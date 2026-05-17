import React, { useEffect, useState } from 'react';
import {
  Paper, Box, Typography, TextField, InputAdornment,
  CircularProgress, Alert, Table, TableHead, TableRow,
  TableCell, TableBody, TableContainer, TablePagination, IconButton, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Importation de useNavigate

const DepartmentListPage = () => {
  const navigate = useNavigate();  // Hook pour la navigation
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/departments`, {
         headers: {
    Authorization: `Bearer ${token}`,
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  params: {
    t: Date.now() // optionnel : évite tout cache côté proxy ou navigateur
  },
      });
      setDepartments(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des départements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/departments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDepartments(prev => prev.filter(dep => dep.id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression du département");
    }
  };

  const filteredList = departments.filter(dep =>
    dep.departmentName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Paper elevation={0} sx={{ backgroundColor: 'transparent', px: 10, py: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Departments</Typography>
      </Box>

      {/* Box avec bouton "Add Department" à gauche et barre de recherche à droite */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        {/* Bouton "Add Department" aligné à gauche */}
     

        {/* Champ de recherche aligné à droite */}
        <TextField
          placeholder="Search department"
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
          onClick={() => navigate('/addDepartment')}  // Redirige vers une page d'ajout
        >
          Add Department
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress size={60} /></Box>
      ) : filteredList.length === 0 ? (
        <Typography align="center">No departments found.</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Department Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{item.departmentName}</TableCell>
                      <TableCell>
                        <IconButton color="error" onClick={() => handleDelete(item.id)}>
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

export default DepartmentListPage;
