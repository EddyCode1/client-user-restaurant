import authClient from '../authClient';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await authClient.post('/login', { email, password });
      return {
        success: true,
        token: response.data?.token || response.data?.accessToken || null,
        refreshToken: response.data?.refreshToken || null,
        user: response.data?.user || response.data?.data || null,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },

  register: async (payload) => {
    try {
      const response = await authClient.post('/register', payload);
      return {
        success: true,
        data: response.data?.data || response.data || null,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },
};

export default authService;
