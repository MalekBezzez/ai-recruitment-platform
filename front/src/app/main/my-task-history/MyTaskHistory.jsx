import React, { useState, useEffect } from 'react';
import {
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, TextField, InputAdornment,
  TablePagination, CircularProgress, Typography, IconButton, Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';


const API_URL = process.env.REACT_APP_API_URL;

const MyTaskHistory = () => {
  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
  const [tasks, setTasks] = useState([]);

  let userId = null;
  try {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    if (!user?.user?.id) {
      throw new Error('No valid user found in localStorage');
    }
    userId = user.user.id;
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'ID utilisateur:', err.message);
  }

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/api/workflowjoboffer/history/validator/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des tâches historiques :", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId, token]);

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

  const handleViewDetails = (taskId) => {
    console.log("View details for task:", taskId);
  };

  const filteredTasks = tasks.filter((task) =>
    task.processInstanceId.toLowerCase().includes(searchText.toLowerCase()) ||
    task.taskId.toLowerCase().includes(searchText.toLowerCase()) ||
    task.taskName.toLowerCase().includes(searchText.toLowerCase()) ||
    task.jobOfferName.toLowerCase().includes(searchText.toLowerCase()) ||
    task.ownerName.toLowerCase().includes(searchText.toLowerCase()) ||
    task.decision.toLowerCase().includes(searchText.toLowerCase()) ||
    task.comment.toLowerCase().includes(searchText.toLowerCase())
  );

  const pageCount = Math.ceil(filteredTasks.length / rowsPerPage);
  const adjustedPage = pageCount > 0 ? Math.min(currentPage, pageCount - 1) : 0;
  return (
    <Paper elevation={0} sx={{ backgroundColor: 'transparent', px: 10, py: 0 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
          My Task History
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          placeholder="Search by task name"
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
      ) : filteredTasks.length === 0 ? (
        <Typography variant="h6" color="textSecondary" align="center" mt={5}>
          No task history found.
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
                  <TableCell>Task ID</TableCell>
                  <TableCell>Task Name</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                  <TableCell>Job Offer Name</TableCell>
                  <TableCell>Requester Name</TableCell>
                  <TableCell>Decision</TableCell>
                  <TableCell>Comment</TableCell>
                  
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks
                  .slice(adjustedPage * rowsPerPage, adjustedPage * rowsPerPage + rowsPerPage)
                  .map((task) => (
                    <TableRow key={task.taskId} hover sx={{
                      '&:hover': { backgroundColor: 'action.hover' },
                      '&:last-child td': { borderBottom: 0 },
                      '& td': { borderBottom: '1px solid rgba(0, 0, 0, 0.08)', py: 3 }
                    }}>
                      
                      <TableCell>{task.taskId}</TableCell>
                      <TableCell>{task.taskName}</TableCell>
                      <TableCell>{new Date(task.startTime).toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })}</TableCell>
                      <TableCell>{new Date(task.endTime).toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })}</TableCell>
                      <TableCell>{task.jobOfferName}</TableCell>
                      <TableCell>{task.ownerName}</TableCell>
                      <TableCell>{task.decision}</TableCell>
                      <TableCell>{task.comment}</TableCell>
                      
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredTasks.length}
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

export default MyTaskHistory;
