import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import useOrderStore from '../../orders/store/useOrderStore';
import { getDetallePedidosByOrderService } from '../../detallepedido/services/DetallePedidoService';
import { getDishByIdService } from '../../dishes/services/DishService';
import { getBeverageByIdService } from '../../beverages/services/beverageService';
import {
  asId,
  extractDetalleList,
  formatDateTime,
  getInvoiceStatusLabel,
} from '../utils/invoiceHelpers';

const CustomerFacturaPrintScreen = ({ route }) => {
  // Obtenemos el orderId de los parámetros de navegación
  const { orderId: paramOrderId } = route.params || {};
  
  const { orders, loading, error, fetchOrders } = useOrderStore();
  const [selectedOrderId, setSelectedOrderId] = useState(paramOrderId || '');
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
        setDetailError('No se pudo cargar el detalle');
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
      <View style={styles.card}>
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : !selectedOrder ? (
          <Text>Sin factura disponible</Text>
        ) : (
          <View>
            <Text style={styles.invoiceTitle}>{selectedOrder?.invoice_number || 'FACTURA'}</Text>
            <Text>Orden #{selectedOrder?.Orders_number || '---'}</Text>
            
            <View style={styles.divider} />
            
            {detailItems.map((item, index) => (
              <View key={index} style={styles.row}>
                <Text>{item.name} x{item.qty}</Text>
                <Text>Q{Number(item.subtotal || 0).toFixed(2)}</Text>
              </View>
            ))}

            <View style={styles.divider} />
            
            <Text>Subtotal: Q{subtotal.toFixed(2)}</Text>
            <Text>Total: Q{total.toFixed(2)}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 15 },
  invoiceTitle: { fontSize: 20, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#ccc', marginVertical: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }
});

export default CustomerFacturaPrintScreen;