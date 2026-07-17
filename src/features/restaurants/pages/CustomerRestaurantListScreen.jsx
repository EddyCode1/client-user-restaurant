import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useRestaurantStore from '../../restaurant/store/useRestaurantStore';
import CustomerRestaurantList from '../components/CustomerRestaurantList';
import RestaurantViewModal from '../components/RestaurantViewModal';

const LAST_RESTAURANT_KEY = 'customer:lastRestaurant';

export default function CustomerRestaurantListScreen() {
  const { restaurants, fetchRestaurants, loading } = useRestaurantStore();
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const filteredRestaurants = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return restaurants;
    return (restaurants || []).filter((r) => {
      const name = (r.restaurant_name || r.name || '').toLowerCase();
      return name.includes(q);
    });
  }, [restaurants, searchQuery]);

  const handleView = async (restaurant) => {
    const id = restaurant?._id || restaurant?.id || null;
    if (id) {
      await AsyncStorage.setItem(
        LAST_RESTAURANT_KEY,
        JSON.stringify({
          id,
          name: restaurant?.restaurant_name || restaurant?.name || '',
          ts: Date.now(),
        })
      );
    }
    setSelected(restaurant);
    setOpen(true);
  };

  const listHeader = (
    <View>
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar restaurante por nombre..."
        placeholderTextColor="#71717A"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.section}>
        <View style={styles.header}>
          <View>
            <Text style={styles.overline}>RESTAURANTES</Text>
            <Text style={styles.title}>Explora nuestros locales</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{filteredRestaurants?.length || 0} locales</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomerRestaurantList
        restaurants={filteredRestaurants}
        loading={loading}
        onView={handleView}
        listHeaderComponent={listHeader}
      />

      {open && (
        <RestaurantViewModal
          isOpen={open}
          onClose={() => setOpen(false)}
          restaurant={selected}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111111' },
  searchBar: {
    backgroundColor: '#18181B',
    borderRadius: 12,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 4,
  },
  section: {
    backgroundColor: 'rgba(31, 41, 55, 0.2)',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.3)',
    padding: 24,
    margin: 20,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  overline: { fontSize: 10, fontWeight: '900', color: '#9ca3af', letterSpacing: 3.5, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '900', color: '#f8fafc' },
  countBadge: { padding: 8 },
  countText: { fontSize: 14, color: '#f8fafc' },
});
