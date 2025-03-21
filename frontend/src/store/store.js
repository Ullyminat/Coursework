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
  currentUser: null,
  userLoading: false,
  userError: null,

  // Получение данных текущего пользователя
  fetchCurrentUser: async () => {
    set({ userLoading: true, userError: null });
    try {
      const response = await apiClient.get('/me');
      set({ 
        currentUser: response.data,
        userLoading: false 
      });
    } catch (error) {
      set({ userError: error.response?.data?.error || error.message, userLoading: false });
    }
  },

  fetchUsers: async (page = 1, limit = 10) => {
    set({ usersLoading: true, usersError: null });
    try {
      const response = await apiClient.get(`/user?page=${page}&limit=${limit}`);
      set({ 
        users: response.data.users,
        totalUsers: response.data.total,
        usersLoading: false 
      });
    } catch (error) {
      set({ 
        usersError: error.response?.data?.error || error.message, 
        usersLoading: false 
      });
    }
  },

  changeUserRole: async (userId, newRole) => {
    try {
      await apiClient.put(`/user/chrole/${userId}`, { role: newRole });
      set(state => ({
        users: state.users.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        )
      }));
    } catch (error) {
      throw error.response?.data?.error || error.message;
    }
  },

  deleteUser: async (userId) => {
    try {
      await apiClient.delete(`/user/${userId}`);
      set(state => ({
        users: state.users.filter(user => user._id !== userId),
        totalUsers: state.totalUsers - 1
      }));
    } catch (error) {
      throw error.response?.data?.error || error.message;
    }
  },

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

    // Cкачивания паспорта
    downloadPasport: async (pasportId) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiClient.get(`/${pasportId}/download`, {
          responseType: 'blob'
        });
  
        // Извлекаем имя файла из заголовков
        const contentDisposition = response.headers['content-disposition'];
        const fileNameMatch = contentDisposition?.match(/filename="(.+)"/);
        const fileName = fileNameMatch?.[1] || `pasport_${pasportId}.docx`;
  
        // Создаем временную ссылку для скачивания
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        
        // Чистим ресурсы
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        set({ isLoading: false });
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        set({ error: errorMessage, isLoading: false });
        throw errorMessage;
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