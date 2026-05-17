import React, { useState } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Box, Grid, Snackbar, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddDiplomaType = () => {

   // recently 28/08
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
    diplomaName: '',
    speciality: ''
  });

  const [errors, setErrors] = useState({
    diplomaName: false,
    speciality: false
  });

  // ✅ Utilisation du Gateway (modification collègue)
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
      diplomaName: !formData.diplomaName.trim(),
      speciality: !formData.speciality.trim()
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
      // ✅ Appel vers gateway
      const response = await fetch(`${API_URL}/api/diploma-type`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.replace(/"/g, '')}`
        },
        body: JSON.stringify(formData)
      });

      const responseBody = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error("API error response:", responseBody);
        throw new Error(responseBody.message || "Error during submission");
      }

      //alert(`Diploma type successfully added`);
      showSnack('Diploma type successfully added', 'info');
      
      navigate('/diploma-type');
    } catch (error) {
      console.error("Submission error:", error);
      //alert(`Error: ${error.message || "An error occurred during submission"}`);
      showSnack(`Error: ${error.message || "An error occurred during submission"}`, 'info');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Add New Diploma Type</Typography>
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
                label="Diploma Name"
                name="diplomaName"
                value={formData.diplomaName}
                onChange={handleChange}
                required
                error={errors.diplomaName}
                helperText={errors.diplomaName && "This field is required"}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Speciality"
                name="speciality"
                value={formData.speciality}
                onChange={handleChange}
                required
                error={errors.speciality}
                helperText={errors.speciality && "This field is required"}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Save Diploma Type
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddDiplomaType;
