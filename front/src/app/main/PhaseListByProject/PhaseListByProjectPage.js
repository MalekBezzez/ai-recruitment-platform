import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, InputAdornment, CircularProgress,
  Alert, Grid, Paper, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

const PhaseListByProjectPage = () => {
  const { projectId } = useParams();
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);

  useEffect(() => {
    const fetchPhasesWithCounts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/phases/project/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const enrichedPhases = await Promise.all(
          res.data.map(async (phase) => {
            try {
              const countRes = await axios.get(`${API_URL}/tasks/count/phase/${phase.phaseId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              return { ...phase, taskCount: countRes.data };
            } catch {
              return { ...phase, taskCount: 0 };
            }
          })
        );

        setPhases(enrichedPhases);
      } catch {
        setError('Failed to fetch phases');
      } finally {
        setLoading(false);
      }
    };

    fetchPhasesWithCounts();
  }, [projectId]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/phases/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPhases(prev => prev.filter(p => p.phaseId !== id));
    } catch {
      setError('Error deleting phase');
    }
  };

  const filtered = phases.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box px={10} py={4}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold">Phases for Project #{projectId}</Typography>
      </Box>

      <Box display="flex" justifyContent="flex-end" mb={3}>
        <TextField
          placeholder="Search phase"
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
        <Typography align="center">No phases found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.phaseId}>
              <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" fontWeight="bold" color="primary">{item.name}</Typography>
                <Typography>Heures passées : {item.passedHours} Hour(s)</Typography>
                <Typography>Reste à faire : {item.totalHours} Hour(s)</Typography>
                <Typography>
                  Retard(J) : {
                    dayjs().isAfter(dayjs(item.endDate))
                      ? dayjs().diff(dayjs(item.endDate), 'day')
                      : 0
                  }
                </Typography>
                <Typography fontStyle="italic" color="error">{item.endDate}</Typography>
                <Box mt="auto" display="flex" justifyContent="space-between" alignItems="center">
                  <Typography fontWeight="bold" color="text.secondary">
                    {item.taskCount || 0} Tasks
                  </Typography>
                  <IconButton color="error" onClick={() => handleDelete(item.phaseId)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PhaseListByProjectPage;
