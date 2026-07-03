import { create } from 'zustand';
import adminClient from '../../../shared/api/adminClient';

const normalizeMenuList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.menus)) return payload.menus;
  return [];
};

const useMenuStore = create((set) => ({
  menus: [],
  currentMenu: null,
  loading: false,
  error: null,

  setMenus: (menus) => set({ menus }),
  setCurrentMenu: (menu) => set({ currentMenu: menu }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchMenus: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await adminClient.get('/menu', { params });
      const menus = normalizeMenuList(response.data);
      set({ menus, loading: false });
      return { success: true, data: menus };
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false, menus: [] });
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  fetchMenuById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await adminClient.get(`/menu/${id}`);
      const menu = response.data?.data || response.data;
      set({ currentMenu: menu, loading: false });
      return { success: true, data: menu };
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },
}));

export default useMenuStore;
