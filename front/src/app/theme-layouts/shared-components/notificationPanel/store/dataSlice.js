import { createAsyncThunk, createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

const notificationsAdapter = createEntityAdapter({});
const initialState = notificationsAdapter.getInitialState({
  unreadCount: 0, // ➜ compteur initialisé à 0
});
const API_URL = process.env.REACT_APP_API_URL;
// ✅ GET toutes les notifications de l’utilisateur
export const getNotifications = createAsyncThunk(
  'notificationPanel/getData',
  async () => {
    const API_URL = process.env.REACT_APP_API_URL;

console.log('API_URL:', API_URL);
    const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.user?.id;

    const response = await axios.get(`${API_URL}/notifications/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  }
);

// ✅ Marquer une notification comme lue
export const dismissItem = createAsyncThunk(
  'notificationPanel/dismissItem',
  async (id) => {
    const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
    await axios.put(`${API_URL}/notifications/read/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  }
);

// ✅ Marquer toutes comme lues (si tu veux le gérer)
export const dismissAll = createAsyncThunk(
  'notificationPanel/dismissAll',
  async () => {
    return true; // ou un vrai endpoint si tu veux
  }
);

// ✅ Ajouter une notification depuis le backend
export const addNotification = createAsyncThunk(
  'notificationPanel/addNotification',
  async (item) => {
    const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.user?.id;

    const response = await axios.post(`${API_URL}/notifications/${userId}`, item.message, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  }
);

// ✅ ➜ NOUVEAU : le thunk pour GET le nombre de notifications non lues
export const getUnreadCount = createAsyncThunk(
  'notificationPanel/getUnreadCount',
  async () => {
    const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
     const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.user?.id;
    const response = await axios.get(`${API_URL}/notifications/${userId}/unread/count`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  }
);

const dataSlice = createSlice({
  name: 'notificationPanel/data',
  initialState,
  reducers: {
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Ajoute PENDING pour le debug
      .addCase(getNotifications.pending, (state) => {
        console.log('⏳ getNotifications.pending');
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        console.log('✅ getNotifications.fulfilled', action.payload);
        notificationsAdapter.setAll(state, action.payload);
      })
      .addCase(getNotifications.rejected, (state, action) => {
        console.error('❌ getNotifications.rejected', action.error);
      })
      .addCase(dismissItem.fulfilled, (state, action) => {
        notificationsAdapter.removeOne(state, action.payload);
      })
      .addCase(dismissAll.fulfilled, (state) => {
        notificationsAdapter.removeAll(state);
      })
      .addCase(addNotification.fulfilled, (state, action) => {
        notificationsAdapter.addOne(state, action.payload);
      })
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      });
  },
});

// ✅ Sélecteurs pour le composant ➜ lecture
export const {
  selectAll: selectNotifications,
  selectById: selectNotificationById,
} = notificationsAdapter.getSelectors((state) => state.notificationPanel.data);

export const selectUnreadCount = (state) => state.notificationPanel.data.unreadCount;

// ✅ Actions reducers ➜ set manuellement
export const { setUnreadCount } = dataSlice.actions;

export default dataSlice.reducer;