import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import ScreenBackHeader from '../../../shared/components/ScreenBackHeader';
import useOrderStore from '../../orders/store/useOrderStore';
import { getDetallePedidosByOrderService } from '../../detallepedido/services/detallePedidoService';
import { getDishByIdService } from '../../dishes/services/DishService';
import { getBeverageByIdService } from '../../beverages/services/beverageService';
import { useInvoice } from '../hooks/useInvoice';
import { asId, extractDetalleList, getInvoiceStatusLabel } from '../utils/invoiceHelpers';

const CustomerFacturaScreenIntegrated = () => {
  const route = useRoute();
  const { orders, loading, fetchOrders } = useOrderStore();
  const [selectedOrderId, setSelectedOrderId] = useState(route.params?.orderId || '');
  const { invoice, loading: loadingInvoice, error: invoiceError, fetchInvoice } = useInvoice(selectedOrderId);
  const [detailItems, setDetailItems] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailError, setDetailError] = useState('');

  useEffect(() => {
    if (route.params?.orderId) {
      setSelectedOrderId(route.params.orderId);
    }
  }, [route.params?.orderId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (selectedOrderId) {
      fetchInvoice();
    }
  }, [fetchInvoice, selectedOrderId]);

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
        const detalles = extractDetalleList(result?.data ?? result);
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
              } catch {
                product = null;
              }
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
      } catch {
        setDetailItems([]);
        setDetailError('No se pudo cargar el detalle de la factura');
      } finally {
        setLoadingDetails(false);
      }
    };

    loadDetails();
  }, [selectedOrderId]);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const aTime = new Date(a?.createdAt || a?.created_at || a?.fecha || 0).getTime();
      const bTime = new Date(b?.createdAt || b?.created_at || b?.fecha || 0).getTime();
      return bTime - aTime;
    });
  }, [orders]);

  const selectedOrder = useMemo(() => {
    return sortedOrders.find((order) => asId(order) === selectedOrderId) || null;
  }, [selectedOrderId, sortedOrders]);

  const subtotal = useMemo(() => detailItems.reduce((sum, item) => sum + Number(item.subtotal || 0), 0), [detailItems]);
  const tax = useMemo(() => Number(invoice?.tax ?? selectedOrder?.tax ?? selectedOrder?.iva ?? 0), [invoice, selectedOrder]);
  const discount = useMemo(() => Number(invoice?.discount ?? selectedOrder?.discount ?? 0), [invoice, selectedOrder]);
  const total = useMemo(() => Math.max(0, subtotal + tax - discount), [subtotal, tax, discount]);

  return (
    <ScrollView style={styles.container}>
      <ScreenBackHeader title="Factura" subtitle={selectedOrder ? `Orden #${selectedOrder?.Orders_number || '---'}` : ''} />

      {loading || loadingInvoice ? (
        <ActivityIndicator size="large" color="#FFF" />
      ) : selectedOrder ? (
        <View style={styles.card}>
          <Text style={styles.invoiceNumber}>{invoice?.invoice_number || selectedOrder?.invoice_number || 'FAC-TEMP'}</Text>
          <Text style={styles.orderLabel}>Orden #{selectedOrder?.Orders_number || '---'}</Text>
          <Text style={styles.statusLabel}>{getInvoiceStatusLabel(invoice?.status || selectedOrder?.status || 'pendiente')}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PRODUCTOS</Text>
            {loadingDetails ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : detailItems.length > 0 ? (
              detailItems.map((item, index) => (
                <View key={`${item.name}-${index}`} style={styles.row}>
                  <Text style={styles.text}>{item.name} x{item.qty}</Text>
                  <Text style={styles.text}>Q{Number(item.subtotal || 0).toFixed(2)}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.text}>{detailError || 'Sin productos cargados'}</Text>
            )}
          </View>

          <View style={styles.divider} />
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.text}>Q{subtotal.toFixed(2)}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Impuesto</Text><Text style={styles.text}>Q{Number(tax || 0).toFixed(2)}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Descuento</Text><Text style={styles.text}>Q{Number(discount || 0).toFixed(2)}</Text></View>
          <Text style={styles.totalText}>TOTAL: Q{total.toFixed(2)}</Text>

          {invoiceError ? <Text style={styles.errorText}>{invoiceError}</Text> : null}
        </View>
      ) : (
        <Text style={styles.text}>No hay factura seleccionada</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111113', padding: 20 },
  card: { backgroundColor: '#17171b', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: '#333' },
  invoiceNumber: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  orderLabel: { color: '#AAA', marginBottom: 6 },
  statusLabel: { color: '#8B5CF6', marginBottom: 10, fontWeight: '600' },
  section: { marginVertical: 15 },
  sectionTitle: { fontSize: 10, color: '#666', fontWeight: 'bold', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  summaryLabel: { color: '#AAA' },
  text: { color: '#FFF' },
  divider: { height: 1, backgroundColor: '#333', marginVertical: 10 },
  totalText: { fontSize: 18, fontWeight: 'bold', color: '#FFF', textAlign: 'right', marginTop: 8 },
  errorText: { marginTop: 8, color: '#F87171' },
});

export default CustomerFacturaScreenIntegrated;
