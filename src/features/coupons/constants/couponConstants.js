export const COUPON_MESSAGES = {
  FETCH_SUCCESS: 'Cupones cargados exitosamente',
  FETCH_ERROR: 'Error al cargar cupones',
};

export const COUPON_API_ENDPOINTS = {
  BASE: '/coupon',
  LIST: '/coupon',
  // DETAIL se mantiene por si el cliente necesita ver un cupón específico
  DETAIL: (id) => `/coupon/${id}`,
};

export const COUPON_DEFAULTS = {
  PAGE_SIZE: 10,
  SORT_BY: 'createdAt',
  SORT_ORDER: 'desc',
};