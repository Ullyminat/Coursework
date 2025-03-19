import { create } from 'zustand';
import apiClient from '../api/client';

const useCabinetStore = create((set, get) => ({
  cabinets: [],
  selectedCabinetId: null,
  schemas: [],       // Схемы пользователя
  umk: [],           // Учебно-методические комплексы
  specs: [],         // Спецификации
  pasports: [],      // Добавляем новое поле для паспортов
  isLoading: false,
  error: null,

  // Загрузка кабинетов пользователя
  fetchCabinets: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/me/cabinets');
      set({ cabinets: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || error.message, isLoading: false });
    }
  },

  // Загрузка паспортов пользователя
  fetchPasports: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/me/pasports');
      set({ pasports: response.data || [], isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.error || error.message, 
        pasports: [],
        isLoading: false 
      });
    }
  },

  // Загрузка UMK пользователя
  fetchUMK: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/me/umk');
      set({ umk: response.data || [], isLoading: false });
    } catch (error) {
      set({ umk: [], error: error.response?.data?.error || error.message, isLoading: false });
    }
  },

  // Загрузка спецификаций
  fetchSpecs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/me/specs');
      set({ specs: response.data || [], isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || error.message, isLoading: false });
    }
  },

  // Загрузка схем пользователя
  fetchUserSchemas: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/me/schemas');
      set({ schemas: response.data || [], isLoading: false });
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
      
      // Обновляем список схем после сохранения
      await get().fetchUserSchemas();
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || error.message;
    } finally {
      set({ isLoading: false });
    }
  },

  generateDocument: async ({ cabinetId, umkIds, specIds, schemaId }) => {
    try {
      const response = await apiClient.post(
        '/gendocx', 
        { cabinetId, umkIds, specIds, schemaId },
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage });
      throw errorMessage;
    }
  },
}));

export default useCabinetStore;