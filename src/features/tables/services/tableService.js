import apiClient from '../../../shared/api/apiClient';

const normalizeTableList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.tables)) return payload.tables;
  return [];
};

export const tableService = {
  async getTables(params = {}) {
    try {
      const response = await apiClient.get('/table', { params });
      return normalizeTableList(response.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  async getTableById(id) {
    try {
      const response = await apiClient.get(`/table/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};

export default tableService;
