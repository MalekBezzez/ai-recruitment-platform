import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RestartAltIcon from '@mui/icons-material/RestartAlt'; 
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
import { Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';



const EmployeeListPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');
const [managementAnchorEl, setManagementAnchorEl] = useState(null);
const navigate = useNavigate();
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



const handleOpenManagementMenu = (event) => {
  setManagementAnchorEl(event.currentTarget);
};

const handleCloseManagementMenu = () => {
  setManagementAnchorEl(null);
};

const handleRedirect = (path) => {
  window.location.href = path;
  handleCloseManagementMenu();
};
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const tokenWithoutQuotes = token?.replace(/"/g, '') || '';
      const config = {
        headers: {
          Authorization: `Bearer ${tokenWithoutQuotes}`,
        },
      };
      const response = await axios.get(`${API_URL}/employee/all-employees`, config);
      setAccounts(response.data || []);
      console.log(response)
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
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
      const token = localStorage.getItem('accessToken');
      const tokenWithoutQuotes = token?.replace(/"/g, '') || '';
      const config = {
        headers: {
          Authorization: `Bearer ${tokenWithoutQuotes}`,
        },
      };
      await axios.delete(`${API_URL}/employee/${id}`, config);
      fetchAccounts();
      showSnack('Employee deleted successfully!');
    } catch (error) {
      console.error('Error deleting employee:', error);
      showSnack('Error deleting employee.');
    }
  };
const handleResetPassword = async (id) => {
  try {
    const token = localStorage.getItem('accessToken');
    const tokenWithoutQuotes = token?.replace(/"/g, '') || '';
    const config = {
      headers: {
        Authorization: `Bearer ${tokenWithoutQuotes}`,
      },
    };
    await axios.post(`${API_URL}/employee/${id}/reset-password`, {}, config);
    showSnack("Password reset email sent!");
    fetchAccounts(); // refresh list so resetStatus updates
  } catch (error) {
    console.error("Error resetting password:", error);
    showSnack("Error resetting password.");
  }
};

const handleViewProfile = (employee) => {
  navigate(`/employee-profile/${employee.id}`, { state: { employee } });
};

const handleEdit = (employee) => {
  navigate(`/employee-update/${employee.id}`, { state: { employee } });
};

  const filteredAccounts = Array.isArray(accounts)
    ? accounts.filter((account) =>
        (account.cin?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
        (account.lastname?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
        (account.firstname?.toLowerCase() || '').includes(searchText.toLowerCase())
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
        <Typography variant="h4" fontWeight="bold">Employees List</Typography>
      </Box>

      {/* Bouton à gauche et barre de recherche à droite */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
  {/* Barre de recherche à gauche */}
  <TextField
    placeholder="Search by ID, Last Name or First Name"
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

  {/* Boutons à droite */}
  <Box display="flex" gap={2}>
    {/* Add Account direct */}
    <Button
      variant="contained"
      color="primary"
      startIcon={<AddIcon />}
      onClick={() => window.location.href = '/add-account'}
    >
      Add Account
    </Button>

    {/* Management menu */}
    <Button
      variant="outlined"
      endIcon={<ArrowDropDownIcon />}
      onClick={handleOpenManagementMenu}
    >
      Management
    </Button>

    <Menu
      anchorEl={managementAnchorEl}
      open={Boolean(managementAnchorEl)}
      onClose={handleCloseManagementMenu}
    >
      <MenuItem onClick={() => handleRedirect('/insurrance-list')}>
        Insurance Management
      </MenuItem>
      <MenuItem onClick={() => handleRedirect('/DepartmentList')}>
        Department Management
      </MenuItem>
      <MenuItem onClick={() => handleRedirect('/contractTypeList')}>
        Contract Management
      </MenuItem>
    </Menu>
  </Box>
</Box>


      {/* Table ou loader */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}><CircularProgress size={60} /></Box>
      ) : filteredAccounts.length === 0 ? (
        <Typography align="center">No accounts found.</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>ID Number</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Last Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>First Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAccounts
                  .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
                  .map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.id}</TableCell>
                      <TableCell>{account.cin}</TableCell>
                      <TableCell>{account.lastname}</TableCell>
                      <TableCell>{account.firstname}</TableCell>
                      <TableCell>{account.role}</TableCell>
                      <TableCell>
                        <IconButton color="error" onClick={() => handleDelete(account.id)}>
                          <DeleteIcon />
                        </IconButton>
                       <IconButton color="primary" onClick={() => handleViewProfile(account)}>
  <VisibilityIcon />
</IconButton>
<IconButton color="secondary" onClick={() => handleEdit(account)}>
  <EditIcon />
</IconButton>
<IconButton
  color="warning"
  disabled={account.resetStatus === "SUCCESS"} // ✅ disabled si SUCCESS
  onClick={() => handleResetPassword(account.id)}
>
  <RestartAltIcon />
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
            count={filteredAccounts.length}
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

export default EmployeeListPage;
