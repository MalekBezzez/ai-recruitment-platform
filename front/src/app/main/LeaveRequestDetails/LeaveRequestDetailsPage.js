import React, { useEffect, useState } from 'react';
import {
  Box, Button, CircularProgress, TextField, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LeaveRequestDetailsPage = () => {
  const { id } = useParams(); // ← On récupère bien le taskId (nommé 'id' dans ta route)
  const navigate = useNavigate();
  const [requestDetails, setRequestDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [decision, setDecision] = useState('');
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`${API_URL}/conge/taches/details/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequestDetails(response.data);
      } catch (err) {
        setError("Erreur lors du chargement de la tâche");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleDecisionSubmit = async () => {
    try {
      await axios.post(`${API_URL}/conge/traiter/${id}`, {
        decision,
        commentaire: comment,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Décision envoyée avec succès !");
      navigate('/leave-requests');
    } catch (error) {
      console.error("Erreur lors de la soumission de la décision:", error);
      alert("Échec de la soumission de la décision.");
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!requestDetails) return <Typography>Aucune donnée trouvée.</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>Détails de la Demande</Typography>
      <Paper style={{ padding: 16 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employé</TableCell>
              <TableCell>Type de congé</TableCell>
              <TableCell>Date début</TableCell>
              <TableCell>Date fin</TableCell>
              <TableCell>Date de création</TableCell>
              <TableCell>Commentaire</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{requestDetails.employeId}</TableCell>
              <TableCell>{requestDetails.typeConge}</TableCell>
              <TableCell>{requestDetails.dateDebut}</TableCell>
              <TableCell>{requestDetails.dateFin}</TableCell>
              <TableCell>{new Date(requestDetails.createTime).toLocaleString()}</TableCell>
              <TableCell>{requestDetails.commentaire || 'N/A'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Bloc de décision (visible si la tâche n'est pas encore traitée) */}
        <Box mt={3}>
          <Typography variant="h6">Traiter la Demande</Typography>
          <TextField
            select
            label="Décision"
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            fullWidth
            margin="normal"
            SelectProps={{ native: true }}
          >
            <option value="">Choisir une décision</option>
            <option value="APPROUVER">Approuver</option>
            <option value="REJETER">Rejeter</option>
          </TextField>

          <TextField
            label="Commentaire"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            margin="normal"
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleDecisionSubmit}
            disabled={!decision}
            sx={{ mt: 2 }}
          >
            Soumettre la Décision
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LeaveRequestDetailsPage;
