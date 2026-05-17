import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Select, MenuItem, TextField, Button, Paper,
  Table, TableBody, TableCell, TableHead, TableRow, IconButton, Alert, Snackbar ,Tooltip,
  Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Add, ArrowBack, ArrowForward, Edit } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
const isRowNonDraft = (row) => {
  if (row.isLeave || row.isAbsence) return false;
  return (row.isDraft || []).some((isDraft, index) => {
    const notValidated = row.valide?.[index] === false;
    return isDraft === false && notValidated;
  });
};

const formatDate = (date) => {
  const day = dayNames[date.getDay()];
  const dayNum = date.getDate();
  return `${day} ${dayNum}`;
};
  const raw = JSON.parse(localStorage.getItem('user')) || {};
  const userId = raw.user?.id;
  const role = raw.user?.role;
const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const stripTime = (date) => {
  try {
    const d = typeof date === 'string' ? new Date(date + (date.includes('T') ? '' : 'T00:00:00')) : new Date(date);
    if (isNaN(d.getTime())) {
      console.error('Invalid date input to stripTime:', date);
      return new Date();
    }
    d.setHours(0, 0, 0, 0);
    return d;
  } catch (error) {
    console.error('Error in stripTime:', error, 'Input:', date);
    return new Date();
  }
};

const getMonday = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

