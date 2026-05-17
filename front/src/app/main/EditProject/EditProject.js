import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import _ from '@lodash';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useParams } from 'react-router-dom';
import 'src/styles/style.css';
import { 
  Snackbar,Alert,
 
} from '@mui/material';
const schema = yup.object().shape({
  name: yup.string().required('Project name is required'),
  startedDate: yup.date().required('Start date is required'),
  endDate: yup.date().required('End date is required'),
  totalHours: yup.number().typeError('Total hours must be a number').required('Total hours are required').min(0),
  clientId: yup.number().required('Client is required').min(1, 'Please select a valid client'),
});

const defaultValues = {
  name: '',
  startedDate: '',
  endDate: '',
  totalHours: '',
  clientId: '',
};
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
function AddProject() {
  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found in localStorage');

        const config = {
          headers: {
            Authorization: `Bearer ${token.replace(/"/g, '')}`,
          },
        };

        const response = await axios.get(`${API_URL}/clients`, config);
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
        showSnack('Failed to load clients.');
      }
    };

    fetchClients();
  }, []);
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
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found in localStorage');

      const config = {
        headers: {
          Authorization: `Bearer ${token.replace(/"/g, '')}`,
        },
      };

      const response = await axios.post(`${API_URL}/projects`, data, config);
      console.log('Project added:', response.data);
      showSnack('Project successfully added!');
      reset();
    } catch (error) {
      console.error('Error adding project:', error);
      showSnack('An error occurred while adding the project.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Paper className="h-full sm:h-auto md:flex md:items-start md:justify-start w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1">
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
        <div>
          <Typography className="mt-8 text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Add a Project
          </Typography>
          <Typography className="mt-4 text-lg text-gray-600">
            Please fill in the project details.
          </Typography>
          <form
            name="addProjectForm"
            noValidate
            className="mt-6 sm:mt-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-20"
                  label="Project Name"
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="clientId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth className="mb-20" error={!!errors.clientId}>
                  <InputLabel id="client-select-label">Client</InputLabel>
                  <Select
                    {...field}
                    labelId="client-select-label"
                    label="Client"
                    variant="outlined"
                    required
                  >
                    <MenuItem value="">
                      <em>Select a client</em>
                    </MenuItem>
                    {clients.map((client) => (
                      <MenuItem key={client.clientId} value={client.clientId}>
                        {client.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.clientId && (
                    <Typography color="error">{errors.clientId.message}</Typography>
                  )}
                </FormControl>
              )}
            />
            <Controller
              name="startedDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-20"
                  label="Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.startedDate}
                  helperText={errors?.startedDate?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-20"
                  label="End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.endDate}
                  helperText={errors?.endDate?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="totalHours"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-20"
                  label="Total Hours"
                  type="number"
                  error={!!errors.totalHours}
                  helperText={errors?.totalHours?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Button
              variant="contained"
              color="secondary"
              className="w-full mt-6"
              aria-label="Add a Project"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
              size="large"
            >
              Add Project
            </Button>
          </form>
        </div>
      </Paper>
    </div>
  );
}

function EditProject() {
  const { id } = useParams();
  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;
  const [clients, setClients] = useState([]);
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found in localStorage');

        const config = {
          headers: {
            Authorization: `Bearer ${token.replace(/"/g, '')}`,
          },
        };

        const response = await axios.get(`${API_URL}/clients`, config);
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
        showSnack('Failed to load clients.');
      }
    };

    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found in localStorage');

        const config = {
          headers: {
            Authorization: `Bearer ${token.replace(/"/g, '')}`,
          },
        };

        const response = await axios.get(`${API_URL}/projects/${id}`, config);
        const projectData = response.data;
        setProject(projectData);
        reset({
          name: projectData.name,
          startedDate: projectData.startedDate.split('T')[0], // Format date for input
          endDate: projectData.endDate.split('T')[0], // Format date for input
          totalHours: projectData.totalHours,
          clientId: projectData.clientId,
        });
      } catch (error) {
        console.error('Error fetching project:', error);
        showSnack('Failed to load project.');
      }
    };

    fetchClients();
    if (id) fetchProject();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found in localStorage');

      const config = {
        headers: {
          Authorization: `Bearer ${token.replace(/"/g, '')}`,
        },
      };

      const response = await axios.put(`${API_URL}/projects/${id}`, data, config);
      console.log('Project updated:', response.data);
      showSnack('Project successfully updated!');
    } catch (error) {
      console.error('Error updating project:', error);
      showSnack('An error occurred while updating the project.');
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Paper className="h-full sm:h-auto md:flex md:items-start md:justify-start w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1">
        <div>
          <Typography className="mt-8 text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Edit Project
          </Typography>
          <Typography className="mt-4 text-lg text-gray-600">
            Please update the project details.
          </Typography>
          <form
            name="editProjectForm"
            noValidate
            className="mt-6 sm:mt-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-20"
                  label="Project Name"
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="clientId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth className="mb-20" error={!!errors.clientId}>
                  <InputLabel id="client-select-label">Client</InputLabel>
                  <Select
                    {...field}
                    labelId="client-select-label"
                    label="Client"
                    variant="outlined"
                    required
                  >
                    <MenuItem value="">
                      <em>Select a client</em>
                    </MenuItem>
                    {clients.map((client) => (
                      <MenuItem key={client.clientId} value={client.clientId}>
                        {client.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.clientId && (
                    <Typography color="error">{errors.clientId.message}</Typography>
                  )}
                </FormControl>
              )}
            />
            <Controller
              name="startedDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-20"
                  label="Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.startedDate}
                  helperText={errors?.startedDate?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-20"
                  label="End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.endDate}
                  helperText={errors?.endDate?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="totalHours"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-20"
                  label="Total Hours"
                  type="number"
                  error={!!errors.totalHours}
                  helperText={errors?.totalHours?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Button
              variant="contained"
              color="secondary"
              className="w-full mt-6"
              aria-label="Update Project"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
              size="large"
            >
              Update Project
            </Button>
          </form>
        </div>
      </Paper>
    </div>
  );
}

function ProjectList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found in localStorage');

        const config = {
          headers: {
            Authorization: `Bearer ${token.replace(/"/g, '')}`,
          },
        };

        const response = await axios.get(`${API_URL}/projects`, config);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        showSnack('Failed to load projects.');
      }
    };

    fetchProjects();
  }, []);

  return (
    <TableContainer component={Paper} className="mt-8 mx-auto max-w-4xl">
      <Table sx={{ minWidth: 650 }} aria-label="project table">
        <TableHead>
          <TableRow>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Start Date</TableCell>
            <TableCell align="center">End Date</TableCell>
            <TableCell align="center">Total Hours</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.projectId}>
              <TableCell align="center">{project.projectId}</TableCell>
              <TableCell align="center">{project.name}</TableCell>
              <TableCell align="center">{new Date(project.startedDate).toISOString().split('T')[0]}</TableCell>
              <TableCell align="center">{new Date(project.endDate).toISOString().split('T')[0]}</TableCell>
              <TableCell align="center">{project.totalHours}</TableCell>
              <TableCell align="center">
                <IconButton aria-label="delete" color="error">
                  <DeleteIcon />
                </IconButton>
                <IconButton aria-label="view">
                  <VisibilityIcon />
                </IconButton>
                <IconButton aria-label="edit">
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="add">
                  <AddIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}



export default EditProject;