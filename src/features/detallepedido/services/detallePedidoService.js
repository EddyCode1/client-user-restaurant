import apiClient from '../../../shared/api/apiClient';

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.detallePedidos)) return payload.detallePedidos;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const unwrap = (payload) => payload?.data ?? payload;

export const getDetallePedidos = async (params = {}) => {
  const response = await apiClient.get('/detallepedido', { params });
  return normalizeList(response.data);
};

export const getDetallePedidoById = async (id) => {
  const response = await apiClient.get(`/detallepedido/${id}`);
  return unwrap(response.data);
};

export const getDetallePedidosByOrder = async (orderId) => {
  const response = await apiClient.get(`/detallepedido/order/${orderId}`);
  return normalizeList(response.data);
};

export const getDetallePedidosByOrderService = async (orderId) => {
  const data = await getDetallePedidosByOrder(orderId);
  return { success: true, data };
};

export const createDetallePedido = async (payload) => {
  const response = await apiClient.post('/detallepedido', payload);
  return unwrap(response.data);
};

export const updateDetallePedido = async (id, payload) => {
  const response = await apiClient.put(`/detallepedido/${id}`, payload);
  return unwrap(response.data);
};

export const deleteDetallePedido = async (id) => {
  const response = await apiClient.delete(`/detallepedido/${id}`);
  return unwrap(response.data);
};

export default {
  getDetallePedidos,
  getDetallePedidoById,
  getDetallePedidosByOrder,
  getDetallePedidosByOrderService,
  createDetallePedido,
  updateDetallePedido,
  deleteDetallePedido,
};
