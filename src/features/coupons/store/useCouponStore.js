import { create } from 'zustand';
import { couponService } from '../services/couponService.js';

const useCouponStore = create((set) => ({
  // State
  coupons: [],
  currentCoupon: null,
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  clearCurrentCoupon: () => set({ currentCoupon: null }),

  // Async Actions
  fetchCoupons: async () => {
    set({ loading: true, error: null });
    const result = await couponService.getCoupons();

    if (result.success) {
      set({ coupons: result.data, loading: false, error: null });
    } else {
      set({ loading: false, error: result.error });
    }
    return result;
  },

  fetchCouponById: async (id) => {
    if (!id) return { success: false, error: 'ID de cupón requerido' };

    set({ loading: true, error: null });
    const result = await couponService.getCouponById(id);

    if (result.success) {
      set({ currentCoupon: result.data, loading: false, error: null });
    } else {
      set({ loading: false, error: result.error });
    }
    return result;
  },
}));

export default useCouponStore;