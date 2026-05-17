import React, { useState } from "react";
import { Card, CardContent, Typography, CircularProgress, Box, List, ListItem, ListItemText } from "@mui/material";
import { TextField, Button } from "@mui/material";
import axios from 'axios';

const AnalyseResultsPage = () => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  const handleSend = async () => {
    try {
      // Retrieve the token from localStorage, removing any surrounding quotes
      const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
      // Set the Authorization header with the Bearer token
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const response = await axios.post(
        `${API_URL}/api/messages?msg=${encodeURIComponent(message)}`,
        {}, // Empty body since data is sent as query param
        config // Pass the config with headers
      );
      console.log("✅ Réponse backend :", response.data);
      setStatus(response.data);
    } catch (err) {
      console.error("❌ Erreur d'envoi :", err);
      setStatus("Erreur lors de l'envoi");
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Envoyer un message RabbitMQ
      </Typography>
      <TextField
        label="Votre message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleSend}>
        Envoyer
      </Button>
      {status && (
        <Typography sx={{ mt: 2 }} color="primary">
          {status}
        </Typography>
      )}
    </Box>
  );
};

export default AnalyseResultsPage;