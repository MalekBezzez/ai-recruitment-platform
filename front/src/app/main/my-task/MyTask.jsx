import React, { useState, useEffect } from 'react';
import {
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, TextField, InputAdornment,
  TablePagination, CircularProgress, Typography, IconButton, Box, Dialog, DialogTitle, DialogContent,
  DialogActions, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const MyTask = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';

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

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');

  const [openModal, setOpenModal] = useState(false);
  const [comment, setComment] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [decision, setDecision] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/workflowjoboffer/tasks/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des tâches :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
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

  const handleViewDetails = (offerId) => {
    navigate(`/offer-details/${offerId}`);
  };

  const handleProcessedRequests = () => {
    navigate(`/processed-requests`);
  };

  const handleApprove = (task) => {
    setSelectedTask(task);
    setDecision("APPROVED");
    setOpenModal(true);
  };

  const handleReject = (task) => {
    setSelectedTask(task);
    setDecision("REJECTED");
    setOpenModal(true);
  };

  const handleCompleteTask = async () => {
    if (!selectedTask) return;
    try {
      await axios.post(`${API_URL}/api/workflowjoboffer/tasks/complete`, null, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          taskId: selectedTask.taskId,
          decision,
          comment,
          completedBy: userId
        }
      });

      // Rafraîchir la liste des tâches
      const response = await axios.get(`${API_URL}/api/workflowjoboffer/tasks/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Erreur lors de la soumission de la tâche :', error);
    } finally {
      setOpenModal(false);
      setComment('');
      setSelectedTask(null);
      setDecision('');
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.jobOfferId.toString().includes(searchText.toLowerCase()) ||
    task.jobOfferName.toLowerCase().includes(searchText.toLowerCase()) ||
    task.taskId.toLowerCase().includes(searchText.toLowerCase()) ||
    task.taskName.toLowerCase().includes(searchText.toLowerCase())
  );

  const pageCount = Math.ceil(filteredTasks.length / rowsPerPage);
  const adjustedPage = pageCount > 0 ? Math.min(currentPage, pageCount - 1) : 0;

  return (
    <Paper elevation={0} sx={{ backgroundColor: 'transparent', px: 10, py: 0 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
          My Tasks
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
  {/* Search box à gauche */}
  <TextField
    placeholder="Search by Offer Id, Name or Task"
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

  {/* Button "Processed Requests" à droite */}
  <Button
    variant="contained"
    color="primary"
    onClick={handleProcessedRequests} // tu peux définir cette fonction de navigation
  >
    Processed Job Offers
  </Button>
</Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress size={60} thickness={4} color="primary" />
        </Box>
      ) : filteredTasks.length === 0 ? (
        <Typography variant="h6" color="textSecondary" align="center" mt={5}>
          No tasks found.
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
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    py: 3,
                    borderBottom: '2px solid rgba(0, 0, 0, 0.12)'
                  }
                }}>
                  <TableCell>Job Offer Id</TableCell>
                  <TableCell>Job Offer Name</TableCell>
                  <TableCell>Task Id</TableCell>
                  <TableCell>Task Name</TableCell>
                  <TableCell>Actions</TableCell>
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
                      <TableCell sx={{ fontWeight: 500 }}>{task.jobOfferId}</TableCell>
                      <TableCell>{task.jobOfferName}</TableCell>
                      <TableCell>{task.taskId}</TableCell>
                      <TableCell>{task.taskName}</TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <IconButton color="primary" onClick={() => handleViewDetails(task.jobOfferId)}>
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton color="success" onClick={() => handleApprove(task)}>
                            <CheckIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleReject(task)}>
                            <CloseIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
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

      {/* Modal pour le commentaire */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>{decision} Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comment"
            type="text"
            fullWidth
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCompleteTask} color="primary">
            Complete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default MyTask;
