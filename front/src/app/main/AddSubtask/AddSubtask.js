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

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Subtask name is required')
    .min(3, 'Subtask name must be at least 3 characters')
    .max(100, 'Subtask name cannot exceed 100 characters'),
  estimatedTime: yup
    .number()
    .typeError('Estimated time must be a number')
    .required('Estimated time is required')
    .positive('Estimated time must be positive')
    .max(1000, 'Estimated time cannot exceed 1000 hours'),
  priority: yup
    .string()
    .required('Priority is required')
    .oneOf(['LOW', 'MEDIUM', 'HIGH', 'BLOCKER'], 'Invalid priority value'),
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
    .optional()
    .nullable(),
});

function AddSubtask() {
  const navigate = useNavigate();
  const { parentTaskId, phaseId } = useParams();
  const [users, setUsers] = useState([]);
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
  });

  // Fetch users for assignee dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
        if (!token) return;
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${API_URL}/employee/all-employees`, { headers });
        setUsers(response.data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  const onSubmit = useCallback(
    async (data) => {
      try {
        const userData = localStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : null;
        if (!user?.user?.id) {
          throw new Error('No valid user found in localStorage');
        }
        const reporterId = user.user.id;

        const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
        if (!token) {
          throw new Error('No access token found');
        }
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch tasks for the phase to check available hours
        const tasksRes = await axios.get(`${API_URL}/tasks/phase/${phaseId}`, { headers });
        const existingTasks = tasksRes.data || [];

        // Calculate used hours
        const usedHours = existingTasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);

        // Fetch phase details
        const phaseRes = await axios.get(`${API_URL}/phases/${phaseId}`, { headers });
        const totalHours = phaseRes.data?.totalHours || 0;

        // Validate available hours
        if (usedHours + Number(data.estimatedTime) > totalHours) {
          showSnack(' Estimated time exceeds available hours in the phase');
          return;
        }

        // Prepare payload for subtask
        const payload = {
          name: data.name,
          estimatedTime: Number(data.estimatedTime),
          actualTime: Number(data.estimatedTime),
          priority: data.priority,
          phaseId: Number(phaseId),
          parentTaskId: Number(parentTaskId),
          status: 'TO_DO',
          description: data.description || null,
          assigneeId: data.assigneeId || null,
          dueDate: data.dueDate ? dayjs(data.dueDate).format('YYYY-MM-DD') : null,
          reporterId: reporterId,
        };

        // Create subtask
        await axios.post(`${API_URL}/tasks`, payload, { headers });
        showSnack('Subtask created successfully');
        reset(); // Reset form after successful submission
        navigate(`/phases/${phaseId}/tasks`);
      } catch (error) {
        console.error('Error creating subtask:', error);
        const message = error.response?.data?.message || 'Failed to create subtask. Please try again.';
        showSnack(` ${message}`);
      }
    },
    [navigate, phaseId, parentTaskId, reset]
  );

  return (
    <Paper sx={{ padding: 4, maxWidth: 600, margin: 'auto', mt: 4 }}>
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
      <Typography variant="h5" gutterBottom component="h1">
        Create a Subtask for Task #{parentTaskId}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Subtask Name"
                    fullWidth
                    required
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    inputProps={{ 'aria-label': 'Subtask Name' }}
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
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    inputProps={{ 'aria-label': 'Subtask Description' }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="estimatedTime"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Estimated Time (hours)"
                    type="number"
                    fullWidth
                    required
                    inputProps={{ step: '0.1', min: '0.1', 'aria-label': 'Estimated Time' }}
                    error={!!errors.estimatedTime}
                    helperText={errors.estimatedTime?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Priority"
                    select
                    fullWidth
                    required
                    error={!!errors.priority}
                    helperText={errors.priority?.message}
                    inputProps={{ 'aria-label': 'Priority' }}
                  >
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                    <MenuItem value="BLOCKER">Blocker</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="assigneeId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Assignee"
                    select
                    fullWidth
                    error={!!errors.assigneeId}
                    helperText={errors.assigneeId?.message}
                    inputProps={{ 'aria-label': 'Assignee' }}
                  >
                    <MenuItem value={null}>None</MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.firstname} {user.lastname}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Due Date"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date ? date.toDate() : null)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.dueDate}
                        helperText={errors.dueDate?.message}
                        inputProps={{ ...params.inputProps, 'aria-label': 'Due Date' }}
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
              aria-label="Submit Subtask"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Subtask'}
            </Button>
          </Grid>
        </Box>
      </LocalizationProvider>
    </Paper>
  );
}

export default AddSubtask;