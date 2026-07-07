import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import ScreenBackHeader from '../../../shared/components/ScreenBackHeader';
import useMenuStore from '../../menus/store/useMenuStore';
import useRestaurantStore from '../../restaurant/store/useRestaurantStore';
import { MenuViewModal } from '../components/MenuViewModal';
import CustomerMenuList from '../components/CustomerMenuList';

export default function CustomerRestaurantMenuScreen() {
  const route = useRoute();
  const { restaurantId } = route.params || {};

  const { menus, fetchMenus, loading } = useMenuStore();
  const { restaurants, fetchRestaurants } = useRestaurantStore();
  
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [restaurantName, setRestaurantName] = useState('');

  useEffect(() => {
    fetchMenus();
    if (!restaurants?.length) fetchRestaurants();
  }, [fetchMenus, fetchRestaurants, restaurants?.length]);

  useEffect(() => {
    if (!restaurantId) return;
    const found = restaurants.find((r) => String(r._id || r.id) === String(restaurantId));
    setRestaurantName(found?.restaurant_name || found?.name || '');
  }, [restaurantId, restaurants]);

  const filteredMenus = useMemo(() => {
    if (!restaurantId) return [];
    return (Array.isArray(menus) ? menus : []).filter((menu) => {
      const isAvailable = menu.available ?? menu.Menu_available ?? menu.Available ?? true;
      const menuRestaurantId = 
        menu?.Restaurant_id || menu?.restaurant_id || menu?.restaurantId || 
        menu?.Restaurant?._id || menu?.restaurant?._id;
      
      return isAvailable === true && String(menuRestaurantId) === String(restaurantId);
    });
  }, [menus, restaurantId]);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenBackHeader title={restaurantName || 'Menú'} subtitle="Platillos disponibles" />

      <CustomerMenuList
        menus={filteredMenus}
        loading={loading}
        onView={(menu) => {
          setSelectedMenu(menu);
          setIsViewModalOpen(true);
        }}
      />

      <MenuViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        menu={selectedMenu}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#333', marginBottom: 10 },
  preTitle: { fontSize: 10, fontWeight: '900', color: '#9ca3af', letterSpacing: 3 },
  title: { fontSize: 24, fontWeight: '900', color: '#fff', marginTop: 8 },
  count: { fontSize: 12, color: '#666', marginTop: 5, textTransform: 'uppercase' }
});