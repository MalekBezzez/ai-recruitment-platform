import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Button, Paper, Table, TableCell, TableHead, TableRow, TableBody, IconButton, Alert,
} from '@mui/material';
import { ArrowBack, ArrowForward, Schedule } from '@mui/icons-material';
import axios from 'axios';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const formatDate = (date) => {
  const d = new Date(date);
  return dayNames[d.getDay()];
};

const formatLocalDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const stripTime = (date) => {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getWeekStartDate = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const InvalidImputationsByUserPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [startDate, setStartDate] = useState(getWeekStartDate(new Date()));
  const [timeEntries, setTimeEntries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allPhases, setAllPhases] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [taskProjectPhaseCache, setTaskProjectPhaseCache] = useState({});
  const [validatedLeaves, setValidatedLeaves] = useState([]);
  const [company, setCompany] = useState('');
  const [serviceCenter, setServiceCenter] = useState('');
  const [totalHours, setTotalHours] = useState('00:00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // État pour les détails de l'employé
  const [employeeDetails, setEmployeeDetails] = useState({
    firstname: '',
    lastname: '',
    email: '',
    department: '',
    contractType: '',
    insurance: ''
  });

  const days = [...Array(7)].map((_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  const periodLabel = `${formatLocalDate(startDate)} - ${formatLocalDate(days[6])}`;
  const weekNumber = getWeekNumber(startDate);

  // Fonction pour naviguer vers le timesheet de l'utilisateur
  const handleGoToTimesheet = () => {
    // Ajuster selon votre structure de routage
    navigate(`/timesheet`);
  };
  const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  // Fonction pour récupérer les détails de l'employé depuis la base de données
  const fetchEmployeeDetails = async () => {
    if (!userId) {
      setError('User ID not found in URL parameters.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
      const response = await axios.get(`${API_URL}/employee/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const employeeData = response.data;
      setEmployeeDetails({
        firstname: employeeData.firstname || 'Unknown',
        lastname: employeeData.lastname || 'Unknown',
        email: employeeData.email || '',
        department: employeeData.department || '',
        contractType: employeeData.contractType || '',
        insurance: employeeData.insurance || ''
      });
      
      // Vous pouvez aussi utiliser d'autres champs si disponibles
      setCompany(employeeData.company || 'LOOYAS');
      setServiceCenter(employeeData.serviceCenter || 'Service Center');
      
    } catch (error) {
      console.error('Error fetching employee details:', error);
      setError('Failed to load employee details.');
      // Valeurs par défaut
      setEmployeeDetails({
        firstname: 'Unknown',
        lastname: 'Unknown',
        email: '',
        department: '',
        contractType: '',
        insurance: ''
      });
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
      const response = await axios.get(`${API_URL}/projects/names-ids`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      return Array.isArray(data) ? data.map((p) => ({ id: p.id, name: p.name || p.title })) : [];
    } catch (error) {
      console.error('Error loading projects', error);
      return [];
    }
  };

  const fetchTaskProjectPhase = async (taskId) => {
    if (!taskId || taskProjectPhaseCache[taskId]) {
      return taskProjectPhaseCache[taskId] || null;
    }
    try {
      const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
      const response = await axios.get(`${API_URL}/tasks/${taskId}/project-phase`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      const cacheEntry = {
        taskId: data.taskId,
        phaseId: data.phaseId,
        projectId: data.projectId,
      };
      setTaskProjectPhaseCache(prev => ({ ...prev, [taskId]: cacheEntry }));
      return cacheEntry;
    } catch (error) {
      console.error('Error fetching task project phase:', error);
      return null;
    }
  };

  const fetchValidatedLeaves = async (startDate, endDate) => {
    if (!userId) {
      console.error('User ID not found');
      return [];
    }
    try {
      const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${API_URL}/leave-requests/validated?employeeId=${userId}&startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`,
        { headers }
      );
      const leaves = Array.isArray(response.data) ? response.data : [];
      return leaves.filter(leave => {
        if (!leave.startDate || !leave.endDate || !leave.leaveTypeName || leave.numberOfHours === undefined) {
          console.warn('Invalid leave data:', leave);
          return false;
        }
        const leaveStart = stripTime(leave.startDate);
        const leaveEnd = stripTime(leave.endDate);
        const periodStart = stripTime(startDate);
        const periodEnd = stripTime(endDate);
        return leaveStart <= periodEnd && leaveEnd >= periodStart;
      });
    } catch (error) {
      console.error('Error fetching validated leaves:', error);
      return [];
    }
  };

  const isLeaveFullTime = (leave) => {
    return Number(leave.numberOfHours) >= 8;
  };

  const getLeaveHoursForDay = (dayDate, leave) => {
    try {
      const dayStr = formatLocalDate(dayDate);
      const startLeave = stripTime(leave.startDate);
      const endLeave = stripTime(leave.endDate);
      const checkDate = stripTime(dayStr);

      if (checkDate < startLeave || checkDate > endLeave) return 0;

      const totalDays = Math.floor((endLeave - startLeave) / (1000 * 60 * 60 * 24)) + 1;
      if (totalDays === 1) return leave.numberOfHours || 0;
      if (checkDate.getTime() === endLeave.getTime()) return leave.numberOfHours || 0;
      return 8;
    } catch (error) {
      console.error('Error in getLeaveHoursForDay:', error);
      return 0;
    }
  };

  const getProjectName = (projectId) => {
    if (!projectId) return 'Absence';
    const project = projects.find((p) => p.id == projectId);
    return project ? project.name : `Project ${projectId}`;
  };

  const getPhaseName = (phaseId) => {
    const phase = allPhases.find((p) => p.phaseId == phaseId);
    return phase ? phase.name : `Absence`;
  };

  const getTaskName = (taskId) => {
    const task = allTasks.find((t) => t.taskId == taskId);
    return task ? task.name  : `Absence`;
   // return task ? task.name : `Task ${taskId}`;
  };

  const getDayTotal = (dayIndex) => {
    return timeEntries.reduce((total, entry) => {
      const hours = entry.hours[dayIndex]?.split(':')[0] || '0';
      return total + (parseInt(hours) || 0);
    }, 0);
  };

  const getTaskTotal = (entry) => {
    return entry.hours.reduce((sum, h) => sum + (parseInt(h.split(':')[0]) || 0), 0);
  };

const validateAllUnvalidated = async () => {
  setLoading(true);
  setError(null);
  setShowAlert(false);

  const imputationIdsToValidate = timeEntries
    .filter(entry => !entry.validated && entry.imputationIds && !entry.isLeave)
    .flatMap(entry => entry.imputationIds);

  const uniqueIds = [...new Set(imputationIdsToValidate)];

  if (uniqueIds.length === 0) {
    setError('No unvalidated entries to validate.');
    setLoading(false);
    return;
  }

  try {
    const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
    if (!token) {
      setError('Access token missing. Please log in again.');
      setLoading(false);
      return;
    }

    for (const id of uniqueIds) {
      await axios.put(
        `${API_URL}/imputations/${id}/validate`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }

    setTimeEntries(prev =>
      prev.map(entry =>
        entry.imputationIds?.some(id => uniqueIds.includes(id))
          ? { ...entry, validated: true, isDraft: false }
          : entry
      )
    );

    setSuccessMessage('Only current week imputations validated.');
    setShowAlert(true);
  } catch (error) {
    console.error('Error during validation:', error);
    setError('Validation failed. Please try again.');
  } finally {
    setLoading(false);
  }
};


const markAllAsDraft = async () => {
  setLoading(true);
  setError(null);
  setShowAlert(false);

const imputationIdsToDraft = timeEntries
  .filter(entry => !entry.validated && entry.imputationIds && !entry.isLeave)
  .flatMap(entry => entry.imputationIds); // ✅ récupère tous les ID de la semaine

  const uniqueIds = [...new Set(imputationIdsToDraft)];

  if (uniqueIds.length === 0) {
    setError('No unvalidated entries to mark as draft.');
    setLoading(false);
    return;
  }

  try {
    const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
    if (!token) {
      setError('Access token missing. Please log in again.');
      setLoading(false);
      return;
    }

    for (const id of uniqueIds) {
      await axios.put(
        `${API_URL}/imputations/${id}/draft`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }

    setTimeEntries(prev =>
      prev.map(entry =>
        uniqueIds.includes(entry.imputationId)
          ? { ...entry, isDraft: true }
          : entry
      )
    );

    setSuccessMessage('Only current week imputations marked as draft.');
    setShowAlert(true);
  } catch (error) {
    console.error('Error marking as draft:', error);
    setError('Failed to mark entries as draft.');
  } finally {
    setLoading(false);
  }
};



  const fetchTimesheetData = async () => {
    if (!userId) {
      setError('User ID not found in URL parameters.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
      const headers = { Authorization: `Bearer ${token}` };

      const projectsData = await fetchProjects();
      setProjects(projectsData);

      const phasesResponse = await axios.get(`${API_URL}/phases`, { headers });
      setAllPhases(phasesResponse.data);

      const tasksResponse = await axios.get(`${API_URL}/tasks`, { headers });
      setAllTasks(tasksResponse.data);

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      const leaves = await fetchValidatedLeaves(startDate, endDate);
      setValidatedLeaves(leaves);

      const timesheetResponse = await axios.get(
        `${API_URL}/imputations/user/${userId}?start=${startDate.toISOString().split('T')[0]}&end=${endDate.toISOString().split('T')[0]}`,
        { headers }
      );

      const data = timesheetResponse.data || [];
      const grouped = {};

      for (const entry of data) {
        const taskInfo = await fetchTaskProjectPhase(entry.taskId);
        const key = `${taskInfo?.projectId || 'unknown'}-${taskInfo?.phaseId || 'unknown'}-${entry.taskId}`;
        if (!grouped[key]) {
          grouped[key] = {
             imputationIds: [entry.imputationId],
            projectId: taskInfo?.projectId || '',
            phaseId: taskInfo?.phaseId || '',
            taskId: entry.taskId,
            validated: entry.validated || false,
            hours: Array(7).fill('00:00'),
            isLeave: false,
          };
        } else {grouped[key].imputationIds.push(entry.imputationId);
}
        const dayIndex = Math.floor((stripTime(entry.date) - stripTime(startDate)) / (1000 * 60 * 60 * 24));
        if (dayIndex >= 0 && dayIndex < 7) {
          grouped[key].hours[dayIndex] = `${String(Math.floor(entry.hours)).padStart(2, '0')}:00`;
        }
      }

      const filteredEntries = Object.values(grouped).filter(entry =>
        entry.hours.some(h => h !== '00:00')
      );

      const leaveRows = leaves.map(leave => {
        const startLeave = stripTime(leave.startDate);
        const endLeave = stripTime(leave.endDate);
        const periodStart = stripTime(startDate);
        const periodEnd = stripTime(endDate);

        if (startLeave <= periodEnd && endLeave >= periodStart) {
          const hours = Array(7).fill('00:00');
          let hasValidHours = false;
          for (let d = new Date(periodStart), i = 0; d <= periodEnd; d.setDate(d.getDate() + 1), i++) {
            const currentDay = stripTime(d);
            if (currentDay >= startLeave && currentDay <= endLeave) {
              const leaveHours = getLeaveHoursForDay(currentDay, leave);
              hours[i] = `${String(Math.floor(leaveHours)).padStart(2, '0')}:00`;
              if (leaveHours > 0) hasValidHours = true;
            }
          }
          if (hasValidHours) {
            return {
              imputationId: null,
              projectId: `leave-${leave.leaveId}`,
              phaseId: `leave-${leave.leaveId}`,
              taskId: '',
              validated: true,
              hours,
              isLeave: true,
              leaveTypeName: leave.leaveTypeName,
              isFullTime: isLeaveFullTime(leave),
            };
          }
        }
        return null;
      }).filter(row => row !== null);

      const entries = [...filteredEntries, ...leaveRows];
      setTimeEntries(entries.length > 0 ? entries : []);
      const total = entries.reduce((sum, entry) => sum + getTaskTotal(entry), 0);
      setTotalHours(`${String(total).padStart(2, '0')}:00`);
    } catch (error) {
      console.error('Error fetching timesheet data:', error);
      setError('Failed to load timesheet data. Please try again.');
      setTimeEntries([]);
      setTotalHours('00:00');
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les détails de l'employé au chargement du composant
  useEffect(() => {
    fetchEmployeeDetails();
  }, [userId]);

  // Récupérer les données du timesheet quand startDate ou userId change
  useEffect(() => {
    fetchTimesheetData();
  }, [startDate, userId]);

  const handlePreviousWeek = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() - 7);
    setStartDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + 7);
    setStartDate(newDate);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f7fa' }}>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Timesheets to Approve / Week {weekNumber}</Typography>
          </Grid>
          
          {/* Buttons for managers */}
          
          
          {/* Employee info and buttons */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: 2,
                mb: 2,
              }}
            >
              {/* Left: Employee Information */}
              <Box>
                <Typography>
                  Employee: {employeeDetails.firstname} {employeeDetails.lastname}
                </Typography>
                {employeeDetails.email && (
                  <Typography>Email: {employeeDetails.email}</Typography>
                )}
                <Typography>Company: {company}</Typography>
                <Typography>Service Center: {serviceCenter}</Typography>
                {employeeDetails.department && (
                  <Typography>Department: {employeeDetails.department}</Typography>
                )}
              </Box>
              
              {/* Right: Timesheet Button */}
              <Box>
                <Box display="flex" justifyContent="center" alignItems="center" gap={2} sx={{ mb: 2 }}>
              <IconButton onClick={handlePreviousWeek} disabled={loading}>
                <ArrowBack />
              </IconButton>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {periodLabel}
              </Typography>
              <IconButton onClick={handleNextWeek} disabled={loading}>
                <ArrowForward />
              </IconButton>
            
            </Box>
            
             <Button
                  variant="outlined"
                  
                  startIcon={<Schedule />}
                  onClick={handleGoToTimesheet}
                  sx={{ mb: 1 ,marginLeft: '64px' , marginTop:'50px' }  }
                >
                  Go to Timesheet
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Period Navigation */}
          {/* <Grid item xs={12}>
            <Box display="flex" justifyContent="center" alignItems="center" gap={2} sx={{ mb: 2 }}>
              <IconButton onClick={handlePreviousWeek} disabled={loading}>
                <ArrowBack />
              </IconButton>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {periodLabel}
              </Typography>
              <IconButton onClick={handleNextWeek} disabled={loading}>
                <ArrowForward />
              </IconButton>
            </Box>
          </Grid> */}
          {currentUser?.user?.role === 'MANAGER' && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 ,marginTop:'-73px'}}>

                <Button
                  variant="outlined"
                  onClick={markAllAsDraft}
                  disabled={loading || !timeEntries.some(entry => !entry.validated && !entry.isLeave)}
                >
                  Mark as Draft
                </Button>
                <Button
                 variant="outlined"
                  
                  disabled={loading || !timeEntries.some(entry => !entry.validated && !entry.isLeave)}
                  onClick={validateAllUnvalidated}
                >
                  Validate
                </Button>
              </Box>
            </Grid>
          )}
          <Grid item xs={12}>
            {showAlert && successMessage && (
              <Alert severity="success" sx={{ mt: 2, mb: 2 }} onClose={() => setShowAlert(false)}>
                {successMessage}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                {error}
              </Alert>
            )}
            {loading ? (
              <Typography>Loading...</Typography>
            ) : timeEntries.length === 0 ? (
              <Typography sx={{ mt: 2 }}>No entries or leaves for this week.</Typography>
            ) : (
              <Table sx={{ mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Project</TableCell>
                    <TableCell>Phase</TableCell>
                    <TableCell>Task</TableCell>
                    {days.map((d, i) => (
                      <TableCell key={i} align="center">
                        {`${formatDate(d)} ${d.getDate()}`}
                      </TableCell>
                    ))}
                    <TableCell align="center">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {timeEntries.map((entry, idx) => (
                    <TableRow
                      key={idx}
                      sx={{
                        backgroundColor: entry.isLeave ? '#f0f8ff' : idx % 2 === 0 ? '#f5f5f5' : 'inherit',
                      }}
                    >
                      <TableCell>
                        {entry.isLeave ? 'Leave' : getProjectName(entry.projectId)}
                      </TableCell>
                      <TableCell>
                        {entry.isLeave ? (entry.leaveTypeName || 'Leave') : getPhaseName(entry.phaseId)}
                      </TableCell>
                      <TableCell>
                        {entry.isLeave ? '' : getTaskName(entry.taskId)}
                      </TableCell>
                      {entry.hours.map((hours, i) => (
                        <TableCell key={i} align="center">{hours}</TableCell>
                      ))}
                      <TableCell align="center">{getTaskTotal(entry)}:00</TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ backgroundColor: '#e0e0e0', fontWeight: 'bold' }}>
                    <TableCell colSpan={3}>Total</TableCell>
                    {days.map((_, i) => (
                      <TableCell key={i} align="center">{getDayTotal(i)}:00</TableCell>
                    ))}
                    <TableCell align="center">{totalHours}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default InvalidImputationsByUserPage;