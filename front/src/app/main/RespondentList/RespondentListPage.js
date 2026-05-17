import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Typography, CircularProgress, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, Button
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const RespondentListPage = () => {
  const { questionnaireId } = useParams();
  const [respondents, setRespondents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  useEffect(() => {
    const fetchRespondents = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const config = {
          headers: { Authorization: `Bearer ${token?.replace(/"/g, '') || ''}` },
        };
        const res = await axios.get(
          `${API_URL}/answers/questionnaire/${questionnaireId}/employees`,
          config
        );
        setRespondents(res.data);
      } catch (err) {
        console.error('Failed to load respondents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRespondents();
  }, [questionnaireId]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>Respondents</Typography>
      {loading ? (
        <CircularProgress />
      ) : respondents.length === 0 ? (
        <Typography>No employees have answered this questionnaire yet.</Typography>
      ) : (
        <Paper sx={{ p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {respondents.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.firstname} {emp.lastname}</TableCell>
                  <TableCell>
                    <Button  color="primary"
                      variant="outlined"
                      onClick={() =>
                        navigate(`/answers/${questionnaireId}/${emp.id}`)
                      }
                    >
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

export default RespondentListPage;
