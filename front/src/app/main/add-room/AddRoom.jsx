import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, TextField, Button,
  Box, Grid, MenuItem,Snackbar, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddRoom = () => {

  //recently /28/08

  // Snackbar state
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



  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    siteId: ''
  });

  const [errors, setErrors] = useState({
    name: false,
    siteId: false
  });

  const [sites, setSites] = useState([]);

  // ✅ Ajout de la variable API_URL
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/api/site`, {
          headers: {
            Authorization: `Bearer ${token.replace(/"/g, '')}`
          }
        });

        const data = await response.json();
        setSites(data);
      } catch (error) {
        console.error("❌ Failed to load sites:", error);
      }
    };

    fetchSites();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {
      name: !formData.name.trim(),
      siteId: !formData.siteId
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill in all required fields");
      return;
    }

    const token = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`${API_URL}/api/room/site/${formData.siteId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.replace(/"/g, '')}`
        },
        body: JSON.stringify({
          name: formData.name
        })
      });

      const responseBody = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error("API error:", responseBody);
        throw new Error(responseBody.message || "Error during submission");
      }

      //alert("Room added successfully ✅");

      showSnack('Room added successfully ', 'info');

      navigate('/room-list');
    } catch (error) {
      console.error("Submission error:", error);
      showSnack(`Error: ${error.message}`, 'info');
    }
  };



  return (
    <Container maxWidth="sm">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Add New Room</Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
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

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Room Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                error={errors.name}
                helperText={errors.name && "Room name is required"}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Select Site"
                name="siteId"
                value={formData.siteId}
                onChange={handleChange}
                required
                error={errors.siteId}
                helperText={errors.siteId && "Site is required"}
              >
                {sites.map((site) => (
                  <MenuItem key={site.id} value={site.id}>
                    {site.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Save Room
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddRoom;
