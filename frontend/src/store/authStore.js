import { create } from 'zustand';
import apiClient from '../api/client';

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  isLoadingAuth: true, // Добавляем состояние загрузки

  // Метод для проверки авторизации
  checkAuth: async () => {
    try {
      const response = await apiClient.get('/me');
      set({
        isAuthenticated: true,
        user: response.data.user,
        isLoadingAuth: false,
      });
    } catch (error) {
      set({ isAuthenticated: false, user: null, isLoadingAuth: false });
    }
  },

  login: async (email, password) => {
    try {
      const response = await apiClient.post('/login', { email, password });
      set({ 
        isAuthenticated: true, 
        user: response.data.user,
      });
    } catch (error) {
      throw error.response?.data?.error || 'Ошибка входа';
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/logout');
    } finally {
      set({ isAuthenticated: false, user: null });
    }
  },
}));

export default useAuthStore;