import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import ScreenBackHeader from '../../../shared/components/ScreenBackHeader';
import useOrderStore from '../../orders/store/useOrderStore';
import { getDetallePedidosByOrderService } from '../../detallepedido/services/detallePedidoService';
import { getDishByIdService } from '../../dishes/services/DishService';
import { getBeverageByIdService } from '../../beverages/services/beverageService';
import { useInvoice } from '../hooks/useInvoice';
import {
  asId,
  extractDetalleList,
  getInvoiceStatusLabel,
} from '../utils/invoiceHelpers';

const CustomerFacturaScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const routeOrder = route.params?.order || null;
  const { orders, loading: loadingOrders, fetchOrders } = useOrderStore();
  const [selectedOrderId, setSelectedOrderId] = useState(route.params?.orderId || routeOrder?._id || routeOrder?.id || '');
  const { invoice, loading: loadingInvoice, error: invoiceError, fetchInvoice } = useInvoice(selectedOrderId);

  useEffect(() => {
    if (route.params?.orderId || routeOrder?._id || routeOrder?.id) {
      setSelectedOrderId(route.params?.orderId || routeOrder?._id || routeOrder?.id || '');
    }
  }, [route.params?.orderId, routeOrder?._id, routeOrder?.id]);

  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailItems, setDetailItems] = useState([]);
  const [detailError, setDetailError] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (selectedOrderId) {
      fetchInvoice();
    }
  }, [fetchInvoice, selectedOrderId]);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const aTime = new Date(a?.createdAt || a?.created_at || a?.fecha || 0).getTime();
      const bTime = new Date(b?.createdAt || b?.created_at || b?.fecha || 0).getTime();
      return bTime - aTime;
    });
  }, [orders]);

  const selectedOrder = useMemo(() => {
    if (routeOrder) return routeOrder;
    return sortedOrders.find((order) => asId(order) === selectedOrderId) || null;
  }, [routeOrder, selectedOrderId, sortedOrders]);

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
  const tax = useMemo(() => Number(invoice?.tax ?? selectedOrder?.tax ?? selectedOrder?.iva ?? 0), [invoice, selectedOrder]);
  const discount = useMemo(() => Number(invoice?.discount ?? selectedOrder?.discount ?? 0), [invoice, selectedOrder]);
  const total = useMemo(() => Math.max(0, subtotal + tax - discount), [subtotal, tax, discount]);

  const buildPdfHtml = () => {
    const rows = detailItems.map((item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.qty}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">Q${Number(item.subtotal || 0).toFixed(2)}</td>
      </tr>
    `).join('');

    return `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 24px; color: #111;">
          <h1 style="margin-bottom: 4px;">Factura</h1>
          <p style="margin: 0;">Orden #${selectedOrder?.Orders_number || '---'}</p>
          <p style="margin: 4px 0 16px;">${invoice?.invoice_number || selectedOrder?.invoice_number || 'FAC-TEMP'}</p>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="text-align: left; padding: 8px;">Producto</th>
                <th style="text-align: left; padding: 8px;">Cantidad</th>
                <th style="text-align: left; padding: 8px;">Subtotal</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <div style="margin-top: 16px; text-align: right;">
            <p style="margin: 4px 0;">Subtotal: Q${subtotal.toFixed(2)}</p>
            <p style="margin: 4px 0;">Impuesto: Q${Number(tax || 0).toFixed(2)}</p>
            <p style="margin: 4px 0;">Descuento: Q${Number(discount || 0).toFixed(2)}</p>
            <h3 style="margin-top: 8px;">Total: Q${total.toFixed(2)}</h3>
          </div>
        </body>
      </html>
    `;
  };

  const handleOpenFactura = () => {
    if (!selectedOrder) return;
    navigation.navigate('FacturaPrint', {
      orderId: selectedOrder?._id || selectedOrder?.id || selectedOrderId,
      order: selectedOrder,
      invoice,
      detailItems,
      subtotal,
      tax,
      discount,
      total,
    });
  };

  const handleExportPdf = async () => {
    if (!selectedOrder) {
      Alert.alert('Sin factura', 'No hay una orden seleccionada para exportar.');
      return;
    }

    setIsExporting(true);
    try {
      const html = buildPdfHtml();
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      await shareAsync(uri, { UTI: 'com.adobe.pdf', mimeType: 'application/pdf' });
      Alert.alert('PDF listo', 'La factura se exportó correctamente.');
    } catch (error) {
      Alert.alert('No se pudo exportar', error?.message || 'Inténtalo de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ScreenBackHeader title="Factura" subtitle={selectedOrder ? `Orden #${selectedOrder?.Orders_number || '---'}` : ''} />

      {(loadingOrders || loadingInvoice) ? (
        <ActivityIndicator size="large" color="#FFF" />
      ) : selectedOrder ? (
        <View style={styles.card}>
          <Text style={styles.invoiceNumber}>{invoice?.invoice_number || selectedOrder?.invoice_number || 'FAC-TEMP'}</Text>
          <Text style={styles.orderLabel}>Orden #{selectedOrder?.Orders_number || '---'}</Text>
          <Text style={styles.statusLabel}>{getInvoiceStatusLabel(invoice?.status || selectedOrder?.status || 'pendiente')}</Text>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleOpenFactura}>
            <Text style={styles.secondaryButtonText}>Ver factura</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.exportButton} onPress={handleExportPdf} disabled={isExporting}>
            {isExporting ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.exportButtonText}>Exportar PDF</Text>}
          </TouchableOpacity>

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

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.text}>Q{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Impuesto</Text>
            <Text style={styles.text}>Q{Number(tax || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Descuento</Text>
            <Text style={styles.text}>Q{Number(discount || 0).toFixed(2)}</Text>
          </View>

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
  secondaryButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  secondaryButtonText: { color: '#FFF', fontWeight: '700' },
  exportButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  exportButtonText: { color: '#FFF', fontWeight: '700' },
  totalText: { fontSize: 18, fontWeight: 'bold', color: '#FFF', textAlign: 'right', marginTop: 8 },
  errorText: { marginTop: 8, color: '#F87171' },
});

export default CustomerFacturaScreen;
