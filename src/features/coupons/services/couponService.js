import apiClient from '../../../shared/api/apiClient.js'; // Ajustado a cliente de usuario
import { COUPON_API_ENDPOINTS } from '../constants/couponConstants.js';

const normalizeCouponList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const normalizeCouponItem = (payload) => {
  if (!payload || Array.isArray(payload)) return null;
  return payload.data || payload;
};

export const couponService = {
  /**
   * Obtiene la lista de cupones disponibles para el cliente
   */
  async getCoupons(params = {}) {
    try {
      const response = await apiClient.get(COUPON_API_ENDPOINTS.LIST, { params });
      return {
        success: true,
        data: normalizeCouponList(response.data),
        message: 'Cupones obtenidos exitosamente'
      };
    } catch (error) {
      console.error('Error fetching coupons:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener cupones',
        data: []
      };
    }
  },

  /**
   * Obtiene detalles de un cupón específico
   */
  async getCouponById(id) {
    try {
      const response = await apiClient.get(COUPON_API_ENDPOINTS.DETAIL(id));
      return {
        success: true,
        data: normalizeCouponItem(response.data),
        message: 'Cupón obtenido exitosamente'
      };
    } catch (error) {
      console.error('Error fetching coupon:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener cupón',
        data: null
      };
    }
  }
};