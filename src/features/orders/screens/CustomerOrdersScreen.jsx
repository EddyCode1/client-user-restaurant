import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useOrderStore from '../../orders/store/useOrderStore';
import OrderTimerBadge from '../components/OrderTimerBadge';

export default function CustomerOrdersScreen() {
  const navigation = useNavigation();
  const { orders, loading, fetchOrders } = useOrderStore();
  const [activeTab, setActiveTab] = useState('Todas');

  const handleOpenFactura = (order) => {
    navigation.navigate('Factura', {
      orderId: order?._id || order?.id,
      order,
    });
  };

  useEffect(() => {
    // Fetch inicial
    fetchOrders();

    // Polling: actualizar órdenes cada 5 segundos
    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    // Limpiar interval al desmontar
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'En Proceso') {
      return orders.filter((o) => !['completada', 'entregado'].includes(o.Orders_status));
    }
    if (activeTab === 'Completadas') {
      return orders.filter((o) => ['completada', 'entregado'].includes(o.Orders_status));
    }
    return orders;
  }, [orders, activeTab]);

  const renderOrderCard = ({ item: order }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleOpenFactura(order)}
    >
      <View style={styles.row}>
        <Text style={styles.orderNumber}>#{order?.Orders_number || '---'}</Text>
        <OrderTimerBadge
          orderId={order._id}
          createdAt={order.createdAt || order.Orders_createdAt}
          status={order.Orders_status}
        />
      </View>

      <Text style={styles.statusBadge}>{order.Orders_status || 'en_preparacion'}</Text>

      <View style={styles.divider} />

      <Text style={styles.infoText}>Domicilio: {order.Orders_domicile || 'N/A'}</Text>
      <Text style={styles.totalText}>Total: Q{Number(order.Orders_total || 0).toFixed(2)}</Text>
      <View style={styles.actionsRow}>
        <Text style={styles.tapHint}>Toca la tarjeta para ver detalles</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleOpenFactura(order)}
        >
          <Text style={styles.actionButtonText}>Ver factura</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MIS ÓRDENES</Text>
        <View style={styles.tabContainer}>
          {['Todas', 'En Proceso', 'Completadas'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text style={styles.tabText}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item._id}
          renderItem={renderOrderCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.empty}>No tienes órdenes aún. Crea una desde un restaurante.</Text>
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('OrderCreate')}
      >
        <Text style={styles.fabText}>+ CREAR ORDEN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141416' },
  header: { padding: 20, backgroundColor: '#1b1b1f', borderBottomWidth: 1, borderColor: '#333' },
  title: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 15 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#141416', borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: '#1b1b1f', borderWidth: 1, borderColor: '#333' },
  tabText: { fontSize: 12, color: '#fff', fontWeight: 'bold' },
  listContent: { padding: 15, paddingBottom: 90 },
  card: {
    backgroundColor: '#1b1b1f',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderNumber: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  statusBadge: { fontSize: 10, color: '#aaa', fontWeight: '800', marginVertical: 8 },
  divider: { height: 1, backgroundColor: '#333', marginVertical: 8 },
  infoText: { fontSize: 12, color: '#888' },
  totalText: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginTop: 8 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  tapHint: { fontSize: 10, color: '#6b7280', flex: 1, marginRight: 8 },
  actionButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  actionButtonText: { color: '#111', fontSize: 11, fontWeight: '800' },
  empty: { color: '#9ca3af', textAlign: 'center', marginTop: 40 },
  fab: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  fabText: { fontWeight: '900', color: '#111', letterSpacing: 1, fontSize: 12 },
});
