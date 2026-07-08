import { create } from 'zustand';
import {
  getDetallePedidosByOrder,
  getDetallePedidoById,
  createDetallePedido,
  updateDetallePedido,
} from '../services/detallePedidoService';

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.detallePedidos)) return payload.detallePedidos;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const useDetallePedidoStore = create((set) => ({
  detallePedidos: [],
  loading: false,
  error: null,
  filters: { orderId: null },

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  fetchDetallePedidosByOrder: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const response = await getDetallePedidosByOrder(orderId);
      const filtered = normalizeList(response);
      set({ detallePedidos: filtered, loading: false });
      return { success: true, data: filtered };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false, detallePedidos: [] });
      return { success: false, error: message };
    }
  },

  saveDetallePedido: async (formData, id = null) => {
    set({ loading: true, error: null });
    try {
      const response = id
        ? await updateDetallePedido(id, formData)
        : await createDetallePedido(formData);
      set({ loading: false });
      return { success: true, data: response };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  fetchDetallePedidoById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await getDetallePedidoById(id);
      set({ loading: false });
      return { success: true, data: response };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },
}));

export default useDetallePedidoStore;
