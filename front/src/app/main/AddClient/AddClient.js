import React from 'react';
import {
  Paper, Typography, Grid, TextField, Button
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Snackbar,Alert} from  '@mui/material';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  address: yup.string().required('Address is required')
});
const API_URL = process.env.REACT_APP_API_URL;

console.log('API_URL:', API_URL);
function AddClient() {
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: ''
    }
  });
const [snack, setSnack] = useState({
    open: false,
    message: '',
    severity: 'info', // 'success' | 'info' | 'warning' | 'error'
  });
  
  const showSnack = (message, severity = 'info') =>
    setSnack({ open: true, message, severity });
  
  const handleSnackClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnack(s => ({ ...s, open: false }));
  };

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post(`${API_URL}/clients`, data, { headers });
      showSnack(' Client created successfully');
      navigate('/clients'); // Rediriger vers la liste ou autre page
    } catch (error) {
      console.error(error);
      showSnack( ' Error creating client');
    }
  };

  return (
    <Paper sx={{ padding: 4, maxWidth: 600, margin: 'auto' }}>
      <Snackbar
                open={snack.open}
                autoHideDuration={4000}
                onClose={handleSnackClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{
                  zIndex: 9999,           // reste au-dessus du footer et du contenu
                  mt: { xs: 7, sm: 10 }   // décale vers le bas (margin-top en Material-UI)
                }}
              >
                <Alert
                  onClose={handleSnackClose}
                  severity={snack.severity}
                  variant="filled"
                  sx={{ width: '100%' }}
                >
                  {snack.message}
                </Alert>
              </Snackbar>
      <Typography variant="h5" gutterBottom>
        Add New Client
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
            label={      <span>
                Name <span style={{ color: 'red' }}>*</span>
              </span> }
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                label={      <span>
                Email <span style={{ color: 'red' }}>*</span>
              </span> }
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
         
                   label={      <span>
                Phone <span style={{ color: 'red' }}>*</span>
              </span> }
                  fullWidth
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                
                  fullWidth
                   label={      <span>
                Address <span style={{ color: 'red' }}>*</span>
              </span> }
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />
          </Grid>
        </Grid>

        <Grid container justifyContent="flex-end" sx={{ mt: 4 }}>
          <Button type="submit" variant="contained" color="primary">
            Save Client
          </Button>
        </Grid>
      </form>
    </Paper>
  );
}

export default AddClient;
