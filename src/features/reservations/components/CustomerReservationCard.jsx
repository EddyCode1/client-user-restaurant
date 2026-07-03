import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { getReservationDisplayStatus, getReservationStatusStyles } from '../utils/reservationStatus';

export default function CustomerReservationCard({ reservation, onView }) {
  const restaurantName = reservation.restaurant_name || reservation.restaurant?.restaurant_name || reservation.restaurant?.name || 'Restaurante';
  const date = reservation.fecha || reservation.reservation_date || 'Sin fecha';
  const time = reservation.hora || reservation.reservation_time || 'Sin hora';
  const people = reservation.personas || reservation.number_of_people || reservation.guest_count || 1;
  const table = reservation.mesa || reservation.table || reservation.table_name || 'Sin mesa';
  const status = getReservationDisplayStatus(reservation);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.preTitle}>RESERVACIÓN</Text>
          <View style={[styles.statusBadge, { backgroundColor: getReservationStatusStyles(status) }]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>
        <Text style={styles.restaurantName} numberOfLines={1}>{restaurantName}</Text>
      </View>

      <View style={styles.grid}>
        {[
          { label: 'FECHA', value: date },
          { label: 'HORA', value: time },
          { label: 'PERSONAS', value: people },
          { label: 'MESA', value: table },
        ].map((item, index) => (
          <View key={index} style={styles.infoBox}>
            <Text style={styles.infoLabel}>{item.label}</Text>
            <Text style={styles.infoValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={() => onView(reservation)}>
        <Text style={styles.buttonText}>VER DETALLES</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 24,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(248, 250, 252, 0.1)',
  },
  header: { marginBottom: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  preTitle: { fontSize: 10, fontWeight: '900', color: '#d1d5db', letterSpacing: 2 },
  restaurantName: { fontSize: 20, fontWeight: '900', color: '#fff', marginTop: 8 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 10, fontWeight: '900', color: '#000', letterSpacing: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  infoBox: { backgroundColor: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 16, width: '47%' },
  infoLabel: { fontSize: 8, color: '#d1d5db', letterSpacing: 1, fontWeight: 'bold' },
  infoValue: { fontSize: 14, color: '#fff', fontWeight: '600', marginTop: 4 },
  button: {
    marginTop: 20,
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: { fontSize: 12, fontWeight: '900', color: '#1f2937', letterSpacing: 2 },
});

CustomerReservationCard.propTypes = {
  reservation: PropTypes.object.isRequired,
  onView: PropTypes.func.isRequired,
};
