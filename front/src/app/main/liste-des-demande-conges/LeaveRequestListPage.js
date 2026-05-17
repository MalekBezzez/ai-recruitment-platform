import React, { useEffect, useState } from 'react';
import {
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
  Paper, TextField, InputAdornment, TablePagination,
  CircularProgress, Typography, IconButton, Box, Alert, Tooltip 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import dayjs from 'dayjs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';

const LeaveRequestListPage = () => {
  const navigate = useNavigate();

  const raw = JSON.parse(localStorage.getItem('user')) || {};
  const userId = raw.user?.id;
  const role = raw.user?.role;
  const token = (localStorage.getItem('accessToken') || '').replace(/"/g, '');
  const API_URL = process.env.REACT_APP_API_URL;

  console.log('API_URL:', API_URL);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        if (role !== 'MANAGER') {
          setError('Access denied: managers only.');
          return;
        }
        if (!token) {
          setError('Session expired. Please log in again.');
          return;
        }

        const response = await axios.get(
          `${API_URL}/conge/taches/manager?managerId=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const formatted = (response.data || []).map(r => ({
          id: r.id,
          employeeName: `${r.employeeFirstName} ${r.employeeLastName}`,
          leaveType: r.typeConge,
          formattedStartDate: r.dateDebut
            ? dayjs(r.dateDebut).format('DD/MM/YYYY') : '',
          formattedEndDate: r.dateFin
            ? dayjs(r.dateFin).format('DD/MM/YYYY') : '',
          formattedCreateDate: r.createTime
            ? dayjs(r.createTime).format('DD/MM/YYYY HH:mm') : ''
        }));

        setRequests(formatted);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || 'An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [role, token, userId]);

  const filtered = requests.filter(r =>
    r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
    r.leaveType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Paper elevation={0} sx={{ backgroundColor: 'transparent', px: 10, py: 3 }}>
      {/* Titre centré */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Leave Requests to Validate
        </Typography>
      </Box>

      {/* Barre de recherche à gauche */}
      <Box display="flex" justifyContent="flex-start" alignItems="center" mb={3}>
        <TextField
          size="small"
          placeholder="Search by employee or leave type"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(0);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          sx={{ width: 300 }}
        />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Table ou loader */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress size={60} />
        </Box>
      ) : filtered.length === 0 ? (
        <Typography align="center">
          {requests.length === 0
            ? "No leave requests to validate."
            : "No results found for your search."}
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Leave Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Period</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Request Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(r => (
                    <TableRow key={r.id}>
                      <TableCell>{r.employeeName}</TableCell>
                      <TableCell>{r.leaveType}</TableCell>
                      <TableCell>{r.formattedStartDate} – {r.formattedEndDate}</TableCell>
                      <TableCell>{r.formattedCreateDate}</TableCell>
                      <TableCell>
                        <Tooltip title="View request" arrow></Tooltip>

                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/decision/${r.id}`)}
                          aria-label="View request"
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
            count={filtered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={e => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </>
      )}
    </Paper>
  );
};

export default LeaveRequestListPage;