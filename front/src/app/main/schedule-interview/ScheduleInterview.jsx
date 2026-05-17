import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import enGB from 'date-fns/locale/en-GB';
import {
  Box,
  Typography,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Grid,
  Stack,
  Card,
  CardContent,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const ScheduleInterview = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [sites, setSites] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [interviewersList, setInterviewersList] = useState([]);
  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
  const { applicationId, id } = useParams();
  const isEditMode = !!id;

  const candidate = state?.candidate || {};
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 2);
  defaultDate.setHours(14, 0, 0, 0);
  const now = new Date();

  const [formData, setFormData] = useState({
    title: '',
    datetime: defaultDate,
    duration: 30,
    mode: 'video',
    meetingLink: '',
    interviewers: [],
    site: '',
    room: null,
  });

  const [emailPreviewOpen, setEmailPreviewOpen] = useState(false);
  const [editableEmail, setEditableEmail] = useState('');

  useEffect(() => {
    const fetchInterviewers = async () => {
      try {
        const response = await axios.get(`${API_URL}/employee/interviewers`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setInterviewersList(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des interviewers:', error);
      }
    };
    fetchInterviewers();
  }, []);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/site`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSites(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des sites:', error);
      }
    };
    fetchSites();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      const fetchInterview = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/interviews/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const interview = response.data;

          
          
        console.log ("this the selected interview ID", interview.roomId)

       const roomsResponse = await axios.get(`${API_URL}/api/room/site/${interview.siteId}`, {
  headers: {
    Authorization: `Bearer ${token}`
  } 
});
setRooms(roomsResponse.data);  // charger liste des room 


setFormData({
            title: interview.title,
            datetime: new Date(interview.datetime),
            duration: interview.duration,
            mode: interview.meetingLink ? 'video' : 'onsite',
            meetingLink: interview.meetingLink || '',
            interviewers: interview.interviewers,
            site: interview.siteId,
            room: interview.roomId  || '',
          });




        } catch (error) {
          console.error("Erreur lors du chargement de l'entretien:", error);
        }
      };
      fetchInterview();
    }
  }, [id]);

  const handleChange = (field) => (value) => {
    setFormData(prev => {
      if (field === 'mode') {
        if (value === 'onsite') {
          return {
            ...prev,
            mode: value,
            meetingLink: '',
          };
        }
      }
      return { ...prev, [field]: value };
    });
  };

  const formatDateTime = (date) => {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const generateEmailContent = () => {
    return `Dear ${candidate.fullName},\n\n` +
      `Thank you for applying to the ${candidate.jobTitle} position.\n\n` +
      `We would like to schedule an interview on ${formatDateTime(formData.datetime)} ` +
      `(${formData.mode === 'video' ? 'Video Call' : 'On-Site'}).\n\n` +
      (formData.mode === 'video'
        ? `Meeting Link: ${formData.meetingLink}\n`
        : `room: ${formData.site} - ${formData.room}\n`) +
      `Duration: ${formData.duration} minutes\n\n` +
      `Please confirm your availability.\n\n` +
      `Best regards,\nThe Hiring Team`;
  };

  const handleSubmit = async () => {
    setEditableEmail(generateEmailContent());
    setEmailPreviewOpen(true);
  };

  const confirmAndSend = async () => {
    if (!token) {
      console.error('Token manquant');
      return;
    }
    try {
      const payload = {
        title: formData.title,
        datetime: formData.datetime,
        duration: formData.duration,
        meetingLink: formData.meetingLink,
        interviewers: formData.interviewers,
        roomId: formData.room,
        emailContent: editableEmail
      };

      if (isEditMode) {
        await axios.put(`${API_URL}/api/interviews/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        payload.applicationId = applicationId;
        await axios.post(`${API_URL}/api/interviews/schedule`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      navigate('/interviews-list', {
        state: {
          success: isEditMode ? 'Interview updated!' : 'Interview scheduled!'
        }
      });
    } catch (error) {
      console.error('Scheduling error:', error);
    }
  };

  const isFormValid = () => {
    if (!formData.title || !formData.datetime || !formData.duration) return false;
    if (formData.mode === 'video' && !formData.meetingLink) return false;
    if (formData.mode === 'onsite' && (!formData.site || !formData.room)) return false;
    return true;
  };

  const handleSiteChange = async (event) => {
    const selectedSite = event.target.value;
    setFormData((prev) => ({
      ...prev,
      site: selectedSite,
      room: ''
    }));

    try {
      const response = await axios.get(`${API_URL}/api/room/site/${selectedSite}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRooms(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des rooms:', error);
      setRooms([]);
    }
  };

  return (
    <Box
      sx={{
        width: '80%',
        maxWidth: 800,
        margin: '0 auto',
        p: 4,
        gap: 2,
        borderRadius: 2,
      }}
    >
      <Typography className="mt-22 pt-100 text-4xl font-extrabold tracking-tight leading-tight">
        {isEditMode ? 'Reschedule Interview' : 'Schedule Interview'}
      </Typography>

      <Card elevation={3}>
        <CardContent>
          <Box sx={{ mx: 'auto', width: '78%', marginTop: 4 }}>
            <Stack spacing={3}>
              <TextField
                label="Title"
                value={formData.title}
                onChange={(e) => handleChange('title')(e.target.value)}
                fullWidth
              />

              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                <DateTimePicker
                  label="Scheduled Date"
                  value={formData.datetime}
                  onChange={handleChange('datetime')}
                  minDateTime={now}
                  ampm={false}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>

              <TextField
                label="Duration (in minutes)"
                type="number"
                value={formData.duration}
                onChange={(e) => handleChange('duration')(e.target.value)}
                inputProps={{ min: 5 }}
                fullWidth
              />

              <FormControl component="fieldset">
                <Typography variant="subtitle2">Mode</Typography>
                <RadioGroup
                  row
                  value={formData.mode}
                  onChange={(e) => handleChange('mode')(e.target.value)}
                >
                  <FormControlLabel value="video" control={<Radio />} label="Visio" />
                  <FormControlLabel value="onsite" control={<Radio />} label="On-Site" />
                </RadioGroup>
              </FormControl>

              {formData.mode === 'video' && (
                <TextField
                  label="Meeting Link"
                  value={formData.meetingLink}
                  onChange={(e) => handleChange('meetingLink')(e.target.value)}
                  fullWidth
                />
              )}

              <FormControl fullWidth>
                <InputLabel>Interviewers</InputLabel>
                <Select
                  multiple
                  value={formData.interviewers}
                  onChange={(e) => handleChange('interviewers')(e.target.value.map(v => parseInt(v)))}
                  renderValue={(selected) =>
                    selected
                      .map(id => {
                        const interviewer = interviewersList.find(emp => emp.id === id);
                        return interviewer ? interviewer.fullName : id;
                      })
                      .join(', ')
                  }
                >
                  {interviewersList.map((interviewer) => (
                    <MenuItem key={interviewer.id} value={interviewer.id}>
                      {interviewer.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Site</InputLabel>
                <Select
                  value={formData.site}
                  onChange={handleSiteChange}
                >
                  {sites.map(site => (
                    <MenuItem key={site.id} value={site.id}>
                      {site.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth disabled={!formData.site}>
                <InputLabel shrink={!!formData.room}>Room</InputLabel>
                <Select
                  value={formData.room || ''}
                  onChange={(e) => handleChange('room')(Number(e.target.value))}
                >
                  {rooms.map(room => (
                    <MenuItem key={room.id} value={room.id}>
                      {room.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ 
                pt: 2, 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: 2,
                flexWrap: 'wrap'
              }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate(-1)}
                  sx={{ minWidth: 85 }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  disabled={!isFormValid()} 
                  onClick={confirmAndSend}
                  sx={{ minWidth: 85 }}
                >
                  Send
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={emailPreviewOpen} fullWidth maxWidth="md">
        <DialogTitle>Email Preview</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={15}
            fullWidth
            value={editableEmail}
            onChange={(e) => setEditableEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'center' }}>
            <Button
              onClick={() => setEmailPreviewOpen(false)}
              variant="outlined"
              sx={{ minWidth: 150 }}
            >
              Edit Form
            </Button>
            <Button
              variant="contained"
              onClick={confirmAndSend}
              sx={{ minWidth: 150 }}
            >
              Send
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScheduleInterview;