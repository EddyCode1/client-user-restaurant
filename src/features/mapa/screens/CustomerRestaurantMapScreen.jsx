import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from '../../../shared/components/MapViewCompat';
import { useRoute } from '@react-navigation/native';
import { restaurantService } from '../../restaurant/services/restaurantService';

export default function CustomerRestaurantMapScreen() {
  const route = useRoute();
  const { restaurantId } = route.params || {};
  
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      const res = await restaurantService.getRestaurantById(restaurantId);
      if (res.success) setRestaurant(res.data);
      else setError(res.error || 'No se encontró el restaurante');
      setLoading(false);
    };

    if (restaurantId) load();
  }, [restaurantId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={styles.loadingText}>Cargando mapa...</Text>
      </View>
    );
  }

  if (error || !restaurant) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Restaurante no encontrado'}</Text>
      </View>
    );
  }

  const lat = Number(restaurant?.lat);
  const lng = Number(restaurant?.lng);

  return (
    <View style={styles.container}>
      {restaurant.hasLocation && lat && lng ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.005, // Delta más pequeño para zoom cercano en un solo punto
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{ latitude: lat, longitude: lng }}
            title={restaurant.restaurant_name || restaurant.name || 'Restaurante'}
            description={restaurant.restaurant_direction || restaurant.address || ''}
          />
        </MapView>
      ) : (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Este restaurante no tiene ubicación registrada.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000',
    padding: 10 
  },
  centered: { 
    flex: 1, 
    backgroundColor: '#000', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { color: '#666', marginTop: 10 },
  errorText: { color: '#FFF', fontSize: 16 },
  map: { 
    flex: 1, 
    borderRadius: 12 
  }
});
