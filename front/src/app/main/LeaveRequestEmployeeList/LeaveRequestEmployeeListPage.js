import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TableContainer,
  Table,Chip ,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TextField,
  InputAdornment,
  TablePagination,
  CircularProgress,
  Typography,
  Button,
  IconButton,Snackbar,
  Box,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const LeaveRequestListEmployeePage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
const token = (localStorage.getItem('accessToken') || '').replace(/"/g, '');
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

const API_URL = process.env.REACT_APP_API_URL; 
  useEffect(() => {
    fetchLeaveRequests();
  }, []);
const userRole = JSON.parse(localStorage.getItem('user'))?.user?.role;

 const fetchLeaveRequests = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem('accessToken');
    const userData = JSON.parse(localStorage.getItem('user'));
    const employeeId = userData?.user?.id;

    const response = await axios.get(
      `${API_URL}/leave-requests/employee/${employeeId}`,
      {
        headers: {
          Authorization: `Bearer ${token?.replace(/"/g, '')}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        params: {
          t: Date.now(), // empêche le cache navigateur/proxy
        },
      }
    );

    setRequests(response.data || []);
    console.log("Fetched requests:", response.data);

  } catch (error) {
    console.error('Error fetching leave requests by employee:', error);
    setError('Failed to load leave requests.');
  } finally {
    setLoading(false);
  }
};


  const handleSearch = (event) => {
    setSearchText(event.target.value);
    setCurrentPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        const token = localStorage.getItem('accessToken');
        const config = {
          headers: {
            Authorization: `Bearer ${token?.replace(/"/g, '')}`,
          },
        };
        await axios.delete(`${API_URL}/leave-requests/${id}`, config);
        fetchLeaveRequests();
      } catch (error) {
        console.error('Error deleting request:', error);
        setError('Failed to delete request.');
      }
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/LeaveRequestDetail/${id}`);
  };

  const handleCreateRequest = () => {
    navigate('/addLeaveRequest');
  };

  const filteredRequests = requests.filter((request) => {
    const employeeName = `${request.employee?.firstName || ''} ${request.employee?.lastName || ''}`.toLowerCase();
    const type = request.leaveType?.toLowerCase() || '';
    return (
      employeeName.includes(searchText.toLowerCase()) ||
      type.includes(searchText.toLowerCase())
    );
  });

  return (
    <Paper
      elevation={0}
      sx={{ backgroundColor: 'transparent', px: 10, py: 3 }}
    >
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
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
  <Typography variant="h4" fontWeight="bold">Leave Requests</Typography>
</Box>

<Box
  display="flex"
  justifyContent="space-between"
  alignItems="center"
  flexWrap="wrap"
  gap={2}
  mb={3}
>
  {/* Partie gauche : Barre de recherche */}
  <TextField
    placeholder="Search by Employee or Type"
    value={searchText}
    onChange={handleSearch}
    size="small"
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon color="primary" />
        </InputAdornment>
      ),
    }}
    sx={{ width: 300 }}
  />

  {/* Partie droite : Boutons */}
  <Box display="flex" gap={2} flexWrap="wrap">
 {userRole === 'RH' && (
     <Button
      variant="outlined"
      color="primary"
      onClick={() => navigate('/leavetypeslist')}
    >
      Leave Type List
    </Button>
     )}
    {(userRole === 'RH' || userRole === 'MANAGER') && (
  <Button
    variant="outlined"
    color="primary"
    onClick={() => {
      if (userRole === 'RH') {
        navigate('/demande-conge-listrh');
      } else if (userRole === 'MANAGER') {
        navigate('/demande-conge-list');
      }
    }}
  >
    Requests Leave
  </Button>
)}

    {userRole === 'RH' && (
  <Button
    variant="outlined"
    color="primary"
    onClick={() => navigate('/validatedleaves')}
  >
    Historique
  </Button>
)}

{userRole === 'MANAGER' && (
  <Button
    variant="outlined"
    color="primary"
    onClick={() => navigate('/historicLeaveManager')}
  >
    Historique
  </Button>
)}

    <Button
      variant="outlined"
      color="primary"
      startIcon={<AddIcon />}
      onClick={handleCreateRequest}
    >
      New Request
    </Button>
  </Box>
</Box>


      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress size={60} thickness={4} color="primary" />
        </Box>
      ) : filteredRequests.length === 0 ? (
        <Typography variant="h6" color="textSecondary" align="center" mt={5}>
          No leave requests found.
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests
                  .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
                  .map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.id}</TableCell>
                      <TableCell>{format(new Date(request.startDate), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{format(new Date(request.endDate), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{request.leaveTypeName}</TableCell>
                      <TableCell>{request.status || "Pending for Approval"}</TableCell>
                      <TableCell>
                        <IconButton color="error" onClick={() => handleDelete(request.id)}>
                          <DeleteIcon />
                        </IconButton>
                        <IconButton color="primary" onClick={() => handleViewDetails(request.id)}>
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
            count={filteredRequests.length}
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

export default LeaveRequestListEmployeePage;