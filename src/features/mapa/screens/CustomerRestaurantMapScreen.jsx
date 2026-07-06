import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import MapView, { Marker, Polyline } from '../../../shared/components/MapViewCompat';
import { useRoute } from '@react-navigation/native';
import { restaurantService } from '../../restaurant/services/restaurantService';
import { useUserLocation } from '../../../shared/hooks/useUserLocation';
import { fetchOsrmRoute } from '../../../shared/utils/osrmService';

export default function CustomerRestaurantMapScreen() {
  const route = useRoute();
  const mapRef = useRef(null);
  const { restaurantId } = route.params || {};

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);

  const { location: userLocation } = useUserLocation();

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

  const name = restaurant?.restaurant_name || restaurant?.name || 'Restaurante';
  const address = restaurant?.restaurant_direction || restaurant?.address || '';
  const lat = Number(restaurant?.lat);
  const lng = Number(restaurant?.lng);

  const traceRoute = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Mapa nativo', 'Las rutas están disponibles en Android/iOS.');
      return;
    }
    if (!userLocation) {
      Alert.alert('Ubicación', 'Activa el GPS para trazar la ruta.');
      return;
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    setRouteLoading(true);
    try {
      const routeData = await fetchOsrmRoute(userLocation, { latitude: lat, longitude: lng });
      setRouteCoords(routeData.coordinates);
      setRouteInfo(routeData);
      mapRef.current?.fitToCoordinates?.(routeData.coordinates, {
        edgePadding: { top: 60, right: 40, bottom: 120, left: 40 },
        animated: true,
      });
    } catch (err) {
      Alert.alert('Ruta', err.message || 'No se pudo calcular la ruta.');
    } finally {
      setRouteLoading(false);
    }
  };

  const openWaze = () => {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    Linking.openURL(`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`);
  };

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

  return (
    <View style={styles.container}>
      {restaurant.hasLocation && lat && lng ? (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {userLocation ? (
              <Marker coordinate={userLocation} title="Tu ubicación" pinColor="#3b82f6" />
            ) : null}
            {routeCoords.length > 1 ? (
              <Polyline coordinates={routeCoords} strokeColor="#3b82f6" strokeWidth={4} />
            ) : null}
            <Marker
              coordinate={{ latitude: lat, longitude: lng }}
              title={name}
              description={address}
              pinColor="#ef4444"
            />
          </MapView>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>{name}</Text>
            <Text style={styles.panelAddress}>{address}</Text>
            {routeInfo ? (
              <Text style={styles.panelRoute}>
                {routeInfo.durationMin} min · {routeInfo.distanceKm} km
              </Text>
            ) : null}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.btnPrimary} onPress={traceRoute} disabled={routeLoading}>
                <Text style={styles.btnText}>{routeLoading ? 'Calculando...' : 'Ver ruta en mapa'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSecondary} onPress={openWaze}>
                <Text style={styles.btnTextSecondary}>Abrir en Waze</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Este restaurante no tiene ubicación registrada.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centered: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#666', marginTop: 10 },
  errorText: { color: '#FFF', fontSize: 16, textAlign: 'center', padding: 20 },
  map: { flex: 1 },
  panel: {
    backgroundColor: '#111',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#333',
  },
  panelTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  panelAddress: { color: '#aaa', marginTop: 4 },
  panelRoute: { color: '#93c5fd', marginTop: 8, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btnPrimary: {
    flex: 1,
    backgroundColor: '#e67e22',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700' },
  btnTextSecondary: { color: '#fff', fontWeight: '600' },
});
