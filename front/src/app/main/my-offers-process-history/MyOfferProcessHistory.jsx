import React, { useState,useEffect } from 'react';
import {
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, TextField, InputAdornment,
  TablePagination, CircularProgress, Typography, IconButton, Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const MyOfferProcessHistory = () => {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');

  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
  const ownerId = 1; // ID statique pour l'instant

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/workflowjoboffer/history/owner/${ownerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setProcesses(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des tâches historiques :", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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

  const handleViewDetails = (processInstanceId) => {
    console.log("View details for process:", processInstanceId);
  };

  const filteredProcesses = processes.filter((proc) =>
    proc.processInstanceId?.toLowerCase().includes(searchText.toLowerCase()) ||
    proc.taskName?.toLowerCase().includes(searchText.toLowerCase()) ||
    proc.jobOfferName?.toLowerCase().includes(searchText.toLowerCase()) ||
    proc.decision?.toLowerCase().includes(searchText.toLowerCase()) ||
    proc.comment?.toLowerCase().includes(searchText.toLowerCase()) ||
    proc.completedByName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const pageCount = Math.ceil(filteredProcesses.length / rowsPerPage);
  const adjustedPage = pageCount > 0 ? Math.min(currentPage, pageCount - 1) : 0;

  return (
    <Paper elevation={0} sx={{ backgroundColor: 'transparent', px: 10, py: 0 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
          My Offer Process History
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          placeholder="Search process"
          value={searchText}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            width: 350,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            }
          }}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress size={60} thickness={4} color="primary" />
        </Box>
      ) : filteredProcesses.length === 0 ? (
        <Typography variant="h6" color="textSecondary" align="center" mt={5}>
          No process history found.
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{
            borderRadius: 2,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
            '&:hover': { boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.12)' },
            transition: 'box-shadow 0.3s ease-in-out',
          }}>
            <Table sx={{ '& .MuiTableCell-root': { height: '73px' } }}>
              <TableHead>
                <TableRow sx={{
                  '& th': {
                    fontSize: '1.3rem',
                    fontWeight: '500',
                    py: 3,
                    borderBottom: '2px solid rgba(0, 0, 0, 0.12)'
                  }
                }}>
                  <TableCell>Process Instance ID</TableCell>
                  <TableCell>Task Name</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                  <TableCell>Job Offer Name</TableCell>
                  <TableCell>Decision</TableCell>
                  <TableCell>Comment</TableCell>
                  <TableCell>Completed By Name</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProcesses
                  .slice(adjustedPage * rowsPerPage, adjustedPage * rowsPerPage + rowsPerPage)
                  .map((proc) => (
                    <TableRow key={proc.processInstanceId} hover sx={{
                      '&:hover': { backgroundColor: 'action.hover' },
                      '&:last-child td': { borderBottom: 0 },
                      '& td': { borderBottom: '1px solid rgba(0, 0, 0, 0.08)', py: 3 }
                    }}>
                      <TableCell>{proc.processInstanceId}</TableCell>
                      <TableCell>{proc.taskName}</TableCell>
                      <TableCell>{proc.startTime}</TableCell>
                      <TableCell>{proc.endTime}</TableCell>
                      <TableCell>{proc.jobOfferName}</TableCell>
                      <TableCell>{proc.decision}</TableCell>
                      <TableCell>{proc.comment}</TableCell>
                      <TableCell>{proc.completedByName}</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleViewDetails(proc.processInstanceId)} sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                            color: 'primary.dark'
                          }
                        }}>
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
            count={filteredProcesses.length}
            rowsPerPage={rowsPerPage}
            page={adjustedPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              '& .MuiTablePagination-toolbar': { padding: 2 },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontSize: '1.3rem',
              }
            }}
          />
        </>
      )}
    </Paper>
  );
};

export default MyOfferProcessHistory;
