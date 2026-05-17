import React, { useState } from 'react';
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


const AddYearEvaluation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [year, setYear] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
const { employeeId } = useParams()
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear - 15 + i);
const API_URL = process.env.REACT_APP_API_URL;

console.log('API_URL:', API_URL);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        `${API_URL}/year-evaluations/add-to-employee/${id}`,
        { date: `${year}-01-01`, note },
        {
          headers: {
            Authorization: `Bearer ${token?.replace(/"/g, '')}`,
          },
        }
      );

      setSuccess('Evaluation added successfully!');
      setYear('');
      setNote('');
      setTimeout(() => navigate(`/employee-details/${id}`), 1500);
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Error while adding evaluation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Add Annual Evaluation
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
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
              label="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              multiline
              rows={4}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/YearEvaluation/${employeeId}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Add'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default AddYearEvaluation;
