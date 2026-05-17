import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, CircularProgress, Table, TableHead,
  TableRow, Button, TableCell, TableBody, Paper, TextField,
  IconButton,Snackbar,Alert, Tooltip, TableContainer, TablePagination
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const SurveyManagementPage = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [respondentCounts, setRespondentCounts] = useState({});
  const [analysisExists, setAnalysisExists] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  // --- AJOUT PAGINATION ---
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const config = {
          headers: { Authorization: `Bearer ${token?.replace(/"/g, '') || ''}` },
        };

        const res = await axios.get(`${API_URL}/questionnaires/with-response-count`, config);
        setQuestionnaires(res.data);
        setFiltered(res.data);

        const counts = {};
        const analysisStatus = {};
        await Promise.all(
          res.data.map(async (q) => {
            try {
              const countRes = await axios.get(
                `${API_URL}/answers/questionnaire/${q.questionnaireId}/count`,
                config
              );
              counts[q.questionnaireId] = countRes.data;

              const analysisRes = await axios.get(
                `${API_URL}/results/questionnaire/${q.questionnaireId}`,
                config
              );
              analysisStatus[q.questionnaireId] = analysisRes.data && analysisRes.data.length > 0;
            } catch (err) {
              counts[q.questionnaireId] = 0;
              analysisStatus[q.questionnaireId] = false;
            }
          })
        );
        setRespondentCounts(counts);
        setAnalysisExists(analysisStatus);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const result = questionnaires.filter(q =>
      q.title.toLowerCase().includes(lowerSearch)
    );
    setFiltered(result);
    setCurrentPage(0); // Reset page on search
  }, [search, questionnaires]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      try {
        const token = localStorage.getItem('accessToken');
        const config = {
          headers: { Authorization: `Bearer ${token?.replace(/"/g, '') || ''}` },
        };
        await axios.delete(`${API_URL}/questionnaires/${id}`, config);
        setQuestionnaires(prev => prev.filter(q => q.questionnaireId !== id));
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleNlpAnalysis = async (questionnaireId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const raw = JSON.parse(localStorage.getItem('user')) || {};
      const userId = raw.user?.id;
      const config = {
        headers: {
          Authorization: `Bearer ${token?.replace(/"/g, '') || ''}`,
          'Content-Type': 'application/json',
        },
      };

      const res = await axios.get(`${API_URL}/answers/with-answers/${questionnaireId}`, config);
      const responses = res.data;

      const formatted = responses.map(response => {
        const questionType = response.questionType.toLowerCase();
        const base = {
          employeeId: response.employeeId,
          questionId: response.questionId,
          questionType,
          questionText: response.questionText,
          weight: response.weight ?? 1,
          answer: questionType === 'choice' ? parseFloat(response.responseText).toString() : response.responseText,
          questionnaireId: questionnaireId,
        };

        if (['choice', 'likert', 'boolean'].includes(questionType)) {
          base.scale_max = response.scaleMax ?? 3;
        }
        if (questionType === 'likert' && Array.isArray(response.likertLabels) && response.likertLabels.length > 0) {
          base.likert_labels = response.likertLabels;
        }
        return base;
      });

      const payload = {
        initiatorUserId: parseInt(userId, 10),
        responses: formatted
      };

      await axios.post(`${API_URL}/nlp/analyze`, payload, config);
      showSnack(" The analysis of your questionnaire has started. You will receive a notification when it is completed.");
    } catch (error) {
      console.error(" Erreur NLP :", error);
      showSnack(" Échec de la mise en file d'attente de l'analyse NLP");
    }
  };

  const handleViewAnalysis = (questionnaireId) => {
    navigate(`/analyseresults/${questionnaireId}`);
  };

  // PAGINATION HANDLERS
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  // Pagination slice
  const paginatedRows = filtered.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="h4">Survey Management</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <TextField
          label="Search by title"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 300 }}
          size="small"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/create-questionnaire')}
        >
          Add Questionnaire
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Paper sx={{ p: 2 }}>
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
          <TableContainer>
            <Table>
              <TableHead>
  <TableRow>
    <TableCell align="center" sx={{ fontWeight: 600, fontSize: '1.46rem' }}>Survey Title</TableCell>
    <TableCell align="center" sx={{ fontWeight: 600, fontSize: '1.46rem' }}>Survey Description</TableCell>
    <TableCell align="center" sx={{ fontWeight: 600, fontSize: '1.46rem' }}>Respondents</TableCell>
    <TableCell align="center" sx={{ fontWeight: 600, fontSize: '1.46rem' }}>Actions</TableCell>
  </TableRow>
</TableHead>
<TableBody>
  {paginatedRows.map((q) => (
    <TableRow key={q.questionnaireId}>
      <TableCell align="center">{q.title}</TableCell>
      <TableCell align="center">{q.description}</TableCell>
      <TableCell align="center">
        {respondentCounts[q.questionnaireId] !== undefined
          ? respondentCounts[q.questionnaireId]
          : <CircularProgress size={16} />}
      </TableCell>
      <TableCell align="center">
        <Tooltip title="View Answers">
          <IconButton color="primary" onClick={() => navigate(`/answers-overview/${q.questionnaireId}`)}>
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="NLP Analysis">
          <IconButton color="success" onClick={() => handleNlpAnalysis(q.questionnaireId)}>
            <PsychologyAltIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={
            analysisExists[q.questionnaireId]
              ? "View Analysis"
              : "Analysis not available"
          }
        >
          <span>
            <IconButton
              color="info"
              onClick={() => handleViewAnalysis(q.questionnaireId)}
              disabled={!analysisExists[q.questionnaireId]}
            >
              <AnalyticsIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Delete Survey">
          <IconButton color="error" onClick={() => handleDelete(q.questionnaireId)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filtered.length}
            page={currentPage}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Box>
  );
};

export default SurveyManagementPage;
