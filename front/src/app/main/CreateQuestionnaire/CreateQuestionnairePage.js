import React, { useState } from 'react';
import axios from 'axios';
import {
  Snackbar,Alert,Box, Button, TextField, Typography, IconButton, Paper, MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const CreateSurveyPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('');
  const [scaleMax, setScaleMax] = useState(5); // Global max
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      questionType: 'TEXT',
      weight: '',
      choices: [''],
      likertLabels: [{ label: '', value: '' }]
    }
  ]);
  const [loading, setLoading] = useState(false);
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

  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const API_URL = process.env.REACT_APP_API_URL;

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleChoiceChange = (qIndex, cIndex, value, field = 'choices', subfield = null) => {
    const updated = [...questions];
    if (field === 'likertLabels' && subfield) {
      if (typeof updated[qIndex][field][cIndex] !== 'object') {
        updated[qIndex][field][cIndex] = { label: '', value: '' };
      }
      updated[qIndex][field][cIndex][subfield] = value;
    } else {
      updated[qIndex][field][cIndex] = value;
    }
    setQuestions(updated);
  };

  const addQuestionField = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        questionType: 'TEXT',
        weight: '',
        choices: [''],
        likertLabels: [{ label: '', value: '' }]
      }
    ]);
  };

  const addChoiceField = (qIndex, field = 'choices') => {
    const updated = [...questions];
    if (field === 'likertLabels') {
      updated[qIndex][field].push({ label: '', value: '' });
    } else {
      updated[qIndex][field].push('');
    }
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    // 🔹 Validation des champs globaux
    if (title.trim() === '') {
      showSnack(" Title is required");
      return;
    }
    if (description.trim() === '') {
      showSnack(" Description is required");
      return;
    }

    // 🔹 Validation des questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (q.questionText.trim() === '') {
        showSnack(` Question ${i + 1} text is required`);
        return;
      }
      if (q.questionType === 'CHOICE' && q.choices.filter(c => c.trim() !== '').length < 2) {
        showSnack(` Question ${i + 1} must have at least 2 choices`);
        return;
      }
      if (q.questionType === 'LIKERT' && q.likertLabels.filter(l => l.label.trim() && l.value !== '').length < 2) {
        showSnack(` Question ${i + 1} must have at least 2 Likert labels`);
        return;
      }
    }

    setLoading(true);
    try {
      const perQuestionScaleMax = (qt) => {
        switch (qt) {
          case 'BOOLEAN': return 2;
          case 'TEXT': return 3;
          case 'CHOICE':
          case 'LIKERT': return Number(scaleMax) || 5;
          default: return Number(scaleMax) || 5;
        }
      };

      const surveyPayload = {
        title,
        description,
        employeIds: [],
        scaleMax: Number(scaleMax),
        questions: questions.map(q => ({
          questionText: q.questionText,
          theme,
          questionType: q.questionType,
          weight: Number(q.weight) || 0,
          scaleMax: perQuestionScaleMax(q.questionType),
          choices:
            (q.questionType === 'CHOICE')
              ? q.choices.filter(c => typeof c === 'string' && c.trim() !== '')
              : [],
          likertLabels:
            (q.questionType === 'LIKERT')
              ? Object.fromEntries(
                q.likertLabels
                  .filter(l => l.label.trim() && l.value !== '')
                  .map(l => [l.label.trim(), parseInt(l.value)])
              )
              : {},
        }))
      };

      const res = await axios.post(`${API_URL}/questionnaires`, surveyPayload, config);
      showSnack(` Survey "${title}" created with ${res.data.questions?.length || 0} questions.`);

      // Reset form
      setTitle('');
      setDescription('');
      setTheme('');
      setScaleMax(5);
      setQuestions([
        {
          questionText: '',
          questionType: 'TEXT',
          weight: '',
          choices: [''],
          likertLabels: [{ label: '', value: '' }]
        }
      ]);
    } catch (error) {
      console.error('Creation error:', error);
      showSnack(' Failed to create survey.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" mb={3}>Create New Survey</Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
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
        <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Description" value={description} onChange={(e) => setDescription(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Theme" value={theme} onChange={(e) => setTheme(e.target.value)} sx={{ mb: 2 }} />
        <TextField
          fullWidth
          type="number"
          label="Scale Max (CHOICE / LIKERT)"
          value={scaleMax}
          onChange={(e) => setScaleMax(e.target.value)}
          sx={{ mb: 2 }}
        />
      </Paper>

      <Typography variant="h6" mb={2}>Questions</Typography>
      {questions.map((q, qIndex) => (
        <Paper key={qIndex} sx={{ p: 2, mb: 2 }}>
          <TextField
            fullWidth
            label={`Question ${qIndex + 1}`}
            value={q.questionText}
            onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            select
            fullWidth
            label="Question Type"
            value={q.questionType}
            onChange={(e) => handleQuestionChange(qIndex, 'questionType', e.target.value)}
            sx={{ mb: 2 }}
          >
            <MenuItem value="TEXT">Free Text</MenuItem>
            <MenuItem value="CHOICE">Multiple Choice</MenuItem>
            <MenuItem value="BOOLEAN">Yes / No</MenuItem>
            <MenuItem value="LIKERT">Likert Scale</MenuItem>
          </TextField>

          <TextField
            fullWidth
            type="number"
            label="Weight"
            value={q.weight}
            onChange={(e) => handleQuestionChange(qIndex, 'weight', e.target.value)}
            sx={{ mb: 2 }}
          />

          {q.questionType === 'CHOICE' && (
            <>
              <Typography variant="subtitle2">Choices:</Typography>
              {q.choices.map((c, cIndex) => (
                <TextField
                  key={cIndex}
                  fullWidth
                  label={`Choice ${cIndex + 1}`}
                  value={c}
                  onChange={(e) => handleChoiceChange(qIndex, cIndex, e.target.value, 'choices')}
                  sx={{ mb: 1 }}
                />
              ))}
              <Button
                size="small"
                disabled={q.choices.filter(c => c.trim() !== '').length >= scaleMax}
                onClick={() => addChoiceField(qIndex, 'choices')}
              >
                + Add a choice
              </Button>
            </>
          )}

          {q.questionType === 'LIKERT' && (
            <>
              <Typography variant="subtitle2">Likert Labels:</Typography>
              {q.likertLabels.map((l, lIndex) => (
                <Box key={lIndex} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    label={`Label ${lIndex + 1}`}
                    value={l.label}
                    onChange={(e) =>
                      handleChoiceChange(qIndex, lIndex, e.target.value, 'likertLabels', 'label')
                    }
                  />
                  <TextField
                    label="Value"
                    type="number"
                    value={l.value}
                    onChange={(e) =>
                      handleChoiceChange(qIndex, lIndex, e.target.value, 'likertLabels', 'value')
                    }
                  />
                </Box>
              ))}
              <Button
                size="small"
                disabled={q.likertLabels.length >= scaleMax}
                onClick={() => addChoiceField(qIndex, 'likertLabels')}
              >
                + Add a label
              </Button>
            </>
          )}
        </Paper>
      ))}

      <IconButton onClick={addQuestionField} color="primary">
        <AddIcon /> Add a question
      </IconButton>

      <Box mt={4}>
        <Button color="primary" variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Submitting...' : '📝 Create Survey'}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateSurveyPage;
