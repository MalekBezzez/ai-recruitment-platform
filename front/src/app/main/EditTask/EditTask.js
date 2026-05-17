import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, Grid, TextField,Snackbar,Alert , MenuItem, Button
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const schema = yup.object().shape({
  name: yup.string().required('Task name is required'),
  estimatedTime: yup.number().required('Estimated time is required').positive(),
  priority: yup.string().required('Priority is required'),
  status: yup.string().required('Status is required'),
});
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
function EditTask() {
  const navigate = useNavigate();
  const { taskId, phaseId } = useParams();
  const [employees, setEmployees] = useState([]);
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
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      estimatedTime: '',
      priority: '',
      status: '',
      dueDate: '',
      assigneeId: ''
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
        const headers = { Authorization: `Bearer ${token}` };

        // Charger la tâche
        const taskRes = await axios.get(`${API_URL}/tasks/${taskId}`, { headers });
        reset({
          ...taskRes.data,
          assigneeId: taskRes.data.assignee?.id || ''
        });

        // Charger les employés
        const empRes = await axios.get(`${API_URL}/employee/all-employees`, { headers });
        setEmployees(empRes.data);

      } catch (error) {
        showSnack(' Erreur lors du chargement des données');
        console.error(error);
      }
    };
    fetchData();
  }, [taskId, reset]);

  const onSubmit = async (data) => {
    try {
      const userData = localStorage.getItem('user');
const user = userData ? JSON.parse(userData) : null;
if (!user?.user?.id) {
  throw new Error('No valid user found in localStorage');
}
const updatedBy = user.user.id;

      const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
      const headers = { Authorization: `Bearer ${token}` };

      const payload = {
        ...data,
        taskId: Number(taskId),
        phaseId: Number(phaseId),
        assigneeId: Number(data.assigneeId),
        updatedBy: updatedBy,
  updatedDate: new Date().toISOString(),
      };

      await axios.patch(`${API_URL}/tasks/edit/${taskId}`, payload, { headers });
      showSnack(' Task updated successfully');
      navigate(`/tasks/detail/${taskId}`);
    } catch (error) {
      console.error(error);
      showSnack( '❌ Error updating task');
    }
  };

  return (
    <Paper sx={{ padding: 4, maxWidth: 700, margin: 'auto' }}>
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
        Modify Task
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>

          {/* Task Name */}
          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Task Name"
                  fullWidth
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
                  multiline
                  rows={4}
                  fullWidth
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
                  select
                  fullWidth
                  error={!!errors.priority}
                  helperText={errors.priority?.message}
                >
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="BLOCKER">Blocker</MenuItem>
                </TextField>
              )}
            />
          </Grid>

          {/* Status */}
          <Grid item xs={12}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Status"
                  select
                  fullWidth
                  error={!!errors.status}
                  helperText={errors.status?.message}
                >
                  <MenuItem value="TO_DO">To Do</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="DONE">Done</MenuItem>
                  <MenuItem value="BLOCKED">Blocked</MenuItem>
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
                <TextField
                  {...field}
                  label="Due Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
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
                  select
                  fullWidth
                >
                  {employees.map((emp) => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.firstname} {emp.lastname}
                    </MenuItem>
                  ))}
                </TextField>
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

export default EditTask;
