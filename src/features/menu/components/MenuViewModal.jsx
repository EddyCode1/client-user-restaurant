import React, { useEffect, useMemo, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { getDishByIdService, getDishesByRestaurantService } from '../../dishes/services/DishService';
import { getBeverageByIdService, getBeveragesByRestaurantService } from '../../beverages/services/beverageService';
import { restaurantService } from '../../restaurant/services/restaurantService';
import { useCart } from '../../detallepedido/hooks/useCart';

const asId = (value) => {
  if (!value) return null;
  if (typeof value === 'object') return value._id || value.id || null;
  return value;
};

const normalizeDish = (item) => ({
  _id: item?._id || item?.id || null,
  Menu_Plate: item?.Menu_Plate || item?.name || item?.plate || 'Plato',
  Menu_Price: item?.Menu_Price ?? item?.price ?? 0,
  Menu_description_plate: item?.Menu_description_plate || item?.description || '',
});

const normalizeBeverage = (item) => ({
  _id: item?._id || item?.id || null,
  name: item?.Menu_Drink || item?.name || item?.beverage_name || 'Bebida',
  Menu_Price: item?.Menu_Price ?? item?.price ?? 0,
  Menu_type_drink: item?.Menu_type_drink || item?.type || '',
});

const buildFallbackFromMenu = (menu) => {
  const dishes = [];
  const beverages = [];

  if (menu?.Menu_Plate || menu?.name) {
    dishes.push(normalizeDish(menu));
  }

  if (menu?.Menu_Drink || menu?.drink) {
    beverages.push(normalizeBeverage(menu));
  }

  return { dishes, beverages };
};

const resolveItems = async (items, fetchById, normalize) => {
  if (!Array.isArray(items) || items.length === 0) return [];

  const resolved = await Promise.all(
    items.map(async (item) => {
      if (typeof item === 'object' && (item.Menu_Plate || item.name || item.Menu_Drink)) {
        return normalize(item);
      }
      const id = asId(item);
      if (!id) return null;
      try {
        const data = await fetchById(id);
        return normalize(data);
      } catch {
        return null;
      }
    }),
  );

  return resolved.filter(Boolean);
};

export const MenuViewModal = ({ isOpen, onClose, menu }) => {
  const { addItem } = useCart();
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [resolvedDishes, setResolvedDishes] = useState([]);
  const [resolvedBeverages, setResolvedBeverages] = useState([]);
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantId, setRestaurantId] = useState(null);

  const restaurantContext = useMemo(
    () => ({ id: restaurantId, name: restaurantName }),
    [restaurantId, restaurantName]
  );

  const handleAddToCart = (item, type) => {
    if (!item?._id) {
      Alert.alert('No disponible', 'Este producto no se puede agregar al carrito.');
      return;
    }
    addItem(item, type, restaurantContext);
    Alert.alert('Agregado', `${item.Menu_Plate || item.name} agregado al carrito.`);
  };

  useEffect(() => {
    const loadDetails = async () => {
      if (!isOpen || !menu) return;

      setLoadingDetails(true);
      setResolvedDishes([]);
      setResolvedBeverages([]);

      const restaurantId =
        menu?.Restaurant_id ||
        menu?.restaurant_id ||
        menu?.Restaurant?._id ||
        menu?.restaurant?._id;

      let name =
        menu?.Restaurant_name ||
        menu?.restaurant?.restaurant_name ||
        menu?.restaurant?.name ||
        menu?.restaurant_name ||
        '';

      if (!name && restaurantId) {
        try {
          const result = await restaurantService.getRestaurantById(restaurantId);
          if (result?.success) {
            name = result.data?.restaurant_name || result.data?.name || '';
          }
        } catch {
          name = '';
        }
      }
      setRestaurantName(name);
      setRestaurantId(restaurantId ? String(restaurantId) : null);

      const embeddedDishes = menu?.dishes || menu?.Dishes || menu?.platos || [];
      const embeddedBeverages = menu?.beverages || menu?.Beverages || menu?.bebidas || [];

      let dishes = await resolveItems(embeddedDishes, getDishByIdService, normalizeDish);
      let beverages = await resolveItems(embeddedBeverages, getBeverageByIdService, normalizeBeverage);

      if (dishes.length === 0 && beverages.length === 0 && restaurantId) {
        try {
          const [allDishes, allBeverages] = await Promise.all([
            getDishesByRestaurantService(restaurantId),
            getBeveragesByRestaurantService(restaurantId),
          ]);
          dishes = (allDishes || []).map(normalizeDish);
          beverages = (allBeverages || []).map(normalizeBeverage);
        } catch {
          // fallback below
        }
      }

      if (dishes.length === 0 && beverages.length === 0) {
        const fallback = buildFallbackFromMenu(menu);
        dishes = fallback.dishes;
        beverages = fallback.beverages;
      }

      setResolvedDishes(dishes);
      setResolvedBeverages(beverages);
      setLoadingDetails(false);
    };

    loadDetails();
  }, [isOpen, menu]);

  return (
    <Modal visible={isOpen} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>[ CERRAR ]</Text>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.status}>
                {menu?.Menu_available ?? menu?.available
                  ? 'DISPONIBLE PARA SERVICIO'
                  : 'NO DISPONIBLE TEMPORALMENTE'}
              </Text>
              <Text style={styles.title}>{menu?.Menu_Plate || menu?.name || 'Menú'}</Text>
              {restaurantName ? <Text style={styles.restaurant}>{restaurantName}</Text> : null}
              <Text style={styles.description}>
                {menu?.Menu_description_plate || menu?.description || ''}
              </Text>
            </View>

            {loadingDetails ? (
              <ActivityIndicator size="small" color="#000" style={{ marginVertical: 40 }} />
            ) : (
              <View style={styles.grid}>
                <View style={styles.column}>
                  <Text style={styles.sectionTitle}>FOOD MENU</Text>
                  {resolvedDishes.length === 0 ? (
                    <Text style={styles.empty}>Sin platos registrados</Text>
                  ) : (
                    resolvedDishes.map((dish, i) => (
                      <View key={`dish-${dish._id || i}`} style={styles.item}>
                        <View style={styles.row}>
                          <Text style={styles.itemName}>{dish.Menu_Plate}</Text>
                          <Text style={styles.itemPrice}>Q{Number(dish.Menu_Price || 0).toFixed(2)}</Text>
                        </View>
                        {dish.Menu_description_plate ? (
                          <Text style={styles.itemDesc}>{dish.Menu_description_plate}</Text>
                        ) : null}
                        <TouchableOpacity
                          style={styles.addButton}
                          onPress={() => handleAddToCart(dish, 'dish')}
                        >
                          <Text style={styles.addButtonText}>Agregar al carrito</Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                </View>

                <View style={styles.column}>
                  <Text style={styles.sectionTitle}>DRINKS MENU</Text>
                  {resolvedBeverages.length === 0 ? (
                    <Text style={styles.empty}>Sin bebidas registradas</Text>
                  ) : (
                    resolvedBeverages.map((bev, i) => (
                      <View key={`bev-${bev._id || i}`} style={styles.item}>
                        <View style={styles.row}>
                          <Text style={styles.itemName}>{bev.name}</Text>
                          {bev.Menu_Price ? (
                            <Text style={styles.itemPrice}>Q{Number(bev.Menu_Price).toFixed(2)}</Text>
                          ) : null}
                        </View>
                        {bev.Menu_type_drink ? (
                          <Text style={styles.itemDesc}>{bev.Menu_type_drink}</Text>
                        ) : null}
                        <TouchableOpacity
                          style={styles.addButton}
                          onPress={() => handleAddToCart(bev, 'beverage')}
                        >
                          <Text style={styles.addButtonText}>Agregar al carrito</Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  )}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

MenuViewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  menu: PropTypes.object,
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    maxHeight: '90%',
    borderRadius: 4,
    borderWidth: 8,
    borderColor: '#111',
  },
  closeButton: { alignSelf: 'flex-end', marginBottom: 10 },
  closeButtonText: { fontSize: 10, fontWeight: 'bold' },
  header: { alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 20 },
  status: { fontSize: 8, letterSpacing: 2, marginBottom: 10 },
  title: { fontSize: 32, fontWeight: '300', textAlign: 'center' },
  restaurant: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 2, marginTop: 5 },
  description: { fontSize: 12, fontStyle: 'italic', textAlign: 'center', marginTop: 10 },
  grid: { flexDirection: 'column' },
  column: { marginTop: 30 },
  sectionTitle: {
    fontSize: 18,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    marginBottom: 15,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  item: { marginBottom: 12 },
  itemName: { fontWeight: 'bold', flex: 1 },
  itemPrice: { fontWeight: 'bold' },
  itemDesc: { fontSize: 11, color: '#666', marginTop: 2 },
  addButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#111',
  },
  addButtonText: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  empty: { fontSize: 12, color: '#888', textAlign: 'center', fontStyle: 'italic' },
});

export default MenuViewModal;
