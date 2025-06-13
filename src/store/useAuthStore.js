// C:\Users\Anirudha\Desktop\CogniCare\frontend\src\store\useAuthStore.js

import { create } from 'zustand';
import api from '../lib/axios'; // Import your axios instance
import toast from 'react-hot-toast'; // You'll need to install react-hot-toast later

export const useAuthStore = create((set) => ({
  authUser: null,
  isLoading: false,
  error: null,

  // Action to fetch user profile (e.g., on app load to check session)
  getAuthUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response =await api.get('/api/auth/check');//-----------------------------------------/profile
      set({ authUser: response.data });//----------------isLoading: false
    } catch (err) {
      console.error("Failed to get auth user:", err);
      set({ authUser: null, isLoading: false, error: 'Failed to fetch user profile' });
    }
    // finally{
    //   set({isLoading:false});//------------------------------------------added
    // }
  },

  // Action for user signup
  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/auth/signup', userData);
      set({ authUser: response.data, isLoading: false });
      toast.success('Signed up successfully!');
      return true; // Indicate success
    } catch (err) {
      console.error("Signup error:", err);
      const errorMessage = err.response?.data?.message || 'Signup failed. Please try again.';
      set({ authUser: null, isLoading: false, error: errorMessage });
      toast.error(errorMessage);
      return false; // Indicate failure
    }
  },

  // Action for user login
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/api/auth/login', credentials);
      set({ authUser: response.data, isLoading: false });
      toast.success('Logged in successfully!');
      return true; // Indicate success
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      set({ authUser: null, isLoading: false, error: errorMessage });
      toast.error(errorMessage);
      return false; // Indicate failure
    }
  },

  // Action for user logout
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/api/auth/logout');
      set({ authUser: null, isLoading: false });
      toast.success('Logged out successfully!');
      return true; // Indicate success
    } catch (err) {
      console.error("Logout error:", err);
      const errorMessage = err.response?.data?.message || 'Logout failed.';
      set({ isLoading: false, error: errorMessage });
      toast.error(errorMessage);
      return false; // Indicate failure
    }
  },

  // Clear errors
  clearError: () => set({ error: null }),
}));