import { create } from 'zustand';
import adminClient from '../../../shared/api/adminClient';

const useContactStore = create((set) => ({
  contacts: [],
  loading: false,
  error: null,

  setContacts: (contacts) => set({ contacts }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchContacts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await adminClient.get('/contact');
      const contacts = response.data?.data || response.data || [];
      set({ contacts: Array.isArray(contacts) ? contacts : [], loading: false });
      return { success: true, data: Array.isArray(contacts) ? contacts : [] };
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false, contacts: [] });
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },
}));

export default useContactStore;
