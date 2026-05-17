import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
const API_URL1 = `${API_URL}/notifications`;

const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
const headers = {
  Authorization: `Bearer ${token}`,
};

//  Récupérer toutes les notifications d’un utilisateur
export const getUserNotifications = (userId) =>
  axios.get(`${API_URL1}/${userId}`, { headers });

//  Marquer une notification comme lue
export const markNotificationAsRead = (notificationId) =>
  axios.put(`${API_URL1}/read/${notificationId}`, {}, { headers });

//  Envoyer une notification manuellement (si besoin)
export const createNotification = (userId, message) =>
  axios.post(`${API_URL1}/${userId}`, message, { headers });
