import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  CircularProgress,
  Alert,
  MenuItem
} from '@mui/material';

const EditYearEvaluation = () => {
  const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  const { emplyeeid , id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    year: '',
    note: ''
  });

  // Generate possible years (10 years around current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear - 15 + i);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const tokenWithoutQuotes = token?.replace(/"/g, '') || '';
        const config = {
          headers: {
            Authorization: `Bearer ${tokenWithoutQuotes}`,
          },
        };
        const response = await axios.get(
          `${API_URL}/year-evaluations/${id}`,
          config
        );
        
        // Extract year from the date (assuming date is in format 'YYYY-MM-DD')
        const evaluationYear = response.data.date.split('-')[0];
        setFormData({
          year: evaluationYear,
          note: response.data.note
        });
      } catch (error) {
        console.error('Error fetching evaluation:', error);
        setError('Failed to load evaluation data');
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      const tokenWithoutQuotes = token?.replace(/"/g, '') || '';
      
      const payload = {
        date: `${formData.year}-01-01`, // Format as full date (January 1st of selected year)
        note: formData.note
      };
  
      const config = {
        headers: {
          'Authorization': `Bearer ${tokenWithoutQuotes}`,
          'Content-Type': 'application/json'
        },
      };
      
      await axios.put(
        `${API_URL}/year-evaluations/${id}`,
        payload,
        config
      );
      
      setSuccess(true);
      setTimeout(() => navigate(`/employee-profile/${emplyeeid}`), 1500);
    } catch (error) {
      console.error('Error updating evaluation:', error);
      setError(error.response?.data?.message || 'Failed to update evaluation');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.year) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Edit Year Evaluation
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Evaluation updated successfully!
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            >
              {years.map((yearOption) => (
                <MenuItem key={yearOption} value={yearOption}>
                  {yearOption}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Evaluation Note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              multiline
              rows={4}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/employee-details/${id}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Update Evaluation'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default EditYearEvaluation;