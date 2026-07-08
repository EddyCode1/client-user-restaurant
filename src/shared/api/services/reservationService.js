import apiClient from '../apiClient';

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.reservations)) return payload.reservations;
  return [];
};

const reservationService = {
  async getReservations(params = {}) {
    try {
      const response = await apiClient.get('/reservation', { params });
      return normalizeList(response.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  async getReservationById(id) {
    try {
      const response = await apiClient.get(`/reservation/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  async createReservation(payload) {
    try {
      const response = await apiClient.post('/reservation', payload);
      return response.data?.data || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  async updateReservation(id, payload) {
    try {
      const response = await apiClient.put(`/reservation/${id}`, payload);
      return response.data?.data || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  async deleteReservation(id) {
    try {
      const response = await apiClient.delete(`/reservation/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  async cancelReservation(id) {
    return this.updateReservation(id, { reservation_state: 'cancelada' });
  },
};

export default reservationService;
