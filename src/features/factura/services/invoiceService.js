import apiClient from '../../../shared/api/apiClient';

const normalizeInvoiceList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.invoices)) return payload.invoices;
  return [];
};

const normalizeInvoiceItem = (payload) => {
  if (!payload) return null;
  return payload?.data || payload;
};

export const invoiceService = {
  async getInvoicesByOrder(orderId) {
    try {
      const response = await apiClient.get(`/invoice/order/${orderId}`);
      return {
        success: true,
        data: normalizeInvoiceList(response.data),
        message: 'Facturas obtenidas exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener la factura',
        data: [],
      };
    }
  },

  async getInvoiceById(id) {
    try {
      const response = await apiClient.get(`/invoice/${id}`);
      return {
        success: true,
        data: normalizeInvoiceItem(response.data),
        message: 'Factura obtenida exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener la factura',
        data: null,
      };
    }
  },
};

export default invoiceService;
