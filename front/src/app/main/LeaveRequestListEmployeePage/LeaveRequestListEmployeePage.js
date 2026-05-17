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
  TextField,
  InputAdornment,
  TablePagination,
  CircularProgress,
  Typography,
  Button,
  IconButton,
  Box,
  Select,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const LeaveRequestListEmployeePage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token?.replace(/"/g, '')}`,
        },
      };
      const response = await axios.get(`${API_URL}/leave-requests`, config);
      setRequests(response.data || []);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      setRequests([]);
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
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('accessToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token?.replace(/"/g, '')}`,
        },
      };
      await axios.patch(
        `${API_URL}/leave-requests/${id}/status`,
        { status: newStatus },
        config
      );
      fetchLeaveRequests();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/leave-request-details/${id}`);
  };

  const handleCreateRequest = () => {
    navigate('/create-leave-request');
  };

  const filteredRequests = requests.filter((request) =>
    request.employeeName?.toLowerCase().includes(searchText.toLowerCase()) ||
    request.type?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <h1>Leave Requests</h1>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          placeholder="Search by Employee or Type"
          value={searchText}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          style={{ width: 300 }}
        />
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateRequest}
        >
          New Request
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : filteredRequests.length === 0 ? (
        <Typography>No leave requests found.</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Employee</TableCell>
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
                      <TableCell>{request.employeeName}</TableCell>
                      <TableCell>{format(new Date(request.startDate), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{format(new Date(request.endDate), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>
                        <Select
                          value={request.status}
                          onChange={(e) => handleStatusChange(request.id, e.target.value)}
                          size="small"
                          sx={{ minWidth: 120 }}
                        >
                          <MenuItem value="PENDING">Pending</MenuItem>
                          <MenuItem value="APPROVED">Approved</MenuItem>
                          <MenuItem value="REJECTED">Rejected</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(request.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          color="primary"
                          onClick={() => handleViewDetails(request.id)}
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
            count={filteredRequests.length}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </div>
  );
};

export default LeaveRequestListEmployeePage;