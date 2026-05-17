import React, { useState, useEffect } from 'react';
import {
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, TextField, InputAdornment,
  TablePagination, CircularProgress, Typography, IconButton, Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const OffersProcess = () => {
  const [offerRequests, setOfferRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');
  const [isOwner, setIsOwner] = useState(false);

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

  useEffect(() => {
    const fetchOfferRequests = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/workflowjoboffer/requests/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOfferRequests(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfferRequests();
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

  const handleDetails = (id) => {
    navigate(`/offer-details/${id}`);
  };

  const handleDelete = (jobOfferId) => {
    const updatedList = offerRequests.filter(request => request.jobOfferId !== jobOfferId);
    setOfferRequests(updatedList);
    const newTotalPages = Math.ceil(updatedList.length / rowsPerPage);
    if (currentPage >= newTotalPages) {
      setCurrentPage(Math.max(0, newTotalPages - 1));
    }
  };

  const handleViewDetails = (jobOfferId) => {
    console.log("View details for job offer:", jobOfferId);
  };

  const handleApprove = (jobOfferId) => {
    setOfferRequests(offerRequests.map(request =>
      request.jobOfferId === jobOfferId ? { ...request, statusJobOffer: "Approved" } : request
    ));
  };

  const handleReject = (jobOfferId) => {
    setOfferRequests(offerRequests.map(request =>
      request.jobOfferId === jobOfferId ? { ...request, statusJobOffer: "Rejected" } : request
    ));
  };

  const filteredOfferRequests = offerRequests.filter((request) =>
    request.jobOfferId.toString().includes(searchText) ||
    request.jobOfferName.toLowerCase().includes(searchText.toLowerCase()) ||
    request.statusJobOffer.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "success.main";
      case "Pending": return "warning.main";
      case "Rejected": return "error.main";
      default: return "text.primary";
    }
  };

  const pageCount = Math.ceil(filteredOfferRequests.length / rowsPerPage);
  const adjustedPage = pageCount > 0 ? Math.min(currentPage, pageCount - 1) : 0;

  return (
    <Paper elevation={0} sx={{ backgroundColor: 'transparent', px: 10, py: 0 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
          Job Offer Requests
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          placeholder="Search by ID, Title, or Status"
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
      ) : filteredOfferRequests.length === 0 ? (
        <Typography variant="h6" color="textSecondary" align="center" mt={5}>
          No job offers found.
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
                  <TableCell>Job Offer ID</TableCell>
                  <TableCell>Job Offer Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Previous Comment</TableCell>
                  <TableCell>Current Task</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOfferRequests
                  .slice(adjustedPage * rowsPerPage, adjustedPage * rowsPerPage + rowsPerPage)
                  .map((request) => (
                    <TableRow key={request.jobOfferId} hover sx={{
                      '&:hover': { backgroundColor: 'action.hover' },
                      '&:last-child td': { borderBottom: 0 },
                      '& td': { borderBottom: '1px solid rgba(0, 0, 0, 0.08)', py: 3 }
                    }}>
                      <TableCell sx={{ fontWeight: 500 }}>{request.jobOfferId}</TableCell>
                      <TableCell>{request.jobOfferName}</TableCell>
                      <TableCell sx={{
                        color: getStatusColor(request.statusJobOffer),
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}>
                        {request.statusJobOffer}
                      </TableCell>
                      <TableCell>{request.previousComment || '-'}</TableCell>
                      <TableCell>{request.currentTaskName}</TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          {isOwner && (
                            <IconButton color="error" onClick={() => handleDelete(request.jobOfferId)}>
                              <DeleteIcon />
                            </IconButton>
                          )}
                          <IconButton color="primary" onClick={() => handleDetails(request.jobOfferId)}>
                            <VisibilityIcon />
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
            count={filteredOfferRequests.length}
            rowsPerPage={rowsPerPage}
            page={adjustedPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Paper>
  );
};

export default OffersProcess;