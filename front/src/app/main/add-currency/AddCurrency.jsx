import React, { useState } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Box, Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddCurrency = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currencyName: '',
  });

  const [errors, setErrors] = useState({
    currencyName: false,
  });

  // ✅ Utilisation du Gateway (modif collègue)
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
      currencyName: !formData.currencyName.trim(),
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
    if (!token) {
      alert("Session expired. Please log in again.");
      navigate('/login');
      return;
    }

    try {
      // ✅ Appel vers gateway au lieu du backend direct
      const response = await fetch(`${API_URL}/api/currencies`, {
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

      alert("Currency successfully added");
      navigate('/currency-list'); 
    } catch (error) {
      console.error("Submission error:", error);
      alert(`Error: ${error.message || "An error occurred during submission"}`);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Add New Currency</Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Currency Name"
                name="currencyName"
                value={formData.currencyName}
                onChange={handleChange}
                required
                error={errors.currencyName}
                helperText={errors.currencyName && "This field is required"}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Save Currency
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddCurrency;
