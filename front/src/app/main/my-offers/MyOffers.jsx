import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, TextField, InputAdornment,
  TablePagination, Typography, IconButton, Box, Chip, Button, Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import PublishIcon from '@mui/icons-material/Publish';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



//recently 
import { useLocation } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const MyOffers = ({ userRole = "Manager" }) => {

  //recently 
  const [loading, setLoading] = useState(true); // Ajout de l'état de chargement
  const [error, setError] = useState(null); // Ajout de l'état d'erreur
  const location = useLocation();
const queryParams = new URLSearchParams(location.search);
let refresh = queryParams.get('refresh');
//
console.log("this your refresh Value at this moment ", refresh);

  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const isRH = userRole === "RH";
  const isManager = userRole === "Manager";

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
    const fetchData = async () => {
      try {
        console.log('useEffect déclenché - location.search:', location.search);
        if (!userId || !token) {
          console.warn('userId ou token manquant');
          setError('Veuillez vous connecter pour voir vos offres');
          setLoading(false);
          return;
        }

        setLoading(true);
        const response = await axios.get(`${API_URL}/api/offers/created-by/${userId}`, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  params: {
    t: Date.now() // optionnel : évite tout cache côté proxy ou navigateur
  }
});
        setOffers(response.data);
        console.log('Requête réussie:', response.data);
        
      } catch (err) {
        console.error('Erreur lors du chargement des offres:', err);
        setError('Erreur lors du chargement des offres');
      } finally {
        setLoading(false); // Toujours mettre à jour l'état de chargement
      }
    };

    fetchData();
  }, [location.search, userId, token]);

  // Réinitialiser au démontage
  // Réinitialiser au démontage
  useEffect(() => {
    return () => {
      console.log('Composant démonté');
      setOffers([]);
      setLoading(true);
      setError(null);
    };
  }, []);



 



  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleManageCurrencies = () => {
    navigate(`/currency-list`);
    handleCloseMenu();
  };

  const handleManageDiplomas = () => {
    handleCloseMenu();
  };

  const handleManageContracts = () => {
    handleCloseMenu();
  };

  const handleManageDepartments = () => {
    handleCloseMenu();
  };

  const handleManageWorkArrangements = () => {
    handleCloseMenu();
  };

  const handlePublish = (id) => {
    setOffers(offers.map(offer => 
      offer.id === id ? { 
        ...offer, 
        status: "Publié", 
        publishDate: new Date().toLocaleDateString('fr-FR') 
      } : offer
    ));
  };

  const handleEdit = (id) => {
    navigate(`/edit-joboffer/${id}`);
  };

  const handleDetails = (id) => {
    navigate(`/offer-details/${id}`);
  };

  /*
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      axios.delete(`${API_URL}/api/offers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(() => {
          setOffers(offers.filter(offer => offer.id !== id));
          console.log("Offer successfully deleted!");
        })
        .catch(error => {
          console.error("Error while deleting the offer:", error);
        });
    }
  };
  */


  const handleDelete = (id) => {
  axios.delete(`${API_URL}/api/offers/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(() => {
    setOffers(offers.filter(offer => offer.id !== id));
    console.log("Offer successfully deleted!");
  })
  .catch((error) => {
    console.error("Error while deleting the offer:", error);
  });
};
  
  const filteredOffers = offers.filter(offer => 
    offer.jobTitle.toLowerCase().includes(searchText.toLowerCase()) ||
    offer.departmentName.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case "Publié": return "success";
      case "Pending": return "warning";
      case "Archivé": return "error";
      default: return "default";
    }
  };

  const handleAddJobOffer = () => {
    navigate('/add-joboffer');
  };

  const handleMyRequests = () => {
    navigate('/my-requests');
  };

  const handleRequestsToProcess = () => {
    navigate('/my-tasks');
  };

useEffect(() => {
  console.log('État offers après setOffers:', offers);
}, [offers]);


useEffect(() => {
  console.log('filteredOffers:', filteredOffers, 'searchText:', searchText, 'page:', page);
}, [filteredOffers, searchText, page]);

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
        px: 10,
        py: 0,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
          Job Offer Management
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          placeholder="Search by title or department"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
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

        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddJobOffer}
          >
            Add Job Offer
          </Button>

          <Button variant="contained" color="primary" onClick={handleMyRequests}>
            My Job Offers in Progress
          </Button>

          <Button variant="contained" color="primary" onClick={handleRequestsToProcess}>
Job Offers to Validate
          </Button>
        </Stack>
      </Box>

      <TableContainer 
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.12)',
          },
          transition: 'box-shadow 0.3s ease-in-out',
        }}
      >
        <Table sx={{
          '& .MuiTableCell-root': {
            height: '73px',
          }
        }}>
          <TableHead>
            <TableRow sx={{ 
              '& th': {
                fontSize: '1.5rem',
                fontWeight: '500',
                py: 3,
                borderBottom: '2px solid rgba(0, 0, 0, 0.12)'
              }
            }}>
              <TableCell>Reference</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Contract</TableCell>
              {isRH && <TableCell>CreatedBy</TableCell>}
              <TableCell>Creation Date</TableCell>
              <TableCell>Starting Date</TableCell>
              <TableCell>Expired</TableCell>
              {isRH && <TableCell>Publish Date</TableCell>}
              <TableCell>Request Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOffers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((offer) => (
                <TableRow 
                  key={offer.id}
                  hover
                  sx={{ 
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    '&:last-child td': {
                      borderBottom: 0,
                    },
                    '& td': {
                      borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                      py: 3
                    }
                  }}
                >
                  <TableCell sx={{ fontWeight: 500 }}>{offer.reference}</TableCell>
                  <TableCell>{offer.jobTitle}</TableCell>
                  <TableCell>{offer.departmentName}</TableCell>
                  <TableCell>{offer.contractName}</TableCell>
                  {isRH && <TableCell>{offer.createdBy}</TableCell>}
                  <TableCell>
  {offer.creationDate
    
    ||  '-'}
</TableCell>
                  <TableCell>
                    {offer.startingDate}
                  </TableCell>
                  
                  <TableCell>
  <Chip
    label={new Date(offer.expirationDate) < new Date() ? 'Expired' : 'Active'}
    color={new Date(offer.expirationDate) < new Date() ? 'error' : 'success'}
    variant="outlined"
    size="small"
  />
</TableCell>

                  {isRH && (
                    <TableCell>
                      {offer.publishDate || '-'}
                    </TableCell>
                  )}

                  <TableCell>
  {offer.requestDate  
    || '-'}
</TableCell>


                  

                  <TableCell>
  {offer.status || '-'}
</TableCell>


                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton
                        color="primary"
                        onClick={() => handleDetails(offer.id)}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                            color: 'primary.dark'
                          }
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>

                      {isRH && offer.status !== "Publié" && (
                        <IconButton
                          color="success"
                          onClick={() => handlePublish(offer.id)}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(76, 175, 80, 0.08)',
                              color: 'success.dark'
                            }
                          }}
                        >
                          <PublishIcon />
                        </IconButton>
                      )}

                      {isManager && !offer.inProcess && (
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(offer.id)}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(244, 67, 54, 0.08)',
                              color: 'error.dark'
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
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
        count={filteredOffers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        sx={{
          '& .MuiTablePagination-toolbar': {
            padding: 2,
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: '1.3rem',
          }
        }}
      />
    </Paper>
  );
};

export default MyOffers;