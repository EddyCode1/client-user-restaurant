import { useCallback } from 'react';
import useCouponStore from '../store/useCouponStore.js';

/**
 * Hook para obtener y manejar cupones (Consulta)
 */
export const useCoupons = () => {
  const {
    coupons,
    loading,
    error,
    fetchCoupons,
    clearError,
  } = useCouponStore();

  return {
    coupons,
    loading,
    error,
    fetchCoupons,
    clearError,
  };
};

/**
 * Hook para manejar cupón individual (Consulta)
 */
export const useCoupon = (id) => {
  const {
    currentCoupon,
    loading,
    error,
    fetchCouponById,
    clearCurrentCoupon,
  } = useCouponStore();

  const fetch = useCallback(() => {
    if (id) {
      return fetchCouponById(id);
    }
  }, [id, fetchCouponById]);

  return {
    coupon: currentCoupon,
    loading,
    error,
    fetch,
    clearCurrentCoupon,
  };
};

