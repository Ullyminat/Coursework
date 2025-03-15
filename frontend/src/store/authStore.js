import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  login: async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/login', { email, password }, { withCredentials: true });
      if (response.status === 200) {
        set({ isAuthenticated: true, user: response.data.user, token: response.data.token });
        return response.data;
      } else {
        throw new Error('Неверный email или пароль');
      }
    } catch (error) {
      throw error;
    }
  },
  logout: () => {
    set({ isAuthenticated: false, user: null, token: null });
  },
}));

export default useAuthStore;