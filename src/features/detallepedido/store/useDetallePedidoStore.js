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

// Función para reintentar con backoff exponencial
const retryWithBackoff = async (fn, maxRetries = 3, initialDelay = 1000) => {
  let lastError;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
};

const useDetallePedidoStore = create((set) => ({
  detallePedidos: [],
  loading: false,
  error: null,
  retrying: false,
  filters: { orderId: null },

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  fetchDetallePedidosByOrder: async (orderId) => {
    if (!orderId) {
      set({ error: 'Order ID es requerido', detallePedidos: [] });
      return { success: false, error: 'Order ID es requerido' };
    }

    set({ loading: true, error: null, retrying: false });
    try {
      const result = await retryWithBackoff(
        () => getDetallePedidosByOrder(orderId),
        3,
        500
      );
      const filtered = normalizeList(result);
      set({ detallePedidos: filtered, loading: false, error: null });
      return { success: true, data: filtered };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Error al cargar detalles';
      console.error('[useDetallePedidoStore] fetchDetallePedidosByOrder failed:', message);
      set({ error: message, loading: false, detallePedidos: [], retrying: false });
      return { success: false, error: message };
    }
  },

  // Reintentar carga de detalles manualmente
  retryFetchDetallePedidosByOrder: async (orderId) => {
    if (!orderId) return { success: false, error: 'Order ID es requerido' };
    set({ retrying: true, error: null });
    try {
      const result = await getDetallePedidosByOrder(orderId);
      const filtered = normalizeList(result);
      set({ detallePedidos: filtered, retrying: false, error: null });
      return { success: true, data: filtered };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Error al reintentar';
      set({ error: message, retrying: false });
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
