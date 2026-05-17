import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Button, CircularProgress,
  TextField, Card, CardContent, Grid, Container,
  InputAdornment, Divider, Stack, TablePagination
} from '@mui/material';
import {
  Search, Assessment, Timeline
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PredictionResultListPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL ;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const config = {
          headers: {
            Authorization: `Bearer ${token?.replace(/"/g, '') || ''}`
          }
        };
        const res = await axios.get(`${API_URL}/prediction/save-result/discussion-results/grouped`, config);
        setResults(res.data);
      } catch (error) {
        console.error("Error fetching Analyses messages results", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const filteredResults = results.filter((r) => {
    const matchesSearch = search
      ? r.predictions?.some((p) =>
          `${p.message || ''} ${p.topic || ''} ${p.sentiment || ''}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      : true;

    const analyzedAt = new Date(r.items?.[0]?.analyzedAt);
    const afterStart = startDate ? analyzedAt >= new Date(startDate) : true;
    const beforeEnd = endDate ? analyzedAt <= new Date(endDate) : true;

    return matchesSearch && afterStart && beforeEnd;
  });

  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg,rgb(248, 249, 253) 0%,rgb(248, 246, 250) 100%)'
      }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            Loading analyse message results...
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
            Analyse Messages Results
          </Typography>
        </Box>

        {/* Search & Date Filters */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(1);
            }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setCurrentPage(1);
            }}
            InputLabelProps={{ shrink: true }}
          />
          
        </Stack>

        {/* Prediction Cards */}
        {paginatedResults.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <Timeline sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No prediction result found
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Try adjusting your search or check back later.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {paginatedResults.map((r, index) => {
              const date = new Date(r.items?.[0]?.analyzedAt);
              const formattedDate = isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
              const resultNumber = (currentPage - 1) * rowsPerPage + index + 1;

              return (
                <Grid item xs={12} md={6} lg={4} key={r.id}>
                  <Card
                    elevation={3}
                    sx={{
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
                    <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ p: 1.5, borderRadius: 2, background: 'primary.main', color: 'white', mr: 2 }}>
                          <Assessment />
                        </Box>
                        <Typography variant="h6" fontWeight="bold" flexGrow={1}>
                          Analyse Message #{resultNumber}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        Analyzed At: {formattedDate}
                      </Typography>

                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 'auto', borderRadius: 2 }}
                        onClick={() => navigate(`/MessageAnalyse/${r.id}`)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Pagination Modern */}
        {filteredResults.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <TablePagination
              component="div"
              count={filteredResults.length}
              page={currentPage - 1}
              onPageChange={(event, newPage) => setCurrentPage(newPage + 1)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setCurrentPage(1);
              }}
              rowsPerPageOptions={[6, 12, 24]}
              labelRowsPerPage="Results per page"
            />
          </Box>
        )}

        
      </Container>
    </Box>
  );
};

export default PredictionResultListPage;
