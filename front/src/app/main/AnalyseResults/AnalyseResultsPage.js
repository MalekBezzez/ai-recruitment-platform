import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, CircularProgress, TextField, InputAdornment,
  TablePagination, Grid, Drawer, IconButton, Alert, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import ScoreBar from '../components/ScoreBar';

const API_URL = process.env.REACT_APP_API_URL;

const fetchEmployeeInfo = async (id) => {
  try {
    const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await fetch(`${API_URL}/employee/${id}`, config);
    if (res.ok) return await res.json();
    console.error(`Failed to fetch employee ${id}: ${res.status}`);
    return { firstname: '', lastname: '' };
  } catch (err) {
    console.error(`Error fetching employee ${id}:`, err);
    return { firstname: '', lastname: '' };
  }
};

const fetchAnalysisResults = async (questionnaireId) => {
  try {
    const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await fetch(`${API_URL}/results/questionnaire/${questionnaireId}`, config);
    if (res.ok) return await res.json();
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  } catch (err) {
    console.error('Error fetching analysis results:', err);
    throw err;
  }
};

// Fonction utilitaire pour formater le score
const formatScore = (value) => {
  if (value == null) return 0;
  const num = Number(value);
  return num % 1 === 0 ? num : num.toFixed(2);
};

const AnalyseResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const questionnaireId = id;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRow, setSelectedRow] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const loadAnalysisResults = async () => {
      if (!questionnaireId) {
        setError('Questionnaire ID is required');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const analysisResults = await fetchAnalysisResults(questionnaireId);

        if (!analysisResults || analysisResults.length === 0) {
          setResults([]);
          setLoading(false);
          return;
        }

        const enrichedResults = await Promise.all(
          analysisResults.map(async (result) => {
            const employee = await fetchEmployeeInfo(result.employeeId);
            return {
              employee_id: result.employeeId,
              fullName: `${employee.firstname} ${employee.lastname}`.trim(),
              satisfaction_score_pct: result['global_satisfaction_%'],
              unsatisfaction_score_pct: result['dissatisfaction_score_%'],
              resignation_risk_score: result['adjusted_satisfaction_%'],
              satisfaction_causes: result.satisfaction_causes ? result.satisfaction_causes.split('; ') : [],
              unsatisfaction_causes: result.dissatisfaction_causes ? result.dissatisfaction_causes.split('; ') : [],
              resignation_risk_causes: result.dissatisfaction_causes ? result.dissatisfaction_causes.split('; ') : [],
              analyzed_at: result.analyzed_at || null,
            };
          })
        );

        setResults(enrichedResults);
      } catch (err) {
        setError(err.message || 'Error loading analysis results');
        console.error('Error loading analysis results:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalysisResults();
  }, [questionnaireId]);

  const handleViewCharts = () => {
    navigate(`/satisfaction-analysis/${questionnaireId}`);
  };

  const filteredResults = results.filter(row =>
    row.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
    row.employee_id?.toString().includes(searchText)
  );

  const pagedResults = filteredResults.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  const getRiskColor = (score, label) => {
    if (score == null) return 'gray';
    switch (label.toLowerCase()) {
      case 'satisfaction score':
        return score >= 70 ? 'red' : score >= 40 ? 'orange' : 'green';
      case 'unsatisfaction score':
        return score >= 40 ? 'green' : score >= 20 ? 'orange' : 'red';
      case 'resignation risk':
        return score >= 70 ? 'green' : score >= 40 ? 'orange' : 'red';
      default:
        return 'gray';
    }
  };

  const handleOpenDrawer = (row) => {
    setSelectedRow(row);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedRow(null);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <Paper elevation={0} sx={{ backgroundColor: 'transparent', px: 10, py: 0 }}>
        <Typography variant="h4" mb={2} fontWeight="bold">
          Analysis Results
        </Typography>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          <Box mt={1}>
            <button onClick={handleRetry} style={{ marginLeft: '10px' }}>
              Retry
            </button>
          </Box>
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ backgroundColor: 'transparent', px: 10, py: 0 }}>
      <Typography variant="h4" mb={2} fontWeight="bold">
        Analysis Results
      </Typography>

      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <Grid item>
          <TextField
            placeholder="Search by name or ID"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              )
            }}
            sx={{ width: 350 }}
          />
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleViewCharts}
          >
            View Charts
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {results.length === 0 ? (
            <Box textAlign="center" mt={4}>
              <Typography variant="h6" color="text.secondary">
                No analysis results found for this questionnaire
              </Typography>
            </Box>
          ) : (
            <>
              <Table sx={{ backgroundColor: '#fff' }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center"><b>Employee ID</b></TableCell>
                    <TableCell align="center"><b>Full Name</b></TableCell>
                    <TableCell align="center"><b>Satisfaction (%)</b></TableCell>
                    <TableCell align="center"><b>Unsatisfaction (%)</b></TableCell>
                    <TableCell align="center"><b>Satisfaction global</b></TableCell>
                    <TableCell align="center"><b>Analyzed At</b></TableCell>
                    <TableCell align="center"><b>Details</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagedResults.map((row) => (
                    <TableRow key={row.employee_id}>
                      <TableCell align="center">{row.employee_id}</TableCell>
                      <TableCell align="center">{row.fullName}</TableCell>
                      <TableCell align="center">{formatScore(row.satisfaction_score_pct)}</TableCell>
                      <TableCell align="center">{formatScore(row.unsatisfaction_score_pct)}</TableCell>
                      <TableCell align="center">
                        <strong style={{ color: getRiskColor(row.resignation_risk_score, 'Resignation Risk') }}>
                          {formatScore(row.resignation_risk_score) + ' / 100'}
                        </strong>
                      </TableCell>
                      <TableCell align="center">
                        {row.analyzed_at ? new Date(row.analyzed_at).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleOpenDrawer(row)}>
                          <InfoIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <TablePagination
                component="div"
                count={filteredResults.length}
                page={currentPage}
                onPageChange={(e, newPage) => setCurrentPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
              />
            </>
          )}

          <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
            <Box sx={{ width: 500, p: 4, backgroundColor: '#fafafa', height: '100%' }}>
              {selectedRow && (
                <>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Analysis Details - {selectedRow.fullName}
                  </Typography>
                  {selectedRow.analyzed_at && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Analyzed on: {new Date(selectedRow.analyzed_at).toLocaleString()}
                    </Typography>
                  )}
                  <ScoreBar
                    label="Satisfaction Score"
                    value={formatScore(selectedRow.satisfaction_score_pct)}
                    causes={selectedRow.satisfaction_causes}
                    color={getRiskColor(selectedRow.satisfaction_score_pct, 'Satisfaction Score')}
                  />
                  <ScoreBar
                    label="Unsatisfaction Score"
                    value={formatScore(selectedRow.unsatisfaction_score_pct)}
                    causes={selectedRow.unsatisfaction_causes}
                    color={getRiskColor(selectedRow.unsatisfaction_score_pct, 'Unsatisfaction Score')}
                  />
                  <ScoreBar
                    label="Satisfaction global score"
                    value={formatScore(selectedRow.resignation_risk_score)}
                    causes={selectedRow.resignation_risk_causes}
                    color={getRiskColor(selectedRow.resignation_risk_score, 'Resignation Risk')}
                  />
                </>
              )}
            </Box>
          </Drawer>
        </>
      )}
    </Paper>
  );
};

export default AnalyseResultsPage;
