import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TextField,
  InputAdornment,
  TablePagination,
  CircularProgress,
  Typography,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useParams } from 'react-router-dom';

const YearEvaluationEmployeePage = () => {
  const { id } = useParams();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');
  const [employeeName, setEmployeeName] = useState('');
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
  useEffect(() => {
    fetchEmployeeEvaluations();
    fetchEmployeeName();
  }, [id]);

  const fetchEmployeeEvaluations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const tokenWithoutQuotes = token?.replace(/"/g, '') || '';
      const config = {
        headers: {
          Authorization: `Bearer ${tokenWithoutQuotes}`,
        },
      };
      const response = await axios.get(`${API_URL}/year-evaluations/employee/${id}`, config);
      setEvaluations(response.data || []);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      setEvaluations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeName = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const tokenWithoutQuotes = token?.replace(/"/g, '') || '';
      const config = {
        headers: {
          Authorization: `Bearer ${tokenWithoutQuotes}`,
        },
      };
      const response = await axios.get(`${API_URL}/employes/${id}`, config);
      setEmployeeName(response.data.name || `Employee ${id}`);
    } catch (error) {
      console.error('Error fetching employee name:', error);
      setEmployeeName(`Employee ${id}`);
    }
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value);
    setCurrentPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      const tokenWithoutQuotes = token?.replace(/"/g, '') || '';
      const config = {
        headers: {
          Authorization: `Bearer ${tokenWithoutQuotes}`,
        },
      };
      await axios.delete(`${API_URL}/year-evaluations/${id}`, config);
      fetchEmployeeEvaluations();
      alert('Evaluation deleted successfully!');
    } catch (error) {
      console.error('Error deleting evaluation:', error);
      alert('Error deleting evaluation.');
    }
  };

  const handleEdit = (id) => {
    window.location.href = `/year-evaluation-update/${id}`;
  };

  const handleViewDetails = (id) => {
    window.location.href = `/year-evaluation-details/${id}`;
  };

  const handleAddEvaluation = () => {
    window.location.href = `/AddYearEvaluation/${id}`;
  };

  const filteredEvaluations = Array.isArray(evaluations)
    ? evaluations.filter((evaluation) =>
        (evaluation.note?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
        (evaluation.date?.toLowerCase() || '').includes(searchText.toLowerCase()))
    : [];

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <h1>Year Evaluations for {employeeName}</h1>
      </Box>
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          placeholder="Search by Note or Date"
          value={searchText}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          style={{ width: 300 }}
        />
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddEvaluation}
          style={{ marginLeft: 16 }}
        >
          Add Evaluation
        </Button>
      </Box>
      
      {loading ? (
        <CircularProgress />
      ) : filteredEvaluations.length === 0 ? (
        <Typography>No evaluations found for this employee.</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEvaluations
                  .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
                  .map((evaluation) => (
                    <TableRow key={evaluation.id}>
                      <TableCell>{evaluation.idYearEvaluation}</TableCell>
                      <TableCell>{new Date(evaluation.date).getFullYear()}</TableCell>
                      <TableCell>{evaluation.note}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(evaluation.idYearEvaluation)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        {/* <IconButton
                          color="primary"
                          onClick={() => handleViewDetails(evaluation.id)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => handleEdit(evaluation.id)}
                        >
                          <EditIcon />
                        </IconButton> */}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredEvaluations.length}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </div>
  );
};

export default YearEvaluationEmployeePage;