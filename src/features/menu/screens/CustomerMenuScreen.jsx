import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import useMenuStore from '../../menus/store/useMenuStore';
import useRestaurantStore from '../../restaurant/store/useRestaurantStore';
import { MenuViewModal } from '../components/MenuViewModal';
import CustomerMenuList from '../components/CustomerMenuList';
import CartCheckoutCTA from '../../detallepedido/components/CartCheckoutCTA';

export default function CustomerMenuScreen() {
  const { menus, fetchMenus, loading } = useMenuStore();
  const { restaurants, fetchRestaurants } = useRestaurantStore();
  
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchRestaurant, setSearchRestaurant] = useState('');

  useEffect(() => {
    fetchMenus();
    if (!restaurants?.length) fetchRestaurants();
  }, [fetchMenus, fetchRestaurants, restaurants?.length]);

  const availableMenus = useMemo(() => {
    return (Array.isArray(menus) ? menus : []).filter((menu) => 
      (menu.available ?? menu.Menu_available ?? menu.Available ?? true) === true
    );
  }, [menus]);

  const filteredMenus = useMemo(() => {
    const q = searchRestaurant.trim().toLowerCase();
    if (!q) return availableMenus;

    return availableMenus.filter((menu) => {
      const restaurantId = menu?.Restaurant_id || menu?.restaurant_id || menu?.Restaurant?._id || menu?.restaurant?._id;
      
      let name = menu?.Restaurant_name || menu?.restaurant?.restaurant_name || menu?.restaurant_name || menu?.restaurant?.name || '';
      
      if (!name && restaurantId) {
        const found = restaurants.find((r) => (r._id || r.id) == restaurantId);
        name = found?.restaurant_name || found?.name || '';
      }
      return name.toLowerCase().includes(q);
    });
  }, [availableMenus, searchRestaurant, restaurants]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.preTitle}>MENÚ DEL CLIENTE</Text>
          <Text style={styles.title}>Explora platillos y bebidas</Text>
          <Text style={styles.description}>Vista de solo lectura del menú disponible.</Text>
        </View>

        <TextInput
          style={styles.searchBar}
          placeholder="Buscar por restaurante..."
          placeholderTextColor="#666"
          value={searchRestaurant}
          onChangeText={setSearchRestaurant}
        />

        <CustomerMenuList
          menus={filteredMenus}
          loading={loading}
          onView={(menu) => {
            setSelectedMenu(menu);
            setIsViewModalOpen(true);
          }}
        />
      </View>

      <MenuViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        menu={selectedMenu}
      />

      <CartCheckoutCTA />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  content: { flex: 1, padding: 20, paddingBottom: 100 },
  header: { marginBottom: 20 },
  preTitle: { fontSize: 10, fontWeight: '900', color: '#9ca3af', letterSpacing: 3 },
  title: { fontSize: 28, fontWeight: '900', color: '#fff', marginTop: 8 },
  description: { fontSize: 12, color: '#d1d5db', marginTop: 4 },
  searchBar: {
    backgroundColor: '#1f2937',
    padding: 15,
    borderRadius: 12,
    color: '#fff',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#374151'
  }
});
