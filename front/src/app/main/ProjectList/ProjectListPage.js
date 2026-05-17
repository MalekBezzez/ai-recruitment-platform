// 📁 src/pages/ProjectListPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Paper,
  CircularProgress,
  Button,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

const ProjectListPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');

  const userRole = JSON.parse(localStorage.getItem('user'))?.user?.role;
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken')?.replace(/\"/g, '') || '';
      const headers = { Authorization: `Bearer ${token}` };
      const { data } = await axios.get(`${API_URL}/projects`, { headers });
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = e => {
    setSearchText(e.target.value);
    setPage(0);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = e => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleDelete = async id => {
    try {
      const token = localStorage.getItem('accessToken')?.replace(/\"/g, '') || '';
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${API_URL}/projects/${id}`, { headers });
      fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const handleView = id => navigate(`/projectprofile/${id}`);
  const handleEdit = id => navigate(`/editproject/${id}`);
  const handleAddPhase = id => navigate(`/addphase/${id}`);
  const handleAddProject = () => navigate('/addproject');

  // Search + exclude "absence"
  const filtered = projects
    .filter(p => p.name?.toLowerCase().includes(searchText.toLowerCase()))
    .filter(p => p.name?.toLowerCase() !== 'absence');

  return (
    <Box p={4}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"          
        mb={3}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Project List
          </Typography>
          <TextField
            placeholder="Search by Project Name"
            value={searchText}
            onChange={handleSearch}
            size="small"
            sx={{ mt: 1, width: 280 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box display="flex" gap={2}>
          {userRole === 'MANAGER' && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ borderRadius: 20, textTransform: 'none', px: 3 }}
              onClick={handleAddProject}
            >
              Add Project
            </Button>
          )}
          {/* <Button
            variant="outlined"
            sx={{ borderRadius: 20, textTransform: 'none', px: 3 }}
            onClick={() => navigate('/clients')}
          >
            Client Management
          </Button> */}
        </Box>
      </Box>

      {/* Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <Typography align="center" mt={4}>
          No projects found.
        </Typography>
      ) : (
        <Paper
          sx={{ borderRadius: 4, overflow: 'hidden' }}
          elevation={0}              
        >
          <TableContainer>
            <Table>
              <TableHead >
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Total Hours</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(project => (
                    <TableRow key={project.projectId} hover>
                      <TableCell>{project.projectId}</TableCell>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{project.startedDate}</TableCell>
                      <TableCell>{project.endDate}</TableCell>
                      <TableCell>{project.totalHours}</TableCell>
                      <TableCell align="center">
                        <Box display="flex" justifyContent="center" gap={1}>
                          {userRole === 'MANAGER' && (
                            <IconButton color="error" onClick={() => handleDelete(project.projectId)}>
                              <DeleteIcon />
                            </IconButton>
                          )}
                          <IconButton color="primary" onClick={() => handleView(project.projectId)}>
                            <VisibilityIcon />
                          </IconButton>
                          {userRole === 'MANAGER' && (
                            <IconButton color="secondary" onClick={() => handleEdit(project.projectId)}>
                              <EditIcon />
                            </IconButton>
                          )}
                          {userRole === 'MANAGER' && (
                            <IconButton onClick={() => handleAddPhase(project.projectId)}>
                              <AddIcon />
                            </IconButton>
                          )}
                        </Box>
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
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Box>
  );
};

export default ProjectListPage;
