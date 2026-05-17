import React, { useEffect, useState } from 'react';
import {
  Paper, Box, Typography, TextField, InputAdornment,
  CircularProgress, Alert, Table, TableHead, TableRow,
  TableCell, TableBody, TableContainer, TablePagination, IconButton,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TrainingRecommendationSummary = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL ;
  
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/training-recommendation-plans/summary`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPlans(res.data);
    } catch (err) {
      setError("Error loading training recommendation plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const filteredList = plans.filter(plan =>
    plan.requesterName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Paper elevation={0} sx={{ backgroundColor: 'transparent', px: 10, py: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Training Recommendations Plan</Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} gap={2}>
        <TextField
          placeholder="Search by requester"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/training-recommendation-start')}
          sx={{ whiteSpace: 'nowrap' }}
        >
          New Training Recommendation
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress size={60} /></Box>
      ) : filteredList.length === 0 ? (
        <Typography align="center">No training recommendations found.</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Requester Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{item.requesterName || '—'}</TableCell>
                      <TableCell>
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                            })
                          : '—'}
                      </TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          disabled={item.status !== "COMPLETED"}
                          onClick={() => navigate(`/${item.id}/training-recommendation-tabs`)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </>
      )}
    </Paper>
  );
};

export default TrainingRecommendationSummary;
