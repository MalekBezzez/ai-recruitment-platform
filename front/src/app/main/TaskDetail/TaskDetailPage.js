// 📁 src/pages/TaskDetailPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Chip, CircularProgress, Alert, Button
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

const TaskDetailPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  // Récupération du rôle utilisateur
  const userItem = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = userItem.user?.role;

  const [task, setTask] = useState(null);
  const [assignee, setAssignee] = useState(null);
  const [reporter, setReporter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
  const API_URL = process.env.REACT_APP_API_URL;
  console.log('API_URL:', API_URL);

  useEffect(() => {
    const fetchTaskAndUsers = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Charger la tâche
        const taskRes = await axios.get(`${API_URL}/tasks/${taskId}`, { headers });
        const taskData = taskRes.data;
        setTask(taskData);

        // Charger l'assignee si existant
        if (taskData.assigneeId) {
          const resp = await axios.get(
            `${API_URL}/employee/${taskData.assigneeId}`,
            { headers }
          );
          setAssignee(resp.data);
        }

        // Charger le reporter si existant
        if (taskData.reporterId) {
          const resp = await axios.get(
            `${API_URL}/employee/${taskData.reporterId}`,
            { headers }
          );
          setReporter(resp.data);
        }
      } catch (err) {
        console.error(err);
        setError('❌ Failed to load task details');
      } finally {
        setLoading(false);
      }
    };

    fetchTaskAndUsers();
  }, [taskId, token, API_URL]);

  if (loading) return <Box textAlign="center"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Paper
      sx={{
        p: 6,
        width: '100%',
        maxWidth: 1000,
        m: '40px auto',
        borderRadius: 3,
        boxShadow: 4,
        backgroundColor: '#fff',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" fontWeight="bold">
          {task.name || `Task #${task.taskId}`}
        </Typography>
        {userRole === 'MANAGER' && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/phases/tasks/edit/${task.taskId}`)}
          >
            Edit Task
          </Button>
        )}
      </Box>

      <Typography mb={2}>Description: {task.description || '—'}</Typography>

      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <Chip label={`Priority: ${task.priority}`} />
        <Chip label={`Status: ${task.status}`} />
      </Box>

      <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2} mb={3}>
        <Typography>Estimated Time: {task.estimatedTime} h</Typography>
        <Typography>Actual Time: {task.actualTime || 0} h</Typography>
        <Typography>Due Date: {task.dueDate || '—'}</Typography>
        <Typography>
          Created: {dayjs(task.createdDate).isValid()
            ? dayjs(task.createdDate).format('YYYY-MM-DD HH:mm')
            : '—'}
        </Typography>
        <Typography>
          Updated: {task.updatedDate
            ? dayjs(task.updatedDate).format('YYYY-MM-DD HH:mm')
            : '—'}
        </Typography>
        <Typography>Updated By: {task.updatedBy || '—'}</Typography>
        <Typography>
          Assignee: {assignee ? `${assignee.firstname} ${assignee.lastname}` : '—'}
        </Typography>
        <Typography>
          Reporter: {reporter ? `${reporter.firstname} ${reporter.lastname}` : '—'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default TaskDetailPage;
