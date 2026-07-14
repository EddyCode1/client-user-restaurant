import { create } from 'zustand';
import adminClient from '../../../shared/api/adminClient';
import { useAuthStore } from '../../../shared/store/authStore';

const normalizeOrderList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.orders)) return payload.orders;
  return [];
};

const useOrderStore = create((set) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,

  setOrders: (orders) => set({ orders }),
  setCurrentOrder: (order) => set({ currentOrder: order }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchOrders: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      const userId = user?._id || user?.id;
      const queryParams = {
        ...params,
        ...(userId ? { User_id: userId } : {}),
      };
      const response = await adminClient.get('/order', { params: queryParams });
      const orders = normalizeOrderList(response.data);
      set({ orders, loading: false });
      return { success: true, data: orders };
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false, orders: [] });
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  fetchOrderById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await adminClient.get(`/order/${id}`);
      const order = response.data?.data || response.data;
      set({ currentOrder: order, loading: false });
      return { success: true, data: order };
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  saveOrder: async (formData, id = null) => {
    set({ loading: true, error: null });
    try {
      const response = id
        ? await adminClient.put(`/order/${id}`, formData)
        : await adminClient.post('/order', formData);
      const order = response.data?.data || response.data;
      await set((state) => ({ orders: id ? state.orders : [order, ...state.orders] }));
      set({ loading: false });
      return { success: true, data: order };
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      await adminClient.put(`/order/${id}`, { Orders_status: status });
      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === id ? { ...order, Orders_status: status } : order
        ),
      }));
      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  createOrderDetails: async (orderId, cartItems) => {
    try {
      if (!cartItems?.length) return { success: true };

      await adminClient.post('/detallepedido', {
        orders_id: orderId,
        items: cartItems.map((item) => ({
          producto: item.id,
          productType: item.type,
          candidadproducto: item.quantity,
        })),
      });
      return { success: true };
    } catch (error) {
      console.error('Error creating order details:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  saveOrderWithDetails: async (formData, cartItems = []) => {
    set({ loading: true, error: null });
    try {
      const response = await adminClient.post('/order', formData);
      const order = response.data?.data || response.data;
      const orderId = order._id || order.id;

      if (cartItems?.length > 0 && orderId) {
        await adminClient.post('/detallepedido', {
          orders_id: orderId,
          items: cartItems.map((item) => ({
            producto: item.id,
            productType: item.type,
            candidadproducto: item.quantity,
          })),
        });
      }

      set((state) => ({ orders: [order, ...state.orders] }));
      set({ loading: false });
      return { success: true, data: order };
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },
}));

export default useOrderStore;
