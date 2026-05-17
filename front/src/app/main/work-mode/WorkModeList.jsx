import React, { useEffect, useState } from 'react';
import {
  Paper, Box, Typography, TextField, InputAdornment,
  CircularProgress, Alert, Table, TableHead, TableRow,
  TableCell, TableBody, TableContainer, TablePagination, IconButton, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


  const API_URL = process.env.REACT_APP_API_URL;

const WorkModeList = () => {
  const navigate = useNavigate();
  const [workModes, setWorkModes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';

  const fetchWorkModes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/work-modes`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setWorkModes(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des modes de travail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkModes();
  }, [token]);

  const handleDelete = async (idWorkMode) => {
    try {
      await axios.delete(`${API_URL}/api/work-modes/${idWorkMode}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setWorkModes(prev => prev.filter(wm => wm.idWorkMode !== idWorkMode));
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  const filteredList = workModes.filter(mode =>
    mode.workModeName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Paper elevation={0} sx={{ backgroundColor: 'transparent', px: 10, py: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Work Modes</Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          placeholder="Search work mode"
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
          onClick={() => navigate('/add-work-mode')}  // À créer
        >
          Add Work Mode
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress size={60} /></Box>
      ) : filteredList.length === 0 ? (
        <Typography align="center">No work modes found.</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Work Mode Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <TableRow key={item.idWorkMode}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{item.workModeName}</TableCell>
                      <TableCell>
                        <IconButton color="error" onClick={() => handleDelete(item.idWorkMode)}>
                          <DeleteIcon />
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

export default WorkModeList;
