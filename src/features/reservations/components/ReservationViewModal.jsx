import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import reservationService from '../../../shared/api/services/reservationService';
import { getReservationDisplayStatus, getReservationStatusStyles } from '../utils/reservationStatus';

export default function ReservationViewModal({ isOpen, visible, onClose, reservation, onReservationUpdated }) {
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const open = !!(visible ?? isOpen);

  if (!reservation) return null;

  const restaurantName = reservation.restaurant_name || reservation.restaurant?.restaurant_name || reservation.restaurant?.name || 'Restaurante';
  const status = getReservationDisplayStatus(reservation);
  const canModify = status !== 'CANCELADA' && status !== 'COMPLETADA';

  const handleCancelReservation = async () => {
    try {
      const id = reservation?._id || reservation?.id;
      const result = await reservationService.cancelReservation(id);
      if (result) {
        onReservationUpdated?.(result);
        setShowCancelPrompt(false);
        onClose();
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo cancelar la reservación');
    }
  };

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <Text style={styles.title}>DETALLE DE RESERVACIÓN</Text>

            <View style={styles.section}>
              <Text style={styles.label}>RESTAURANTE</Text>
              <Text style={styles.value}>{restaurantName}</Text>
            </View>

            <View style={styles.grid}>
              {[
                { l: 'FECHA', v: reservation.fecha || reservation.reservation_date },
                { l: 'HORA', v: reservation.hora || reservation.reservation_time },
                { l: 'PERSONAS', v: reservation.personas || reservation.number_of_people },
                { l: 'MESA', v: reservation.mesa || reservation.table },
              ].map((item, i) => (
                <View key={i} style={styles.gridItem}>
                  <Text style={styles.label}>{item.l}</Text>
                  <Text style={styles.value}>{item.v}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>ESTADO</Text>
              <View style={[styles.statusBadge, { backgroundColor: getReservationStatusStyles(status) }]}>
                <Text style={styles.statusText}>{status}</Text>
              </View>
            </View>

            {canModify && (
              <View style={styles.actions}>
                {showCancelPrompt ? (
                  <View style={styles.promptBox}>
                    <Text style={styles.promptText}>¿Deseas cancelar esta reservación?</Text>
                    <View style={styles.row}>
                      <TouchableOpacity onPress={() => setShowCancelPrompt(false)} style={styles.btnSmall}>
                        <Text>VOLVER</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleCancelReservation} style={[styles.btnSmall, { backgroundColor: '#ef4444' }]}>
                        <Text style={{ color: '#fff' }}>SÍ, CANCELAR</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity onPress={() => setShowCancelPrompt(true)} style={styles.btnDanger}>
                    <Text style={styles.btnDangerText}>CANCELAR RESERVACIÓN</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={styles.btnClose}>
            <Text style={styles.btnCloseText}>CERRAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1f2937', borderRadius: 24, padding: 20, maxHeight: '80%' },
  scroll: { gap: 15 },
  title: { fontSize: 18, fontWeight: '900', color: '#fff', marginBottom: 10 },
  label: { fontSize: 9, color: '#9ca3af', letterSpacing: 2 },
  value: { fontSize: 14, color: '#fff', fontWeight: 'bold', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridItem: { width: '47%' },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 5 },
  statusText: { fontSize: 10, fontWeight: '900', color: '#000' },
  actions: { marginTop: 20, borderTopWidth: 1, borderColor: '#374151', paddingTop: 20 },
  btnDanger: { backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 15, borderRadius: 12, alignItems: 'center' },
  btnDangerText: { color: '#ef4444', fontWeight: 'bold' },
  promptBox: { backgroundColor: '#fee2e2', padding: 15, borderRadius: 12 },
  promptText: { color: '#991b1b', fontWeight: 'bold' },
  row: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
  btnSmall: { padding: 10, borderRadius: 8, backgroundColor: '#fff' },
  btnClose: { marginTop: 20, alignItems: 'center' },
  btnCloseText: { color: '#9ca3af', fontWeight: 'bold' },
});
