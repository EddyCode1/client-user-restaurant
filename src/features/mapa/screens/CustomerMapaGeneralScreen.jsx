import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import MapView, { Marker, Polyline } from '../../../shared/components/MapViewCompat';
import { restaurantService } from '../../restaurant/services/restaurantService';
import { useUserLocation } from '../../../shared/hooks/useUserLocation';
import { fetchOsrmRoute } from '../../../shared/utils/osrmService';

const DEFAULT_REGION = {
  latitude: 14.6349,
  longitude: -90.5069,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const getRestaurantName = (r) => r?.restaurant_name || r?.name || 'Restaurante';
const getRestaurantId = (r) => String(r?._id || r?.id || '');

const StatCard = ({ label, value }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const CustomerMapaGeneralScreen = () => {
  const mapRef = useRef(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [activeRouteId, setActiveRouteId] = useState(null);

  const { location: userLocation, loading: locationLoading } = useUserLocation();

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      const result = await restaurantService.getRestaurants();
      if (result.success) setRestaurants(result.data);
      else setError(result.error || 'Error al cargar restaurantes.');
      setLoading(false);
    };
    fetchRestaurants();
  }, []);

  const ubicados = restaurants.filter((r) => r.hasLocation && r.lat != null && r.lng != null);

  const mapRegion = userLocation
    ? { ...userLocation, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }
    : DEFAULT_REGION;

  const clearRoute = () => {
    setRouteCoords([]);
    setRouteInfo(null);
    setActiveRouteId(null);
  };

  const traceRoute = async (restaurant) => {
    if (Platform.OS === 'web') {
      Alert.alert('Mapa nativo', 'Las rutas OSRM están disponibles en Android/iOS.');
      return;
    }

    if (!userLocation) {
      Alert.alert('Ubicación', 'Activa el GPS para trazar la ruta.');
      return;
    }

    const destLat = Number(restaurant.lat);
    const destLng = Number(restaurant.lng);
    if (!Number.isFinite(destLat) || !Number.isFinite(destLng)) return;

    setRouteLoading(true);
    setActiveRouteId(getRestaurantId(restaurant));

    try {
      const route = await fetchOsrmRoute(userLocation, {
        latitude: destLat,
        longitude: destLng,
      });

      setRouteCoords(route.coordinates);
      setRouteInfo({
        name: getRestaurantName(restaurant),
        distanceKm: route.distanceKm,
        durationMin: route.durationMin,
      });

      mapRef.current?.fitToCoordinates?.(route.coordinates, {
        edgePadding: { top: 80, right: 40, bottom: 40, left: 40 },
        animated: true,
      });
    } catch (err) {
      Alert.alert('Ruta', err.message || 'No se pudo calcular la ruta.');
      clearRoute();
    } finally {
      setRouteLoading(false);
    }
  };

  if (loading || locationLoading) {
    return <ActivityIndicator style={styles.centered} size="large" color="#FFF" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mapa General</Text>
        <Text style={styles.subtitle}>Restaurantes y rutas tipo Waze (OSRM).</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      {routeInfo ? (
        <View style={styles.routeBanner}>
          <Text style={styles.routeTitle}>{routeInfo.name}</Text>
          <Text style={styles.routeMeta}>
            {routeInfo.durationMin} min · {routeInfo.distanceKm} km
          </Text>
          <TouchableOpacity onPress={clearRoute}>
            <Text style={styles.routeClose}>Cerrar ruta</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.statsContainer}>
        <StatCard label="Total" value={restaurants.length} />
        <StatCard label="Ubicados" value={ubicados.length} />
        <StatCard label="Sin Ubic." value={restaurants.length - ubicados.length} />
      </View>

      <View style={styles.mapWrapper}>
        <MapView ref={mapRef} style={styles.map} initialRegion={mapRegion}>
          {userLocation ? (
            <Marker coordinate={userLocation} title="Tu ubicación" pinColor="#3b82f6" />
          ) : null}
          {routeCoords.length > 1 ? (
            <Polyline coordinates={routeCoords} strokeColor="#3b82f6" strokeWidth={4} />
          ) : null}
          {ubicados.map((r) => (
            <Marker
              key={getRestaurantId(r)}
              coordinate={{ latitude: Number(r.lat), longitude: Number(r.lng) }}
              title={getRestaurantName(r)}
              description={r.restaurant_direction || r.address || ''}
              pinColor={activeRouteId === getRestaurantId(r) ? '#e67e22' : '#ef4444'}
            />
          ))}
        </MapView>
      </View>

      <ScrollView horizontal style={styles.routeList} contentContainerStyle={styles.routeListContent}>
        {ubicados.map((r) => (
          <TouchableOpacity
            key={getRestaurantId(r)}
            style={styles.routeChip}
            onPress={() => traceRoute(r)}
            disabled={routeLoading}
          >
            <Text style={styles.routeChipText}>
              {routeLoading && activeRouteId === getRestaurantId(r)
                ? 'Calculando...'
                : `Ruta → ${getRestaurantName(r)}`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centered: { flex: 1, justifyContent: 'center' },
  header: { padding: 20, paddingBottom: 8 },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#AAA', fontSize: 14 },
  errorText: { color: '#f87171', fontSize: 12, marginTop: 8 },
  routeBanner: {
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#1e3a5f',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  routeTitle: { color: '#fff', fontWeight: '700', fontSize: 14 },
  routeMeta: { color: '#93c5fd', marginTop: 4 },
  routeClose: { color: '#fca5a5', marginTop: 8, fontWeight: '600' },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 12 },
  statCard: { flex: 1, backgroundColor: '#111', padding: 12, borderRadius: 12, alignItems: 'center' },
  statValue: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: '#666', fontSize: 10, textTransform: 'uppercase' },
  mapWrapper: { flex: 1, marginHorizontal: 20, borderRadius: 15, overflow: 'hidden' },
  map: { flex: 1 },
  routeList: { maxHeight: 52, marginTop: 12, marginBottom: 16 },
  routeListContent: { paddingHorizontal: 20, gap: 8 },
  routeChip: {
    backgroundColor: '#e67e22',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  routeChipText: { color: '#fff', fontWeight: '600', fontSize: 12 },
});

export default CustomerMapaGeneralScreen;
