import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useDetallePedidoStore from '../../detallepedido/store/useDetallePedidoStore';
import useOrderStore from '../../orders/store/useOrderStore';
import notificationService from '../../../shared/api/services/notificationService';

const MAX_MINUTES = 30;

export default function OrderTimerBadge({ orderId, createdAt, status }) {
  const { fetchDetallePedidosByOrder } = useDetallePedidoStore();
  const { updateOrderStatus } = useOrderStore();
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());
  const hasUpdatedRef = useRef(false);

  const createdAtDate = useMemo(() => (createdAt ? new Date(createdAt) : null), [createdAt]);
  const isCompleted = ['completada', 'completado', 'entregada', 'entregado'].includes(String(status || '').toLowerCase());

  // Lógica de carga, timer y actualización (Idéntica a la web)
  useEffect(() => {
    const loadDetails = async () => {
      const result = await fetchDetallePedidosByOrder(orderId);
      if (result?.success) setDetails(result.data || []);
      setLoading(false);
    };
    if (orderId) loadDetails();
  }, [orderId]);

  useEffect(() => {
    if (!createdAtDate || isCompleted) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [createdAtDate, isCompleted]);

  // Cálculo de tiempos
  const estimatedMinutes = loading ? 30 : (details.every(d => d?.productType === 'beverage') ? 10 : (details.length > 6 ? 45 : 30));
  const elapsedSeconds = createdAtDate ? Math.max(0, Math.floor((now - createdAtDate.getTime()) / 1000)) : 0;
  const percentage = Math.min((elapsedSeconds / (MAX_MINUTES * 60)) * 100, 100);
  const remaining = Math.max(0, (MAX_MINUTES * 60) - elapsedSeconds);
  const mm = Math.floor(remaining / 60).toString().padStart(2, '0');
  const ss = (remaining % 60).toString().padStart(2, '0');

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.timerText}>{mm}:{ss}</Text>
        <Text style={styles.infoText}>{estimatedMinutes} min</Text>
      </View>

      {/* Barra de progreso */}
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
      </View>

      <Text style={styles.statusText}>
        {createdAtDate && !isCompleted && percentage < 100 ? 'Preparando' : 'Completada'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', paddingVertical: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  timerText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
  infoText: { fontSize: 12, color: '#fff' },
  progressBarBackground: { 
    height: 12, 
    borderRadius: 6, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    overflow: 'hidden' 
  },
  progressBarFill: { 
    height: '100%', 
    borderRadius: 6, 
    backgroundColor: '#fff' 
  },
  statusText: { 
    fontSize: 10, 
    textAlign: 'center', 
    fontWeight: '600', 
    marginTop: 4,
    color: '#000' // O ajusta según el fondo de tu tarjeta
  }
});