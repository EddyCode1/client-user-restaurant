import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuthStore } from '../../../shared/store/authStore';
import useRestaurantStore from '../../restaurant/store/useRestaurantStore';
import useMenuStore from '../../menus/store/useMenuStore';
import useCouponStore from '../../coupons/store/useCouponStore';
import useOrderStore from '../../orders/store/useOrderStore';
import ScreenBackHeader from '../../../shared/components/ScreenBackHeader';

export default function CustomerOrderCreateScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { restaurantId: routeRestaurantId } = route.params || {};
  
  const user = useAuthStore((state) => state.user);
  const { restaurants, fetchRestaurants } = useRestaurantStore();
  const { menus, fetchMenus } = useMenuStore();
  const { coupons, fetchCoupons } = useCouponStore();
  const { saveOrder } = useOrderStore();

  const [formData, setFormData] = useState({ Orders_domicile: '', Orders_cupon: '', Menu_id: '' });
  const [restaurantContext, setRestaurantContext] = useState({ id: '', name: '' });

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

  const filteredMenuOptions = useMemo(() => {
    return menus.filter(m => String(m.restaurant_id || m.Restaurant_id) === restaurantContext.id);
  }, [menus, restaurantContext.id]);

  const handleSubmit = async () => {
    if (!formData.Orders_domicile || !formData.Menu_id || !restaurantContext.id) {
      Alert.alert('Error', 'Completa todos los campos obligatorios');
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

    if (result?.success) {
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

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>CREAR ORDEN</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  content: { padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 20 },
  card: { backgroundColor: '#1f2937', padding: 20, borderRadius: 16 },
  label: { fontSize: 10, color: '#9ca3af', marginBottom: 5, letterSpacing: 2 },
  input: { backgroundColor: '#000', padding: 15, borderRadius: 8, color: '#fff', marginBottom: 15 },
  pickerContainer: { backgroundColor: '#000', borderRadius: 8, marginBottom: 15 },
  submitButton: { backgroundColor: '#6b7280', padding: 15, borderRadius: 8, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: 'bold' }
});
