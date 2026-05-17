// 📁 src/pages/AddTask.jsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  Paper, Typography, Grid, TextField, MenuItem, Button, Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { Snackbar,Alert } from '@mui/material' ;
// Schéma de validation des tâches
const schema = yup.object().shape({
  name: yup
    .string()
    .required('Task name is required')
    .min(3, 'Task name must be at least 3 characters')
    .max(100, 'Task name cannot exceed 100 characters'),
  estimatedTime: yup
    .number()
    .typeError('Estimated time must be a number')
    .required('Estimated time is required')
    .positive('Estimated time must be positive')
    .max(1000, 'Estimated time cannot exceed 1000 hours'),
  priority: yup
    .string()
    .required('Priority is required')
    .oneOf(['LOW', 'MEDIUM', 'HIGH'], 'Invalid priority value'),
  description: yup
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  assigneeId: yup
    .number()
    .typeError('Assignee must be a valid user')
    .optional()
    .nullable(),
  dueDate: yup
    .date()
    .typeError('Due date must be a valid date')
    .nullable()
    .min(new Date(), 'Due date cannot be in the past'), // ✅ règle ajoutée
});


function AddTask() {
  const navigate = useNavigate();
  const { phaseId } = useParams();
  const [users, setUsers] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  console.log('API_URL:', API_URL);
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
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      estimatedTime: '',
      priority: '',
      description: '',
      assigneeId: null,
      dueDate: null,
    },
    mode: 'onTouched',
  });

  // Chargement des utilisateurs pour le champ Assignee
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
        if (!token) return;
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(
          `${API_URL}/employee/all-employees`,
          { headers }
        );
        setUsers(response.data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [API_URL]);

  const onSubmit = useCallback(
    async (data) => {
      try {
        const userItem = JSON.parse(localStorage.getItem('user') || '{}');
        const reporterId = userItem.user?.id;
        if (!reporterId) throw new Error('User not logged in');

        const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
        if (!token) throw new Error('No access token');
        const headers = { Authorization: `Bearer ${token}` };

        // 1) Récupérer les tâches existantes de la phase
        const tasksRes = await axios.get(
          `${API_URL}/tasks/phase/${phaseId}`,
          { headers }
        );
        const existingTasks = tasksRes.data || [];
        const usedHours = existingTasks.reduce((sum, t) => sum + (t.estimatedTime || 0), 0);

        // 2) Récupérer la phase pour son totalHours
        const phaseRes = await axios.get(
          `${API_URL}/phases/${phaseId}`,
          { headers }
        );
        const maxPhaseHours = phaseRes.data?.totalHours || 0;

        // 3) Vérifier la somme
        if (usedHours + Number(data.estimatedTime) > maxPhaseHours) {
          showSnack('Estimated time exceeds available hours in this phase');
          return;
        }

        // 4) Construction du payload
        const payload = {
          name: data.name,
          estimatedTime: Number(data.estimatedTime),
          actualTime: Number(data.estimatedTime),
          priority: data.priority,
          phaseId: Number(phaseId),
          status: 'TO_DO',
          description: data.description || null,
          assigneeId: data.assigneeId || null,
          dueDate: data.dueDate
            ? dayjs(data.dueDate).format('YYYY-MM-DD')
            : null,
          reporterId,
        };

        // 5) Création de la tâche
        await axios.post(
          `${API_URL}/tasks`,
          payload,
          { headers }
        );

        showSnack('Task created successfully');
        reset();
        // navigation vers la liste des tâches de la phase
        navigate(`/phasetasks/${phaseId}`);
      } catch (error) {
        console.error('Error creating task:', error);
        const message = error.response?.data?.message
          || error.message
          || 'Failed to create task';
        showSnack(message);
      }
    },
    [navigate, phaseId, reset, API_URL]
  );

  return (
    <Paper sx={{ p: 4, maxWidth: 600, m: 'auto', mt: 4 }}>
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
        Create a New Task
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            {/* Name */}
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Task Name"
                    fullWidth
                    required
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            {/* Description */}
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    multiline rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>
            {/* Estimated Time */}
            <Grid item xs={12}>
              <Controller
                name="estimatedTime"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Estimated Time (h)"
                    type="number"
                    fullWidth
                    required
                    inputProps={{ step: 0.1, min: 0.1 }}
                    error={!!errors.estimatedTime}
                    helperText={errors.estimatedTime?.message}
                  />
                )}
              />
            </Grid>
            {/* Priority */}
            <Grid item xs={12}>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Priority"
                    select fullWidth required
                    error={!!errors.priority}
                    helperText={errors.priority?.message}
                  >
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            {/* Assignee */}
            <Grid item xs={12}>
              <Controller
                name="assigneeId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Assignee"
                    select fullWidth
                    error={!!errors.assigneeId}
                    helperText={errors.assigneeId?.message}
                  >
                    <MenuItem value={null}>None</MenuItem>
                    {users.map(u => (
                      <MenuItem key={u.id} value={u.id}>
                        {u.firstname} {u.lastname}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            {/* Due Date */}
            <Grid item xs={12}>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Due Date"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={date => field.onChange(date ? date.toDate() : null)}
                    renderInput={params => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.dueDate}
                        helperText={errors.dueDate?.message}
                      />
                    )}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Add Task'}
            </Button>
          </Grid>
        </Box>
      </LocalizationProvider>
    </Paper>
  );
}

export default AddTask;
