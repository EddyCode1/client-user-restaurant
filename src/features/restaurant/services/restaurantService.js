import adminClient from '../../../shared/api/adminClient';

const normalizeRestaurantList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.restaurants)) return payload.restaurants;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const normalizeRestaurantItem = (payload) => {
  if (!payload || Array.isArray(payload)) return null;
  return payload?.restaurant || payload?.data || payload;
};

export const restaurantService = {
  getRestaurants: async (params = {}) => {
    try {
      const response = await adminClient.get('/restaurant', { params });
      return { success: true, data: normalizeRestaurantList(response.data) };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  getRestaurantById: async (id) => {
    try {
      const response = await adminClient.get(`/restaurant/${id}`);
      return { success: true, data: normalizeRestaurantItem(response.data) };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },
};

export default restaurantService;
