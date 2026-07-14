import authClient from '../authClient';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await authClient.post('/login', { email, password });
      const data = response.data;
      return {
        success: true,
        token: data?.accessToken || data?.token || null,
        refreshToken: data?.refreshToken || null,
        expiresAt: data?.expiresAt || (data?.expiresIn ? new Date(Date.now() + data.expiresIn * 1000).toISOString() : null),
        user: data?.userDetails || data?.user || data?.data || null,
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
