import React from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import CustomerRestaurantCard from './CustomerRestaurantCard';

export default function CustomerRestaurantList({ restaurants, loading, onView }) {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#f8fafc" />
        <Text style={styles.loadingText}>Cargando restaurantes...</Text>
      </View>
    );
  }

  if (!Array.isArray(restaurants) || restaurants.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="storefront-outline" size={48} color="#9ca3af" />
        <Text style={styles.emptyTitle}>NO HAY RESTAURANTES</Text>
        <Text style={styles.emptySubtitle}>No se encontraron restaurantes disponibles.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={restaurants}
      keyExtractor={(item) => item._id || item.id?.toString()}
      renderItem={({ item }) => (
        <CustomerRestaurantCard restaurant={item} onView={onView} />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  loadingText: { color: '#9ca3af', marginTop: 15, fontFamily: 'monospace', fontSize: 12 },
  emptyContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 40, 
    margin: 20,
    backgroundColor: 'rgba(31, 41, 55, 0.1)',
    borderRadius: 30,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(107, 114, 128, 0.3)'
  },
  emptyTitle: { color: '#f8fafc', fontSize: 18, fontWeight: 'bold', marginTop: 20, letterSpacing: 1 },
  emptySubtitle: { color: '#9ca3af', marginTop: 8, fontStyle: 'italic', textAlign: 'center' },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 }
});

CustomerRestaurantList.propTypes = {
  restaurants: PropTypes.array,
  loading: PropTypes.bool,
  onView: PropTypes.func.isRequired,
};