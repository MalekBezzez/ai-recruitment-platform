import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, InputAdornment, CircularProgress,
  Alert, Grid, Paper, IconButton, Chip, Tooltip, Badge, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import EditIcon from '@mui/icons-material/Edit';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TaskListByPhasePage = () => {
  const { phaseId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [phaseName, setPhaseName] = useState('');
  const [projectId, setProjectId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [subTasksCounts, setSubTasksCounts] = useState({});
  const [loadingSubTasks, setLoadingSubTasks] = useState({});
  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const userRole = JSON.parse(localStorage.getItem('user'))?.user?.role;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch phase details
        const phaseRes = await axios.get(
          `${API_URL}/phases/${phaseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPhaseName(phaseRes.data.name);
        setProjectId(phaseRes.data.projectId);

        // Fetch all tasks for phase
        const tasksRes = await axios.get(
          `${API_URL}/tasks/phase/${phaseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const allTasks = tasksRes.data;
        // Filter out subtasks: those having parentTask != null or parentTaskId
        const rootTasks = allTasks.filter(t => !t.parentTaskId);
        setTasks(rootTasks);

        // Fetch subtasks count for each root task
        await fetchAllSubTasksCounts(rootTasks);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [phaseId, token, API_URL]);

  const fetchAllSubTasksCounts = async (taskList) => {
    const counts = {};
    const loadingStates = {};
    for (const task of taskList) {
      loadingStates[task.taskId] = true;
      try {
        const res = await axios.get(
          `${API_URL}/tasks/${task.taskId}/subtasks`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        counts[task.taskId] = res.data?.length || 0;
      } catch {
        counts[task.taskId] = 0;
      } finally {
        loadingStates[task.taskId] = false;
      }
    }
    setSubTasksCounts(counts);
    setLoadingSubTasks(loadingStates);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/tasks/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(prev => prev.filter(t => t.taskId !== id));
      setSubTasksCounts(prev => { const c = { ...prev }; delete c[id]; return c; });
    } catch {
      setError('Error deleting task');
    }
  };

  const handleViewSubTasks = (taskId) => navigate(`/tasks/${taskId}/subtasks`);
  const handleEditPhase = () => projectId
    ? navigate(`/editphase/${projectId}/${phaseId}`)
    : setError('Project ID not available');

  const filtered = tasks.filter(t => t.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box px={10} py={4}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Tasks for Phase: {phaseName || `#${phaseId}`}
          </Typography>
          <TextField
            placeholder="Search task"
            value={search}
            onChange={e => setSearch(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (<InputAdornment position="start"><SearchIcon color="primary"/></InputAdornment>)
            }}
            sx={{ mt:1, width:250 }}
          />
        </Box>
        {userRole === 'MANAGER' && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon/>}
            onClick={handleEditPhase}
            disabled={!projectId}
          >Edit Phase</Button>
        )}
      </Box>

      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <Box display="flex" justifyContent="center"><CircularProgress size={60}/></Box>
      ) : filtered.length === 0 ? (
        <Typography align="center">No tasks found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {filtered.map(task => (
            <Grid item xs={12} sm={6} md={4} key={task.taskId}>
              <Paper elevation={3} sx={{p:2, display:'flex', flexDirection:'column', height:'100%'}}>
                <Typography variant="h6" fontWeight="bold" color="primary">{task.name}</Typography>  <Typography>Estimation: {task.estimatedTime} h</Typography>
                <Typography>Réalisé: {task.actualTime} h</Typography>
                <Typography>Status: <Chip label={task.status} size="small" color="info" /></Typography>
                <Typography>Priorité: {task.priority}</Typography>
                <Typography>Due Date: {task.dueDate || '—'}</Typography>

                <Box mt={1}>
                  <Typography variant="body2" color="text.secondary">
                    SubTasks: 
                    <Chip 
                      label={loadingSubTasks[task.taskId] ? '...' : (subTasksCounts[task.taskId] || 0)} 
                      size="small" 
                      color={subTasksCounts[task.taskId] > 0 ? "primary" : "default"}
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Box>

                <Box mt="auto" display="flex" justifyContent="space-between" alignItems="center">
                  <Typography fontWeight="bold" color="text.secondary">
                    ID #{task.taskId}
                  </Typography>

                  <Box display="flex" gap={1}>
                    <Tooltip title="Task Details">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/tasks/detail/${task.taskId}`)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title={
                      loadingSubTasks[task.taskId] 
                        ? "Loading..." 
                        : subTasksCounts[task.taskId] > 0 
                          ? `View ${subTasksCounts[task.taskId]} SubTask(s)` 
                          : 'No SubTasks'
                    }>
                      <IconButton
                        color={subTasksCounts[task.taskId] > 0 ? "success" : "default"}
                        onClick={() => handleViewSubTasks(task.taskId)}
                        disabled={loadingSubTasks[task.taskId]}
                      >
                        <Badge 
                          badgeContent={subTasksCounts[task.taskId] > 0 ? subTasksCounts[task.taskId] : null} 
                          color="primary"
                        >
                          <AccountTreeIcon />
                        </Badge>
                      </IconButton>
                    </Tooltip>
                    
                {userRole === 'MANAGER' && (      <Tooltip title="Add Subtask">
                      <IconButton
                        color="secondary"
                        onClick={() => navigate(`/tasks/add-subtask/${task.taskId}/phase/${phaseId}`)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>)}
                    
             {userRole === 'MANAGER' && (         <Tooltip title="Delete Task">
                      <IconButton color="error" onClick={() => handleDelete(task.taskId)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>)}   </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default TaskListByPhasePage;
