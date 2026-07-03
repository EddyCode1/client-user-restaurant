import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { restaurantService } from '../../restaurant/services/restaurantService';
import { FiMap, FiMapPin, FiSearch } from 'react-icons/fi'; // Si usas react-icons, asegúrate de tener una librería compatible con RN o usa @expo/vector-icons

const StatCard = ({ label, value, iconName }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const CustomerMapaGeneralScreen = () => {
  const [restaurants, setRestaurants] = useState([]);
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

  const ubicados = restaurants.filter((r) => r.hasLocation);

  if (loading) return <ActivityIndicator style={styles.centered} size="large" color="#FFF" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mapa General</Text>
        <Text style={styles.subtitle}>Visualiza nuestros restaurantes.</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard label="Total" value={restaurants.length} />
        <StatCard label="Ubicados" value={ubicados.length} />
        <StatCard label="Sin Ubic." value={restaurants.length - ubicados.length} />
      </View>

      <View style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 14.6349, // Coordenadas por defecto (Guatemala)
            longitude: -90.5069,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {ubicados.map((r) => (
            <Marker
              key={r.id}
              coordinate={{ latitude: r.lat, longitude: r.lng }}
              title={r.nombre}
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
  statsContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#111', padding: 15, borderRadius: 12, alignItems: 'center' },
  statValue: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: '#666', fontSize: 10, textTransform: 'uppercase' },
  mapWrapper: { flex: 1, marginHorizontal: 20, marginBottom: 20, borderRadius: 15, overflow: 'hidden' },
  map: { flex: 1 }
});

export default CustomerMapaGeneralScreen;