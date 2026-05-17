import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Grid, TextField,Snackbar,Alert, Button, CircularProgress
} from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const EditClientPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // récupérer éventuellement le client depuis location.state
  const clientFromState = location.state?.client || null;
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

  // initialiser formData (null = pas encore chargé)
  const [formData, setFormData] = useState(clientFromState);
  const [loading, setLoading] = useState(!clientFromState);  // si pas de state → on démarre en loading
  const [error, setError] = useState('');
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  // fallback fetch si pas de client
  useEffect(() => {
    if (!clientFromState) {
      setLoading(true);
      const fetchClient = async () => {
        try {
          const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const response = await axios.get(`${API_URL}/clients/${id}`, config);
          setFormData(response.data);
        } catch (err) {
          console.error(err);
          setError(' Impossible de charger le client');
        } finally {
          setLoading(false);
        }
      };
      fetchClient();
    }
  }, [clientFromState, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${API_URL}/clients/${id}`, formData, config);
      showSnack(' Client updated successfully!');
      navigate(`/clients/${id}`);
    } catch (err) {
      console.error('Error updating client:', err);
      setError(' Error updating client');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Typography align="center" sx={{ mt: 4 }}>
        <CircularProgress />
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography align="center" color="error" sx={{ mt: 4 }}>
        {error}
      </Typography>
    );
  }

  if (!formData) {
    return (
      <Typography align="center" sx={{ mt: 4 }}>
        Client not found
      </Typography>
    );
  }

  return (
    <Paper sx={{ padding: 4, maxWidth: 800, margin: 'auto', mt: 4 }}>
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
      <Typography variant="h5" gutterBottom>Edit Client</Typography>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              type="email"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
        </Grid>

        <Grid container justifyContent="flex-end" sx={{ mt: 4 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !formData.name || !formData.email || !formData.phone || !formData.address}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </Grid>
      </form>
    </Paper>
  );
};

export default EditClientPage;
