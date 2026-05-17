import React, { useState, useEffect } from 'react';
import {
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper,
  TextField, InputAdornment, TablePagination, CircularProgress, Typography,
  IconButton, Box, FormControl, InputLabel, MenuItem, Select, Drawer, Button, Divider,
  List, ListItem, ListItemText, Grid, Stack, Dialog,
  DialogTitle, DialogContent, DialogActions,Alert
} from '@mui/material';
import ScoreBar from '../../components/ScoreBar';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FilterListIcon from '@mui/icons-material/FilterList';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/en-gb';
import TableSortLabel from '@mui/material/TableSortLabel';
import dayjs from 'dayjs';
import Snackbar from '@mui/material/Snackbar';


const ApplicationsList = () => {

//recently 28/08

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


  const API_URL = process.env.REACT_APP_API_URL;
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');
  const [selectedApplicationScores, setSelectedApplicationScores] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dateSort, setDateSort] = useState('desc');
  const [scoreSort, setScoreSort] = useState('desc');
  const navigate = useNavigate();

  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [applicantNameFilter, setApplicantNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [applicationStatusFilter, setapplicationStatusFilter] = useState('');
  const [applicationTypeFilter, setApplicationTypeFilter] = useState('');
  const [jobTitleFilter, setJobTitleFilter] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minScore, setMinScore] = useState(null);

  const [rejectionEmailDialog, setRejectionEmailDialog] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(null);

  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';

  const [emailData, setEmailData] = useState({
    recipient: '',
    subject: '',
    content: ''
  });

  const [emailDialog, setEmailDialog] = useState({
    open: false,
    type: null,
    title: '',
    buttonText: '',
    buttonColor: 'primary'
  });

  const { id } = useParams();
  const isSpecific = !!id;
  const [jobTitle, setJobTitle] = useState('');
  const [loadingTitle, setLoadingTitle] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (isSpecific) {
        setLoadingTitle(true);
        try {
          const jobTitleResponse = await axios.get(`${API_URL}/api/offers/${id}/title`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setJobTitle(jobTitleResponse.data);
        } catch (error) {
          console.error('Error fetching job title', error);
          setJobTitle('Title not available');
        } finally {
          setLoadingTitle(false);
        }

        try {
          const response = await axios.get(`${API_URL}/api/applications/joboffer/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setApplications(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération des candidatures spécifiques', error);
        } finally {
          setLoading(false);
        }
      } else {
        try {
          const response = await axios.get(`${API_URL}/api/applications/all`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setApplications(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération des candidatures générales', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [isSpecific, id, token]);

  const handleSearch = (event) => {
    setSearchText(event.target.value.toLowerCase());
    setCurrentPage(0);
  };

  const handleChangeStatus = (applicationId, newStatus) => {
   // Sauvegarde de l'ancien état
  const prevApplications = [...applications];

  // Mise à jour optimiste
  setApplications(applications.map(app =>
    app.applicationId === applicationId ? { ...app, status: newStatus } : app
  ));

  axios.put(`${API_URL}/api/applications/${applicationId}/status`, { status: newStatus }, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(() => {
      showSnack(`Status updated to "${newStatus}"`, 'success');
      if (newStatus === 'Interview') {
        navigate(`/schedule-interview/${applicationId}`);
      }
    })
    .catch(error => {
      console.error('Erreur lors de la mise à jour du statut :', error);
      // Restaurer l'ancien état
      setApplications(prevApplications);
      showSnack("Failed to update the application status.", "error");
    });
    
  };
// --- Email sending stubs (to implement) ---
const sendRejectionEmail = async (applicationId, emailData) => {
  // TODO: implement API call for rejection email
};

const sendAcceptanceEmail = async (applicationId, emailData) => {
  // TODO: implement API call for acceptance email
};

  const getAvailableStatusOptions = (currentStatus) => {
    switch (currentStatus) {
      case 'Pending':
        return ['Rejected', 'Interview'];
      case 'Interview':
        return ['Accepted', 'Rejected'];
      case 'Rejected':
      case 'Accepted':
        return [];
      default:
        return [];
    }
  };

  const handleViewCV = async (applicationId) => {
  const url = `${API_URL}/api/applications/${applicationId}/cv`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob', // important pour récupérer un fichier binaire
    });

    // créer un URL pour le blob avec le type PDF
    const fileUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));

    // ouvrir dans un nouvel onglet
    window.open(fileUrl, '_blank');

  } catch (error) {
    console.error("Erreur lors de la récupération du CV:", error);
    //alert("Impossible de récupérer le CV");
    showSnack("Unable to retrieve the CV", "info");

  }
};

  const handleOpenDrawer = async (application) => {
    try {
      const response = await axios.get(`${API_URL}/api/applications/score-details/${application.applicationId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const scoreDetails = response.data;
      setSelectedApplicationScores(scoreDetails);
      setDrawerOpen(true);
    } catch (error) {
      console.error("Erreur lors du chargement des détails :", error);
    }
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedApplicationScores(null);
  };

  const filteredApplications = applications
    .filter((app) => {
      const matchesSearch = app.fullName.toLowerCase().includes(searchText) ||
        app.email.toLowerCase().includes(searchText);
      return matchesSearch;
    })
    .sort((a, b) => {
      if (scoreSort !== 'none') {
        const scoreDiff = b.matchingScore - a.matchingScore;
        if (scoreSort === 'desc') return scoreDiff;
        if (scoreSort === 'asc') return -scoreDiff;
      }
      const dateA = new Date(a.postulationDate);
      const dateB = new Date(b.postulationDate);
      return dateSort === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const pagedApplications = filteredApplications.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  const handleResetFilters = () => {
    setApplicantNameFilter('');
    setJobTitleFilter('');
    setPhoneFilter('');
    setEmailFilter('');
    setApplicationTypeFilter('');
    setStartDate(null);
    setEndDate(null);
    setMinScore(null);
    setSearchText('');
  };

  const handleApplyFilters = async () => {
    try {
      const filterPayload = {
        fullName: applicantNameFilter,
        applicationStatus: applicationStatusFilter, // <-- Ajouté ici
        email: emailFilter,
        mobilePhone: phoneFilter,
        jobTitle: jobTitleFilter,
        applicationType: applicationTypeFilter,
        startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
        endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
        minScore: minScore !== null ? minScore : null,
      };

      if (isSpecific) {
        filterPayload.jobOfferId = parseInt(id);
      }

      const url = isSpecific
        ? `${API_URL}/api/applications/filter-by-offer`
        : `${API_URL}/api/applications/filter`;

      const response = await axios.post(url, filterPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplications(response.data);
      setCurrentPage(0);
    } catch (err) {
      console.error('Erreur lors de l’application du filtre :', err);
      //alert('Erreur lors de l’application du filtre');
      showSnack('Error applying the filter', 'info');
    }
  };

  const handleSortClick = () => {
    setDateSort(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleScoreSortClick = () => {
    setScoreSort(prev => (prev === 'desc' ? 'asc' : 'desc'));
  };

  return (
    <Paper elevation={0} sx={{ backgroundColor: 'transparent', px: 10, py: 0 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} mb={1}>
        <Typography className="text-4xl font-extrabold tracking-tight leading-tight">
          {isSpecific
            ? (loadingTitle ? 'Loading...' : `Applications: ${jobTitle}`)
            : 'Job Applications'}
        </Typography>
        <Box display="flex" gap={2}></Box>
      </Box>

      <Grid container spacing={2} alignItems="center" justifyContent="space-between" mb={2}></Grid>
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
      
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


        <Box display="flex" mb={-4} alignItems="center" gap={1}>
          <FilterListIcon fontSize="medium" sx={{ color: 'text.primary' }} />
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Button variant="contained" color="primary" size="medium" onClick={() => navigate('/interviews-list')}>
            All Interviews
          </Button>
          <Box sx={{ width: '1px', height: '32px', backgroundColor: '#ccc', mx: 2 }} />
          <Button variant="contained" color="primary" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
          <Button variant="outlined" color="primary" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mt: 2, mb: 2, borderColor: '#E0E0E0' }} />

      <Box display="flex" flexWrap="wrap" gap={3} mb={3} columnGap={3} rowGap={2} alignItems="flex-start">
        {isSpecific ? (
          <>
            <TextField
              label="Applicant Name"
              size="small"
              sx={{ width: 220 }}
              value={applicantNameFilter}
              onChange={e => setApplicantNameFilter(e.target.value)}
            />
            <TextField
              label="Phone"
              size="small"
              sx={{ width: 220 }}
              value={phoneFilter}
              onChange={e => setPhoneFilter(e.target.value)}
            />
            <TextField
              label="Email"
              size="small"
              sx={{ width: 220 }}
              value={emailFilter}
              onChange={e => setEmailFilter(e.target.value)}
            />
            {showMoreFilters && (
              <>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{ textField: { size: 'small', sx: { width: 220 } } }}
                  />
                  <DesktopDatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{ textField: { size: 'small', sx: { width: 220 } } }}
                  />
                </LocalizationProvider>
                <FormControl size="small" sx={{ minWidth: 220 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={applicationStatusFilter}
                    label="Status"
                    onChange={(e) => setapplicationStatusFilter(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Interview">Interview</MenuItem>
                    <MenuItem value="Accepted">Accepted</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Minimum Score"
                  type="number"
                  size="small"
                  sx={{ width: 220 }}
                  value={minScore ?? ''}
                  onChange={e => setMinScore(e.target.value ? parseFloat(e.target.value) : null)}
                  inputProps={{ min: 0, max: 100 }}
                />
              </>
            )}
          </>
        ) : (
          <>
            <TextField
              label="Applicant Name"
              size="small"
              sx={{ width: 220 }}
              value={applicantNameFilter}
              onChange={e => setApplicantNameFilter(e.target.value)}
            />
            <TextField
              label="Job Title"
              size="small"
              sx={{ width: 220 }}
              value={jobTitleFilter}
              onChange={e => setJobTitleFilter(e.target.value)}
            />
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel>Application Type</InputLabel>
              <Select
                value={applicationTypeFilter}
                label="Application Type"
                onChange={(e) => setApplicationTypeFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="By offer">By offer</MenuItem>
                <MenuItem value="Spontaneous">Spontaneous</MenuItem>
              </Select>
            </FormControl>
            {showMoreFilters && (
              <>
                <TextField
                  label="Phone"
                  size="small"
                  sx={{ width: 220 }}
                  value={phoneFilter}
                  onChange={e => setPhoneFilter(e.target.value)}
                />
                <TextField
                  label="Email"
                  size="small"
                  sx={{ width: 220 }}
                  value={emailFilter}
                  onChange={e => setEmailFilter(e.target.value)}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{ textField: { size: 'small', sx: { width: 220 } } }}
                  />
                  <DesktopDatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{ textField: { size: 'small', sx: { width: 220 } } }}
                  />
                </LocalizationProvider>
                <FormControl size="small" sx={{ minWidth: 220 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={applicationStatusFilter}
                    label="Status"
                    onChange={(e) => setapplicationStatusFilter(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Interview">Interview</MenuItem>
                    <MenuItem value="Accepted">Accepted</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Minimum Score"
                  type="number"
                  size="small"
                  sx={{ width: 220 }}
                  value={minScore ?? ''}
                  onChange={e => setMinScore(e.target.value ? parseFloat(e.target.value) : null)}
                  inputProps={{ min: 0, max: 100 }}
                />
              </>
            )}
          </>
        )}
        <Button
          size="small"
          variant="contained"
          color="primary"
          endIcon={showMoreFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={() => setShowMoreFilters(prev => !prev)}
          sx={{ alignSelf: 'flex-end', minWidth: 160, height: 40, mt: 'auto' }}
        >
          {showMoreFilters ? 'Hide Filters' : 'More Filters'}
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{
            borderRadius: 2,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
            '&:hover': {
              boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.12)',
            },
            transition: 'box-shadow 0.3s ease-in-out',
          }}>
            <Table>
              <TableHead sx={{
                '& th': {
                  fontSize: '1.5rem',
                  fontWeight: '500',
                  py: 3,
                  borderBottom: '2px solid rgba(0, 0, 0, 0.12)'
                }
              }}>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  {!isSpecific && <TableCell>Job Title</TableCell>}
                  {!isSpecific && <TableCell>Application Type</TableCell>}
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>CV File</TableCell>
                  <TableCell sortDirection={dateSort === 'desc' ? 'desc' : 'asc'}>
                    <TableSortLabel
                      active={true}
                      direction={dateSort}
                      onClick={() => handleSortClick()}
                    >
                      Postulation Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={scoreSort === 'desc' ? 'desc' : 'asc'}>
                    <TableSortLabel
                      active={scoreSort !== 'none'}
                      direction={scoreSort}
                      onClick={handleScoreSortClick}
                    >
                      Matching Score
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Interview Details</TableCell>
                  <TableCell>Application Status</TableCell>
                  <TableCell>Score Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedApplications.map((app) => (
                  <TableRow key={app.applicationId}>
                    <TableCell>{app.fullName}</TableCell>
                    {!isSpecific && <TableCell>{app.jobTitle}</TableCell>}
                    {!isSpecific && <TableCell>{app.applicationType}</TableCell>}
                    <TableCell>{app.phone}</TableCell>
                    <TableCell>{app.email}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleViewCV(app.applicationId)} variant="outlined" size="small">
                        View CV
                      </Button>
                    </TableCell>
                    <TableCell>{app.postulationDate}</TableCell>
                    <TableCell>{Math.round(app.matchingScore * 100)}%</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => navigate(`/interviews-list/${app.applicationId}`)}
                        variant="outlined"
                        size="small"
                        disabled={app.status === "Pending"} 
                      >
                        Details
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={app.status}
                        onChange={(e) => handleChangeStatus(app.applicationId, e.target.value)}
                        size="small"
                      >
                        <MenuItem value={app.status} disabled>
                          {app.status}
                        </MenuItem>
                        {getAvailableStatusOptions(app.status).map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDrawer(app)}>
                        <InfoIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredApplications.length}
            page={currentPage}
            onPageChange={(e, newPage) => setCurrentPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
          />

          <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
            <Box sx={{ width: 560, p: 3 }}>
              <Typography variant="h6">Score Details</Typography>
              {selectedApplicationScores && (
                <Box mt={2}>
                  <Box mt={4}>
                    <Typography variant="h6" gutterBottom>Matching Scores:</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <ScoreBar label="Final Score" value={Math.round(selectedApplicationScores.finalScore * 100)} />
                    <ScoreBar label="Skill Match" value={Math.round(selectedApplicationScores.skillsScore * 100)} />
                    <ScoreBar label="Experience Match" value={Math.round(selectedApplicationScores.experienceScore * 100)} />
                    <ScoreBar label="Education Match" value={Math.round(selectedApplicationScores.educationScore * 100)} />
                    <ScoreBar label="Language Match" value={Math.round(selectedApplicationScores.languageScore * 100)} />
                    <ScoreBar label="Certification Match" value={Math.round(selectedApplicationScores.certificationScore * 100)} />
                    <Box mt={2}>
                      <Typography variant="subtitle2" fontWeight="bold">Color Legend :</Typography>
                      <Box display="flex" gap={4} mt={1}>
                        <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
                          <Box width={30} height={10} bgcolor="#f44336" borderRadius={1} />
                          <Typography variant="caption">0–50%</Typography>
                        </Box>
                        <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
                          <Box width={30} height={10} bgcolor="#ff9800" borderRadius={1} />
                          <Typography variant="caption">50–75%</Typography>
                        </Box>
                        <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
                          <Box width={30} height={10} bgcolor="#4caf50" borderRadius={1} />
                          <Typography variant="caption">75–100%</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  {selectedApplicationScores.justification && (
                    <Box mt={4}>
                      <Typography mt={2}><strong>Justification:</strong></Typography>
                      <Typography variant="body1" whiteSpace="pre-line">
                        {selectedApplicationScores.justification}
                      </Typography>
                    </Box>
                  )}
                  <Box mt={4}>
                    <Typography variant="h6" gutterBottom>Extracted CV Data:</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography><strong>Skills:</strong></Typography>
                    <List dense>
                      {(selectedApplicationScores.skills || []).map((skill, applicationIdx) => (
                        <ListItem key={applicationIdx} sx={{ py: 0 }}>
                          <ListItemText primary={`- ${skill}`} />
                        </ListItem>
                      ))}
                    </List>
                    <Typography mt={2}><strong>Education:</strong></Typography>
                    <List dense>
                      {(selectedApplicationScores.educations || []).map((edu, applicationIdx) => {
                        const fields = edu.split('\n');
                        return (
                          <ListItem key={applicationIdx} alignItems="flex-start">
                            <ListItemText
                              primary={
                                <Box ml={1}>
                                  {fields.map((line, i) => {
                                    const [label, ...valueParts] = line.split(':');
                                    const value = valueParts.join(':').trim();
                                    return (
                                      <Typography key={i} variant="body2">
                                        <strong>{label.trim()}:</strong> {value}
                                      </Typography>
                                    );
                                  })}
                                </Box>
                              }
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                    <Typography mt={2}><strong>Experience:</strong></Typography>
                    <List dense>
                      {(selectedApplicationScores.experiences || []).map((exp, applicationIdx) => {
                        const fields = exp.split('\n');
                        return (
                          <ListItem key={applicationIdx} alignItems="flex-start">
                            <ListItemText
                              primary={
                                <Box ml={1}>
                                  {fields.map((line, i) => {
                                    const [label, ...valueParts] = line.split(':');
                                    const value = valueParts.join(':').trim();
                                    return (
                                      <Typography key={i} variant="body2">
                                        <strong>{label.trim()}:</strong> {value}
                                      </Typography>
                                    );
                                  })}
                                </Box>
                              }
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                    <Typography mt={2}><strong>Language:</strong></Typography>
                    <List dense>
                      {(selectedApplicationScores.languages || []).map((language, applicationIdx) => (
                        <ListItem key={applicationIdx} sx={{ py: 0 }}>
                          <ListItemText primary={`- ${language}`} />
                        </ListItem>
                      ))}
                    </List>
                    <Typography mt={2}><strong>Certifications:</strong></Typography>
                    <List dense>
                      {(selectedApplicationScores.certifications || []).map((cert, applicationIdx) => {
                        const fields = cert.split('\n');
                        return (
                          <ListItem key={applicationIdx} alignItems="flex-start">
                            <ListItemText
                              primary={
                                <Box ml={1}>
                                  {fields.map((line, i) => {
                                    const [label, ...valueParts] = line.split(':');
                                    const value = valueParts.join(':').trim();
                                    return (
                                      <Typography key={i} variant="body2">
                                        <strong>{label.trim()}:</strong> {value}
                                      </Typography>
                                    );
                                  })}
                                </Box>
                              }
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                    {(selectedApplicationScores.links || []).length > 0 && (
                      <>
                        <Typography mt={2}><strong>Links:</strong></Typography>
                        <List dense>
                          {selectedApplicationScores.links.map((link, applicationIdx) => (
                            <ListItem key={applicationIdx} sx={{ py: 0 }}>
                              <ListItemText primary={`- ${link}`} />
                            </ListItem>
                          ))}
                        </List>
                      </>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Drawer>

          <Dialog open={emailDialog.open} onClose={() => setEmailDialog({ ...emailDialog, open: false })} maxWidth="md" fullWidth>
            <DialogTitle>{emailDialog.title}</DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 0 }}>
                <TextField
                  label="Recipient"
                  fullWidth
                  value={emailData.recipient}
                  onChange={(e) => setEmailData({ ...emailData, recipient: e.target.value })}
                  margin="normal"
                />
                <TextField
                  label="Subject"
                  fullWidth
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  margin="normal"
                />
                <TextField
                  label="Email Content"
                  fullWidth
                  multiline
                  rows={17}
                  value={emailData.content}
                  onChange={(e) => setEmailData({ ...emailData, content: e.target.value })}
                  margin="normal"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEmailDialog({ ...emailDialog, open: false })}>Cancel</Button>
              <Button
                variant="contained"
                color={emailDialog.buttonColor}
                onClick={() => {
                  if (emailDialog.type === 'rejected') {
                    sendRejectionEmail(currentApplication.applicationId, emailData);
                  } else {
                    sendAcceptanceEmail(currentApplication.applicationId, emailData);
                  }
                  setEmailDialog({ ...emailDialog, open: false });
                }}
              >
                {emailDialog.buttonText}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Paper>
  );
};

export default ApplicationsList;