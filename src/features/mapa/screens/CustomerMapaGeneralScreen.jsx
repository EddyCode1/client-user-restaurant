import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import MapView, { Marker } from '../../../shared/components/MapViewCompat';
import { restaurantService } from '../../restaurant/services/restaurantService';

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
  const [restaurants, setRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (Platform.OS === 'web') return;

    let mounted = true;
    (async () => {
      try {
        const Location = await import('expo-location');
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted' || !mounted) return;
        const location = await Location.getCurrentPositionAsync({});
        if (mounted) {
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      } catch {
        // Ubicación opcional; el mapa usa región por defecto
      }
    })();

    return () => { mounted = false; };
  }, []);

  const ubicados = restaurants.filter((r) => r.hasLocation && r.lat != null && r.lng != null);

  const mapRegion = userLocation
    ? { ...userLocation, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }
    : DEFAULT_REGION;

  if (loading) return <ActivityIndicator style={styles.centered} size="large" color="#FFF" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mapa General</Text>
        <Text style={styles.subtitle}>Visualiza nuestros restaurantes.</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <View style={styles.statsContainer}>
        <StatCard label="Total" value={restaurants.length} />
        <StatCard label="Ubicados" value={ubicados.length} />
        <StatCard label="Sin Ubic." value={restaurants.length - ubicados.length} />
      </View>

      <View style={styles.mapWrapper}>
        <MapView style={styles.map} initialRegion={mapRegion}>
          {userLocation ? (
            <Marker coordinate={userLocation} title="Tu ubicación" pinColor="#3b82f6" />
          ) : null}
          {ubicados.map((r) => (
            <Marker
              key={getRestaurantId(r)}
              coordinate={{ latitude: Number(r.lat), longitude: Number(r.lng) }}
              title={getRestaurantName(r)}
              description={r.restaurant_direction || r.address || ''}
            />
          ))}
        </MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centered: { flex: 1, justifyContent: 'center' },
  header: { padding: 20 },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#AAA', fontSize: 14 },
  errorText: { color: '#f87171', fontSize: 12, marginTop: 8 },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#111', padding: 15, borderRadius: 12, alignItems: 'center' },
  statValue: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: '#666', fontSize: 10, textTransform: 'uppercase' },
  mapWrapper: { flex: 1, marginHorizontal: 20, marginBottom: 20, borderRadius: 15, overflow: 'hidden' },
  map: { flex: 1 },
});

export default CustomerMapaGeneralScreen;
