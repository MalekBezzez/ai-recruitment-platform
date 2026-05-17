import React, { useEffect, useState } from 'react';
import {
  Paper, Box, Typography, TextField, InputAdornment,
  CircularProgress, Alert, Table, TableHead, TableRow,
  TableCell, TableBody, TableContainer, TablePagination,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const HistoryWorkflowLeaveListPage = () => {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  const fetchHistories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/historyleaves`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistories(res.data);
    } catch (err) {
      setError('Error loading history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistories(); }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/historyleaves/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistories(prev => prev.filter(h => h.id !== id));
    } catch {
      setError('Error deleting history');
    }
  };

  const filtered = histories.filter(h =>
    h.taskName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Paper elevation={0} sx={{ px: 4, py: 3, background: 'transparent' }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Task History</Typography>
        <TextField
          size="small"
          placeholder="Search by task"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary"/>
              </InputAdornment>
            )
          }}
          sx={{ width: 300 }}
        />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading
        ? <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress size={60}/>
          </Box>
        : filtered.length === 0
          ? <Typography align="center">No history found.</Typography>
          : (
            <>
              <TableContainer component={Paper} sx={{ mb: 2, borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Task ID</TableCell>
                      <TableCell>Decision</TableCell>
                      <TableCell>Comment</TableCell>
                      <TableCell>Completed On</TableCell>
                      <TableCell>Requester</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((h, idx) => (
                        <TableRow key={h.id} hover>
                          <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                          <TableCell>{h.taskId}</TableCell>
                          <TableCell>{h.decision}</TableCell>
                          <TableCell>{h.comment}</TableCell>
                          <TableCell>
                            {new Date(h.completedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {h.requesterFirstName} {h.requesterLastName}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(h.id)}
                            >
                              <DeleteIcon/>
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(_, p) => setPage(p)}
                onRowsPerPageChange={e => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </>
          )
      }
    </Paper>
  );
};

export default HistoryWorkflowLeaveListPage;
