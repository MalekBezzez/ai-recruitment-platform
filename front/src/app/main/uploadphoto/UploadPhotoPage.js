import React, { useState } from 'react';
import axios from 'axios';
import { Button, Typography, Paper, CircularProgress, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function UploadPhotoPage({ photoId, onPhotoUpdated }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user')); 
  const navigate = useNavigate();
  const userId = user?.user?.id; 
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      setMessage('Please select a file.');
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setMessage('You are not authenticated. Please log in.');
      setSnackbarOpen(true);
      return;
    }

    const tokenWithoutQuotes = token.replace(/"/g, '');
    setLoading(true);

    try {
      let response;
      if (photoId) {
        response = await axios.put(
          `${API_URL}/photos/update/${photoId}/${userId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${tokenWithoutQuotes}`,
            },
          }
        );
      } else {
        response = await axios.post(
          `${API_URL}/photos/upload/${userId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${tokenWithoutQuotes}`,
            },
          }
        );
      }
      setMessage(response.data || 'Photo uploaded successfully!');
      setSnackbarOpen(true);
      onPhotoUpdated();
    } catch (error) {
      setMessage('Error uploading the photo.');
      setSnackbarOpen(true);
      navigate('/add-account');
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        {photoId ? 'Update Profile Photo' : 'Upload Profile Photo'}
      </Typography>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
        style={{ marginTop: '10px', float: 'right' }} // ✅ aligned to the right
      >
        {loading ? <CircularProgress size={24} /> : (photoId ? 'Update' : 'Upload')}
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={message}
      />
    </Paper>
  );
}

export default UploadPhotoPage;
