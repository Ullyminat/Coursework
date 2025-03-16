import { create } from 'zustand';
import apiClient from '../api/client';

const useCabinetStore = create((set, get) => ({
  cabinets: [],
  selectedCabinetId: null,
  schemas: [],
  isLoading: false,
  error: null,

  fetchCabinets: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/me/cabinets');
      set({ cabinets: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || error.message, isLoading: false });
    }
  },

  selectCabinet: (cabinetId) => {
    set({ selectedCabinetId: cabinetId });
  },

  saveSchema: async (schemaData, imageBlob) => {
    const { selectedCabinetId } = get();
    if (!selectedCabinetId) throw new Error('Кабинет не выбран');

    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('schemaData', JSON.stringify(schemaData));
      formData.append('image', imageBlob, 'schema.png');
      formData.append('cabinetId', selectedCabinetId);

      const response = await apiClient.post('/save', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || error.message;
    } finally {
      set({ isLoading: false });
    }
  },

  generateDocument: async (schemaId) => {
    try {
      const response = await apiClient.post('/gendocx', { schemaId }, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || error.message;
    }
  },
}));

export default useCabinetStore;