import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import useOrderStore from '../../orders/store/useOrderStore';
import { getDetallePedidosByOrderService } from '../../detallepedido/services/DetallePedidoService';
import { getDishByIdService } from '../../dishes/services/DishService';
import { getBeverageByIdService } from '../../beverages/services/beverageService';
import {
  asId,
  formatDateTime,
  extractDetalleList,
  getInvoiceStatusLabel,
} from '../utils/invoiceHelpers';

const CustomerFacturaScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orders, loading, error, fetchOrders } = useOrderStore();

  // El orderId vendría por los params de la ruta de navegación
  const [selectedOrderId, setSelectedOrderId] = useState(route.params?.orderId || '');
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailItems, setDetailItems] = useState([]);
  const [detailError, setDetailError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const aTime = new Date(a?.createdAt || a?.created_at || a?.fecha || 0).getTime();
      const bTime = new Date(b?.createdAt || b?.created_at || b?.fecha || 0).getTime();
      return bTime - aTime;
    });
  }, [orders]);

  const selectedOrder = useMemo(
    () => sortedOrders.find((order) => asId(order) === selectedOrderId) || null,
    [selectedOrderId, sortedOrders]
  );

  useEffect(() => {
    const loadDetails = async () => {
      if (!selectedOrderId) {
        setDetailItems([]);
        return;
      }
      setLoadingDetails(true);
      setDetailError('');
      try {
        const result = await getDetallePedidosByOrderService(selectedOrderId);
        const detalles = extractDetalleList(result);
        const items = await Promise.all(
          detalles.map(async (detail) => {
            const qty = Number(detail?.candidadproducto || detail?.quantity || 1);
            const productType = String(detail?.productType || detail?.tipo || 'dish').toLowerCase();
            const productId = detail?.producto;
            let product = null;
            if (productId && typeof productId === 'object') {
              product = productId;
            } else if (productId) {
              try {
                const response = productType === 'beverage'
                  ? await getBeverageByIdService(productId)
                  : await getDishByIdService(productId);
                product = response?.data || response || null;
              } catch { product = null; }
            }
            const unitPrice = Number(product?.Menu_Price ?? product?.price ?? 0);
            return {
              name: product?.Menu_Plate || product?.Menu_Drink || product?.name || String(productId || 'Producto'),
              qty,
              subtotal: unitPrice * qty,
            };
          })
        );
        setDetailItems(items);
      } catch (err) {
        setDetailItems([]);
        setDetailError('No se pudo cargar el detalle de la factura');
      } finally {
        setLoadingDetails(false);
      }
    };
    loadDetails();
  }, [selectedOrderId]);

  const subtotal = useMemo(() => detailItems.reduce((sum, item) => sum + Number(item.subtotal || 0), 0), [detailItems]);
  const tax = useMemo(() => Number(selectedOrder?.tax || selectedOrder?.iva || 0), [selectedOrder]);
  const discount = useMemo(() => Number(selectedOrder?.discount || 0), [selectedOrder]);
  const total = useMemo(() => Math.max(0, subtotal + tax - discount), [subtotal, tax, discount]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>FACTURA</Text>

      {/* Aquí podrías mapear un selector o lista de órdenes si deseas cambiar de orden */}
      
      {loading ? (
        <ActivityIndicator size="large" color="#FFF" />
      ) : selectedOrder ? (
        <View style={styles.card}>
          <Text style={styles.invoiceNumber}>{selectedOrder?.invoice_number || 'FAC-TEMP'}</Text>
          <Text style={styles.orderLabel}>Orden #{selectedOrder?.Orders_number || '---'}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PRODUCTOS</Text>
            {detailItems.map((item, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.text}>{item.name} x{item.qty}</Text>
                <Text style={styles.text}>Q{item.subtotal.toFixed(2)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <Text style={styles.totalText}>TOTAL: Q{total.toFixed(2)}</Text>
        </View>
      ) : (
        <Text style={styles.text}>No hay factura seleccionada</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111113', padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 20 },
  card: { backgroundColor: '#17171b', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: '#333' },
  invoiceNumber: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  orderLabel: { color: '#AAA', marginBottom: 10 },
  section: { marginVertical: 15 },
  sectionTitle: { fontSize: 10, color: '#666', fontWeight: 'bold', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  text: { color: '#FFF' },
  divider: { height: 1, backgroundColor: '#333', marginVertical: 10 },
  totalText: { fontSize: 18, fontWeight: 'bold', color: '#FFF', textAlign: 'right' }
});

export default CustomerFacturaScreen;
