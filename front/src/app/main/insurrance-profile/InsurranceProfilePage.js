import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Divider,
} from '@mui/material';

const InsurranceProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const insurance = location.state?.insurance;

  if (!insurance) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 4,
          m: 4,
          borderRadius: 3,
          backgroundColor: '#fdfdfd',
        }}
      >
        <Typography variant="h6" color="error">
          No insurance data found.
        </Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }} variant="contained">
          Go Back
        </Button>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        m: 4,
        borderRadius: 4,
        backgroundColor: '#fafafa',
        boxShadow: '0px 3px 12px rgba(0,0,0,0.1)',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Insurance Details
        </Typography>
        <Button variant="contained" onClick={() => navigate(-1)}>
          Back to List
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1"><strong>Name:</strong> {insurance.name}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1"><strong>Provider:</strong> {insurance.insuranceProvider}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1"><strong>Start Date:</strong> {insurance.startDate}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1"><strong>End Date:</strong> {insurance.endDate}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1"><strong>Description:</strong> {insurance.description}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1"><strong>Contact Info:</strong> {insurance.contactInfo}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default InsurranceProfile;