const Timesheet = () => {
  const [leavesLoaded, setLeavesLoaded] = useState(false);
  const [startDate, setStartDate] = useState(getMonday(new Date()));
  const [projects, setProjects] = useState([]);
  const [allPhases, setAllPhases] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [taskProjectPhaseCache, setTaskProjectPhaseCache] = useState({});
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [weeklyTotalError, setWeeklyTotalError] = useState(false);
  const [dailyTotalErrors, setDailyTotalErrors] = useState(Array(7).fill(false));
  const [validatedLeaves, setValidatedLeaves] = useState([]);
  const [employeeRegime, setEmployeeRegime] = useState('H40');
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImputationId, setSelectedImputationId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [newDescription, setNewDescription] = useState('');
  const [dialogError, setDialogError] = useState('');
  const [hasNonDraftInWeek, setHasNonDraftInWeek] = useState(false);
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
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const lastname = currentUser?.user?.lastname || 'Unknown';
  const firstname = currentUser?.user?.firstname || 'Unknown';
  const userId = currentUser?.user?.id;

  const today = new Date();
  today.setHours(21, 31, 0, 0);

  const navigate = useNavigate();

  const fetchEmployeeRegime = async () => {
    if (!userId) {
      showSnack('User ID not found');
      return;
    }
    try {
      const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
      const response = await axios.get(`${API_URL}/employee/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployeeRegime(response.data.worktime || 'H40');
    } catch (error) {
      showSnack('Error fetching employee regime:');
      setEmployeeRegime('H40');
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
      showSnack('Error fetching task project phase');
      return null;
    }
  };

  const fetchValidatedLeaves = async (startDate, endDate) => {
    if (!userId) {
      showSnack('User ID not found');
      return;
    }
    try {
      const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
      const headers = { Authorization: `Bearer ${token}` };
      console.log(`Fetching leaves for period: ${formatLocalDate(startDate)} to ${formatLocalDate(endDate)}`);
      const response = await axios.get(
        `${API_URL}/leave-requests/validated?employeeId=${userId}&startDate=${formatLocalDate(startDate)}&endDate=${formatLocalDate(endDate)}`,
        { headers }
      );
      console.log('API response for validated leaves:', response.data);
      const leaves = Array.isArray(response.data) ? response.data : [];
      const validatedLeaves = leaves.filter(leave => {
        if (!leave.startDate || !leave.endDate || !leave.leaveTypeName || leave.numberOfHours === undefined) {
          console.warn('Invalid leave data:', leave);
          return false;
        }
        // ✅ calcul des heures par jour
const leaveStart = stripTime(leave.startDate);
const leaveEnd   = stripTime(leave.endDate);

if (typeof leave.numberOfHours !== 'number' || leave.numberOfHours < 0) {
  console.warn('Invalid leave hours:', leave);
  return false;
}

// vérifie que la distribution ne dépasse jamais 8h/j
const daily = buildLeaveDailyArray(leave, 8);
if (daily.some(h => h > 8)) {
  console.warn('Leave exceeds 8h/day after distribution:', leave);
  return false;
}


        const periodStart = stripTime(startDate);
        const periodEnd = stripTime(endDate);
        const overlaps = leaveStart <= periodEnd && leaveEnd >= periodStart;
        console.log(`Leave from ${leave.startDate} to ${leave.endDate} overlaps: ${overlaps}`);
        return overlaps;
      });
      console.log('Filtered validated leaves', validatedLeaves);
      setValidatedLeaves(validatedLeaves);
    } catch (error) {
      showSnack('Error fetching validated leaves');
      setValidatedLeaves([]);
    }
  };

  const isDayOnValidatedLeave = (dayDate) => {
    const dayStr = formatLocalDate(dayDate);
    return validatedLeaves.some(leave => {
      const startLeave = stripTime(leave.startDate);
      const endLeave = stripTime(leave.endDate);
      const checkDate = stripTime(dayStr);
      return checkDate >= startLeave && checkDate <= endLeave;
    });
  };

  const MS_PER_DAY = 1000 * 60 * 60 * 24;

const buildLeaveDailyArray = (leave, maxPerDay = 8) => {
  const start = stripTime(leave.startDate);
  const end   = stripTime(leave.endDate);

  // 1) nb de jours demandés par la période (info backend)
  const requestedDays = Math.floor((end - start) / MS_PER_DAY) + 1;

  // 2) nb de jours réellement nécessaires pour consommer les heures
  const totalHours = Math.max(0, Number(leave.numberOfHours) || 0);
  const neededDays = Math.ceil(totalHours / maxPerDay) || 0;

  // 3) on limite la distribution aux jours vraiment nécessaires
  const days = Math.min(requestedDays, neededDays);

  const daily = Array(days).fill(0);
  let remaining = totalHours;

  for (let i = 0; i < days && remaining > 0; i++) {
    const put = Math.min(maxPerDay, remaining);
    daily[i] = put;
    remaining -= put;
  }
  return daily; // ex: 10h -> [8,2] ; 30h -> [8,8,8,6]
};

const getLeaveHoursForDay = (dayDate, leave) => {
  const start = stripTime(leave.startDate);
  const check = stripTime(dayDate);
  if (check < start) return 0;

  const idx = Math.floor((check - start) / MS_PER_DAY);
  const daily = (leave._dailyHours ||= buildLeaveDailyArray(leave, 8));

  // si on a consommé toutes les heures, on ne propage plus sur les jours suivants
  return daily[idx] || 0;
};



const getDailyArrayCached = (leave) => {
  if (!leave._dailyHours) {
    leave._dailyHours = buildLeaveDailyArray(leave, 8);
  }
  return leave._dailyHours;
};

/*  const getLeaveHoursForDay = (dayDate, leave) => {
  const start = stripTime(leave.startDate);
  const check = stripTime(dayDate);
  if (check < start) return 0;

  const idx = Math.floor((check - start) / MS_PER_DAY);
  const daily = getDailyArrayCached(leave);
  return daily[idx] || 0;
};*/



const isLeaveFullTime = (leave) => {
  const daily = buildLeaveDailyArray(leave, 8);
  // full-time si chaque jour pris a 8h
  return daily.length > 0 && daily.every(h => h === 8);
};

  const days = [...Array(7)].map((_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  const getDayWorkHours = (dayIndex, excludeRowIndex = -1) => {
    const workHours = (rows || []).reduce((total, row, idx) => {
      if (excludeRowIndex === idx) return total;
      return total + Number(row.time?.[dayIndex] || 0);
    }, 0);
    return workHours;
  };

  const getDayTotal = (dayIndex) => {
    return rows.reduce((total, row) => {
      const value = Number(row.time?.[dayIndex] || 0);
      return total + (isNaN(value) ? 0 : value);
    }, 0);
  };

  const getWeeklyTotal = () => {
    return (rows || []).reduce((acc, row) => {
      return acc + (row.time || []).reduce((sum, h) => sum + Number(h || 0), 0);
    }, 0);
  };

  const getTaskTotal = (row) => {
    return (row.time || []).reduce((sum, h) => sum + Number(h || 0), 0);
  };

  const isDayOverLimit = (dayIndex) => {
    return getDayTotal(dayIndex) > 8;
  };

  const isWeeklyTotalOverLimit = () => {
    const weeklyTotal = getWeeklyTotal();
    const limit = employeeRegime === 'H48' ? 48 : 40;
    return weeklyTotal > limit;
  };

  const updateErrors = () => {
    setWeeklyTotalError(isWeeklyTotalOverLimit());
    setDailyTotalErrors(Array(7).fill(false).map((_, dayIndex) => isDayOverLimit(dayIndex)));
  };

  const rowHasImputationsInCurrentPeriod = (row) => {
    if (row.isLeave || row.isAbsence) return true;
    return (row.time || []).some((timeValue, index) => {
      const hasImputation = row.idImputations?.[index] !== null;
      const hasTime = timeValue && Number(timeValue) > 0;
      return hasImputation || hasTime;
    });
  };

  const isCellModified = (rowIndex, dayIndex) => {
    return rows[rowIndex]?.isModified?.[dayIndex] || false;
  };

  const getTaskName = (taskId) => {
    const task = allTasks.find((t) => t.taskId == taskId);
    return task ? task.name : `Task ${taskId}`;
  };

  const getPhaseName = (phaseId) => {
    const phase = allPhases.find((p) => p.phaseId == phaseId);
    return phase ? phase.name : `Phase ${phaseId}`;
  };
const getProjectName = (row) => {
  if (!row) return 'Unknown';
  
  // Si c'est une absence
  if (row.isAbsence || (row.taskId === null && row.projectId !== null)) {
    return 'Absence';
  }
  
  // Si c'est un congé
  if (row.isLeave) {
    return row.isFullTime ? 'Complete Leave' : 'Partial Leave';
  }
  
  // Si projectId est null ou undefined
  if (!row.projectId) return 'Unknown project';
  
  // Recherche du projet normal
  const project = projects.find((p) => p.id == row.projectId);
  return project ? project.name : `Project ${row.projectId}`;
};
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
      const response = await fetch(`${API_URL}/projects/names-ids`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      return Array.isArray(data) ? data.map((p) => ({ id: p.id, name: p.name || p.title })) : [];
    } catch (error) {
      showSnack('Error loading projects');
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const projectsData = await fetchProjects();
        setProjects(projectsData);

        const phasesResponse = await axios.get(`${API_URL}/phases`, { headers });
        setAllPhases(phasesResponse.data);

        const tasksResponse = await axios.get(`${API_URL}/tasks`, { headers });
        setAllTasks(tasksResponse.data);

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);

        await fetchValidatedLeaves(startDate, endDate);
        setLeavesLoaded(true);
        await fetchEmployeeRegime();
      } catch (error) {
        showSnack('Error during initial loading:');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [startDate, userId]);

  useEffect(() => {
    if (leavesLoaded) {
      loadImputations(startDate);
      setLeavesLoaded(false);
    }
  }, [leavesLoaded]);

  useEffect(() => {
    const loadTaskInfos = async () => {
      const tasksToLoad = (rows || [])
        .filter(row => row.taskId && !taskProjectPhaseCache[row.taskId])
        .map(row => row.taskId);
      if (tasksToLoad.length > 0) {
        for (const taskId of tasksToLoad) {
          await fetchTaskProjectPhase(taskId);
        }
      }
    };
    loadTaskInfos();
  }, [rows]);

  useEffect(() => {
    updateErrors();
    const nonDraftExists = rows.some(row => isRowNonDraft(row));
    setHasNonDraftInWeek(nonDraftExists);
    console.log('hasNonDraftInWeek:', nonDraftExists); // Debug log
  }, [rows, employeeRegime, validatedLeaves]);

  const loadTasks = async (phaseId, rowIndex) => {
    if (!phaseId) return;
    const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const response = await axios.get(`${API_URL}/tasks/phase/${phaseId}`, { headers });
      setAllTasks((prev) => {
        const filtered = prev.filter((t) => t.phaseId !== phaseId);
        return [...filtered, ...response.data];
      });
      const newRows = [...rows];
      newRows[rowIndex].taskId = '';
      newRows[rowIndex].time = Array(7).fill('');
      newRows[rowIndex].originalTime = Array(7).fill('');
      newRows[rowIndex].idImputations = Array(7).fill(null);
      newRows[rowIndex].isModified = Array(7).fill(false);
      setRows(newRows);
    } catch (error) {
      showSnack('Error loading tasks');
    }
  };

  const isDayValidated = (rowIndex, dayIndex) => {
    return rows[rowIndex]?.valide?.[dayIndex] || false;
  };

  const loadImputations = async (dateStart) => {
    setLoading(true);
    setRows([]);
    const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
    const headers = { Authorization: `Bearer ${token}` };
    const dateEnd = new Date(dateStart);
    dateEnd.setDate(dateEnd.getDate() + 6);

    if (!userId) {
      showSnack('User ID not found in localStorage');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/imputations/user/${userId}?start=${formatLocalDate(dateStart)}&end=${formatLocalDate(dateEnd)}`,
        { headers }
      );
      const data = Array.isArray(response.data) ? response.data : [];
      console.log(data);
      const grouped = {};
      for (const imp of data) {
  let taskInfo = null;

  // Étape 1 : Récupération de l'info du projet/tâche
  if (imp.taskId) {
    taskInfo = await fetchTaskProjectPhase(imp.taskId);
  } else if (imp.projectId) {
    // Cas d'une absence avec projectId directement dans l'imputation
    taskInfo = {
      projectId: imp.projectId,
      phaseId: '',
      taskId: '',
    };
  } else {
    console.warn("Imputation inconnue sans taskId ni projectId:", imp);
    continue; // on ignore cette imputation
  }

  // Étape 2 : Création de la clé d'agrégation
  const key = `${taskInfo.projectId || 'unknown'}-${taskInfo.phaseId || 'unknown'}-${taskInfo.taskId || 'null'}`;

  // Étape 3 : Construction de la ligne si elle n'existe pas encore
  if (!grouped[key]) {
    grouped[key] = {
      projectId: taskInfo.projectId || '',
      phaseId: taskInfo.phaseId || '',
      taskId: taskInfo.taskId || '',
      time: Array(7).fill(''),
      originalTime: Array(7).fill(''),
      idImputations: Array(7).fill(null),
      description: Array(7).fill(null),
      valide: Array(7).fill(false),
      isModified: Array(7).fill(false),
      isDraft: Array(7).fill(true),
    };

    // Étape 4 : Détection automatique de l'absence
    if (!grouped[key].taskId && grouped[key].projectId && !grouped[key].phaseId) {
      grouped[key].isAbsence = true;
    }
  }

  // Étape 5 : Affectation des données journalières
  const impDate = stripTime(imp.date);
  const startDateNormalized = stripTime(dateStart);
  const dayIndex = Math.floor((impDate - startDateNormalized) / (1000 * 60 * 60 * 24));

  if (dayIndex >= 0 && dayIndex < 7) {
    const hoursStr = imp.hours.toString();
    grouped[key].time[dayIndex] = hoursStr;
    grouped[key].originalTime[dayIndex] = hoursStr;
    grouped[key].idImputations[dayIndex] = imp.imputationId ?? null;
    grouped[key].description[dayIndex] = imp.description || null;
    grouped[key].valide[dayIndex] = imp.valide || false;
    grouped[key].isModified[dayIndex] = false;
    grouped[key].isDraft[dayIndex] = imp.draft ?? true;
  }
}

      let loadedRows = Object.values(grouped);

      const leaveRows = validatedLeaves.map(leave => {
        try {
          console.log('Processing leave:', leave);
          const startLeave = stripTime(leave.startDate);
          const endLeave = stripTime(leave.endDate);
          const periodStart = stripTime(dateStart);
          const periodEnd = stripTime(dateEnd);

          if (startLeave <= periodEnd && endLeave >= periodStart) {
            const time = Array(7).fill('');
            let hasValidHours = false;
            for (let d = new Date(periodStart), i = 0; d <= periodEnd; d.setDate(d.getDate() + 1), i++) {
              const currentDay = stripTime(d);
              if (currentDay >= startLeave && currentDay <= endLeave) {
                const hours = getLeaveHoursForDay(currentDay, leave);
                time[i] = hours.toString();
                if (hours > 0) hasValidHours = true;
              }
            }
            console.log('Leave time array:', time, 'Has valid hours:', hasValidHours);
            if (hasValidHours) {
              return ({
                projectId: `leave-${leave.id}`,
                phaseId: `leave-${leave.id}`,
                taskId: '',
                time,
                originalTime: [...time],
                idImputations: Array(7).fill(null),
                description: Array(7).fill(`Leave: ${leave.leaveTypeName}`),
                valide: Array(7).fill(true),
                isModified: Array(7).fill(false),
                isLeave: true,
                leaveTypeName: leave.leaveTypeName,
                isFullTime: isLeaveFullTime(leave),
                isDraft: Array(7).fill(false),
              });
            }
          }
          console.log('Leave does not overlap period or has no valid hours:', leave);
          return null;
        } catch (error) {
          showSnack('Error processing leave:');
          return null;
        }
      }).filter(row => row !== null);

      console.log('Generated leave rows:', leaveRows);
      loadedRows = [...loadedRows, ...leaveRows];
      loadedRows = loadedRows.filter(row => {
        if (row.isLeave || row.isAbsence) return (row.time || []).some(h => Number(h) > 0);
        return rowHasImputationsInCurrentPeriod(row);
      });

      setRows(
        loadedRows.length > 0
          ? loadedRows
          : [
              {
                projectId: '',
                phaseId: '',
                taskId: '',
                time: Array(7).fill(''),
                originalTime: Array(7).fill(''),
                idImputations: Array(7).fill(null),
                description: Array(7).fill(null),
                valide: Array(7).fill(false),
                isModified: Array(7).fill(false),
                isDraft: Array(7).fill(true),
              },
            ]
      );
    } catch (error) {
      console.log('Error loading imputations',
        [{
          projectId: '',
          phaseId: '',
          taskId: '',
          time: Array(7).fill(''),
          originalTime: Array(7).fill(''),
          idImputations: Array(7).fill(null),
          description: Array(7).fill(null),
          valide: Array(7).fill(false),
          isModified: Array(7).fill(false),
          isDraft: Array(7).fill(true),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (rowIndex, dayIndex, value) => {
    const dayDate = days[dayIndex];
    const strippedDayDate = stripTime(dayDate);
    const row = rows[rowIndex];

    if (hasNonDraftInWeek) {
      showSnack('Cannot modify hours: A non-draft imputation exists in this week.');
      return;
    }

    if (row.isLeave) {
      showSnack('Cannot modify hours for leave entries.');
      return;
    }

    const isSunday = dayIndex === 6;
    const isSaturday = dayIndex === 5;
    if (employeeRegime === 'H48' && isSunday) {
      showSnack('Cannot enter imputations on Sunday for H48 regime.');
      return;
    }
    if (employeeRegime === 'H40' && (isSaturday || isSunday)) {
      showSnack('Cannot enter imputations on Saturday or Sunday for H40 regime.');
      return;
    }

    if (strippedDayDate > today) {
      showSnack('You cannot enter imputations for future days.');
      return;
    }

    if (isDayValidated(rowIndex, dayIndex)) {
      showSnack('This day has been approved, you cannot modify the hours.');
      return;
    }

    const numValue = Number(value || 0);
    if (numValue < 0 || numValue > 24) {
      return;
    }

 const isAbsenceRow = row.isAbsence || (!row.taskId && row.projectId && !row.phaseId);
console.log("DEBUG Absence Check:", {
  taskId: row.taskId,
  projectId: row.projectId,
  phaseId: row.phaseId,
  isAbsence: row.isAbsence,
});

if (!row.taskId && !isAbsenceRow) {
  showSnack('Please select a task before entering hours (unless it is an absence).');
  return;
}


    const currentRow = rows[rowIndex];
    const taskId = currentRow.taskId;
    const hasExistingImputation = rows.some(row => 
      row.taskId === taskId && row.idImputations[dayIndex] !== null && row !== currentRow
    );

    if (hasExistingImputation && numValue > 0 && Number(currentRow.time[dayIndex] || 0) === 0) {
      showSnack('An imputation for this task on this day is already saved in the database. You cannot add a new imputation.');
      return;
    }

    const workHoursWithoutCurrentCell = getDayWorkHours(dayIndex, rowIndex);
    const leaveHours = validatedLeaves.reduce((total, leave) => total + getLeaveHoursForDay(dayDate, leave), 0);
    const maxAllowed = 8;

    if (workHoursWithoutCurrentCell + numValue > maxAllowed) {
      showSnack(`The total hours for this day (including ${leaveHours}h of leave) cannot exceed 8h. You can add up to ${maxAllowed - workHoursWithoutCurrentCell}h of work. Current total work hours (excluding this cell): ${workHoursWithoutCurrentCell}h.`);
      return;
    }

    const currentCellValue = Number(rows[rowIndex].time[dayIndex] || 0);
    const weeklyTotalWithoutCurrentCell = getWeeklyTotal() - currentCellValue;
    const newWeeklyTotal = weeklyTotalWithoutCurrentCell + numValue;
    const weeklyLimit = employeeRegime === 'H48' ? 48 : 40;

    if (newWeeklyTotal > weeklyLimit) {
      showSnack(`The total hours for the week cannot exceed ${weeklyLimit} hours. Current total: ${weeklyTotalWithoutCurrentCell}h, you can add up to a maximum of ${weeklyLimit - weeklyTotalWithoutCurrentCell}h.`);
      return;
    }

    const newRows = [...rows];
    newRows[rowIndex].time[dayIndex] = value;
    newRows[rowIndex].isModified[dayIndex] = value !== newRows[rowIndex].originalTime[dayIndex];
    setRows(newRows);
  };

  const deleteRowImputations = async (row) => {
    if (hasNonDraftInWeek) {
      showSnack('Cannot delete row: A non-draft imputation exists in this week.');
      return;
    }
    const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
    const headers = { Authorization: `Bearer ${token}` };
    const promises = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const imputationId = row.idImputations[dayIndex];
      if (imputationId && imputationId !== null) {
        promises.push(
          axios.delete(`${API_URL}/imputations/${imputationId}`, { headers })
            .catch(error => showSnack(`Error deleting imputation `))
        );
      }
    }
    if (promises.length > 0) {
      await Promise.all(promises);
    }
  };

  const handleProjectChange = async (rowIndex, newProjectId) => {
    if (hasNonDraftInWeek) {
      showSnack('Cannot change project: A non-draft imputation exists in this week.');
      return;
    }
    const currentRow = rows[rowIndex];
    const oldProjectId = currentRow.projectId;
    if (oldProjectId === newProjectId || currentRow.isLeave || currentRow.isAbsence) return;
    try {
      setLoading(true);
      if (rowHasImputationsInCurrentPeriod(currentRow) && oldProjectId && oldProjectId !== newProjectId) {
        await deleteRowImputations(currentRow);
      }
      const newRows = [...rows];
      newRows[rowIndex] = {
        projectId: newProjectId,
        phaseId: '',
        taskId: '',
        time: Array(7).fill(''),
        originalTime: Array(7).fill(''),
        idImputations: Array(7).fill(null),
        description: Array(7).fill(null),
        valide: Array(7).fill(false),
        isModified: Array(7).fill(false),
        isDraft: Array(7).fill(true),
      };
      setRows(newRows);
    } catch (error) {
      showSnack('Error during project change');
      showSnack(`Error during project change`);
    } finally {
      setLoading(false);
    }
  };

  const handlePhaseChange = async (rowIndex, newPhaseId) => {
    if (hasNonDraftInWeek) {
      showSnack('Cannot change phase: A non-draft imputation exists in this week.');
      return;
    }
    const currentRow = rows[rowIndex];
    const oldPhaseId = currentRow.phaseId;
    if (oldPhaseId === newPhaseId || currentRow.isLeave || currentRow.isAbsence) return;
    try {
      setLoading(true);
      if (rowHasImputationsInCurrentPeriod(currentRow) && oldPhaseId && oldPhaseId !== newPhaseId) {
        await deleteRowImputations(currentRow);
      }
      const newRows = [...rows];
      newRows[rowIndex].phaseId = newPhaseId;
      newRows[rowIndex].taskId = '';
      newRows[rowIndex].time = Array(7).fill('');
      newRows[rowIndex].originalTime = Array(7).fill('');
      newRows[rowIndex].idImputations = Array(7).fill(null);
      newRows[rowIndex].isModified = Array(7).fill(false);
      newRows[rowIndex].isDraft = Array(7).fill(true);
      setRows(newRows);
      if (newPhaseId) {
        await loadTasks(newPhaseId, rowIndex);
      }
    } catch (error) {
      showSnack('Error during phase change');
      showSnack(`Error during phase change `);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskChange = async (rowIndex, newTaskId) => {
    if (hasNonDraftInWeek) {
      showSnack('Cannot change task: A non-draft imputation exists in this week.');
      return;
    }
    const currentRow = rows[rowIndex];
    const oldTaskId = currentRow.taskId;
    if (oldTaskId === newTaskId || currentRow.isLeave || currentRow.isAbsence) return;
    try {
      setLoading(true);
      if (rowHasImputationsInCurrentPeriod(currentRow) && oldTaskId && oldTaskId !== newTaskId) {
        await deleteRowImputations(currentRow);
      }
      const newRows = [...rows];
      newRows[rowIndex].taskId = newTaskId;
      newRows[rowIndex].time = Array(7).fill('');
      newRows[rowIndex].originalTime = Array(7).fill('');
      newRows[rowIndex].idImputations = Array(7).fill(null);
      newRows[rowIndex].isModified = Array(7).fill(false);
      newRows[rowIndex].isDraft = Array(7).fill(true);
      setRows(newRows);
    } catch (error) {
      showSnack('Error during task change');
      showSnack(`Error during task change`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRow = () => {
    if (hasNonDraftInWeek) {
      showSnack('Cannot add row: A non-draft imputation exists in this week.');
      return;
    }
    if (loading) {
      showSnack('Please wait until current operations are complete.');
      return;
    }
    if (projects.length === 0 || allPhases.length === 0 || allTasks.length === 0) {
      showSnack('Cannot add a row: Project, phase, or task data is not loaded.');
      return;
    }
    setRows([
      ...rows,
      {
        projectId: '',
        phaseId: '',
        taskId: '',
        time: Array(7).fill(''),
        originalTime: Array(7).fill(''),
        idImputations: Array(7).fill(null),
        description: Array(7).fill(null),
        valide: Array(7).fill(false),
        isModified: Array(7).fill(false),
        isDraft: Array(7).fill(true),
      },
    ]);
  };

const handleAddAbsence = async () => {
  if (hasNonDraftInWeek) {
    showSnack('Cannot add absence: A non-draft imputation exists in this week.');
    return;
  }
  try {
    setLoading(true);
    const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
    const headers = { Authorization: `Bearer ${token}` };

    // Fetch absence project
    const projectResponse = await axios.get(`${API_URL}/projects/absence`, { headers });
    const absenceProject = projectResponse.data;
    if (!absenceProject?.projectId) {
      throw new Error('Absence project not found');
    }

    // Add absence row (without taskId)
    const newRow = {
      projectId: absenceProject.projectId.toString(),
      phaseId: '', // No phase for absence
      taskId: '', // No task for absence
      time: Array(7).fill(''),
      originalTime: Array(7).fill(''),
      idImputations: Array(7).fill(null),
      description: Array(7).fill('Absence'),
      valide: Array(7).fill(false),
      isModified: Array(7).fill(false),
      isDraft: Array(7).fill(true),
      isAbsence: true,
    };

    setRows([...rows, newRow]);
    
    // Update projects state if needed
    setProjects(prev => {
      if (!prev.some(p => p.id === absenceProject.projectId)) {
        return [...prev, { id: absenceProject.projectId, name: absenceProject.name }];
      }
      return prev;
    });
  } catch (error) {
    showSnack('Error adding absence');

  } finally {
    setLoading(false);
  }
};

  const handleAddTask = () => {
    navigate(`/imputations/valid/${userId}`);
  };
   const handleemployeelist = () => {
    navigate(`/employees-by-manager/${userId}`);
  };

  const prevWeek = () => {
    const prev = new Date(startDate);
    prev.setDate(prev.getDate() - 7);
    setStartDate(prev);
  };

  const nextWeek = () => {
    const next = new Date(startDate);
    next.setDate(next.getDate() + 7);
    setStartDate(next);
  };

  const totalHours = getWeeklyTotal();
  const weeklyLimit = employeeRegime === 'H48' ? 48 : 40;

  const hasAnyDayOverLimit = () => {
    return dailyTotalErrors.some(error => error);
  };

  const periodLabel = `${startDate.getDate()} ${startDate.toLocaleString('en-US', { month: 'long' })} - ${
    days[6].getDate()
  } ${days[6].toLocaleString('en-US', { month: 'long' })} ${startDate.getFullYear()}`;

const handleSave = async () => {
  try {
    if (weeklyTotalError) {
      showSnack(`Cannot save: Weekly total exceeds ${weeklyLimit} hours.`);
      return;
    }
    if (hasAnyDayOverLimit()) {
      showSnack('Cannot save: Some days exceed the 8-hour limit.');
      return;
    }
    if (!userId) {
      showSnack('User ID not found. Please log in again.');
      return;
    }
    if (loading) return;
    setLoading(true);
    const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
    const headers = { Authorization: `Bearer ${token}` };
    const promises = [];
    
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      if (row.isLeave) continue;
      
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const currentHours = Number(row.time?.[dayIndex] || 0);
        const originalHours = Number(row.originalTime?.[dayIndex] || 0);
        const imputationId = row.idImputations?.[dayIndex];
        const date = new Date(startDate);
        date.setDate(date.getDate() + dayIndex);
        
        const payload = {
          userId: Number(userId),
          date: formatLocalDate(date),
          hours: currentHours,
          draft: false,
        };

        // Handle absence case (projectId but no taskId)
        if (row.isAbsence) {
          payload.projectId = Number(row.projectId);
        } 
        // Handle normal case (with taskId)
        else if (row.taskId) {
          payload.taskId = Number(row.taskId);
        } else {
          continue; // Skip if neither absence nor normal task
        }

        if (imputationId && currentHours !== originalHours) {
          if (currentHours > 0) {
            promises.push(
              axios.put(`${API_URL}/imputations/${imputationId}`, payload, { headers })
            );
          } else {
            promises.push(
              axios.delete(`${API_URL}/imputations/${imputationId}`, { headers })
            );
          }
        } else if (!imputationId && currentHours > 0) {
          promises.push(
            axios.post(`${API_URL}/imputations`, payload, { headers })
          );
        }
      }
    }
    
    if (promises.length === 0) {
      showSnack('No changes to save');
      setLoading(false);
      return;
    }
    
    await Promise.all(promises);
    showSnack('Imputations saved successfully!');
    await loadImputations(startDate);
  } catch (error) {
    showSnack('Error during save:');
    showSnack(`Error during save: ${error.message}`);
  } finally {
    setLoading(false);
  }
};


  const areAllImputationsValidated = () => {
    const hasImputations = rows.some(row => 
      !row.isLeave && !row.isAbsence && (row.time || []).some((time, index) => Number(time || 0) > 0)
    );
    
    if (!hasImputations) return false;

    return rows.every(row => {
      if (row.isLeave || row.isAbsence) return true;
      return (row.valide || []).every((val, index) => {
        const hasTime = Number(row.time?.[index] || 0) > 0;
        return !hasTime || (hasTime && val === true);
      });
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (imputationId, taskId, currentDescription, dayDate) => {
    if (hasNonDraftInWeek) {
      showSnack('Cannot edit description: A non-draft imputation exists in this week.');
      return;
    }
    if (!imputationId) {
      showSnack('Cannot edit description: No imputation exists for this task on this day. Please save the imputation first.');
      return;
    }
    const strippedDayDate = stripTime(dayDate);
    if (strippedDayDate > today) {
      showSnack('You cannot edit descriptions for future days.');
      return;
    }
    setSelectedImputationId(imputationId);
    setSelectedTaskId(taskId);
    setNewDescription(currentDescription || '');
    setDialogError('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedImputationId(null);
    setSelectedTaskId(null);
    setNewDescription('');
    setDialogError('');
  };

  const handleSaveDescription = async () => {
    if (!newDescription.trim()) {
      setDialogError('Description cannot be empty.');
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
      await axios.put(
        `${API_URL}/imputations/${selectedImputationId}/description`,
        { description: newDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newRows = [...rows];
      for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex];
        if (row.taskId === selectedTaskId) {
          for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            if (row.idImputations[dayIndex] === selectedImputationId) {
              newRows[rowIndex].description[dayIndex] = newDescription;
            }
          }
        }
      }
      setRows(newRows);
      showSnack('Description updated successfully!');
      handleCloseDialog();
    } catch (error) {
      showSnack('Error updating description:');
      setDialogError(`Failed to update description: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Timesheet
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
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
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography>Name: {lastname} {firstname}</Typography>
            <Typography>Work Regime: {employeeRegime} (Max {weeklyLimit}h per week)</Typography>
            <Typography>Total time: {totalHours} h</Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton onClick={prevWeek}>
                  <ArrowBack />
                </IconButton>
                <Typography>Period: {periodLabel}</Typography>
                <IconButton onClick={nextWeek}>
                  <ArrowForward />
                </IconButton>
              </Box>
              <Button
                variant="contained"
                onClick={handleAddTask}
                size="small"
              >
                Imputation
              </Button>
{role === 'MANAGER' && (
    <Button
      variant="contained"
      onClick={handleemployeelist}
      size="small"
    >
      Employee list
    </Button>
  )}

            </Box>
          </Grid>
        </Grid>
        {weeklyTotalError && (
          <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2">
              <strong>Attention :</strong> The total hours for the week ({totalHours}h) exceed the limit of {weeklyLimit}h for regime {employeeRegime}.
            </Typography>
          </Alert>
        )}
        {activeTab === 0 && areAllImputationsValidated() && rows.length > 0 && (
          <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2">
              ✅ All imputations for the week have been validated.
            </Typography>
          </Alert>
        )}
        {dailyTotalErrors.some(error => error) && (
          <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2">
              <strong>Attention :</strong> Some days exceed the 8-hour limit:
              {days.map((day, index) =>
                dailyTotalErrors[index] ? (
                  <span key={index} style={{ marginLeft: '8px' }}>
                    {formatDate(day)} ({getDayTotal(index)}h)
                  </span>
                ) : null
              )}
            </Typography>
          </Alert>
        )}
        {validatedLeaves.length > 0 && (
          <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2">
              <strong>Information :</strong> You have approved leave during this period:
              {validatedLeaves.map((leave, index) => (
                <span key={index} style={{ marginLeft: '8px' }}>
                  from {leave.startDate} to {leave.endDate} ({leave.leaveTypeName || 'Leave'}, {isLeaveFullTime(leave) ? 'Full-time' : `${leave.numberOfHours}h/day`})
                </span>
              ))}
            </Typography>
          </Alert>
        )}
        {hasNonDraftInWeek && (
          <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2">
              <strong>Information :</strong> This week's timesheet is locked because a non-draft imputation exists.
            </Typography>
          </Alert>
        )}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="timesheet tabs">
            <Tab label="Detail" />
            <Tab label="Resume" />
          </Tabs>
        </Box>
        {activeTab === 0 && (
          <Box sx={{ overflowX: 'auto', mt: 2 }}>
            <Table sx={{ minWidth: 'max-content', width: '100%', maxWidth: 1000, margin: '0 auto' }}>
              <TableHead>
                <TableRow sx={{ borderBottom: '2px solid #000' }}>
                  <TableCell sx={{ textAlign: 'center', padding: '0px', maxWidth: '100px', minWidth: '120px' }}>Project</TableCell>
                  <TableCell sx={{ textAlign: 'center', padding: '0px', maxWidth: '100px', minWidth: '120px' }}>Phase</TableCell>
                  <TableCell sx={{ textAlign: 'center', padding: '0px', maxWidth: '100px', minWidth: '120px' }}>Task</TableCell>
                  {days.map((d, i) => (
                    <TableCell
                      key={i}
                      sx={{
                        textAlign: 'center',
                        padding: 0,
                        border: 'none',
                        width: '60px',
                        minWidth: '60px',
                        maxWidth: '60px',
                      }}
                    >
                      <Box sx={{ padding: 0, margin: 0 }}>
                        {formatDate(d)}
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{
                            fontSize: '1.95rem',
                            padding: 0,
                            margin: 0,
                          }}
                        >
                          Total: {getDayTotal(i)}h
                        </Typography>
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, idx) => (
                  <TableRow
                    key={idx}
                    sx={{
                      '& td': {
                        padding: '0px',
                        borderBottom: '1px solid #ddd',
                      },
                    }}
                  >
                    <TableCell>
  {row.isLeave ? (
    <Typography sx={{ padding: '8px', paddingLeft: '24px', color: '#000000' }}>
      {rows[idx].isFullTime ? 'Complete Leave' : 'Partial Leave'}
    </Typography>
  ) : (row.isAbsence || (row.taskId === null && row.projectId !== null)) ? (
    <Typography sx={{ padding: '8px', fontWeight: 'bold', color: '#000000' }}>
      Absence
    </Typography>
  ) : (
    <Select
  value={rows[idx].projectId || ''}
  onChange={(e) => handleProjectChange(idx, e.target.value)}
  fullWidth
  displayEmpty
  disabled={loading || hasNonDraftInWeek}
  size="small"
  sx={{
    padding: '0',
    fontSize: '1.85rem',
    '& .MuiSelect-select': { padding: '4px 8px' },
  }}
>
  <MenuItem value="">Select a project</MenuItem>
  {projects
    .filter((p) => p.name.toLowerCase() !== 'absence') // Exclure le projet "Absence"
    .map((p) => (
      <MenuItem key={p.id} value={p.id}>
        {p.name}
      </MenuItem>
    ))}
</Select>

  )}
</TableCell>
                    <TableCell>
  {row.isLeave ? (
    <Typography sx={{ padding: '8px', paddingLeft: '24px', color: '#000000' }}>
      {row.leaveTypeName || 'Leave'}
    </Typography>
  ) : (row.isAbsence || (row.taskId === null && row.projectId !== null)) ? (
    <Typography sx={{ padding: '8px', fontWeight: 'bold', color: '#000000' }}>
      Absence
    </Typography>
  ) : (
    <Select
      value={row.phaseId || ''}
      onChange={(e) => handlePhaseChange(idx, e.target.value)}
                          fullWidth
                          displayEmpty
                          disabled={!row.projectId || loading || hasNonDraftInWeek}
                          size="small"
                          sx={{
                            padding: '0',
                            fontSize: '1.85rem',
                            '& .MuiSelect-select': { padding: '4px 8px' },
                          }}
                        >
                          <MenuItem value="">Select a phase</MenuItem>
                          {allPhases
                            .filter((p) => p.projectId == row.projectId)
                            .map((p) => (
                              <MenuItem key={p.phaseId} value={p.phaseId}>
                                {p.name}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                    </TableCell>
                   <TableCell>
  {row.isLeave ? (
    <Typography sx={{ padding: '8px' }}></Typography>
  ) : (row.isAbsence || (row.taskId === null && row.projectId !== null)) ? (
    <Typography sx={{ padding: '8px', fontWeight: 'bold', color: '#000000' }}>
      Absence
    </Typography>
  ) : (
    <Select
      value={row.taskId || ''}
      onChange={(e) => handleTaskChange(idx, e.target.value)}
                                fullWidth
                          displayEmpty
                          disabled={!row.phaseId || loading || hasNonDraftInWeek}
                          size="small"
                          sx={{
                            padding: '0',
                            fontSize: '1.85rem',
                            '& .MuiSelect-select': { padding: '4px 8px' },
                          }}
                        >
                          <MenuItem value="">Select a task</MenuItem>
                          {allTasks
                            .filter((t) => t.phaseId == row.phaseId)
                            .map((t) => (
                              <MenuItem key={t.taskId} value={t.taskId}>{t.name}</MenuItem>
                            ))}
                        </Select>
                      )}
                    </TableCell>
                    {(row.time || Array(7).fill('')).map((h, dayIdx) => {
                      const dayDate = days[dayIdx];
                      const strippedDayDate = stripTime(dayDate);
                      const isValidated = isDayValidated(idx, dayIdx);
                      const isFuture = strippedDayDate > today;
                      const hasExistingImputation = row.idImputations[dayIdx] !== null;
const isInputDisabled = row.isLeave || 
                       loading || 
                       isValidated || 
                       isFuture || 
                       hasNonDraftInWeek || 
                       (row.isAbsence && row.isDraft?.[dayIdx] === false);                      const displayValue = h;

                      console.log(`Row ${idx}, Day ${dayIdx}: isInputDisabled=${isInputDisabled}, isLeave=${row.isLeave}, isAbsence=${row.isAbsence}, isValidated=${isValidated}, isFuture=${isFuture}, hasNonDraftInWeek=${hasNonDraftInWeek}, loading=${loading}`); // Debug log

                      return (
                        <TableCell
                          key={dayIdx}
                          sx={{
                            padding: '4px',
                            border: 'none !important',
                            borderBottom: 'none',
                            backgroundColor: (row.isLeave || row.isAbsence) ? '#FFFFF' : 'inherit',
                          }}
                        >
                          <Tooltip
                            title={
                              hasNonDraftInWeek
                                ? 'Cannot modify: A non-draft imputation exists in this week.'
                                : row.isLeave
                                ? `Leave: ${row.isFullTime ? 'Full-time' : `${row.time[dayIdx]}h`}`
                                : isFuture
                                ? 'Cannot enter hours for future days.'
                                : isValidated
                                ? 'This day has been approved - Modification not allowed.'
                                : hasExistingImputation
                                ? 'This imputation is saved. You can modify the hours.'
                                : dailyTotalErrors[dayIdx] || weeklyTotalError
                                ? 'Invalid: Exceeds daily or weekly limit'
                                : row.isAbsence
                                ? 'Enter absence hours'
                                : ''
                            }
                          >
                            <TextField
                              type="number"
                              value={displayValue}
                              onChange={(e) => handleChange(idx, dayIdx, e.target.value)}
                              inputProps={{
                                min: 0,
                                max: 8,
                                step: 0.5,
                                style: {
                                  textAlign: 'center',
                                  padding: '6px 4px',
                                  fontSize: '1.85rem',
                                },
                              }}
                              disabled={isInputDisabled}
                              size="small"
                              sx={{
                                width: '70px',
                                '& .MuiOutlinedInput-root': {
                                  padding: 0,
                                  height: '36px',
                                  fontSize: '1.85rem',
                                },
                              }}
                            />
                          </Tooltip>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={10}>
                    <Box display="flex" gap={2}>
                      <Button startIcon={<Add />} onClick={handleAddRow} disabled={loading || hasNonDraftInWeek}>
                        Add a row
                      </Button>
                      <Button 
                        startIcon={<Add />} 
                        onClick={handleAddAbsence} 
                        disabled={loading || hasNonDraftInWeek}
                        color="secondary"
                      >
                        Add Absence
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        )}
        {activeTab === 1 && (
          <Box sx={{ mt: 2 }}>
            {days.map((day, dayIdx) => {
              const tasksForDay = rows.filter(
                (row) => (row.taskId || row.isLeave || row.isAbsence) && row.time?.[dayIdx] && Number(row.time[dayIdx]) > 0
              );
              const strippedDayDate = stripTime(day);
              const isFuture = strippedDayDate > today;
              if (tasksForDay.length === 0) {
                return (
                  <Box key={dayIdx} sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {formatDate(day)} - Total: {getDayTotal(dayIdx)}h
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      No tasks, leaves, or absences recorded for this day.
                    </Typography>
                  </Box>
                );
              }
              return (
                <Box key={dayIdx} sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1,
                    }}
                  >
                    {formatDate(day)} - Total: {getDayTotal(dayIdx)}h
                  </Typography>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ borderBottom: '2px solid #000' }}>
                        <TableCell sx={{ textAlign: 'center' }}>Project</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>Phase</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>Task</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>Description</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>Hours</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tasksForDay.map((row, idx) => {
                        const task = allTasks.find((t) => t.taskId == row.taskId);
                        const imputationId = row.idImputations?.[dayIdx];
                        const description = row.description?.[dayIdx] || task?.description || 'No description';
                       
                        return (
                          <TableRow key={idx}>
                            <TableCell sx={{ textAlign: 'center' }}>
  {row.isLeave ? (row.isFullTime ? 'Complete Leave' : 'Partial Leave') : row.isAbsence ? 'Absence' : getProjectName(row)}
</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              {row.isLeave ? (row.leaveTypeName || 'Leave') : row.isAbsence ? 'Absence' : getPhaseName(row.phaseId)}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              {row.isLeave ? '' : row.isAbsence ? 'Absence' : getTaskName(row.taskId)}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              <Typography variant="body2">{description}</Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {row.time[dayIdx]}h
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>
                              <Tooltip title={
                                hasNonDraftInWeek
                                  ? "Cannot edit description: A non-draft imputation exists in this week."
                                  : isFuture
                                  ? "Cannot edit description for future days."
                                  : row.isLeave
                                  ? "Cannot edit leave description."
                                  : imputationId
                                  ? "Edit Description"
                                  : "Save imputation first to edit description"
                              }>
                                <span>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenDialog(imputationId, row.taskId, description, day)}
                                    disabled={loading || !imputationId || isFuture || row.isLeave || hasNonDraftInWeek}
                                  >
                                    <Edit />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow>
                        <TableCell colSpan={5} sx={{ textAlign: 'right' }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            Total:
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {getDayTotal(dayIdx)}h
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              );
            })}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                Weekly Total: {totalHours}h
              </Typography>
            </Box>
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
              <DialogTitle>Edit Task Description</DialogTitle>
              <DialogContent>
                <TextField
                  label="Description"
                  value={newDescription}
                  onChange={(e) => {
                    setNewDescription(e.target.value);
                    setDialogError('');
                  }}
                  fullWidth
                  multiline
                  rows={4}
                  margin="dense"
                  error={!!dialogError}
                  helperText={dialogError}
                  disabled={hasNonDraftInWeek}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button
                  color="primary"
                  onClick={handleSaveDescription}
                  variant="contained"
                  disabled={loading || !newDescription.trim() || hasNonDraftInWeek}
                >
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          {!hasNonDraftInWeek && (
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading || weeklyTotalError || hasAnyDayOverLimit()}
              size="large"
              color="primary"
            >
              {loading
                ? 'Loading...'
                : weeklyTotalError
                ? `Cannot Save (Over ${weeklyLimit}h)`
                : hasAnyDayOverLimit()
                ? 'Cannot Save (Over 8h)'
                : 'Save'}
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Timesheet;
