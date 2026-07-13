import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import useOrderStore from '../../orders/store/useOrderStore';
import useDetallePedidoStore from '../../detallepedido/store/useDetallePedidoStore';

export default function OrderTimerBadge({ orderId, createdAt, status }) {
  const { fetchDetallePedidosByOrder, retryFetchDetallePedidosByOrder, error: storeError } = useDetallePedidoStore();
  const { updateOrderStatus } = useOrderStore();
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localError, setLocalError] = useState(null);
  const [now, setNow] = useState(Date.now());
  const hasUpdatedRef = useRef(false);

  // Validar orderId
  const validOrderId = orderId && String(orderId).trim() !== 'undefined';

  const createdAtDate = useMemo(() => (createdAt ? new Date(createdAt) : null), [createdAt]);
  const isCompleted = ['completada', 'completado', 'entregada', 'entregado'].includes(
    String(status || '').toLowerCase()
  );

  // Cargar detalles
  useEffect(() => {
    if (!validOrderId) {
      setLoading(false);
      setLocalError('ID de orden inválido');
      return;
    }

    const loadDetails = async () => {
      setLoading(true);
      setLocalError(null);
      const result = await fetchDetallePedidosByOrder(orderId);
      if (result?.success) {
        setDetails(result.data || []);
      } else {
        setLocalError(result?.error || 'Error cargando detalles');
      }
      setLoading(false);
    };

    loadDetails();
  }, [orderId, validOrderId, fetchDetallePedidosByOrder]);

  // Timer que decuenta
  useEffect(() => {
    if (!createdAtDate || isCompleted) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [createdAtDate, isCompleted]);

  // Calcular tiempo estimado basado en detalles
  const estimatedMinutes = loading || localError
    ? 30 // Default si hay error
    : details.every((d) => d?.productType === 'beverage' || d?.product_type === 'beverage')
      ? 10
      : details.length > 6
        ? 45
        : 30;

  // Calcular tiempo transcurrido
  const elapsedSeconds = createdAtDate
    ? Math.max(0, Math.floor((now - createdAtDate.getTime()) / 1000))
    : 0;
  const totalSeconds = estimatedMinutes * 60;
  const percentage = Math.min((elapsedSeconds / totalSeconds) * 100, 100);
  const remaining = Math.max(0, totalSeconds - elapsedSeconds);
  const mm = Math.floor(remaining / 60).toString().padStart(2, '0');
  const ss = (remaining % 60).toString().padStart(2, '0');

  // Auto-completar cuando timer llega a 100%
  useEffect(() => {
    if (!validOrderId || !createdAtDate || isCompleted || hasUpdatedRef.current) return;
    if (elapsedSeconds >= totalSeconds) {
      hasUpdatedRef.current = true;
      updateOrderStatus(orderId, 'completada');
    }
  }, [orderId, validOrderId, createdAtDate, isCompleted, elapsedSeconds, totalSeconds, updateOrderStatus]);

  // Reintentar cargar detalles
  const handleRetry = async () => {
    setLoading(true);
    const result = await retryFetchDetallePedidosByOrder(orderId);
    if (result?.success) {
      setDetails(result.data || []);
      setLocalError(null);
    } else {
      setLocalError(result?.error || 'Error al reintentar');
    }
    setLoading(false);
  };

  const statusLabel = isCompleted || percentage >= 100 ? '✓ Completada' : 'Preparando...';
  const hasError = localError || storeError;

  return (
    <View style={styles.container}>
      {/* Timer y tiempo estimado */}
      <View style={styles.row}>
        <Text style={styles.timerText}>{mm}:{ss}</Text>
        <Text style={styles.infoText}>~{estimatedMinutes} min</Text>
      </View>

      {/* Barra de progreso */}
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
      </View>

      {/* Estado */}
      <Text style={[styles.statusText, hasError && { color: '#ef4444' }]}>
        {hasError ? '⚠️ Error' : statusLabel}
      </Text>

      {/* Mostrar error y botón de retry */}
      {hasError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorMessage}>{hasError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.retryText}>Reintentar</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Indicador de carga */}
      {loading && !hasError && (
        <Text style={styles.loadingText}>Cargando detalles...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    width: '100%', 
    paddingVertical: 4,
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 4 
  },
  timerText: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  infoText: { 
    fontSize: 12, 
    color: '#9ca3af' 
  },
  progressBarBackground: {
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#22c55e',
  },
  statusText: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 4,
    color: '#fff',
  },
  errorContainer: {
    marginTop: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    padding: 6,
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: '#ef4444',
  },
  errorMessage: {
    fontSize: 10,
    color: '#ef4444',
    marginBottom: 4,
  },
  retryButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  retryText: {
    fontSize: 9,
    color: '#ef4444',
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 9,
    color: '#60a5fa',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
