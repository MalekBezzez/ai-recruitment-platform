import React, { useEffect, useState } from 'react';
import {
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
  Paper, TextField, InputAdornment, TablePagination, CircularProgress,
  Typography, Box, IconButton, Alert, Tooltip 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import VisibilityIcon from '@mui/icons-material/Visibility';

const LeaveRequestListPagerh = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  console.log('API_URL:', API_URL);
  // --- extrait une seule fois
  const raw = JSON.parse(localStorage.getItem('user')) || {};
  const userId = raw.user?.id;
  const role = raw.user?.role;
  const token = (localStorage.getItem('accessToken') || '').replace(/"/g, '');

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      setLoading(true);
      try {
        // si tu veux filtrer par rôle RH
        if (role !== 'RH') {
          setError('Access denied: RH only');
          return;
        }

        const resp = await axios.get(
          `${API_URL}/conge/taches/rh`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const formatted = (resp.data || []).map(r => ({
          ...r,
          // construis un nom d'employé comme tu veux
          employeeName: `${r.employeeFirstName} ${r.employeeLastName}`,
          formattedStartDate: r.dateDebut ? dayjs(r.dateDebut).format('DD/MM/YYYY') : '',
          formattedEndDate: r.dateFin ? dayjs(r.dateFin).format('DD/MM/YYYY') : '',
          formattedCreateDate: r.createTime ? dayjs(r.createTime).format('DD/MM/YYYY HH:mm') : ''
        }));

        setLeaveRequests(formatted);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, [role, token, userId]); // dépendances primitives

  const handleSearch = e => {
    setSearchText(e.target.value);
    setPage(0);
  };

  const filtered = leaveRequests.filter(r =>
    String(r.employeId).includes(searchText.toLowerCase()) ||
    r.typeConge?.toLowerCase().includes(searchText.toLowerCase())
  );

  const getChipColor = type => {
    switch (type) {
      case 'Maladie': return 'error';
      case 'Annuel': return 'success';
      default: return 'default';
    }
  };

  return (
    <Paper elevation={0} sx={{ background: 'transparent', p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Leave Requests to Validate (HR)</Typography>
        <TextField
          size="small"
          placeholder="Search by ID or leave type"
          value={searchText}
          onChange={handleSearch}
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

      {loading
        ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        )
        : filtered.length === 0
          ? (
            <Typography variant="h6" align="center" color="textSecondary" mt={5}>
              {leaveRequests.length === 0
                ? "No leave requests to validate"
                : "No results found"}
            </Typography>
          )
          : (
            <>
              <TableContainer component={Paper} sx={{ mb: 2, borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Leave Type</TableCell>
                      <TableCell>Period</TableCell>
                      <TableCell>Request Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map(r => (
                        <TableRow key={r.id} hover>
                          <TableCell>{r.employeeName}</TableCell>
                          <TableCell>
                            {r.typeConge}
                          </TableCell>
                          <TableCell>
                            {r.formattedStartDate} – {r.formattedEndDate}
                          </TableCell>
                          <TableCell>{r.formattedCreateDate}</TableCell>
                          <TableCell>
                            <Tooltip title="View request" arrow></Tooltip>
                            <IconButton
                              color="primary"
                              onClick={() => navigate(`/decision/${r.id}`)}
                              aria-label="View request"
                            ><VisibilityIcon /> </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={e => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </>
          )}
    </Paper>
  );
};

export default LeaveRequestListPagerh;
