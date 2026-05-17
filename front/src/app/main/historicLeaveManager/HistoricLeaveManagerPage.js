import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Paper,
  Box,
  Typography,
  TextField,
  InputAdornment,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function ManagerHistoryListPage() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [decisionFilter, setDecisionFilter] = useState('ALL');
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  const translateDecision = dec => {
    if (dec === 'APPROUVER') return 'Approved';
    if (dec === 'REJETER')   return 'Rejected';
    return dec;
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token     = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
      const user      = JSON.parse(localStorage.getItem('user') || '{}');
      const managerId = user?.user?.id;
      if (!managerId) {
        setHistoryData([]);
        return;
      }
      const { data } = await axios.get(
        `${API_URL}/conge/history/manager/${managerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistoryData(data || []);
    } catch (err) {
      console.error(err);
      setHistoryData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange     = e => { setSearchText(e.target.value);    setPage(0); };
  const handleDateFilterChange = e => { setDateFilter(e.target.value);    setPage(0); };
  const handleDecisionChange   = e => { setDecisionFilter(e.target.value); setPage(0); };
  const handleChangePage       = (_, newPage) => { setPage(newPage); };
  const handleChangeRowsPerPage= e => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const filtered = historyData.filter(item => {
    const nameOk = item.requesterName
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const dateOk = !dateFilter || item.startDate === dateFilter;
    const decisionOk =
      decisionFilter === 'ALL' ||
      item.decision === decisionFilter;
    return nameOk && dateOk && decisionOk;
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
      <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" mb={3}>
        <TextField
          size="small"
          placeholder="Search by name"
          value={searchText}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        <TextField
          size="small"
          type="date"
          label="Leave Start"
          value={dateFilter}
          onChange={handleDateFilterChange}
          InputLabelProps={{ shrink: true }}
        />
        <FormControl size="small">
          <InputLabel id="decision-filter-label">Decision</InputLabel>
          <Select
            labelId="decision-filter-label"
            value={decisionFilter}
            label="Decision"
            onChange={handleDecisionChange}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="APPROUVER">Approved</MenuItem>
            <MenuItem value="REJETER">Rejected</MenuItem>
          </Select>
        </FormControl>
        <IconButton onClick={fetchHistory} color="primary">
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
                  <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Leave Start</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Leave End</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Decision</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Validated On</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.requesterName}</TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>
                        {new Date(row.startDate).toLocaleDateString('en-GB')}
                      </TableCell>
                      <TableCell>
                        {new Date(row.endDate).toLocaleDateString('en-GB')}
                      </TableCell>
                      <TableCell>{translateDecision(row.decision)}</TableCell>
                      <TableCell>
                        {row.endTime
                          ? new Date(row.endTime).toLocaleString('en-GB')
                          : '—'}
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
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Paper>
  );
}