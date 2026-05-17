import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, List, ListItem, ListItemText, ListItemIcon,
  Divider, Grid, Alert
} from '@mui/material';
import { Button } from '@mui/material';
import {
  Work as WorkIcon, Schedule as ScheduleIcon, School as SchoolIcon, Business as BusinessIcon,
  AttachMoney as AttachMoneyIcon, People as PeopleIcon, Event as EventIcon, EventAvailable as EventAvailableIcon,
  LocationOn as LocationIcon, AssignmentInd as AssignmentIndIcon
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';

import Snackbar from '@mui/material/Snackbar';

const API_URL = process.env.REACT_APP_API_URL;

const OfferDetails = () => {

  // Recently 28/08 

  // Snackbar state
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






  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [inProcess, setInProcess] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';

  useEffect(() => {
     axios.get(`${API_URL}/api/offers/details/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    params: {
      t: Date.now() // Empêche le cache côté navigateur/proxy
    }
  })
      .then(res => {
        setOffer(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch offer details:', err);
      });

    axios.get(`${API_URL}/api/workflowjoboffer/in-process/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setInProcess(res.data.inProcess);
      })
      .catch(err => {
        console.error('Failed to check offer process status:', err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (!offer || loading) {
    return <Typography sx={{ p: 5 }}>Loading...</Typography>;
  }

  const handleSendRequest = () => {
    axios.post(`${API_URL}/api/workflowjoboffer/start/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        //alert('Workflow started successfully!');
        showSnack('Workflow started successfully!', 'info');
        navigate('/offers-process');
      })
      .catch(err => {
        console.error('Error starting workflow:', err);
        //alert('Failed to start workflow.');
        showSnack('Failed to start workflow.', 'info');
      });
  };

  const handleEdit = (id) => {
    navigate(`/edit-joboffer/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      axios.delete(`${API_URL}/api/offers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(() => {
          console.log("Offer successfully deleted!");
          navigate('/my-offers');
        })
        .catch(error => {
          console.error("Error while deleting the offer:", error);
        });
    }
  };

  return (
    <Box sx={{ p: 4.5 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          mb: 2,
          maxWidth: 1650,
          mx: 'auto',
        }}
      >
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

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            disabled={inProcess}
            onClick={!inProcess ? () => handleEdit(id) : undefined}
          >
            Update
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={inProcess}
            onClick={!inProcess ? () => handleDelete(id) : undefined}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={inProcess}
            onClick={!inProcess ? () => handleSendRequest() : undefined}
          >
            Send Request
          </Button>
        </Stack>
      </Box>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, maxWidth: 1650, mx: 'auto', alignItems: 'center' }}>
        <Box sx={{ mb: 2 }}>
          <Typography className="mt-10 text-4xl font-extrabold tracking-tight leading-tight">
            {offer.jobTitle}
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <WorkIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Department" secondary={offer.departmentName} />
            </ListItem>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AssignmentIndIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Contract Type" secondary={offer.contractName} />
            </ListItem>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <LocationIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Work Mode" secondary={offer.workModeName} />
            </ListItem>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AttachMoneyIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Salary" 
                secondary={`${offer.salary.toLocaleString()} ${offer.currencyName ?? ''}/month`} />
            </ListItem>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              Position Details
            </Typography>

            <List dense>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <ScheduleIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Experience Required" secondary={`${offer.yearsOfExp} years`} />
              </ListItem>

              <ListItem>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <SchoolIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Education"
                  secondary={
                    offer.diplomaName && offer.diplomaSpeciality
                      ? `${offer.diplomaName} in ${offer.diplomaSpeciality}`
                      : "Not specified"
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <BusinessIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Project/Client" secondary={offer.projectOrClient} />
              </ListItem>

              <ListItem>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <PeopleIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Positions" secondary={offer.numberOfPos} />
              </ListItem>
            </List>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                Important Dates
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <EventIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Starting Date"
                    secondary={new Date(offer.startingDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <EventAvailableIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Offer Expires"
                    secondary={new Date(offer.expirationDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  />
                </ListItem>
              </List>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              Position Description
            </Typography>

            {offer.sections && Object.entries(offer.sections).map(([title, content]) => (
              <Box key={title} sx={{ 
                mb: 3,
                borderLeft: '3px solid',
                borderColor: 'primary.main',
                pl: 2,
                backgroundColor: 'background.paper',
                borderRadius: 1,
                p: 2
              }}>
                <Typography variant="h6" color="primary" sx={{ mb: 1.5, fontWeight: 600 }}>
                  {title}
                </Typography>
                <Typography 
                  component="div"
                  variant="body1"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.8,
                    fontFamily: 'inherit',
                    '& .bullet-item': {
                      display: 'flex',
                      alignItems: 'flex-start',
                      mb: 1
                    },
                    '& .bullet': {
                      color: 'primary.main',
                      mr: 1.5,
                      mt: '2px'
                    }
                  }}
                >
                  {content.split('\n').map((line, i) => (
                    <div key={i} className={line.startsWith('- ') ? 'bullet-item' : ''}>
                      {line.startsWith('- ') && <span className="bullet">•</span>}
                      <span>{line.startsWith('- ') ? line.substring(2) : line}</span>
                    </div>
                  ))}
                </Typography>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default OfferDetails;