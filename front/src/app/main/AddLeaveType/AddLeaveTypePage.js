import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,Snackbar ,
  Box,Alert,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddLeaveTypePage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
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
    type: '',
    solde: ''
  });
  const [errors, setErrors] = useState({ type: false, solde: false });

  const validateForm = () => {
    const newErrors = {
      type: !formData.type.trim(),
      solde: !formData.solde || isNaN(formData.solde) || parseInt(formData.solde, 10) < 0
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const API_URL = process.env.REACT_APP_API_URL;

  console.log('API_URL:', API_URL);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showSnack('Please correct the errors in the form');
      return;
    }
    const requestBody = {
      type: formData.type.trim(),
      solde: parseInt(formData.solde, 10)
      //, employeeId: user?.id  // uncomment if you want to link to the employee
    };

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/leave-types/with-sold`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token.replace(/"/g, '')}` })
        },
        body: JSON.stringify(requestBody)
      });

      if (response.status === 401) {
        showSnack('Unauthorized. Please log in again.');
        // navigate('/login');
        return;
      }

      if (!response.ok) {
        let message = 'Creation error';
        try {
          const errorData = await response.json();
          message = errorData.message || message;
        } catch {
          // ignore JSON parse errors
        }
        throw new Error(message);
      }

      showSnack('Leave type created successfully!');
      navigate('/leavetypeslist');
    } catch (error) {
      console.error('Error:', error);
      showSnack(`Error: ${error.message}`);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4">New Leave Type</Typography>
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
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Leave type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                error={errors.type}
                helperText={errors.type && 'This field is required'}
                inputProps={{ maxLength: 50 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Initial balance (days)"
                name="solde"
                type="number"
                value={formData.solde}
                onChange={handleChange}
                required
                error={errors.solde}
                helperText={errors.solde && 'Enter a valid number (≥ 0)'}
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" color="primary" variant="contained">
                  Save
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddLeaveTypePage;
