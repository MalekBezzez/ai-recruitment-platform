// EmployeeByManagerPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Paper, Box, Typography, TextField, InputAdornment,
  CircularProgress, Alert, Table, TableHead, TableRow,
  TableCell, TableBody, TableContainer, TablePagination, IconButton, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // For "Complete" status
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EmployeeByManagerPage = () => {
  const navigate = useNavigate();
  const { managerId } = useParams();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState(null);
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';

  const fetchEmployeesByManager = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/employee/by-manager/${managerId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEmployees(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des employés");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (managerId) {
      fetchEmployeesByManager();
    } else {
      setError("Aucun ID de manager fourni");
      setLoading(false);
    }
  }, [managerId]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/employee/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression de l'employé");
    }
  };

  const handleViewImputations = (userId) => {
    navigate(`/imputations/valid/${userId}`);
  };

  const filteredList = employees.filter(emp =>
    `${emp.firstname} ${emp.lastname}`.toLowerCase().includes(search.toLowerCase()) ||
    emp.professionalemail?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Paper elevation={0} sx={{ backgroundColor: 'transparent', px: 10, py: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Employees by Manager</Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          placeholder="Search employee"
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
      </Box>

      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress size={60} /></Box>
      ) : filteredList.length === 0 ? (
        <Typography align="center">No employees found for this manager.</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Job Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{`${item.firstname} ${item.lastname}`}</TableCell>
                      <TableCell>{`${item.professionalEmail}`}</TableCell>
                      <TableCell>{item.jobTitle}</TableCell>
                      <TableCell>
                        {item.isComplete ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <span>Not Completed</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleViewImputations(item.id)}>
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

export default EmployeeByManagerPage;