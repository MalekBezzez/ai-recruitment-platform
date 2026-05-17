import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Chip, 
  Grid, 
  Container,
  Box,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { CalendarToday, Group, FilterList } from '@mui/icons-material';
import './JobApplications.scss';
import Paper from '@mui/material/Paper';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const JobApplications = () => {
  const [hideClosed, setHideClosed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobOffers, setJobOffers] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';

  useEffect(() => {
    axios.get(`${API_URL}/api/workflowjoboffer/published`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }) 
      .then(response => {
        const mappedOffers = response.data.map(offer => ({
          id: offer.idJobOffer,
          title: offer.title,
          department: offer.department,
          publishedDate: offer.publishDate,
          applicationsCount: offer.nbApplications,
          status: offer.isCompleted ? 'completed' : 'active'
        }));
        setJobOffers(mappedOffers);
      })
      .catch(error => {
        console.error("Error fetching offers:", error);
      });
  }, []);

  const handleViewApplications = (jobId) => {
    navigate(`/job-offers/${jobId}/applications`);
  };

  const handleHideClosedChange = (event) => {
    setHideClosed(event.target.checked);
  };

  const filteredJobs = jobOffers.filter(job => {
    if (hideClosed && job.status === 'completed') return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        job.title.toLowerCase().includes(searchLower) || 
        job.department.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <Paper className="offers-applications-container" elevation={0} sx={{
      backgroundColor: 'transparent',
      px: 16,
      py: 0,
    }}>
      <Box className="page-header" py={1} px={2}>
        <Typography className="mt-23 text-4xl font-extrabold tracking-tight leading-tight">
          Offers Applications
        </Typography>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} mt={2}>
          <TextField
            placeholder="Search by name or department"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{ 
              width: 350,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              }
            }}
          />
          
          <FormControlLabel 
            control={
              <Switch 
                checked={hideClosed} 
                onChange={handleHideClosedChange} 
                color="success"
                size="large"
              />
            } 
            label={
              <Typography variant="subtitle1" sx={{
                fontWeight: 600,
                color: 'text.primary',
                fontSize: '1.3rem',
              }}>
                Hide Completed
              </Typography>
            } 
          />
        </Box>
      </Box>

      <Box px={2}>
        {filteredJobs.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary">
              No offers match the selected filters
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={5}>
            {filteredJobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={job.id}>
                <Card className="job-card" elevation={4} sx={{ 
                  backgroundColor: "#f4f4f4",
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: 3
                  }
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Chip
                      label={job.status === 'active' ? 'Active' : 'Completed'}
                      color={job.status === 'active' ? 'success' : 'default'}
                      size="small"
                      sx={{ ml: 0 }}
                    />
                    <Box display="flex" justifyContent="space-between" mb={2} mt={2}>
                      <Typography variant="h6" fontWeight={600}>
                        {job.title}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" mb={3}>
                      Department : {job.department}
                    </Typography>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Box display="flex" alignItems="center" mb={1}>
                      <CalendarToday fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        Published: {job.publishedDate ? new Date(job.publishedDate).toLocaleDateString('en-US') : 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center">
                      <Group fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" fontWeight={500}>
                        {job.applicationsCount} application{job.applicationsCount !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewApplications(job.id)}
                      fullWidth
                      sx={{
                        py: 1,
                        fontWeight: 500,
                        borderRadius: 2
                      }}
                    >
                      View Applications
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Paper>
  );
};

export default JobApplications;