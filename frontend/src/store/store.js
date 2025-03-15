import { create } from 'zustand';
import axios from 'axios';

const useCabinetStore = create((set, get) => ({
  cabinets: [], // Список кабинетов пользователя
  selectedCabinetId: null, // Выбранный кабинет
  schemas: [], // Список схем для выбранного кабинета
  isLoading: false, // Состояние загрузки
  error: null, // Ошибки

  // Загрузка кабинетов пользователя
  fetchCabinets: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('http://localhost:3000/api/me/cabinets', {
        withCredentials: true,
      });
      set({ cabinets: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Выбор кабинета
  selectCabinet: (cabinetId) => {
    set({ selectedCabinetId: cabinetId });
  },

  // Сохранение схемы
  saveSchema: async (schemaData, imageBlob) => {
    const { selectedCabinetId } = get();
    if (!selectedCabinetId) {
      throw new Error('Кабинет не выбран');
    }
  
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('schemaData', JSON.stringify(schemaData));
      formData.append('image', imageBlob, 'schema.png'); // Отправляем Blob
      formData.append('cabinetId', selectedCabinetId);
  
      const response = await axios.post(
        'http://localhost:3000/api/save',
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || error.message, isLoading: false });
      throw error;
    }
  },

  // Генерация документа
  generateDocument: async (schemaId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        'http://localhost:3000/api/gendocx',
        { schemaId },
        {
          withCredentials: true,
          responseType: 'blob', // Указываем, что ожидаем бинарные данные
        }
      );
      set({ isLoading: false });
      return response.data; // Возвращаем Blob для скачивания
    } catch (error) {
      set({ error: error.response?.data?.error || error.message, isLoading: false });
      throw error;
    }
  },
}));

export default useCabinetStore;