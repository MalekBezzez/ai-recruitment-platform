import React, { useEffect, useState } from 'react';
import NotificationCard from 'src/app/theme-layouts/shared-components/notificationPanel/NotificationCard';
import axios from 'axios';
import { Box, Typography } from '@mui/material';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);

  // Récupérer l'utilisateur connecté
  const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.user?.id;
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  // Charger les notifications à l'ouverture
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`${API_URL}/notifications/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setNotifications(res.data);
      })
      .catch((err) => {
        console.error('Error fetching notifications:', err);
      });
  }, [userId]);

  // Marquer comme lu
  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${API_URL}/notifications/read/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Mettre à jour l'état local
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          .then((res) => {
            console.log('📦 Notifications reçues:', res.data); // <== DEBUG
            setNotifications(res.data);
          })

      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return (
    <Box className="space-y-16 p-24">
      {notifications.length === 0 ? (
        <Typography color="text.secondary">No notifications found.</Typography>
      ) : (
        notifications.map((notif) => (
          <NotificationCard
            key={notif.id}
            item={{
              id: notif.id,
              title: notif.message,
              time: notif.createdAt,
              read: notif.read,
              variant: notif.read ? 'info' : 'warning',
              icon: 'heroicons-outline:bell',
            }}
            onClose={(id) => {
              setNotifications((prev) => prev.filter((n) => n.id !== id));
            }}
            onMarkAsRead={() => markAsRead(notif.id)}
          />
        ))
      )}
    </Box>
  );
};

export default NotificationList;
