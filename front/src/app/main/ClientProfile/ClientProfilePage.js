import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Grid, CircularProgress, Button, Avatar,
  Box, Dialog, DialogContent, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ClientProfilePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [client, setClient] = useState(location.state?.client || null); // Initialize with location.state.client
  const [loading, setLoading] = useState(true);
  const [photoUrl, setPhotoUrl] = useState('');
  const [error, setError] = useState('');
  const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  useEffect(() => {
    const fetchClient = async () => {
      if (client) {
        // If client data is already available from location.state, skip fetching
        try {
          // Fetch photo if available
          const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
          const config = { headers: { Authorization: `Bearer ${token}` } };
          try {
            const photoRes = await axios.get(`${API_URL}/photos/client/${id}`, {
              ...config,
              responseType: 'blob',
            });
            setPhotoUrl(URL.createObjectURL(photoRes.data));
          } catch {
            console.log('Pas de photo pour ce client');
          }
        } finally {
          setLoading(false);
        }
        return;
      }

      // Fetch client data if not available in location.state
      try {
        const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch client details
        const clientRes = await axios.get(`${API_URL}/clients/${id}`, config);
        setClient(clientRes.data);

        // Fetch photo if available
        try {
          const photoRes = await axios.get(`${API_URL}/photos/client/${id}`, {
            ...config,
            responseType: 'blob',
          });
          setPhotoUrl(URL.createObjectURL(photoRes.data));
        } catch {
          console.log('Pas de photo pour ce client');
        }
      } catch (err) {
        console.error(err);
        setError('❌ Impossible de charger le profil du client.');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id, client]); // Depend on id and client to avoid infinite loop

  const handleEditClick = () => {
    navigate(`/clients/edit/${client.clientId}`, { state: { client } });
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!client) return <Typography>Client non trouvé</Typography>;

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
      <Grid container spacing={4}>
        {/* Photo + Résumé client */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 20, textAlign: 'center' }}>
            <IconButton onClick={() => setOpenPhotoDialog(true)}>
              <Avatar
                src={photoUrl}
                alt={client.name}
                sx={{
                  width: 200, height: 200, fontSize: '4rem',
                  border: '3px solid', borderColor: 'primary.main', mb: 2
                }}
              >
                {client.name?.[0]}
              </Avatar>
            </IconButton>
            <Typography variant="h4">{client.name}</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Client ID: {client.clientId}
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleEditClick}
            >
              Edit Client Info
            </Button>
          </Box>
        </Grid>

        {/* Détails du client */}
        <Grid item xs={12} md={8} sx={{ mt: { xs: 2, md: 6 } }}>
          <Typography variant="h5" gutterBottom>Client Details</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography><strong>Email:</strong> {client.email}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography><strong>Phone:</strong> {client.phone}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography><strong>Address:</strong> {client.address}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Dialog Photo plein écran */}
      <Dialog open={openPhotoDialog} onClose={() => setOpenPhotoDialog(false)} maxWidth="md">
        <IconButton
          onClick={() => setOpenPhotoDialog(false)}
          sx={{
            position: 'absolute', right: 8, top: 8,
            color: 'common.white', bgcolor: 'rgba(0,0,0,0.5)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ p: 0 }}>
          {photoUrl
            ? <img src={photoUrl} alt="Client" style={{ width: '100%', height: 'auto' }} />
            : <Box sx={{ p: 4, textAlign: 'center' }}><Typography>No photo</Typography></Box>
          }
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default ClientProfilePage;