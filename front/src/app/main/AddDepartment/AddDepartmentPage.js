import React, { useState } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Box, Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import  {  useEffect } from 'react';

import { Snackbar,Alert} from  '@mui/material';

const AddDepartmentPage = () => {
  const navigate = useNavigate();
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

  const [formData, setFormData] = useState({
    departmentName: '',
  });

  const [errors, setErrors] = useState({
    departmentName: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
const API_URL = process.env.REACT_APP_API_URL;

console.log('API_URL:', API_URL);
  const validateForm = () => {
    const newErrors = {
      departmentName: !formData.departmentName.trim(),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showSnack("Please fill in all required fields");
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      showSnack("Session expired. Please log in again.");
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.replace(/"/g, '')}`,
        },
        body: JSON.stringify(formData)
      });

      const responseBody = await response.json().catch(() => ({}));

      if (!response.ok) {
        snackBar("🛑 API error response");
        throw new Error(responseBody.message || "Error during submission");
      }

      showSnack(" Department successfully added!");
      navigate('/departmentList'); // Assure-toi que cette route existe dans ton router
    } catch (error) {
      console.error(" Submission error:", error);
      showSnack(`Error: ${error.message || "An error occurred during submission"}`);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Add New Department
        </Typography>
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
                label="Department Name"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleChange}
                required
                error={errors.departmentName}
                helperText={errors.departmentName && "This field is required"}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Save Department
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddDepartmentPage;
