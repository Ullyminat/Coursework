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
  userDetails: null,
  userDetailsLoading: false,
  userDetailsError: null,
  currentUser: null,
  userLoading: false,
  userError: null,
  allCabinets: [],
  
  createUser: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/user', userData);
      
      const { users, totalUsers } = get();
      set({
        users: [...users, response.data],
        totalUsers: totalUsers + 1,
        isLoading: false
      });
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      throw errorMessage;
    }
  },

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

    // Получение всех кабинетов (админ)
    fetchAllCabinets: async () => {
      set({ cabinetsLoading: true, cabinetsError: null });
      try {
        const response = await apiClient.get('/cabinets');
        set({ 
          allCabinets: response.data,
          cabinetsLoading: false 
        });
      } catch (error) {
        set({ 
          cabinetsError: error.response?.data?.error || error.message, 
          cabinetsLoading: false 
        });
        throw error.response?.data?.error || error.message;
      }
    },

  fetchUsers: async (page = 1, limit = 2) => {
    set({ usersLoading: true, usersError: null });
    try {
      const response = await apiClient.get(`/user?page=${page}&limit=${limit}`);
      set({ 
        users: response.data.users,
        totalUsers: response.data.total,
        currentPage: response.data.currentPage,
        totalPages: response.data.pages,
        usersLoading: false 
      });
    } catch (error) {
      set({ 
        usersError: error.response?.data?.error || error.message, 
        usersLoading: false 
      });
    }
  },

  fetchUMKs: async (page = 1, limit = 2) => {
    set({ umksLoading: true, umksError: null });
    try {
      const response = await apiClient.get(`/umk?page=${page}&limit=${limit}`);
      set({ 
        umks: response.data.umks,
        totalUmks: response.data.total,
        currentPage: response.data.currentPage,
        totalPages: response.data.pages,
        umksLoading: false 
      });
    } catch (error) {
      set({ 
        umksError: error.response?.data?.error || error.message, 
        umksLoading: false 
      });
    }
  },

  fetchSpecsAdmin: async (page = 1, limit = 2) => {
    set({ specsLoading: true, specsError: null });
    try {
      const response = await apiClient.get(`/spec?page=${page}&limit=${limit}`);
      set({ 
        specs: response.data.specs,
        totalSpecs: response.data.total,
        currentPage: response.data.currentPage,
        totalPages: response.data.pages,
        specsLoading: false 
      });
    } catch (error) {
      set({ 
        specsError: error.response?.data?.error || error.message, 
        specsLoading: false 
      });
    }
  },

  fetchCabinetsAdmin: async (page = 1, limit = 4) => {
    set({ cabinetsLoading: true, cabinetsError: null });
    try {
      const allResponse = await apiClient.get('/cabinet');
      const total = allResponse.data.length;
      
      const startIndex = (page - 1) * limit;
      const paginatedData = allResponse.data.slice(startIndex, startIndex + limit);
  
      set({
        cabinets: paginatedData,
        totalCabinets: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        cabinetsLoading: false
      });
  
    } catch (error) {
      set({ 
        cabinetsError: error.response?.data?.error || error.message,
        cabinetsLoading: false 
      });
    }
  },

  fetchUser: async (userId) => {
    set({ userDetailsLoading: true, userDetailsError: null });
    try {
      const response = await apiClient.get(`/user/${userId}`);
      set({ 
        userDetails: response.data,
        userDetailsLoading: false 
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ 
        userDetailsError: errorMessage, 
        userDetailsLoading: false 
      });
      throw errorMessage;
    }
  },

  // Создание специализации
  createSpec: async (name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/spec', { name });
      
      // Обновляем список спецификаций
      set(state => ({
        specs: [...state.specs, response.data],
        isLoading: false
      }));
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw errorMessage;
    }
  },

  // Создание УМК
  createUMK: async (name, year) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/umk', { name, year });
      
      set(state => ({
        umk: [...state.umk, response.data],
        isLoading: false
      }));
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw errorMessage;
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
      set({ isLoading: true, error: null });
      await apiClient.delete(`/user/${userId}`);
      set(state => ({
        users: state.users.filter(user => user._id !== userId),
        totalUsers: state.totalUsers - 1,
        isLoading: false
      }));
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw errorMessage;
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

  generateDocument: async ({ cabinetId, cabinetName, umkIds, specIds, schemaId }) => {
    try {
      const response = await apiClient.post(
        '/gendocx', 
        { 
          cabinetId,
          cabinetName,
          umkIds, 
          specIds, 
          schemaId 
        },
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage });
      throw errorMessage;
    }
  },

  createCabinet: async (cabinetData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/cabinet', cabinetData);
      
      // Обновляем список всех кабинетов
      set(state => ({
        allCabinets: [...state.allCabinets, response.data],
        isLoading: false
      }));
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw errorMessage;
    }
  },

addUserCabinets: async (userId, cabinets) => {
  set({ isLoading: true, error: null });
  try {
      // Отправляем полный список кабинетов
      const response = await apiClient.put(`/user/addcabinet/${userId}`, { 
          cabinets 
      });
      
      set(state => ({
          users: state.users.map(user => 
              user._id === userId ? response.data.user : user
          ),
          isLoading: false
      }));
      
      return response.data;
  } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw errorMessage;
  }
},

  deletePasport: async (pasportId) => {
    try {
        await apiClient.delete(`/${pasportId}`);
        set(state => ({
            pasports: state.pasports.filter(p => p._id !== pasportId)
        }));
    } catch (error) {
        throw error.response?.data?.error || error.message;
    }
},

deleteCabinet: async (id) => {
  set({ isLoading: true, error: null });
  try {
    await apiClient.delete(`/cabinet/${id}`);
    set(state => ({
      allCabinets: state.allCabinets.filter(c => c._id !== id),
      cabinets: state.cabinets.filter(c => c._id !== id),
    }));
    set({ isLoading: false });
    return { msg: 'Кабинет удалён' };
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message;
    set({ error: errorMessage, isLoading: false });
    throw errorMessage;
  }
},

deleteSpec: async (id) => {
  set({ isLoading: true, error: null });
  try {
    await apiClient.delete(`/spec/${id}`);
    set(state => ({
      specs: state.specs.filter(spec => spec._id !== id),
    }));
    set({ isLoading: false });
    return { msg: 'Специальность удалена' };
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message;
    set({ error: errorMessage, isLoading: false });
    throw errorMessage;
  }
},

deleteUMK: async (id) => {
  set({ isLoading: true, error: null });
  try {
    await apiClient.delete(`/umk/${id}`);
    set(state => ({
      umks: state.umks.filter(umk => umk._id !== id),
      umk: state.umk.filter(umk => umk._id !== id),
    }));
    set({ isLoading: false });
    return { msg: 'УМК удалён' };
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message;
    set({ error: errorMessage, isLoading: false });
    throw errorMessage;
  }
},
}));

export default useCabinetStore;