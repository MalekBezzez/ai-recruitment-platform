import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Button,
  TextField,
  Snackbar,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

export default function DiplomaManagementPage() {
  const { id } = useParams();
  const [diplomas, setDiplomas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, msg: '', severity: 'success' });
  const [editMode, setEditMode] = useState(false);
  const [currentDiploma, setCurrentDiploma] = useState(null);

  const [speciality, setSpeciality] = useState('');
  const [institution, setInstitution] = useState('');
  const [diplomeType, setDiplomeType] = useState('');
  const [diplomaYear, setDiplomaYear] = useState('');
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const resp = await axios.get(
          `${API_URL}/diplomas/employee/${id}`,
          config
        );
        setDiplomas(resp.data);
      } catch (err) {
        console.error(err);
        setError('Error while fetching diplomas.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const resetForm = () => {
    setEditMode(false);
    setCurrentDiploma(null);
    setSpeciality('');
    setInstitution('');
    setDiplomeType('');
    setDiplomaYear('');
  };

  const handleSaveDiploma = async () => {
    try {
      const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const diplomaData = {
        idDiplome: editMode && currentDiploma ? currentDiploma.idDiplome : null,
        employeId: parseInt(id, 10),
        speciality,
        institution,
        diplomeType,
        diplomaYear: diplomaYear ? parseInt(diplomaYear, 10) : null,
      };

      if (editMode && currentDiploma) {
        await axios.put(
          `${API_URL}/diplomas/${currentDiploma.idDiplome}`,
          diplomaData,
          config
        );
        setSnackbar({ open: true, msg: 'Diploma updated successfully!', severity: 'success' });
      } else {
        await axios.post(
          `${API_URL}/diplomas/employee/${id}`,
          diplomaData,
          config
        );
        setSnackbar({ open: true, msg: 'Diploma added successfully!', severity: 'success' });
      }

      const resp = await axios.get(
        `${API_URL}/diplomas/employee/${id}`,
        config
      );
      setDiplomas(resp.data);
      resetForm();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, msg: 'Error while saving diploma.', severity: 'error' });
    }
  };

  const handleDeleteDiploma = async (diplomaId) => {
    try {
      const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(
        `${API_URL}/diplomas/${diplomaId}`,
        config
      );
      const resp = await axios.get(
        `${API_URL}/diplomas/employee/${id}`,
        config
      );
      setDiplomas(resp.data);
      setSnackbar({ open: true, msg: 'Diploma deleted successfully!', severity: 'success' });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, msg: 'Error deleting diploma.', severity: 'error' });
    }
  };

  const handleEditDiploma = (d) => {
    setEditMode(true);
    setCurrentDiploma(d);
    setSpeciality(d.speciality);
    setInstitution(d.institution);
    setDiplomeType(d.diplomeType);
    setDiplomaYear(d.diplomaYear);
  };

  if (loading) return <CircularProgress />;
  if (error)   return <Typography color="error">{error}</Typography>;

  return (
    <Paper sx={{ p:4, m:'auto', maxWidth:800 }}>
      <Typography variant="h4" gutterBottom>Manage Diplomas</Typography>

      <Grid container spacing={2} sx={{ mb:3 }}>
        <Grid item xs={12}>
          <Typography variant="h6">
            {editMode ? 'Edit Diploma' : 'Add New Diploma'}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Speciality"
            value={speciality}
            onChange={e => setSpeciality(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Institution"
            value={institution}
            onChange={e => setInstitution(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Diploma Type"
            value={diplomeType}
            onChange={e => setDiplomeType(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Diploma Year"
            type="number"
            value={diplomaYear}
            onChange={e => setDiplomaYear(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sx={{ display:'flex', justifyContent:'flex-end' }}>
          <Button variant="contained" color="primary" onClick={handleSaveDiploma}>
            {editMode ? 'Update Diploma' : 'Add Diploma'}
          </Button>
          {editMode && (
            <Button sx={{ ml:2 }} onClick={resetForm}>Cancel</Button>
          )}
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>Existing Diplomas</Typography>
      <TableContainer component={Paper} sx={{ mb:3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Speciality</TableCell>
              <TableCell>Institution</TableCell>
              <TableCell>Diploma Type</TableCell>
              <TableCell>Diploma Year</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {diplomas.map(d => (
              <TableRow key={d.idDiplome}>
                <TableCell>{d.speciality}</TableCell>
                <TableCell>{d.institution}</TableCell>
                <TableCell>{d.diplomeType}</TableCell>
                <TableCell>{d.diplomaYear}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditDiploma(d)}><EditIcon/></IconButton>
                  <IconButton color="error" onClick={() => handleDeleteDiploma(d.idDiplome)}><DeleteIcon/></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <MuiAlert elevation={6} variant="filled" severity={snackbar.severity}>
          {snackbar.msg}
        </MuiAlert>
      </Snackbar>
    </Paper>
  );
}
