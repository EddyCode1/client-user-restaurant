import { create } from 'zustand';
import restaurantService from '../services/restaurantService';

const useRestaurantStore = create((set) => ({
  restaurants: [],
  currentRestaurant: null,
  loading: false,
  error: null,

  setRestaurants: (restaurants) => set({ restaurants }),
  setCurrentRestaurant: (restaurant) => set({ currentRestaurant: restaurant }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchRestaurants: async (params = {}) => {
    set({ loading: true, error: null });
    const result = await restaurantService.getRestaurants(params);
    if (result.success) {
      set({ restaurants: result.data || [], loading: false });
      return { success: true, data: result.data || [] };
    }
    set({ error: result.error, loading: false, restaurants: [] });
    return { success: false, error: result.error };
  },

  fetchRestaurantById: async (id) => {
    set({ loading: true, error: null });
    const result = await restaurantService.getRestaurantById(id);
    if (result.success) {
      set({ currentRestaurant: result.data, loading: false });
      return { success: true, data: result.data };
    }
    set({ error: result.error, loading: false });
    return { success: false, error: result.error };
  },
}));

export default useRestaurantStore;
