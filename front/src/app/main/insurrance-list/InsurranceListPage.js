import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,Snackbar,Alert,
  Paper,
  TextField,
  InputAdornment,
  TablePagination,
  CircularProgress,
  Typography,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

const InsuranceListPage = () => {
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
  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');
const navigate = useNavigate();
  useEffect(() => {
    fetchInsurances();
  }, []);

  const fetchInsurances = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken')?.replace(/"/g, '');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/insurances`, config);
      setInsurances(response.data || []);
    } catch (error) {
      console.error('Error fetching insurances:', error);
      setInsurances([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value);
    setCurrentPage(0);
  };

  const handleChangePage = (_, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleDelete = async (id) => {
    try {
     const token = localStorage.getItem('accessToken')?.replace(/"/g, '');;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${API_URL}/insurances/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
      fetchInsurances();
      showSnack('Insurance deleted successfully!');
    } catch (error) {
      console.error('Error deleting insurance:', error);
      showSnack('Error deleting insurance.');
    }
  };

  const handleEdit = (insurance) => {
   
    navigate(`/insurrance-update/${insurance.id}`, {
    state: { insurance },
  });
  };



const handleViewDetails = (insurance) => {
  navigate(`/insurrance-profile/${insurance.id}`, {
    state: { insurance },
  });
};


  const handleAddInsurance = () => {
    window.location.href = '/addinsurance';
  };

  const filteredInsurances = Array.isArray(insurances)
    ? insurances.filter((insurance) =>
        (insurance.name?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
        (insurance.insuranceProvider?.toLowerCase() || '').includes(searchText.toLowerCase())
      )
    : [];

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
        <Typography variant="h4" fontWeight="bold">Insurance List</Typography>
      </Box>

      {/* Barre de recherche à gauche + bouton à droite */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          placeholder="Search by Name or Provider"
          value={searchText}
          onChange={handleSearch}
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
          onClick={handleAddInsurance}
        >
          Add Insurance
        </Button>
      </Box>

      {/* Table ou loader */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress size={60} /></Box>
      ) : filteredInsurances.length === 0 ? (
        <Typography align="center">No insurances found.</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>End Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Provider</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInsurances
                  .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
                  .map((insurance) => (
                    <TableRow key={insurance.id}>
                      <TableCell>{insurance.id}</TableCell>
                      <TableCell>{insurance.name}</TableCell>
                      <TableCell>{insurance.description}</TableCell>
                      <TableCell>{insurance.startDate}</TableCell>
                      <TableCell>{insurance.endDate}</TableCell>
                      <TableCell>{insurance.insuranceProvider}</TableCell>
                      <TableCell>{insurance.contactInfo}</TableCell>
                      <TableCell>
                        <IconButton color="error" onClick={() => handleDelete(insurance.id)}>
                          <DeleteIcon />
                        </IconButton>
                        <IconButton color="primary" onClick={() => handleViewDetails(insurance)}>
  <VisibilityIcon />
</IconButton>

                        <IconButton color="secondary" onClick={() => handleEdit(insurance)}>
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
            count={filteredInsurances.length}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Paper>
  );
};

export default InsuranceListPage;
