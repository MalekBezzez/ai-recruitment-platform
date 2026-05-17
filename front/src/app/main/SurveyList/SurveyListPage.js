import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Button, CircularProgress,
  TextField, Card, CardContent, Grid, Chip, Container,
  InputAdornment, Divider, Stack
} from '@mui/material';
import {
  Search, Assignment, CheckCircle, Settings,
  TrendingUp, Assessment
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SurveyListPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'completed', 'pending'
  const navigate = useNavigate();
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  const surveysPerPage = 6;

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const employeId = currentUser?.user?.id;

        const config = {
          headers: {
            Authorization: `Bearer ${token?.replace(/"/g, '') || ''}`
          }
        };

        const res = await axios.get(`${API_URL}/questionnaires`, config);
        const allSurveys = res.data;

        const answerChecks = await Promise.all(
          allSurveys.map(async (survey) => {
            try {
              const existsRes = await axios.get(`${API_URL}/answers/exists`, {
                params: {
                  questionnaireId: survey.questionnaireId,
                  employeId
                },
                ...config
              });
              return { ...survey, alreadyAnswered: existsRes.data === true };
            } catch {
              return { ...survey, alreadyAnswered: false };
            }
          })
        );

        setSurveys(answerChecks);
      } catch (error) {
        console.error("Error loading surveys", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  const searchedSurveys = surveys.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase())
  );

  const statusFilteredSurveys = searchedSurveys.filter(s => {
    if (filterStatus === 'completed') return s.alreadyAnswered;
    if (filterStatus === 'pending') return !s.alreadyAnswered;
    return true;
  });

  const totalPages = Math.ceil(statusFilteredSurveys.length / surveysPerPage);
  const paginatedSurveys = statusFilteredSurveys.slice(
    (currentPage - 1) * surveysPerPage,
    currentPage * surveysPerPage
  );

  const userRole = JSON.parse(localStorage.getItem('user'))?.user?.role;

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg,rgb(248, 249, 253) 0%,rgb(248, 246, 250) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)'
          }}
        >
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            Loading surveys...
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh'  }}>
      <Paper elevation={1} sx={{ borderBottom: '1px solid #e0e0e0' }}>
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', md: 'center' }}
              spacing={2}
            >
              <Box>
                <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
                  Available Surveys
                </Typography>
                <Typography variant="h6" color="textSecondary">
                  Participate in surveys and share your feedback
                </Typography>
              </Box>
              
                <Button
                  variant="outlined"
                  startIcon={<Settings />}
                  onClick={() => navigate('/survey-management')}
                >
                  Survey Management
                </Button>
              
            </Stack>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Search + Filter */}
        <Box sx={{ mb: 4 }}>
          <TextField
            label="Search by title"
            variant="outlined"
            size="medium"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            sx={{
              maxWidth: 500,
              mr: 2,
              '& .MuiOutlinedInput-root': {
                
                borderRadius: 2
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Status Filter Buttons */}
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <Button
            variant={filterStatus === 'all' ? 'contained' : 'outlined'}
            onClick={() => { setFilterStatus('all'); setCurrentPage(1); }}
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'completed' ? 'contained' : 'outlined'}
            onClick={() => { setFilterStatus('completed'); setCurrentPage(1); }}
          >
            Completed
          </Button>
          <Button
            variant={filterStatus === 'pending' ? 'contained' : 'outlined'}
            onClick={() => { setFilterStatus('pending'); setCurrentPage(1); }}
          >
            Pending
          </Button>
        </Stack>

        {/* Survey Cards */}
        {paginatedSurveys.length === 0 ? (
          <Paper
            elevation={3}
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)'
            }}
          >
            <Assignment sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight="medium">
              No survey found
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Try adjusting your search criteria or check back later.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {paginatedSurveys.map((s) => (
              <Grid item xs={12} md={6} lg={4} key={s.questionnaireId}>
                <Card
                  elevation={3}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          background: 'primary.main',
                          color: 'white',
                          mr: 2
                        }}
                      >
                        <Assessment />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {s.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          ID: {s.questionnaireId}
                        </Typography>
                      </Box>
                      {s.alreadyAnswered && (
                        <Chip
                          icon={<CheckCircle />}
                          label="Completed"
                          color="success"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>

                    {s.description && (
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 2, flex: 1 }}>
                        {s.description}
                      </Typography>
                    )}

                    <Box sx={{ mb: 3, mt: 'auto' }}>
                      {s.createdAt && (
                        <Typography variant="caption" color="textSecondary">
                          Created: {new Date(s.createdAt).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>

                    <Button
                      fullWidth
                      variant={s.alreadyAnswered ? "outlined" : "contained"}
                      color={s.alreadyAnswered ? "success" : "primary"}
                      size="large"
                      disabled={s.alreadyAnswered}
                      onClick={() => navigate(`/survey/${s.questionnaireId}/answer`)}
                      startIcon={s.alreadyAnswered ? <CheckCircle /> : <TrendingUp />}
                      sx={{ borderRadius: 2, py: 1.5, fontWeight: 'medium' }}
                    >
                      {s.alreadyAnswered ? 'Already Answered' : 'Answer'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Button
              variant="outlined"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Page {currentPage} of {totalPages}
            </Typography>
            <Button
              variant="outlined"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </Stack>
        )}

        {/* Statistics */}
        <Paper
          elevation={3}
          sx={{
            mt: 6,
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight="bold" textAlign="center">
            Survey Statistics
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="primary.main" gutterBottom>
                  {surveys.length}
                </Typography>
                <Typography variant="h6" color="textSecondary">
                  Total Surveys
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="success.main" gutterBottom>
                  {surveys.filter(s => s.alreadyAnswered).length}
                </Typography>
                <Typography variant="h6" color="textSecondary">
                  Completed
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="warning.main" gutterBottom>
                  {surveys.filter(s => !s.alreadyAnswered).length}
                </Typography>
                <Typography variant="h6" color="textSecondary">
                  Pending
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default SurveyListPage;
