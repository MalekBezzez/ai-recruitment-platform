import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Typography, Paper, Grid, LinearProgress, IconButton, Tooltip, Button, TextField
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
    const userRole = JSON.parse(localStorage.getItem('user'))?.user?.role;
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectRes = await axios.get(`${API_URL}/projects/${projectId}`, { headers });
        setProject(projectRes.data);

        const phaseRes = await axios.get(`${API_URL}/phases/project/${projectId}`, { headers });
        setPhases(phaseRes.data);
      } catch (err) {
        console.error('Error loading project detail', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const fetchUsedHours = async (phaseId) => {
    try {
      const res = await axios.get(`${API_URL}/tasks/phase/${phaseId}`, { headers });
      return res.data
        .filter(task => task.status === 'DONE')
        .reduce((sum, task) => sum + task.actualTime, 0);
    } catch {
      return 0;
    }
  };

  const handleAddPhase = () => {
    navigate(`/addphase/${projectId}`);
  };

  const PhaseCard = ({ phase }) => {
    const [usedHours, setUsedHours] = useState(0);

    useEffect(() => {
      const loadUsedHours = async () => {
        const hours = await fetchUsedHours(phase.phaseId);
        setUsedHours(hours);
      };
      loadUsedHours();
    }, [phase.phaseId]);

    const progress = phase.totalHours
      ? Math.min(100, Math.round((usedHours / phase.totalHours) * 100))
      : 0;

    const handleViewTasks = () => {
      navigate(`/phasetasks/${phase.phaseId}`);
    };

    const handleAddTask = () => {
      navigate(`/addtask/${phase.phaseId}`);
    };

    const handleDeletePhase = async () => {
      try {
        await axios.delete(`${API_URL}/phases/${phase.phaseId}`, { headers });
        setPhases(phases.filter((p) => p.phaseId !== phase.phaseId));
      } catch (err) {
        console.error('Error deleting phase', err);
      }
    };

    const handleEditPhase = () => {
      navigate(`/editphase/${projectId}/${phase.phaseId}`);
    };

    return (
      <Paper sx={{ p: 2 }} elevation={3}>
        <Typography variant="h6">{phase.name}</Typography>
        <Typography>Start: {phase.startedDate}</Typography>
        <Typography>End: {phase.endDate}</Typography>
        <Typography>Total Hours: {phase.totalHours}</Typography>
        {/* <Typography>Used Hours: {usedHours}</Typography> */}
        <Typography>Progress: {progress}%</Typography>
        <LinearProgress variant="determinate" value={progress} sx={{ mt: 1, mb: 2 }} />
        <Box display="flex" justifyContent="flex-end">
          <Tooltip title="View Tasks">
            <IconButton onClick={handleViewTasks} color="primary">
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
      {userRole === 'MANAGER' && (
    <Tooltip title="Add Task">
            <IconButton onClick={handleAddTask} color="secondary">
              <AddIcon />
            </IconButton>
          </Tooltip>)}
       {userRole === 'MANAGER' && (    <Tooltip title="Edit Phase">
            <IconButton onClick={handleEditPhase} color="secondary">
              <EditIcon />
            </IconButton>
          </Tooltip>)}
        {userRole === 'MANAGER' && (    <Tooltip title="Delete Phase">
            <IconButton onClick={handleDeletePhase} color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>)}
        </Box>
      </Paper>
    );
  };

  if (loading) return <Typography align="center">Loading...</Typography>;
  if (!project) return <Typography align="center">Project not found.</Typography>;

  const filteredPhases = phases.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={2}>{project.name}</Typography>
      <Typography variant="subtitle1">Start: {project.startedDate} | End: {project.endDate}</Typography>
      <Typography variant="subtitle2" mb={4}>Total Hours: {project.totalHours}</Typography>

      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mt={3} mb={2}>
        <Box>
          <Typography variant="h5" mb={1}>Phases</Typography>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
       {userRole === 'MANAGER' && ( <Tooltip title="Add Phase">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddPhase}
          >
            Add Phase
          </Button>
        </Tooltip>)}
      </Box>

      <Grid container spacing={3}>
        {filteredPhases.map((p) => (
          <Grid item xs={12} md={6} lg={4} key={p.phaseId}>
            <PhaseCard phase={p} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProjectDetailPage;
