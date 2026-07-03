import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import CustomerReservationCard from './CustomerReservationCard';

export default function CustomerReservationList({ reservations, loading, onView }) {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#f8fafc" />
        <Text style={styles.loadingText}>CARGANDO RESERVACIONES...</Text>
      </View>
    );
  }

  if (!Array.isArray(reservations) || reservations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No hay reservaciones disponibles</Text>
        <Text style={styles.emptySubtitle}>
          Aquí verás tus reservaciones cuando el sistema devuelva registros.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={reservations}
      keyExtractor={(item) => item._id || item.id || Math.random().toString()}
      renderItem={({ item }) => (
        <CustomerReservationCard reservation={item} onView={onView} />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    paddingVertical: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 10,
    fontWeight: '900',
    color: '#d1d5db',
    letterSpacing: 3,
  },
  emptyContainer: {
    padding: 30,
    margin: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(248, 250, 252, 0.2)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 12,
    color: 'rgba(209, 213, 219, 0.7)',
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
});

CustomerReservationList.propTypes = {
  reservations: PropTypes.array,
  loading: PropTypes.bool,
  onView: PropTypes.func.isRequired,
};