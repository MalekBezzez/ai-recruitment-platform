import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography,Snackbar, TextField, Button,
  Box, MenuItem, Grid, Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddLeaveRequestsPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const employeeId = user?.user?.id;
  const API_URL = process.env.REACT_APP_API_URL;
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

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [selectedBalance, setSelectedBalance] = useState(null);
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: null,
    endDate: null,
    description: '',
    numberOfHours: ''    // ← new field
  });
  const [errors, setErrors] = useState({});
  const [balanceError, setBalanceError] = useState('');

  // Load leave types
  useEffect(() => {
    const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
    axios.get(`${API_URL}/leave-types`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setLeaveTypes(res.data))
    .catch(() => showSnack('Unable to retrieve leave types'));
  }, [API_URL]);

  // Fetch leave balance when type changes
  useEffect(() => {
    if (!formData.leaveType) {
      setSelectedBalance(null);
      return;
    }
    const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
    axios.get(
      `${API_URL}/leaves/${employeeId}/type/${formData.leaveType}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(res => {
      setSelectedBalance(res.data);
      setBalanceError('');
    })
    .catch(() => {
      setSelectedBalance(null);
      setBalanceError("Unable to fetch balance for this leave type");
    });
  }, [formData.leaveType, employeeId, API_URL]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
    setErrors(err => ({ ...err, [name]: false }));
    setBalanceError('');
  };

  const handleDateChange = (name, date) => {
    setFormData(fd => ({ ...fd, [name]: date }));
    setErrors(err => ({ ...err, [name]: false }));
    setBalanceError('');
  };

  const validateForm = () => {
    const newErr = {
      leaveType: !formData.leaveType,
      startDate: !formData.startDate,
      endDate:   !formData.endDate,
      // require hours if single-day request
      numberOfHours:
        formData.startDate &&
        formData.endDate &&
        formData.startDate.toDateString() === formData.endDate.toDateString() &&
        !formData.numberOfHours
    };
    setErrors(newErr);
    return !Object.values(newErr).some(x => x);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    // Calculate days difference
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysDiff = Math.round(
      (formData.endDate - formData.startDate) / msPerDay
    );

    let totalHours;
    const hoursInput = parseFloat(formData.numberOfHours);

    const payload = {
      leaveTypeId: formData.leaveType,
      description: formData.description,
      startDate:   formData.startDate.toISOString().slice(0,10),
      endDate:     formData.endDate.toISOString().slice(0,10),
      employeeId
    };

    if (daysDiff === 0) {
      // single-day or partial-day
      totalHours = hoursInput || 8;
      payload.numberOfHours = totalHours;
    } else if (formData.numberOfHours) {
      // multi-day plus partial last day
      totalHours = daysDiff * 8 + hoursInput;
      payload.totalHours = totalHours;
    } else {
      // all full days
      totalHours = (daysDiff + 1) * 8;
      payload.totalHours = totalHours;
    }

    // check against available balance
    const availableHours = (selectedBalance?.solde ?? 0) * 8;
    if (availableHours < totalHours) {
      setBalanceError(
        `Insufficient balance: only ${selectedBalance?.solde} day(s) ` +
        `(${availableHours} h) available for your request of ${totalHours} h.`
      );
      return;
    }

    try {
      const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
      const res = await fetch(`${API_URL}/leave-requests`, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          Authorization:   `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Submission error');
      }
      showSnack('Leave request submitted ');
      navigate('/leaveRequestEmployeeList');
    } catch (err) {
      showSnack(`Error: ${err.message}`);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mb: 2 }}>New Leave Request</Typography>
      <Paper sx={{ p: 4 }}>

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
        <form onSubmit={handleSubmit}>
          {formData.leaveType && selectedBalance && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Available balance: {selectedBalance.solde} day(s)
            </Alert>
          )}
          {balanceError && (
            <Alert severity="error" sx={{ mb: 2 }}>{balanceError}</Alert>
          )}

          <TextField
            select label="Leave Type" fullWidth
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            error={errors.leaveType}
            helperText={errors.leaveType && "Required"}
            sx={{ mb: 3 }}
          >
            {leaveTypes.map(lt => (
              <MenuItem key={lt.idLeaveType} value={lt.idLeaveType}>
                {lt.type}
              </MenuItem>
            ))}
          </TextField>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate}
                  minDate={new Date()}
                  onChange={d => handleDateChange('startDate', d)}
                  renderInput={params => (
                    <TextField {...params}
                      fullWidth required
                      error={errors.startDate}
                      helperText={errors.startDate && "Required"} />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="End Date"
                  value={formData.endDate}
                  minDate={formData.startDate || new Date()}
                  onChange={d => handleDateChange('endDate', d)}
                  renderInput={params => (
                    <TextField {...params}
                      fullWidth required
                      error={errors.endDate}
                      helperText={errors.endDate && "Required"} />
                  )}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>

          {/* Partial-day hours input */}
          {formData.startDate && formData.endDate && (
            <TextField
              label={
                formData.startDate.toDateString() === formData.endDate.toDateString()
                  ? "Number of hours"
                  : "Hours on last day (0.5–8)"
              }
              type="number"
              name="numberOfHours"
              inputProps={{ min: 0.5, max: 8, step: 0.5 }}
              value={formData.numberOfHours}
              onChange={handleChange}
              error={errors.numberOfHours}
              helperText={errors.numberOfHours && "Required for single-day"}
              fullWidth
              sx={{ mb: 3 }}
            />
          )}

          <TextField
            label="Description (optional)"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth multiline rows={4}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" color="primary" variant="contained">
              Submit
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AddLeaveRequestsPage;
