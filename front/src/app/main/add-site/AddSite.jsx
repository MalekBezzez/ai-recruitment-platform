import React, { useState } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Box, Grid, Snackbar,Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddSite = () => {

 // Recently 28/08
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
  });

  const [errors, setErrors] = useState({
    name: false,
  });

  // ✅ Ajout de la variable API_URL
  const API_URL = process.env.REACT_APP_API_URL;

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
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      //alert("Please fill in all required fields");
      showSnack('Please fill in all required fields', 'info');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      //alert("Session expired. Please log in again.");
      showSnack('Session expired. Please log in again.', 'info');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/site`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.replace(/"/g, '')}`,
        },
        body: JSON.stringify(formData)
      });

      const responseBody = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error("API error response:", responseBody);
        throw new Error(responseBody.message || "Error during submission");
      }

      //alert("Site successfully added");
      showSnack('Site successfully added', 'info');
      navigate('/site-list'); // Assurez-vous que cette route existe
    } catch (error) {
      console.error("Submission error:", error);
      //alert(`Error: ${error.message || "An error occurred during submission"}`);
      showSnack(`Error: ${error.message || "An error occurred during submission"}`, 'info');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Add New Site</Typography>
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
                label="Site Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                error={errors.name}
                helperText={errors.name && "This field is required"}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Save Site
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddSite;
