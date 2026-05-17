import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  Alert,
  Typography,
  TextField,
  InputAdornment,
  Snackbar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const CareerPathing = () => {

//recently 

// Snackbar state
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



  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL ;
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';

  let userId = null;
  try {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    if (!user?.user?.id) {
      throw new Error('No valid user found in localStorage');
    }
    userId = user.user.id;
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'ID utilisateur:', err.message);
  }

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/employee/training-candidates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des employés");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(eId => eId !== id) : [...prev, id]
    );
  };

  const handleStartCareerPathing = async () => {
    if (selectedIds.length === 0) {
      //alert("Please select at least one employee !");
      showSnack('Please select at least one employee !', 'info');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/employee-skill/career-pathing/process`, {
        employeeIds: selectedIds,
        requesterId: userId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSelectedIds([]);
      navigate('/career-pathing-recommendation-plan');
    } catch (err) {
      //alert("❌ Erreur lors de l'envoi !");
      showSnack("❌ Error during submission!", "info");
    }
  };

  // Filtrage avec search
  const filteredList = employees.filter(
    (emp) =>
      emp.name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
      emp.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Paper elevation={0} sx={{ backgroundColor: 'transparent', px: 10, py: 3 }}>
      {/* Titre */}
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Career Pathing
      </Typography>

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


      {/* Ligne : Search à gauche / Bouton à droite */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        {/* Champ de recherche */}
        <TextField
          placeholder="Search employee"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
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

        {/* Bouton */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleStartCareerPathing}
        >
          Start Career Pathing Recommendation
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress size={60} />
        </Box>
      ) : filteredList.length === 0 ? (
        <Typography align="center">No employees found.</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Select</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Employee Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Job Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(emp.id)}
                          onChange={() => handleCheckboxChange(emp.id)}
                        />
                      </TableCell>
                      <TableCell>{emp.name}</TableCell>
                      <TableCell>{emp.jobTitle}</TableCell>
                      <TableCell>{emp.department}</TableCell>
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

export default CareerPathing;
