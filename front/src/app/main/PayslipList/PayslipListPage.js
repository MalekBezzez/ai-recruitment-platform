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
  InputAdornment,Snackbar,Alert,
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

const PayslipListPage = () => {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchPayslips(selectedMonth, selectedYear);
      setErrorMessage('');
    } else if (selectedMonth || selectedYear) {
      setPayslips([]);
      setErrorMessage('Please select both month and year to search payslips.');
    }
  }, [selectedMonth, selectedYear]);
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
  const fetchPayslips = async (month, year) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${API_URL}/payslips?month=${month}&year=${year}`, config);
      const payslipList = response.data || [];

      const enrichedPayslips = await Promise.all(
        payslipList.map(async (p) => {
          let firstName = 'Unknown';
          let lastName = '';
          try {
            const empRes = await axios.get(`${API_URL}/employee/${p.userId}`, config);
            firstName = empRes.data.firstname || 'Unknown';
            lastName = empRes.data.lastname || '';
          } catch (e) {
            console.warn(`Employee not found for userId ${p.userId}`);
          }

          const d = new Date(p.date);
          return {
            ...p,
            firstName,
            lastName,
            month: d.toLocaleString('default', { month: 'short' }),
            year: d.getFullYear().toString(),
            startDate: p.startDate ? new Date(p.startDate).toLocaleDateString() : 'N/A',
            endDate: p.date ? new Date(p.date).toLocaleDateString() : 'N/A',
          };
        })
      );

      setPayslips(enrichedPayslips);
    } catch (error) {
      console.error('Error fetching payslips:', error);
      setPayslips([]);
      setErrorMessage('Failed to fetch payslips.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_URL}/payslips/${id}`, config);
      if (selectedMonth && selectedYear) {
        fetchPayslips(selectedMonth, selectedYear);
      }
      showSnack('Payslip deleted successfully!');
    } catch (error) {
      console.error('Error deleting payslip:', error);
      showSnack('Error deleting payslip.');
    }
  };

  const handleView = (id) => {
    window.location.href = `/payslip-view/${id}`;
  };

  const handleGenerateForAll = async () => {
    if (!selectedMonth || !selectedYear) {
      showSnack('Please select both month and year before generating payslips.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post(
        `${API_URL}/payslips/generate?month=${selectedMonth}&year=${selectedYear}`,
        {},
        config
      );
      showSnack(res.data || 'Payslips generated successfully for the selected month and year.');
      if (selectedMonth && selectedYear) {
        fetchPayslips(selectedMonth, selectedYear);
      }
    } catch (err) {
      console.error('Error generating payslips:', err);
      showSnack(err.response?.data || 'Failed to generate payslips.');
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

  const filteredPayslips = Array.isArray(payslips)
    ? payslips.filter((p) => {
        const search = searchText.toLowerCase();
        return (
          (p.firstName?.toLowerCase() || '').includes(search) ||
          (p.lastName?.toLowerCase() || '').includes(search) ||
          (p.month?.toLowerCase() || '').includes(search) ||
          (p.year?.toLowerCase() || '').includes(search) ||
          (p.startDate?.toLowerCase() || '').includes(search) ||
          (p.endDate?.toLowerCase() || '').includes(search)
        );
      })
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Payslips List</Typography>
      </Box>

      <Box display="flex" gap={2} alignItems="center" mb={2}>
        <TextField
          select
          label=""
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          SelectProps={{ native: true }}
        >
          <option value="">Select Month</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </TextField>

        <TextField
          select
          label=""
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          SelectProps={{ native: true }}
        >
          <option value="">Select Year</option>
          {['2023', '2024', '2025'].map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </TextField>

        <TextField
          placeholder="Search by name "
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
          variant="outlined"
          color="success"
          onClick={handleGenerateForAll}
          disabled={!selectedMonth || !selectedYear}
        >
          Generate Payslips
        </Button>
      </Box>

      {errorMessage && (
        <Typography color="error" mb={2}>{errorMessage}</Typography>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress size={60} />
        </Box>
      ) : filteredPayslips.length === 0 ? (
        <Typography align="center">No payslips found.</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>First Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Last Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Month</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Year</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>End Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Net Salary</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPayslips
                  .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
                  .map((payslip) => (
                    <TableRow key={payslip.payslipId}>
                      <TableCell>{payslip.payslipId}</TableCell>
                      <TableCell>{payslip.firstName}</TableCell>
                      <TableCell>{payslip.lastName}</TableCell>
                      <TableCell>{payslip.month}</TableCell>
                      <TableCell>{payslip.year}</TableCell>
                      <TableCell>{payslip.startDate}</TableCell>
                      <TableCell>{payslip.endDate}</TableCell>
                      <TableCell>{payslip.netSalary?.toFixed(2)} DT</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleView(payslip.payslipId)}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(payslip.payslipId)}>
                          <DeleteIcon />
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
            count={filteredPayslips.length}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage} // Fixed here
          />
        </>
      )}
    </Paper>
  );
};

export default PayslipListPage;