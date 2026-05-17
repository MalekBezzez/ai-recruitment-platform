import React, { useEffect } from 'react';
import {
  Paper, Typography, Grid, TextField, Button ,Snackbar,Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const schema = yup.object().shape({
  name: yup.string().required('Phase name is required'),
  description: yup.string().required('Description is required'),
  startedDate: yup.date().required('Start date is required'),
  endDate: yup.date().required('End date is required'),
  totalHours: yup.number().required('Total hours is required').positive(),
});
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
function EditPhase() {
  const navigate = useNavigate();
  const { projectId, phaseId } = useParams();
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
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      startedDate: '',
      endDate: '',
      totalHours: '',
    },
  });

  useEffect(() => {
    const fetchPhase = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const config = {
          headers: {
            Authorization: `Bearer ${token?.replace(/"/g, '')}`,
          },
        };
        const response = await axios.get(`${API_URL}/phases/${phaseId}`, config);
        const phase = response.data;
        reset({
          name: phase.name,
          description: phase.description,
          startedDate: phase.startedDate.split('T')[0], // Format date for input
          endDate: phase.endDate.split('T')[0], // Format date for input
          totalHours: phase.totalHours,
        });
      } catch (error) {
        console.error('Error fetching phase:', error);
        showSnack(' Error loading phase data');
      }
    };
    fetchPhase();
  }, [phaseId, reset]);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('accessToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token?.replace(/"/g, '')}`,
        },
      };

      // 1. Fetch all phases for the project except the current phase
      const phasesRes = await axios.get(`${API_URL}/phases/project/${projectId}`, config);
      const existingPhases = phasesRes.data.filter(phase => phase.id !== Number(phaseId));

      // 2. Calculate used hours excluding the current phase
      const usedHours = existingPhases.reduce((sum, phase) => sum + phase.totalHours, 0);

      // 3. Fetch the parent project
      const projectRes = await axios.get(`${API_URL}/projects/${projectId}`, config);
      const maxProjectHours = projectRes.data.totalHours;

      // 4. Check total hours
      if (usedHours + Number(data.totalHours) > maxProjectHours) {
        showSnack(`Total hours exceeded: you have already used ${usedHours}/${maxProjectHours} hours`);
        return;
      }

      // 5. Update the phase
      const payload = {
        ...data,
        projectId: Number(projectId),
      };

      await axios.put(`${API_URL}/phases/${phaseId}`, payload, config);
      showSnack(' Phase updated successfully');
      navigate(`/projectprofile/${projectId}`);
    } catch (error) {
      console.error('Error updating phase:', error);
      showSnack(' Error updating phase');
    }
  };

  return (
    <Paper sx={{ padding: 4, maxWidth: 600, margin: 'auto' }}>
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
      <Typography variant="h5" gutterBottom>
        Edit Phase
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phase Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="startedDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Start Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.startedDate}
                  helperText={errors.startedDate?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="End Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.endDate}
                  helperText={errors.endDate?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="totalHours"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Total Hours"
                  type="number"
                  fullWidth
                  error={!!errors.totalHours}
                  helperText={errors.totalHours?.message}
                />
              )}
            />
          </Grid>
        </Grid>

        <Grid container justifyContent="flex-end" sx={{ mt: 4 }}>
          <Button type="submit" variant="contained" color="primary">
            Update
          </Button>
        </Grid>
      </form>
    </Paper>
  );
}

export default EditPhase;