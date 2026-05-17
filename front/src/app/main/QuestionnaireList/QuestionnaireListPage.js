import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const QuestionnaireListPage = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const config = {
          headers: {
            Authorization: `Bearer ${token?.replace(/"/g, '') || ''}`,
          },
        };
        const res = await axios.get(`${API_URL}/questionnaires`, config);
        setQuestionnaires(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestionnaires();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>Questionnaire List</Typography>

      {/* Boutons d'action */}
      <Stack direction="row" spacing={2} mb={3}>
        <Button
          variant="outlined"
          onClick={() => navigate('/questionnaire/create')}
        >
          Créer un Questionnaire
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate('/survey-management')}
        >
          Gestion des Surveys
        </Button>
      </Stack>

      {loading ? <CircularProgress /> : (
        <Stack spacing={2}>
          {questionnaires.map(q => (
            <Card key={q.questionnaireId}>
              <CardContent>
                <Typography variant="h6">{q.title}</Typography>
                <Typography variant="body2" color="textSecondary">{q.description}</Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 1 }} 
                  onClick={() => navigate(`/questionnaire/${q.questionnaireId}/answer`)}>
                  Répondre
                </Button>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default QuestionnaireListPage;
