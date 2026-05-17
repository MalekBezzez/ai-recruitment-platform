// 📁 src/pages/AddPhase.jsx
import React ,{useState} from 'react';
import {
  Paper, Typography, Grid, TextField, Button ,Snackbar,Alert 
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

// Schéma de validation avec contrôle start/end
const schema = yup.object().shape({
  name: yup.string().required('Phase name is required'),
  description: yup.string().required('Description is required'),
  startedDate: yup
    .date()
    .required('Start date is required'),
  endDate: yup
    .date()
    .required('End date is required')
    .min(yup.ref('startedDate'), 'End date must be same or after start date'),
  totalHours: yup
    .number()
    .typeError('Total hours must be a number')
    .required('Total hours is required')
    .positive('Total hours must be positive'),
});

const API_URL = process.env.REACT_APP_API_URL;
console.log('API_URL:', API_URL);

function AddPhase() {
  const navigate = useNavigate();
  const { projectId } = useParams();
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
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',         // validation on blur
    defaultValues: {
      name: '',
      description: '',
      startedDate: '',
      endDate: '',
      totalHours: '',
    },
  });

  // Pour contraindre la date de fin >= date de début
  const startValue = watch('startedDate');

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('accessToken');
      const config = {
        headers: { Authorization: `Bearer ${token?.replace(/\"/g, '')}` }
      };

      // Récupérer les phases existantes
      const phasesRes = await axios.get(`${API_URL}/phases/project/${projectId}`, config);
      const existingPhases = phasesRes.data;
      const usedHours = existingPhases.reduce((sum, phase) => sum + phase.totalHours, 0);

      // Récupérer projet parent
      const projectRes = await axios.get(`${API_URL}/projects/${projectId}`, config);
      const maxProjectHours = projectRes.data.totalHours;

      // Vérifier la somme des heures
      if (usedHours + Number(data.totalHours) > maxProjectHours) {
        showSnack(` Total hours exceeded: you have used ${usedHours}/${maxProjectHours} hours`);
        return;
      }

      // Création de la phase
      const payload = { ...data, projectId: Number(projectId) };
      await axios.post(`${API_URL}/phases`, payload, config);
      showSnack(' Phase created successfully');
      navigate(`/projectprofile/${projectId}`);
    } catch (error) {
      console.error(error);
      showSnack(' Error creating phase');
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
        Create a New Phase
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
                  multiline rows={3}
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
                  inputProps={{ min: startValue || undefined }}  // min dynamic
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isValid}
          >
            Submit
          </Button>
        </Grid>
      </form>
    </Paper>
  );
}

export default AddPhase;
