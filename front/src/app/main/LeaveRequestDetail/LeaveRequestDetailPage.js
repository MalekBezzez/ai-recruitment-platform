import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, CircularProgress,
  Divider, Grid, Button,Snackbar , Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LeaveRequestDetailPage() {
  const { id } = useParams();             // c’est votre leaveRequestId
  const navigate = useNavigate();
  const [requestDetails, setRequestDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  const token = localStorage
    .getItem('accessToken')
    ?.replace(/"/g, '') || '';
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

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/leave-requests/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRequestDetails(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load the leave request.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Récupère l’utilisateur en localStorage et son ID
      const raw = localStorage.getItem('user');
      if (!raw) throw new Error("User not found");
      const { user } = JSON.parse(raw);
      // on veut l'id de l'employé qui a fait la demande, pas de celui qui valide
const employeeId = requestDetails.employee.id;

      if (!employeeId) throw new Error("Employee ID missing");

      // Appel POST vers votre endpoint Spring
      await axios.post(
        `${API_URL}/conge/demandes`,
        null,
        {
          params: {
            leaveRequestId: id,
            employeId: employeeId
          },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      showSnack("Request sent successfully!");
      navigate('/leaveRequestEmployeeList');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || err.message;
      showSnack("Error sending request: " + msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error)   return <Typography color="error">{error}</Typography>;
  if (!requestDetails) return <Typography>No data found.</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>Leave Request Details</Typography>
      <Paper elevation={3} sx={{ p:4, borderRadius:2 }}>
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
        
        {/* Status & Type */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography>
              <strong>Status:</strong> {requestDetails.status ?? 'Not submitted'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography>
              <strong>Type:</strong> {requestDetails.leaveTypeName}
            </Typography>
          </Grid>
        </Grid>

        {/* Dates */}
        <Box mt={4}>
          <Typography variant="h6">Dates</Typography>
          <Divider sx={{ mb:2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography>
                <strong>Start:</strong> {requestDetails.startDate}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>
                <strong>End:</strong> {requestDetails.endDate}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Description */}
        <Box mt={4}>
          <Typography variant="h6">Description</Typography>
          <Divider sx={{ mb:2 }} />
          <Typography sx={{ whiteSpace:'pre-line' }}>
            {requestDetails.description || 'No description provided.'}
          </Typography>
        </Box>

        {/* Bouton Envoyer */}
        {requestDetails.status === 'PENDING' && (
          <Box mt={4} textAlign="right">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting…' : 'Submit Request'}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
