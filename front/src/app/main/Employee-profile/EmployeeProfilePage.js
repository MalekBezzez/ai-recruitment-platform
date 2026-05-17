import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Avatar,
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Card,
  CardContent,
  Chip,
  Divider,
  Snackbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BusinessIcon from '@mui/icons-material/Business';
import MuiAlert from '@mui/material/Alert';

const EmployeeProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [managerName, setManagerName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, msg: '', severity: 'error' });
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Batch API calls
        const [empResponse, photoResponse] = await Promise.all([
          axios.get(`${API_URL}/employee/${id}`, config),
          axios.get(`${API_URL}/photos/user/${id}`, {
            ...config,
            responseType: 'blob',
          }).catch(() => null), // Handle missing photo gracefully
        ]);

        const emp = empResponse.data;
        setEmployee(emp);

        // Cache photo in local storage
        if (photoResponse?.data) {
          const photoUrl = URL.createObjectURL(photoResponse.data);
          setPhotoUrl(photoUrl);
          localStorage.setItem(`photo_${id}`, photoUrl); // Cache for future use
        } else {
          const cachedPhoto = localStorage.getItem(`African_Codesphoto_${id}`);
          if (cachedPhoto) setPhotoUrl(cachedPhoto);
        }

        // Fetch manager if managerId exists
        if (emp.managerId) {
          const cachedManager = localStorage.getItem(`manager_${emp.managerId}`);
          if (cachedManager) {
            setManagerName(cachedManager);
          } else {
            const { data: mgr } = await axios.get(
              `${API_URL}/employee/${emp.managerId}`,
              config
            );
            const managerFullName = `${mgr.firstname} ${mgr.lastname}`;
            setManagerName(managerFullName);
            localStorage.setItem(`manager_${emp.managerId}`, managerFullName); // Cache manager name
          }
        }
      } catch (e) {
        console.error('Error fetching data:', e);
        setError('Impossible de charger les données');
        setSnackbar({
          open: true,
          msg: e.response?.data?.message || 'Failed to load employee data',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Function to get diploma color based on type
  const getDiplomaColor = (type) => {
    const colors = {
      Master: 'primary',
      Bachelor: 'secondary',
      PhD: 'success',
      Licence: 'info',
      Doctorat: 'success',
      Ingénieur: 'warning',
    };
    return colors[type] || 'default';
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!employee) return <Typography>Employé non trouvé</Typography>;

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Grid container spacing={4}>
        {/* Photo & Summary */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: 'sticky', top: 20, textAlign: 'center' }}>
            <IconButton onClick={() => setOpenPhotoDialog(true)}>
              <Avatar
                src={photoUrl}
                alt={`${employee.firstname} ${employee.lastname}`}
                sx={{
                  width: 200,
                  height: 200,
                  fontSize: '4rem',
                  border: '3px solid',
                  borderColor: 'primary.main',
                  mb: 2,
                }}
              >
                {employee.firstname?.[0]}{employee.lastname?.[0]}
              </Avatar>
            </IconButton>
            <Typography variant="h4">
              {employee.firstname} {employee.lastname}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              {employee.jobTitle}
            </Typography>
            <Typography variant="body2" paragraph>
              {employee.role}
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setShowAdditionalInfo((f) => !f)}
              sx={{ mb: 2 }}
            >
              {showAdditionalInfo ? 'Infos Pro' : 'Infos Perso'}
            </Button>
           
          </Box>
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={8} sx={{ mt: { xs: 2, md: 8 } }}>
          {showAdditionalInfo ? (
            <>
              <Typography variant="h5" gutterBottom>
                Personal Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Birth Date:</strong>{' '}
                    {employee.birthDate
                      ? new Date(employee.birthDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Birth Place:</strong> {employee.birthPlace || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>CIN:</strong> {employee.cin || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Nationality:</strong> {employee.nationality || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Gender:</strong> {employee.gender || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Marital Status:</strong> {employee.martialStatus || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    <strong>Address:</strong> {employee.personalAddress || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Bank Account:</strong> {employee.bankAccountNumber || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Social Security:</strong> {employee.socialSecurityCode || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Insurance Group:</strong> {employee.insuranceGroupName || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Contract Type:</strong> {employee.contractTypeName || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Department:</strong> {employee.departmentName || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>

              {/* Diplomas Section */}
              {employee.diplomas && employee.diplomas.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h5" component="h2">
                      Formation & Diplômes
                    </Typography>
                  </Box>
                  <Grid container spacing={3}>
                    {employee.diplomas.map((diploma, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Card
                          elevation={2}
                          sx={{
                            height: '100%',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              elevation: 4,
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                mb: 2,
                              }}
                            >
                              <Chip
                                label={diploma.diplomeType}
                                color={getDiplomaColor(diploma.diplomeType)}
                                variant="filled"
                                size="small"
                                sx={{ fontWeight: 'bold' }}
                              />
                              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {diploma.diplomaYear || 'N/A'}
                                </Typography>
                              </Box>
                            </Box>
                            <Typography
                              variant="h6"
                              component="h3"
                              sx={{
                                mb: 1,
                                fontWeight: 600,
                                color: 'primary.main',
                                lineHeight: 1.3,
                              }}
                            >
                              {diploma.speciality || 'N/A'}
                            </Typography>
                            <Divider sx={{ my: 1.5 }} />
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <BusinessIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'text.secondary',
                                  fontStyle: 'italic',
                                  fontWeight: 500,
                                }}
                              >
                                {diploma.institution || 'N/A'}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary" align="center">
                      <strong>{employee.diplomas.length}</strong> diplôme
                      {employee.diplomas.length > 1 ? 's' : ''} obtenu
                      {employee.diplomas.length > 1 ? 's' : ''}
                    </Typography>
                  </Box>
                </Box>
              )}
            </>
          ) : (
            <>
              <Typography variant="h5" gutterBottom>
                Professional Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Email:</strong> {employee.email || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Professional Email:</strong> {employee.professionalemail || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Phone:</strong> {employee.personalPhone || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Work Phone:</strong> {employee.mobilePhone || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Workplace:</strong> {employee.workplace || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Seniority:</strong> {employee.seniority || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Salary:</strong> {employee.salary || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Manager:</strong> {managerName || 'None'}
                  </Typography>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>

      {/* Photo Lightbox */}
      <Dialog open={openPhotoDialog} onClose={() => setOpenPhotoDialog(false)} maxWidth="md">
        <IconButton
          onClick={() => setOpenPhotoDialog(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'common.white',
            bgcolor: 'rgba(0,0,0,0.5)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ p: 0 }}>
          {photoUrl ? (
            <img src={photoUrl} alt="Employee" style={{ width: '100%', height: 'auto' }} />
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography>No photo</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Snackbar for errors */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.msg}
        </MuiAlert>
      </Snackbar>
    </Paper>
  );
};

export default EmployeeProfilePage;