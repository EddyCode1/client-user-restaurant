import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useOrderStore from '../../orders/store/useOrderStore';
import useRestaurantStore from '../../restaurant/store/useRestaurantStore';
import useMenuStore from '../../menus/store/useMenuStore';
import OrderTimerBadge from '../components/OrderTimerBadge';

export default function CustomerOrdersScreen() {
  const navigation = useNavigation();
  const { orders, loading, fetchOrders } = useOrderStore();
  const { restaurants } = useRestaurantStore();
  const { menus } = useMenuStore();
  
  const [activeTab, setActiveTab] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'En Proceso') return orders.filter(o => !['completada', 'entregado'].includes(o.Orders_status));
    if (activeTab === 'Completadas') return orders.filter(o => ['completada', 'entregado'].includes(o.Orders_status));
    return orders;
  }, [orders, activeTab]);

  const renderOrderCard = ({ item: order }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.orderNumber}>#{order?.Orders_number || '---'}</Text>
        <OrderTimerBadge 
          orderId={order._id} 
          createdAt={order.createdAt || order.Orders_createdAt} 
          status={order.Orders_status} 
        />
      </View>
      
      <Text style={styles.statusBadge}>
        {order.Orders_status || 'en_preparacion'}
      </Text>
      
      <View style={styles.divider} />
      
      <Text style={styles.infoText}>Domicilio: {order.Orders_domicile || 'N/A'}</Text>
      <Text style={styles.totalText}>Total: Q{Number(order.Orders_total || 0).toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header y Tabs */}
      <View style={styles.header}>
        <Text style={styles.title}>MIS ÓRDENES</Text>
        <View style={styles.tabContainer}>
          {['Todas', 'En Proceso', 'Completadas'].map(tab => (
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
        <ActivityIndicator size="large" color="#fff" style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item._id}
          renderItem={renderOrderCard}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  listContent: { padding: 15 },
  card: { backgroundColor: '#1b1b1f', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#222' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderNumber: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  statusBadge: { fontSize: 10, color: '#aaa', fontWeight: '800', marginVertical: 8 },
  divider: { height: 1, backgroundColor: '#333', marginVertical: 8 },
  infoText: { fontSize: 12, color: '#888' },
  totalText: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginTop: 8 }
});