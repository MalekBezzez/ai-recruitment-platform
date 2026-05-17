import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Paper, Typography, Table, TableHead, TableBody, TableCell, TableRow,
  TableContainer, TextField, InputAdornment, Button, CircularProgress
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const EmployeeAndChannelListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [channelSearch, setChannelSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedChannelId, setSelectedChannelId] = useState(null);

  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchEmployees();
    fetchChannels();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/employee/all-employees`, config);
      setEmployees(response.data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannels = async () => {
    try {
      const response = await axios.get(`${API_URL}/channels`, config);
      setChannels(response.data || []);
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.role === 'EMPLOYEE' &&
    (
      emp.firstname?.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      emp.lastname?.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      emp.cin?.toLowerCase().includes(employeeSearch.toLowerCase())
    )
  );

  const filteredChannels = Array.isArray(channels) ? channels.filter(ch =>
  ch.name?.toLowerCase().includes(channelSearch.toLowerCase()) ||
  ch.description?.toLowerCase().includes(channelSearch.toLowerCase())
) : [];

  const handleInsight = async () => {
    try {
      const payload = {
        employeeId: selectedEmployeeId || null,
        channelId: selectedChannelId || null,
        startDate: startDate || null,
        endDate: endDate || null
      };
      const response = await axios.post(`${API_URL}/insight`, payload, config);
      alert(response.data || 'Insight executed');
    } catch (err) {
      console.error('Insight error:', err);
      alert('Error while executing insight');
    }
  };

  const handleEmployeeRowClick = (empId) => {
    setSelectedEmployeeId(prev => (prev === empId ? null : empId));
  };

  const handleChannelRowClick = (chId) => {
    setSelectedChannelId(prev => (prev === chId ? null : chId));
  };

  const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);
  const selectedChannel = channels.find(ch => ch.id === selectedChannelId);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={4}>Link Employee → Channel</Typography>

      <Box display="flex" gap={5} flexWrap="wrap">
        {/* EMPLOYEES */}
        <Box flex={1}>
          <Typography variant="h6">Employees</Typography>

          <TextField
            fullWidth
            placeholder="Search an employee..."
            value={employeeSearch}
            onChange={(e) => setEmployeeSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            }}
            sx={{ mb: 2 }}
          />

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>First Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3}><CircularProgress /></TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((emp) => (
                    <TableRow
                      key={emp.id}
                      hover
                      selected={selectedEmployeeId === emp.id}
                      onClick={() => handleEmployeeRowClick(emp.id)}
                      sx={{ cursor: 'pointer', backgroundColor: selectedEmployeeId === emp.id ? '#e0f7fa' : 'inherit' }}
                    >
                      <TableCell>{emp.id}</TableCell>
                      <TableCell>{emp.lastname}</TableCell>
                      <TableCell>{emp.firstname}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* CHANNELS */}
        <Box flex={1}>
          <Typography variant="h6">Channels</Typography>
          <TextField
            fullWidth
            placeholder="Search a channel..."
            value={channelSearch}
            onChange={(e) => setChannelSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            }}
            sx={{ mb: 2 }}
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredChannels.map((ch) => (
                  <TableRow
                    key={ch.id}
                    hover
                    selected={selectedChannelId === ch.id}
                    onClick={() => handleChannelRowClick(ch.id)}
                    sx={{ cursor: 'pointer', backgroundColor: selectedChannelId === ch.id ? '#f3e5f5' : 'inherit' }}
                  >
                    <TableCell>{ch.id}</TableCell>
                    <TableCell>{ch.name}</TableCell>
                    <TableCell>{ch.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Date Filters */}
      <Box mt={4} display="flex" gap={2} justifyContent="center">
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      {/* Selected Info */}
      {selectedEmployee || selectedChannel ? (
        <Box mt={3} textAlign="center">
          <Typography variant="body1">
            Selected: {selectedEmployee && (<strong>{selectedEmployee.firstname} {selectedEmployee.lastname}</strong>)}
            {selectedEmployee && selectedChannel && ' → '}
            {selectedChannel && (<strong>{selectedChannel.name}</strong>)}
          </Typography>
        </Box>
      ) : null}

      {/* Insight Button */}
      <Box mt={4} textAlign="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleInsight}
        >
          🔎 Run Insight
        </Button>
      </Box>
    </Box>
  );
};

export default EmployeeAndChannelListPage;
