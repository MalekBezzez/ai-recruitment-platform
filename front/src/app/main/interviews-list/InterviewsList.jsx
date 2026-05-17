import React, { useState, useEffect } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Box, TextField, InputAdornment, IconButton, TablePagination, Button, Modal,
  Select, MenuItem, FormControl, InputLabel, Link, Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import PeopleIcon from '@mui/icons-material/People';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FilterListIcon from '@mui/icons-material/FilterList';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import 'dayjs/locale/en-gb';
dayjs.locale('en-gb');

const API_URL = process.env.REACT_APP_API_URL;

const InterviewsList = () => {
  const [interviews, setInterviews] = useState([]);
  const [planningInfo, setPlanningInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const isSpecific = !!id;
  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';

  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [applicantNameFilter, setApplicantNameFilter] = useState('');
  const [jobTitleFilter, setJobTitleFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [interviewerFilter, setInterviewerFilter] = useState('');
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [applicationTypeFilter, setApplicationTypeFilter] = useState('');
  const [isApplicantNameLocked, setIsApplicantNameLocked] = useState(false);
  const [isJobTitleLocked, setIsJobTitleLocked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isSpecific) {
          const planningResponse = await axios.get(`${API_URL}/api/applications/planning-info/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setPlanningInfo(planningResponse.data);
          setApplicantNameFilter(planningResponse.data.applicantFullName || '');
          setJobTitleFilter(planningResponse.data.jobOfferTitle || '');
          setIsApplicantNameLocked(true);
          setIsJobTitleLocked(true);

          const interviewsResponse = await axios.get(`${API_URL}/api/interviews/by-application/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setInterviews(interviewsResponse.data);
        } else {
          const response = await axios.get(`${API_URL}/api/interviews/details`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setInterviews(response.data);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des interviews:', err);
        setError('Erreur lors du chargement des interviews');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isSpecific, token]);

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [selectedInterviewers, setSelectedInterviewers] = useState([]);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const navigate = useNavigate();

  const handleOpenModal = (interviewers) => {
    setSelectedInterviewers(interviewers);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedInterviewers([]);
  };

  const handleOpenStatusModal = (interview) => {
    setSelectedInterview(interview);
    setNewStatus('');
    setOpenStatusModal(true);
  };

  const handleCloseStatusModal = () => {
    setOpenStatusModal(false);
    setSelectedInterview(null);
    setNewStatus('');
  };

  const handleUpdateStatus = async () => {
    if (!selectedInterview || !newStatus) return;
    
    await axios.put(
      `${API_URL}/api/interviews/${selectedInterview.id}/status`,
      { label: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    );

    setInterviews(prev =>
      prev.map(i => i.id === selectedInterview.id ? { ...i, status: newStatus } : i)
    );
    handleCloseStatusModal();
  };

  const filtered = interviews.filter(i => {
    const titleMatch = i.title.toLowerCase().includes(titleFilter.toLowerCase());
    const text = searchText.toLowerCase();
    const dateStr = dayjs(i.scheduledDate).format('DD/MM/YYYY HH:mm').toLowerCase();
    const interviewerNames = i.interviewers.map(int => int.fullName.toLowerCase()).join(' ');
    return (
      titleMatch &&
      (i.title.toLowerCase().includes(text) ||
        dateStr.includes(text) ||
        i.room.toLowerCase().includes(text) ||
        interviewerNames.includes(text))
    );
  });

  const handleReschedule = (interviewId) => {
    navigate(`/schedule-interview/edit/${interviewId}`);
  };

  const handleScheduleClick = () => {
    navigate(`/schedule-interview/${id}`);
  };

  const handleApplyFilters = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/interviews/filter`,
        {
          applicantName: applicantNameFilter,
          jobTitle: jobTitleFilter,
          phone: phoneFilter,
          email: emailFilter,
          room: roomFilter,
          interviewer: interviewerFilter,
          startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
          endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
          status: statusFilter,
          title: titleFilter,
          applicationType: isSpecific ? null : applicationTypeFilter,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setInterviews(response.data);
      setPage(0);
    } catch (err) {
      console.error('Erreur lors de l’application du filtre :', err);
      setError('Erreur lors de l’application du filtre');
    }
  };

  const handleResetFilters = () => {
    if (!isApplicantNameLocked) setApplicantNameFilter('');
    if (!isJobTitleLocked) setJobTitleFilter('');
    if (!isSpecific) setApplicationTypeFilter('');
    setPhoneFilter('');
    setEmailFilter('');
    setRoomFilter('');
    setInterviewerFilter('');
    setStartDate(null);
    setEndDate(null);
    setStatusFilter('');
    setTitleFilter('');
  };

  return (
    <Paper elevation={0} sx={{ backgroundColor: 'transparent', px: 10, py: 0 }}>
      <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight" mb={1}>
        Interviews Management
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={5}></Box>
      </Box>

      <Box mb={1} mt={-3} display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" mb={-4} alignItems="center">
          <FilterListIcon fontSize="medium" sx={{ color: 'text.primary' }} />
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          {isSpecific && (
            <Button
              variant="contained"
              color="primary"
              size="medium"
              startIcon={<CalendarTodayIcon />}
              onClick={handleScheduleClick}
            >
              Schedule Interview
            </Button>
          )}
          {isSpecific && (
            <Box
              sx={{
                width: '1px',
                height: '32px',
                backgroundColor: '#ccc',
                mx: 2,
              }}
            />
          )}
          <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            onClick={handleResetFilters}
          >
            Reset Filters
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mt: 2, mb: 2, borderColor: '#E0E0E0' }} />

      <Box display="flex" flexWrap="wrap" gap={3} mb={3} columnGap={3} rowGap={2} alignItems="flex-start">
        <TextField
          label="Applicant Name"
          size="small"
          sx={{ width: 220 }}
          value={applicantNameFilter}
          onChange={e => setApplicantNameFilter(e.target.value)}
          disabled={isApplicantNameLocked}
        />
        <TextField
          label="Job Title"
          size="small"
          sx={{ width: 220 }}
          value={jobTitleFilter}
          onChange={e => setJobTitleFilter(e.target.value)}
          disabled={isJobTitleLocked}
        />
        {!isSpecific && (
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
        )}
        <TextField
          label="Phone"
          size="small"
          sx={{ width: 220 }}
          value={phoneFilter}
          onChange={e => setPhoneFilter(e.target.value)}
        />
        {showMoreFilters && (
          <>
            <TextField
              label="Email"
              size="small"
              sx={{ width: 220 }}
              value={emailFilter}
              onChange={e => setEmailFilter(e.target.value)}
            />
            <TextField
              label="Interview Title"
              size="small"
              sx={{ width: 220 }}
              value={titleFilter}
              onChange={e => setTitleFilter(e.target.value)}
            />
            <TextField
              label="Room"
              size="small"
              sx={{ width: 220 }}
              value={roomFilter}
              onChange={e => setRoomFilter(e.target.value)}
            />
            <TextField
              label="Interviewer"
              size="small"
              sx={{ width: 220 }}
              value={interviewerFilter}
              onChange={e => setInterviewerFilter(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: { width: 220 },
                  },
                }}
              />
              <DesktopDatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: { width: 220 },
                  },
                }}
              />
            </LocalizationProvider>
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Candidate absent">Candidate absent</MenuItem>
                <MenuItem value="Internal cancelled">Internal cancelled</MenuItem>
              </Select>
            </FormControl>
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { fontSize: '1.2rem', fontWeight: '600' } }}>
              {!isSpecific && <TableCell>Applicant</TableCell>}
              {!isSpecific && <TableCell>Job Title</TableCell>}
              {!isSpecific && <TableCell>Application Type</TableCell>}
              {!isSpecific && <TableCell>Contacts</TableCell>}
              <TableCell>Interview Title</TableCell>
              <TableCell>Scheduled Date</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Meeting Link</TableCell>
              <TableCell>Interviewers</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((interview) => (
                <TableRow key={interview.id}>
                  {!isSpecific && <TableCell>{interview.applicantName}</TableCell>}
                  {!isSpecific && <TableCell>{interview.jobTitle}</TableCell>}
                  {!isSpecific && <TableCell>{interview.applicationType}</TableCell>}
                  {!isSpecific && (
                    <TableCell>
                      <Tooltip
                        title={
                          <>
                            <Typography variant="body2">
                              <strong>Email:</strong> {interview.applicantEmail}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Phone:</strong> {interview.applicantPhone}
                            </Typography>
                          </>
                        }
                        arrow
                        placement="top"
                      >
                        <IconButton>
                          <InfoIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                  <TableCell>{interview.title}</TableCell>
                  <TableCell>{dayjs(interview.scheduledDate).format('DD/MM/YYYY HH:mm')}</TableCell>
                  <TableCell>{interview.duration} min</TableCell>
                  <TableCell>{interview.room}</TableCell>
                  <TableCell>
                    {interview.meetingLink ? (
                      <Link href={interview.meetingLink} target="_blank" underline="hover" color="primary">
                        Open Link
                      </Link>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Not available
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<PeopleIcon />}
                      onClick={() => handleOpenModal(interview.interviewers)}
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell>{interview.status}</TableCell>
                  <TableCell sx={{ width: 370, maxWidth: 370 }}>
                    <Button
                      size="small"
                      color="primary"
                      startIcon={<AutorenewIcon />}
                      onClick={() => handleReschedule(interview.id)}
                      sx={{ textTransform: 'none', mr: 1 }}
                      disabled={interview.status === 'Completed'}
                      title={interview.status === 'Completed' ? 'Cannot reschedule a completed interview' : 'Reschedule interview'}
                    >
                      Reschedule
                    </Button>
                    <Button
                      size="small"
                      color="secondary"
                      startIcon={<ChangeCircleIcon />}
                      onClick={() => handleOpenStatusModal(interview)}
                      sx={{ textTransform: 'none' }}
                      disabled={interview.status === 'Completed'}
                      title={interview.status === 'Completed' ? 'Cannot change status of a completed interview' : 'Change interview status'}
                    >
                      Change Status
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="flex-end">
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Box>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 4,
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Interviewers
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Employee Full Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedInterviewers.map((interviewer, index) => (
                  <TableRow key={index}>
                    <TableCell>{interviewer.fullName}</TableCell>
                  </TableRow>
                ))}
                {selectedInterviewers.length === 0 && (
                  <TableRow>
                    <TableCell align="center">
                      No interviewers assigned
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleCloseModal}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={openStatusModal} onClose={handleCloseStatusModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 4
        }}>
          <Typography variant="h6" gutterBottom>Change Interview Status</Typography>
          <Typography sx={{ mb: 2 }}>
            Current status: <strong>{selectedInterview?.status}</strong>
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="status-select-label">New Status</InputLabel>
            <Select
              labelId="status-select-label"
              value={newStatus}
              label="New Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Candidate absent">Candidate absent</MenuItem>
              <MenuItem value="Internal cancelled">Internal cancelled</MenuItem>
            </Select>
          </FormControl>
          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={handleCloseStatusModal}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdateStatus} disabled={!newStatus}>
              Update
            </Button>
          </Box>
        </Box>
      </Modal>
    </Paper>
  );
};

export default InterviewsList;