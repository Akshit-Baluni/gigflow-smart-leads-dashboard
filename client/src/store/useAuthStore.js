import { create } from 'zustand';
import api from '../utils/axios';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('user', JSON.stringify(response.data));
      set({ user: response.data, loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/register', userData);
      localStorage.setItem('user', JSON.stringify(response.data));
      set({ user: response.data, loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put('/auth/profile', profileData);
      const updatedUser = { ...JSON.parse(localStorage.getItem('user')), ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser, loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  changePassword: async (passwords) => {
    set({ loading: true, error: null });
    try {
      await api.put('/auth/change-password', passwords);
      set({ loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  deactivateAccount: async () => {
    set({ loading: true, error: null });
    try {
      await api.delete('/auth/deactivate');
      localStorage.removeItem('user');
      set({ user: null, loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Deactivation failed';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    set({ user: null });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
