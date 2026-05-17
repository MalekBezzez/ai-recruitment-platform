import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Box, Grid,
  Table, TableHead, TableBody, TableCell, TableRow, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const ChannelManagerPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({ name: false });
  const [channels, setChannels] = useState([]);

  const token = localStorage.getItem('accessToken')?.replace(/"/g, '');
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  const fetchChannels = async () => {
    try {
      const response = await fetch(`${API_URL}/api/channels`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setChannels(data);
    } catch (err) {
      console.error("❌ Error fetching channels:", err);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = { name: !formData.name.trim() };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Fill in all required fields");
      return;
    }

    try {
      const response = await fetch('`${API_URL}/api/channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Error during channel creation");
      setFormData({ name: '', description: '' });
      await fetchChannels();
    } catch (err) {
      console.error("❌ Error creating channel:", err);
      alert("Error creating channel");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/channels/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setChannels(prev => prev.filter(c => c.id !== id));
      } else {
        alert("Error deleting channel");
      }
    } catch (err) {
      console.error("❌ Error deleting channel:", err);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Channel Management</Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Channel Name"
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                error={errors.name}
                helperText={errors.name && "Required"}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Description"
                fullWidth
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} textAlign="right">
              <Button type="submit" variant="contained">Add Channel</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper elevation={2}>
        <Typography variant="h6" sx={{ p: 2 }}>Channel List</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {channels.map(channel => (
              <TableRow key={channel.id}>
                <TableCell>{channel.id}</TableCell>
                <TableCell>{channel.name}</TableCell>
                <TableCell>{channel.description}</TableCell>
                <TableCell align="right">
                  <IconButton color="error" onClick={() => handleDelete(channel.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {channels.length === 0 && (
              <TableRow><TableCell colSpan={4} align="center">No channels found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default ChannelManagerPage;
