import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Button, TextField, Typography, Paper,
  RadioGroup, FormControlLabel, Radio,
  CircularProgress, Snackbar, Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const AnswerQuestionnairePage = () => {
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
  const { questionnaireId } = useParams();
  const [questionnaire, setQuestionnaire] = useState(null);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const config = { headers: { Authorization: `Bearer ${token?.replace(/"/g, '') || ''}` } };
        const res = await axios.get(`${API_URL}/questionnaires/${questionnaireId}`, config);
        setQuestionnaire(res.data);

        const initialAnswers = {};
        res.data.questions.forEach(q => {
          initialAnswers[q.questionId] = q.questionType === 'BOOLEAN' ? null : '';
        });
        setAnswers(initialAnswers);
      } catch (err) {
        console.error(err);
        showSnack(' Failed to load questionnaire', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestionnaire();
  }, [questionnaireId, API_URL]);

  const handleChange = (qid, value) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
    setErrors(prev => ({ ...prev, [qid]: false }));
  };

  const handleSubmit = async () => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const employeId = currentUser?.user?.id;
    const token = localStorage.getItem('accessToken');
    const config = { headers: { Authorization: `Bearer ${token?.replace(/"/g, '') || ''}` } };

    if (!questionnaireId || !employeId) {
      showSnack(' Missing questionnaire ID or employee ID.', 'error');
      return;
    }

    // Validation
    const newErrors = {};
    questionnaire.questions.forEach(q => {
      const value = answers[q.questionId];
      if (value === undefined || value === null || value.toString().trim() === '') {
        newErrors[q.questionId] = true;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showSnack(' Please answer all required questions.', 'error');
      return;
    }

    const answerPayload = Object.entries(answers).map(([questionId, responseText]) => ({
      questionId: parseInt(questionId),
      responseText,
      questionnaireId: parseInt(questionnaireId),
      employeId: parseInt(employeId),
    }));

    try {
      await axios.post(`${API_URL}/answers`, answerPayload, config);
      showSnack(' Answers submitted successfully!', 'success');
      navigate('/surveys');
    } catch (error) {
      console.error('Error submitting answers:', error);
      const msg = error?.response?.data?.message || '❌ Failed to submit answers.';
      showSnack(msg, 'error');
    }
  };

  const renderQuestionInput = (q) => {
    const value = answers[q.questionId];

    switch (q.questionType?.toUpperCase()) {
      case 'CHOICE':
        return (
          <RadioGroup value={value || ''} onChange={(e) => handleChange(q.questionId, e.target.value)}>
            {(q.choices || []).map((choice, i) => (
              <FormControlLabel key={i} value={choice} control={<Radio />} label={choice} />
            ))}
          </RadioGroup>
        );
      case 'LIKERT':
        return (
          <RadioGroup value={value || ''} onChange={(e) => handleChange(q.questionId, e.target.value)}>
            {(q.likertLabels ? Object.entries(q.likertLabels) : []).map(([label, val]) => (
              <FormControlLabel key={val} value={String(val)} control={<Radio />} label={label} />
            ))}
          </RadioGroup>
        );
      case 'BOOLEAN':
      case 'BOOL':
        return (
          <RadioGroup value={value || ''} onChange={(e) => handleChange(q.questionId, e.target.value)}>
            <FormControlLabel value="Yes" control={<Radio />} label="Oui" />
            <FormControlLabel value="No" control={<Radio />} label="Non" />
          </RadioGroup>
        );
      case 'TEXT':
      default:
        return (
          <TextField
            fullWidth
            label="Your answer"
            multiline
            minRows={2}
            required
            error={!!errors[q.questionId]}
            helperText={errors[q.questionId] ? 'This field is required' : ''}
            value={value || ''}
            onChange={(e) => handleChange(q.questionId, e.target.value)}
            sx={{ mt: 1 }}
          />
        );
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* ✅ Snackbar placé en haut, disponible partout */}
<Snackbar
  open={snack.open}
  autoHideDuration={4000}
  onClose={handleSnackClose}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  sx={{
    zIndex: 9999,
    mt: { xs: 7, sm: 10 }
  }}
>
  <Alert
    onClose={handleSnackClose}
    severity="info" // ✅ Toujours bleu
    variant="filled"
    sx={{
      width: '100%',
      bgcolor: '#2196f3',   // ✅ bleu fixe (tu peux mettre un autre code couleur si tu veux)
      color: '#fff'
    }}
  >
    {snack.message}
  </Alert>
</Snackbar>



      {loading ? (
        <CircularProgress />
      ) : questionnaire && (
        <>
          <Typography variant="h4" mb={3}>{questionnaire.title}</Typography>

          {questionnaire.questions.map((q, index) => (
            <Paper key={q.questionId} sx={{ p: 2, mb: 3 }} elevation={3}>
              <Typography variant="h6">
                {index + 1}. {q.questionText} <span style={{ color: 'red' }}>*</span>
              </Typography>
              {renderQuestionInput(q)}
            </Paper>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AnswerQuestionnairePage;
