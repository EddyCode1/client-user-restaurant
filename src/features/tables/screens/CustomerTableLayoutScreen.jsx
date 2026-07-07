import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import ScreenBackHeader from '../../../shared/components/ScreenBackHeader';
import { tableService } from '../../tables/services/tableService';

export default function CustomerTableLayoutScreen() {
  const route = useRoute();
  const { restaurantId } = route.params || {};
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await tableService.getTables(
          restaurantId ? { restaurant_id: restaurantId } : {},
        );
        setTables(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || 'No se pudieron cargar las mesas');
        setTables([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [restaurantId]);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenBackHeader title="Distribución de mesas" subtitle="Vista de mesas del restaurante" />
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : tables.length === 0 ? (
          <Text style={styles.empty}>No hay mesas registradas para este restaurante.</Text>
        ) : (
          tables.map((table) => (
            <View key={table._id || table.id} style={styles.card}>
              <Text style={styles.cardTitle}>
                {table.table_name || `Mesa ${table.table_number || ''}`}
              </Text>
              <Text style={styles.cardMeta}>
                Capacidad: {table.table_capacity || '—'} · Estado: {table.table_state || table.status || '—'}
              </Text>
              <Text style={styles.cardMeta}>
                Ubicación: {table.table_ubication || table.ubication || '—'}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  content: { padding: 20, paddingBottom: 40 },
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#fff' },
  cardMeta: { fontSize: 12, color: '#9ca3af', marginTop: 6 },
  empty: { color: '#9ca3af', textAlign: 'center', marginTop: 40 },
  error: { color: '#f87171', textAlign: 'center', marginTop: 40 },
});
