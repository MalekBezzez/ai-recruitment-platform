// 📁 src/pages/AnswersByQuestionnairePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, CircularProgress, Table, TableHead,
  TableRow, TableCell, TableBody, Paper, Button, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AnswersByQuestionnairePage = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const config = {
          headers: { Authorization: `Bearer ${token?.replace(/"/g, '') || ''}` },
        };
        const res = await axios.get(`${API_URL}/questionnaires`, config);
        setQuestionnaires(res.data);
      } catch (error) {
        console.error('Error loading questionnaires:', error);
      }
    };
    fetchQuestionnaires();
  }, []);

  const fetchResponses = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const config = {
        headers: { Authorization: `Bearer ${token?.replace(/"/g, '') || ''}` },
      };
      const res = await axios.get(`${API_URL}/questionnaires/${id}/answers`, config);
      setResponses(res.data);
    } catch (error) {
      console.error('Error loading answers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (event) => {
    const id = event.target.value;
    setSelectedId(id);
    fetchResponses(id);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>Questionnaire Responses</Typography>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel>Select a questionnaire</InputLabel>
        <Select value={selectedId} label="Select a questionnaire" onChange={handleSelectChange}>
          {questionnaires.map(q => (
            <MenuItem key={q.questionnaireId} value={q.questionnaireId}>{q.title}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading ? <CircularProgress /> : selectedId && (
        <Paper sx={{ p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Number of Responses</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {responses.map((res, i) => (
                <TableRow key={i}>
                  <TableCell>{res.employeName}</TableCell>
                  <TableCell>{res.answerCount}</TableCell>
                  <TableCell>
                    <Button color="primary"
                      variant="outlined"
                      onClick={() => navigate(`/answers/${selectedId}/${res.employeId}`)}>
                      View Answers
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default AnswersByQuestionnairePage;
