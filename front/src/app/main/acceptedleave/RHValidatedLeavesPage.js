import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Paper, Box, Typography, TextField, InputAdornment, TableContainer,
  Table, TableHead, TableBody, TableRow, TableCell, TablePagination,
  CircularProgress, IconButton, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function HistoricLeaveListPage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');
  const [decisionFilter, setDecisionFilter] = useState('ALL');
  const [validationDate, setValidationDate] = useState(null);
  const [taskKeys, setTaskKeys] = useState(['UserTask_ValidationRH']);
  const [decisionVariable, setDecisionVariable] = useState('decisionRH');
const API_URL = process.env.REACT_APP_API_URL;

console.log('API_URL:', API_URL);


  useEffect(() => {
    fetchLeaves();
  }, [taskKeys, decisionVariable]);
  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
      const params = new URLSearchParams();
      taskKeys.forEach(key => params.append('taskKeys', key));
      params.append('decisionVariable', decisionVariable);

      const { data } = await axios.get(
        `${API_URL}/rh-history?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeaves(data || []);
    } catch (err) {
      console.error(err);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(0);
  };

  const handleChangePage = (_, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(0);
  };

  const translateDecision = (dec) => {
    if (dec === 'APPROUVER') return 'Approved';
    if (dec === 'REJETER') return 'Rejected';
    return dec;
  };

  const filtered = leaves.filter((l) => {
    const search = searchText.toLowerCase();
    const fullName = l.requesterName?.toLowerCase() || '';
    const type = l.type?.toLowerCase() || '';

    const hasDecision =
      l.decision && l.decision.trim() !== '' && l.decision !== 'UNKNOWN';
    const matchesDecision =
      decisionFilter === 'ALL' || l.decision === decisionFilter;
    const matchesSearch =
      fullName.includes(search) || type.includes(search);
    const matchesDate = !validationDate || (
      l.endTime &&
      new Date(l.endTime).toDateString() === new Date(validationDate).toDateString()
    );

    return matchesSearch && hasDecision && matchesDecision && matchesDate;
  });

  return (
    <Paper elevation={0} sx={{ backgroundColor: 'transparent', px: 10, py: 3 }}>
      {/* Titre centré */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Leave Validation History
        </Typography>
      </Box>

      {/* Filtres alignés à gauche */}
      <Box display="flex" gap={2} alignItems="center" flexWrap="wrap" mb={3}>
        <TextField
          size="small"
          placeholder="Search by name or type"
          value={searchText}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        <FormControl size="small">
          <InputLabel id="task-key-label">Task</InputLabel>
          <Select
            labelId="task-key-label"
            value={taskKeys[0]}
            label="Task"
            onChange={(e) => setTaskKeys([e.target.value])}
          >
            <MenuItem value="UserTask_ValidationRH">RH Validation</MenuItem>
            <MenuItem value="UserTask_ValidationManager">Manager Validation</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small">
          <InputLabel id="decision-var-label">Decision Var</InputLabel>
          <Select
            labelId="decision-var-label"
            value={decisionVariable}
            label="Decision Var"
            onChange={(e) => setDecisionVariable(e.target.value)}
          >
            <MenuItem value="decisionRH">decisionRH</MenuItem>
            <MenuItem value="decisionManager">decisionManager</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small">
          <InputLabel id="decision-filter-label">Decision</InputLabel>
          <Select
            labelId="decision-filter-label"
            value={decisionFilter}
            label="Decision"
            onChange={(e) => setDecisionFilter(e.target.value)}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="APPROUVER">Approved</MenuItem>
            <MenuItem value="REJETER">Rejected</MenuItem>
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Validation Date"
            value={validationDate}
            onChange={(newDate) => setValidationDate(newDate)}
            slotProps={{ textField: { size: 'small' } }}
          />
        </LocalizationProvider>
        <IconButton color="primary" onClick={fetchLeaves}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Table ou loader */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress size={60} />
        </Box>
      ) : filtered.length === 0 ? (
        <Typography align="center">
          No records found.
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Requester</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>End Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Leave Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Decision</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Validation Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered
                  .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
                  .map((l, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{l.requesterName}</TableCell>
                      <TableCell>{new Date(l.startDate).toLocaleDateString('en-GB')}</TableCell>
                      <TableCell>{new Date(l.endDate).toLocaleDateString('en-GB')}</TableCell>
                      <TableCell>{l.type || '—'}</TableCell>
                      <TableCell>{translateDecision(l.decision)}</TableCell>
                      <TableCell>{l.endTime ? new Date(l.endTime).toLocaleString('en-GB') : '—'}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filtered.length}
            page={currentPage}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Paper>
  );
}