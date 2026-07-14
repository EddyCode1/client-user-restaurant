import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuthStore } from '../../../shared/store/authStore';
import useRestaurantStore from '../../restaurant/store/useRestaurantStore';
import useMenuStore from '../../menus/store/useMenuStore';
import useCouponStore from '../../coupons/store/useCouponStore';
import useOrderStore from '../../orders/store/useOrderStore';
import { useCart } from '../../detallepedido/hooks/useCart';
import ScreenBackHeader from '../../../shared/components/ScreenBackHeader';

export default function CustomerOrderCreateScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { restaurantId: routeRestaurantId } = route.params || {};
  
  const user = useAuthStore((state) => state.user);
  const { restaurants, fetchRestaurants } = useRestaurantStore();
  const { menus, fetchMenus } = useMenuStore();
  const { coupons, fetchCoupons } = useCouponStore();
  const { saveOrderWithDetails, loading } = useOrderStore();
  const { cart, removeItem, clearCart, subtotal, restaurantId: cartRestaurantId, restaurantName: cartRestaurantName } = useCart();

  const [formData, setFormData] = useState({ Orders_domicile: '', Orders_cupon: '', Menu_id: '' });
  const [restaurantContext, setRestaurantContext] = useState({ id: '', name: '' });
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);

  useEffect(() => {
    fetchRestaurants();
    fetchMenus();
    fetchCoupons();
  }, []);

  useEffect(() => {
    if (routeRestaurantId) {
      setRestaurantContext({ id: String(routeRestaurantId), name: '' });
    } else {
      AsyncStorage.getItem('customer:lastRestaurant').then(raw => {
        if (raw) {
          const parsed = JSON.parse(raw);
          setRestaurantContext({ id: String(parsed.id), name: parsed.name || '' });
        }
      });
    }
  }, [routeRestaurantId]);

  useEffect(() => {
    if (routeRestaurantId || !cartRestaurantId) return;
    setRestaurantContext((prev) => ({
      id: prev.id || cartRestaurantId,
      name: prev.name || cartRestaurantName || '',
    }));
  }, [cartRestaurantId, cartRestaurantName, routeRestaurantId]);

  const filteredMenuOptions = useMemo(() => {
    return menus.filter(m => String(m.restaurant_id || m.Restaurant_id) === restaurantContext.id);
  }, [menus, restaurantContext.id]);

  // Validar cupón cuando cambia la selección
  const validateCoupon = (couponId) => {
    setCouponError(null);
    if (!couponId) {
      setSelectedCoupon(null);
      return true;
    }

    const coupon = coupons.find(c => c._id === couponId);
    if (!coupon) {
      setCouponError('Cupón no encontrado');
      return false;
    }

    // Validar que no esté inactivo
    if (!coupon.estado || !coupon.active) {
      setCouponError('Este cupón no está disponible');
      return false;
    }

    // Validar expiración
    if (coupon.expiration_date && new Date(coupon.expiration_date) < new Date()) {
      setCouponError('Este cupón ha expirado');
      return false;
    }

    // Validar max uses
    if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
      setCouponError('Este cupón ya no tiene usos disponibles');
      return false;
    }

    setSelectedCoupon(coupon);
    return true;
  };

  const handleCouponChange = (val) => {
    setFormData(p => ({ ...p, Orders_cupon: val }));
    validateCoupon(val);
  };

  const handleSubmit = async () => {
    if (!formData.Orders_domicile || !formData.Menu_id || !restaurantContext.id) {
      Alert.alert('Error', 'Completa todos los campos obligatorios');
      return;
    }

    // Validar cupón nuevamente antes de crear
    if (formData.Orders_cupon && !validateCoupon(formData.Orders_cupon)) {
      Alert.alert('Cupón inválido', couponError || 'No se puede usar este cupón');
      return;
    }

    const payload = {
      Orders_domicile: formData.Orders_domicile,
      Orders_cupon: formData.Orders_cupon || null,
      Orders_status: 'en_preparacion',
      Restaurant_id: restaurantContext.id,
      Menu_id: formData.Menu_id,
      User_id: user?._id || user?.id,
      client_name: user?.nombre || user?.name || 'Cliente',
    };

    const result = await saveOrderWithDetails(payload, cart);

    if (result?.success) {
      clearCart();
      Alert.alert('Éxito', 'Orden creada con éxito');
      navigation.navigate('OrderDetails', { orderId: result.data._id || result.data.id });
    } else {
      Alert.alert('Error', result?.error || 'No se pudo crear la orden');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenBackHeader title="Crear orden" subtitle={restaurantContext.name || 'Nuevo pedido'} />
      
      <View style={styles.card}>
        <Text style={styles.label}>DOMICILIO</Text>
        <TextInput
          style={styles.input}
          placeholder="Dirección de entrega"
          placeholderTextColor="#666"
          value={formData.Orders_domicile}
          onChangeText={(text) => setFormData(p => ({ ...p, Orders_domicile: text }))}
        />

        <Text style={styles.label}>MENÚ</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.Menu_id}
            onValueChange={(val) => setFormData(p => ({ ...p, Menu_id: val }))}
            style={{ color: '#fff' }}
            dropdownIconColor="#fff"
          >
            <Picker.Item label="Selecciona un menú..." value="" />
            {filteredMenuOptions.map(m => (
              <Picker.Item key={m._id} label={m.name || m.Menu_Plate} value={m._id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>CUPÓN (OPCIONAL)</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.Orders_cupon}
            onValueChange={handleCouponChange}
            style={{ color: '#fff' }}
            dropdownIconColor="#fff"
          >
            <Picker.Item label="Sin cupón" value="" />
            {coupons.map((c) => (
              <Picker.Item
                key={c._id}
                label={c.coupon_code || c.Coupon_code || c.name || 'Cupón'}
                value={c._id}
              />
            ))}
          </Picker>
        </View>

        {couponError && (
          <Text style={styles.errorText}>⚠️ {couponError}</Text>
        )}

        {selectedCoupon && (
          <View style={styles.couponInfo}>
            <Text style={styles.couponLabel}>✓ Cupón aplicado: {selectedCoupon.coupon_code || selectedCoupon.name}</Text>
          </View>
        )}

        {/* Mostrar items del carrito si existen */}
        {cart.length > 0 && (
          <View style={styles.cartSection}>
            <Text style={styles.cartTitle}>Items en carrito ({cart.length})</Text>
            <FlatList
              data={cart}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.cartItem}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>Q{(item.price * item.quantity).toFixed(2)} ({item.quantity}x)</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeItem(item.id)}>
                    <Text style={styles.removeBtn}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
            <Text style={styles.cartSubtotal}>Subtotal: Q{subtotal.toFixed(2)}</Text>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.submitButton, loading && { opacity: 0.6 }]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitText}>CREAR ORDEN</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  content: { padding: 20, paddingBottom: 30 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 20 },
  card: { backgroundColor: '#1f2937', padding: 20, borderRadius: 16 },
  label: { fontSize: 10, color: '#9ca3af', marginBottom: 5, letterSpacing: 2 },
  input: { backgroundColor: '#000', padding: 15, borderRadius: 8, color: '#fff', marginBottom: 15 },
  pickerContainer: { backgroundColor: '#000', borderRadius: 8, marginBottom: 15 },
  
  errorText: { 
    color: '#ef4444', 
    fontSize: 12, 
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#ef4444'
  },
  
  couponInfo: { 
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#22c55e',
    marginBottom: 15
  },
  couponLabel: { color: '#22c55e', fontSize: 12, fontWeight: '600' },
  
  cartSection: { 
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)'
  },
  cartTitle: { fontSize: 12, color: '#60a5fa', fontWeight: '600', marginBottom: 10, letterSpacing: 1 },
  cartItem: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.2)'
  },
  itemInfo: { flex: 1 },
  itemName: { color: '#fff', fontSize: 13, marginBottom: 3 },
  itemPrice: { color: '#9ca3af', fontSize: 11 },
  removeBtn: { color: '#ef4444', fontSize: 16, fontWeight: 'bold' },
  cartSubtotal: { color: '#60a5fa', fontSize: 12, fontWeight: '600', marginTop: 10, textAlign: 'right' },
  
  submitButton: { 
    backgroundColor: '#3b82f6', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center',
    marginTop: 10
  },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});
