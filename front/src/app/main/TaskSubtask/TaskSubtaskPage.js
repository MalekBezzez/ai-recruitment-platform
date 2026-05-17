import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, InputAdornment, CircularProgress,
  Alert, Grid, Paper, IconButton, Chip, Tooltip, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TaskSubtaskPage = () => {
  const { parentTaskId } = useParams();
  const [subtasks, setSubtasks] = useState([]);
  const [parentTaskName, setParentTaskName] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
  const navigate = useNavigate();
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [subtaskRes, parentRes] = await Promise.all([
          axios.get(`${API_URL}/tasks/${parentTaskId}/subtasks`, { headers }),
          axios.get(`${API_URL}/tasks/${parentTaskId}`, { headers }),
        ]);

        setSubtasks(subtaskRes.data);
        setParentTaskName(parentRes.data.name);
      } catch {
        setError('Failed to fetch subtasks or parent task');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [parentTaskId]);
const userRole = JSON.parse(localStorage.getItem('user'))?.user?.role;

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubtasks(prev => prev.filter(t => t.taskId !== id));
    } catch {
      setError('Error deleting subtask');
    }
  };

  const filtered = subtasks.filter(t => t.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box px={10} py={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Subtasks of: {parentTaskName || `Task #${parentTaskId}`}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<InfoIcon />}
          onClick={() => navigate(`/tasks/detail/${parentTaskId}`)}
        >
          View Parent Task
        </Button>
      </Box>

      <Box display="flex" justifyContent="flex-end" mb={3}>
        <TextField
          placeholder="Search subtask"
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            )
          }}
          sx={{ width: 300 }}
        />
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center"><CircularProgress size={60} /></Box>
      ) : filtered.length === 0 ? (
        <Typography align="center">No subtasks found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.taskId}>
              <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" fontWeight="bold" color="primary">{task.name}</Typography>
                <Typography>Estimated: {task.estimatedTime} h</Typography>
                <Typography>Actual: {task.actualTime} h</Typography>
                <Typography>Status: <Chip label={task.status} size="small" color="info" /></Typography>
                <Typography>Priority: {task.priority}</Typography>
                <Typography>Due Date: {task.dueDate || '—'}</Typography>

                <Box mt="auto" display="flex" justifyContent="space-between" alignItems="center">
                  <Typography fontWeight="bold" color="text.secondary">
                    Task ID: #{task.taskId}
                  </Typography>

                  <Box display="flex" gap={1}>
                    {/* <Tooltip title="Add Sub-subtask">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/tasks/add-subtask/${task.taskId}`)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip> */}

               {userRole === 'MANAGER' && (       <Tooltip title="Edit Subtask">
                      <IconButton
                        color="success"
                        onClick={() => navigate(`/tasks/edit/${task.taskId}`)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>)}

                 {userRole === 'MANAGER' && (     <Tooltip title="Delete Subtask">
                      <IconButton color="error" onClick={() => handleDelete(task.taskId)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip> )}

               {userRole === 'MANAGER' && (       <Tooltip title="View Subtask Details">
                      <IconButton
                        color="default"
                        onClick={() => navigate(`/tasks/detail/${task.taskId}`)}
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip> )}

                    {task.subTaskIds && task.subTaskIds.length > 0 && (
                      <Tooltip title="View Sub-subtasks">
                        <IconButton
                          color="secondary"
                          onClick={() => navigate(`/tasks/${task.taskId}/subtasks`)}
                        >
                          <SearchIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default TaskSubtaskPage;
