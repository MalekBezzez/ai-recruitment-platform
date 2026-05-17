// src/components/LeaveTypesListPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TextField,Snackbar,Alert,
  InputAdornment,
  TablePagination,
  CircularProgress,
  Typography,
  Button,
  IconButton,
  Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

export default function LeaveTypesListPage() {
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
const API_URL = process.env.REACT_APP_API_URL; 
 const [snack, setSnack] = useState({
   open: false,
   message: '',
   severity: 'info', // 'success' | 'info' | 'warning' | 'error'
 });
 
 const showSnack = (message, severity = 'info') =>
   setSnack({ open: true, message, severity });
 
 const handleSnackClose = (_, reason) => {
   if (reason === 'clickaway') return;
   setSnack(s => ({ ...s, open: false }));
 };
 
console.log('API_URL:', API_URL);
  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const tokenWithoutQuotes = token?.replace(/"/g, '') || '';
      const config = {
        headers: {
          Authorization: `Bearer ${tokenWithoutQuotes}`,
        },
      };
      const response = await axios.get(`${API_URL}/leave-types`, config);
      setTypes(response.data || []);
    } catch (err) {
      console.error('Error fetching leave types:', err);
      setTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    setPage(0);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredTypes = Array.isArray(types)
    ? types.filter((t) =>
        String(t.idLeaveType).includes(searchText) ||
        (t.type?.toLowerCase() || '').includes(searchText.toLowerCase())
      )
    : [];

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this leave type?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      const tokenWithoutQuotes = token?.replace(/"/g, '') || '';
      const config = {
        headers: {
          Authorization: `Bearer ${tokenWithoutQuotes}`,
        },
      };
      await axios.delete(`${API_URL}/leave-types/${id}`, config);
      fetchTypes();
      showSnack('Leave type deleted successfully!');
    } catch (err) {
      console.error('Error deleting leave type:', err);
      showSnack('Error deleting leave type.');
    }
  };

  const handleView = (id) => {
    navigate(`/leave-type/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/leave-type-update/${id}`);
  };

  const handleAdd = () => {
    navigate('/AddLeaveType');
  };

  return (
    <Paper elevation={0} sx={{ backgroundColor: 'transparent', px: 10, py: 3 }}>
      <Snackbar
       open={snack.open}
       autoHideDuration={4000}
       onClose={handleSnackClose}
       anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
       sx={{
         zIndex: 9999,           // reste au-dessus du footer et du contenu
         mt: { xs: 7, sm: 10 }   // décale vers le bas (margin-top en Material-UI)
       }}
     >
       <Alert
         onClose={handleSnackClose}
         severity={snack.severity}
         variant="filled"
         sx={{ width: '100%' }}
       >
         {snack.message}
       </Alert>
     </Snackbar>
     
      {/* Titre centré */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Leave Types</Typography>
      </Box>

      {/* Barre de recherche à gauche et bouton à droite */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          placeholder="Search by ID or Type"
          value={searchText}
          onChange={handleSearchChange}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Leave Type
        </Button>
      </Box>

      {/* Table ou loader */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress size={60} />
        </Box>
      ) : filteredTypes.length === 0 ? (
        <Typography align="center">No leave types found.</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Solde</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTypes
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((t) => (
                    <TableRow key={t.idLeaveType}>
                      <TableCell>{t.idLeaveType}</TableCell>
                      <TableCell>{t.type}</TableCell>
                      <TableCell>{t.solde}</TableCell>
                      <TableCell>
                        <IconButton color="error" onClick={() => handleDelete(t.idLeaveType)}>
                          <DeleteIcon />
                        </IconButton>
                        <IconButton color="primary" onClick={() => handleView(t.idLeaveType)}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton color="secondary" onClick={() => handleEdit(t.idLeaveType)}>
                          <EditIcon />
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
            count={filteredTypes.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Paper>
  );
}