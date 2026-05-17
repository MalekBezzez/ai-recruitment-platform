// AllInterviewsList.jsx

import React, { useEffect, useState } from 'react';
import {
  Paper, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, TextField, InputAdornment, Typography, CircularProgress,
  TablePagination, Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('${API_URL}:', API_URL);

const AllInterviewsList = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';
        const response = await axios.get(`${API_URL}/api/interviews/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setInterviews(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des interviews :', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const handleSearch = (event) => {
    setSearchText(event.target.value.toLowerCase());
    setCurrentPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const filteredInterviews = interviews.filter((item) =>
    item.jobTitle?.toLowerCase().includes(searchText) ||
    item.applicantName?.toLowerCase().includes(searchText) ||
    item.room?.toLowerCase().includes(searchText) ||
    item.interviewers?.some(name => name.toLowerCase().includes(searchText)) // if interviewers is array
  );

  const pagedInterviews = filteredInterviews.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);

  return (
    <Paper elevation={0} sx={{ backgroundColor: 'transparent', px: 10 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
          All Interviews
        </Typography>
      </Box>

      <Box display="flex" justifyContent="flex-start" mb={3}>
        <TextField
          placeholder="Search by Job Title, Applicant or Room"
          value={searchText}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{ width: 350 }}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress size={60} thickness={4} color="primary" />
        </Box>
      ) : filteredInterviews.length === 0 ? (
        <Typography variant="h6" color="textSecondary" align="center" mt={5}>
          No interviews found.
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Applicant Name</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Room</TableCell>
                  <TableCell>Meeting Link</TableCell>
                  <TableCell>Interviewers</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedInterviews.map((interview, index) => (
                  <TableRow key={index}>
                    <TableCell>{interview.jobTitle}</TableCell>
                    <TableCell>{interview.applicantName}</TableCell>
                    <TableCell>{interview.duration}</TableCell>
                    <TableCell>{interview.room}</TableCell>
                    <TableCell>
                      {interview.meetingLink ? (
                        <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer">
                          Link
                        </a>
                      ) : '—'}
                    </TableCell>
                    <TableCell>{Array.isArray(interview.interviewers) ? interview.interviewers.join(', ') : interview.interviewers}</TableCell>
                    <TableCell>{interview.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredInterviews.length}
            page={currentPage}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      )}
    </Paper>
  );
};

export default AllInterviewsList;
