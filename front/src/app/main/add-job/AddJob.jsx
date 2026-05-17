import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import "./AddJob.scss";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IconButton, InputAdornment } from "@mui/material";
import { Close } from "@mui/icons-material";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField'; 
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Paper from '@mui/material/Paper'; 
import Grid from '@mui/material/Grid'; 
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';

//what i add 

import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import 'dayjs/locale/en-gb'; // 🇬🇧 semaine commence le lundi
import dayjs from "dayjs";
const API_URL = process.env.REACT_APP_API_URL;

const schema = yup.object().shape({
  jobTitle: yup.string().required('Job title is required'),
  contract: yup.string().required('Contract type is required'),
  yearsOfExp: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .required("Years of experience is required")
    .min(0, "Years of experience cannot be negative"),
  department: yup.string().required('Department is required'),
  currency: yup.string().required('Currency is required'),
  workMode: yup.string().required('Work mode is required'),
  reference: yup.string().required("Reference is required"),
  diploma: yup.string().required("Diploma is required"),
  projectOrClient: yup.string().required("Project or client is required"),
  startingDate: yup.date()
    .typeError("Start date is required")
    .required("Start date is required"),
  expirationDate: yup.date()
    .typeError("Expiration date is required")
    .required("Expiration date is required"),
  numberOfPos: yup.number()
    .min(1, "At least 1 position is required")
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .required("Number of positions is required"),
  salary: yup 
    .number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .required("Salary amount is required")
    .min(0, "Salary amount cannot be negative"),
});

const AddJob = () => {
// what i added 28/08 

// Snackbar state
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

  const { id } = useParams();
  const isEditMode = Boolean(id);
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';

  const [sections, setSections] = useState([]);

  useEffect(() => {
    console.log("useEffect triggered with isEditMode =", isEditMode, "and id =", id);
    if (isEditMode) {
      axios.get(`${API_URL}/api/offers/${id}`, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  params: {
    t: Date.now() // empêche toute réponse mise en cache
  }
})
        .then(response => {
          const data = response.data;
          console.log(data);
          setValue('jobTitle', data.jobTitle);
          setValue('contract', data.contractId);
          setValue('yearsOfExp', data.yearsOfExp);
          setValue('workMode', data.workMode);
          setValue('department', data.department);
          setValue('reference', data.reference);
          setValue('salary', data.salary);
          setValue('numberOfPos', data.numberOfPos);
          setValue('diploma', data.diploma);
          setValue('projectOrClient', data.projectOrClient);
          setValue('startingDate', data.startingDate);
          setValue('expirationDate', data.expirationDate);
          setValue('createdby', data.createdby);
          setValue('currency', data.currency);
          console.log(data.sections);
          if (data.sections && typeof data.sections === 'object') {
            const loadedSections = Object.entries(data.sections).map(([title, description]) => ({
              id: Date.now() + Math.random(),
              title,
              description,
            }));
            console.log("Setting sections to:", loadedSections);
            setSections(loadedSections);
          }
        })
        .catch(error => console.error('Error fetching offer:', error));
    } else {
      setValue('jobTitle', "");
      setValue('contract', "");
      setValue('yearsOfExp', "");
      setValue('workMode', "");
      setValue('department', "");
      setValue('reference', "");
      setValue('salary', "");
      setValue('numberOfPos', "");
      setValue('diploma', "");
      setValue('projectOrClient', "");
      setValue('startingDate', "");
      setValue('expirationDate', "");
      setValue('createdby', "");
      setValue('currency', "");
      console.log("Entering create mode branch");
      setSections([
        { id: Date.now(), title: "About", description: '' },
        { id: Date.now() + 1, title: "Required Skills", description: '' },
      ]);
    }
  }, [id, isEditMode]);

  const [showModal, setShowModal] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [diplomas, setDiplomas] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/diploma-type`, {
       headers: {
    Authorization: `Bearer ${token}`,
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  params: {
    t: Date.now() // empêche toute réponse mise en cache
  }
    })
      .then(response => {
        setDiplomas(response.data);
      })
      .catch(error => {
        console.error("Error fetching diplomas:", error);
      });
  }, []);

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/departments`, {
       headers: {
    Authorization: `Bearer ${token}`,
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  params: {
    t: Date.now() // empêche toute réponse mise en cache
  }
    })
      .then(response => {
        setDepartments(response.data);
      })
      .catch(error => {
        console.error("Error fetching departments:", error);
      });
  }, []);

  const [workModes, setWorkModes] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/work-modes`, {
       headers: {
    Authorization: `Bearer ${token}`,
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  params: {
    t: Date.now() // empêche toute réponse mise en cache
  }
    })
      .then(response => {
        setWorkModes(response.data);
      })
      .catch(error => {
        console.error("Error fetching work-modes:", error);
      });
  }, []);

  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/contract-types`, {
       headers: {
    Authorization: `Bearer ${token}`,
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  params: {
    t: Date.now() // empêche toute réponse mise en cache
  }
    })
      .then(response => {
        setContracts(response.data);
      })
      .catch(error => {
        console.error("Error fetching contracts:", error);
      });
  }, []);

  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/currencies`, {
       headers: {
    Authorization: `Bearer ${token}`,
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  params: {
    t: Date.now() // empêche toute réponse mise en cache
  }
    })
      .then(response => {
        setCurrencies(response.data);
      })
      .catch(error => {
        console.error("Error fetching currencies:", error);
      });
  }, []);

  const addSection = () => {
    if (newSectionTitle.trim() === '') {
      //alert('Title is required!');
      showSnack('Title is required!', 'info');
      return;
    }
    setSections([
      ...sections,
      { id: Date.now(), title: newSectionTitle, description: '' },
    ]);
    setNewSectionTitle('');
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    setNewSectionTitle(e.target.value);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewSectionTitle('');
  };

  const removeSection = (id) => {
    setSections(sections.filter((section) => section.id !== id));
  };

  const [showError, setShowError] = useState(false);

  const handleCloseSnackbar = () => {
    setShowError(false);
  };

  const { control, watch, setValue, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      jobTitle: "",
      department: "",
      reference: "",
      contract: "",
      workMode: "",
      diploma: "",
      yearsOfExp: "",
      numberOfPos: "",
      salary: "",
      currency: "",
      projectOrClient: "",
      startingDate: "",
      expirationDate: ""
    }
  });

  const jobTitle = watch("jobTitle");
  const departmentId = watch("department");

  useEffect(() => {
    if (jobTitle && departmentId) {
      const formatJobTitle = (title) => {
        const words = title.trim().split(/\s+/);
        return words.length === 1
          ? words[0].slice(0, 3).toUpperCase()
          : words.map(word => word[0].toUpperCase()).join("");
      };
      const formatDepartment = (deptName) => deptName.trim().slice(0, 3).toUpperCase();
      const selectedDepartment = departments.find(dep => dep.id === departmentId);
      const departmentName = selectedDepartment?.departmentName || "";
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const date = `${year}${month}${day}`;
      const time = `${hours}${minutes}`;
      const referenceValue = `${formatJobTitle(jobTitle)}-${formatDepartment(departmentName)}-${date}-${time}`;
      setValue("reference", referenceValue);
    }
  }, [jobTitle, departmentId, departments, setValue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue(name, value);
  };

  const onSubmit = (data) => {
    let currentUserId = null;
    try {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      if (!user?.user?.id) {
        throw new Error('No valid user ID found in localStorage');
      }
      currentUserId = user.user.id;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'ID utilisateur:', error);
    }

    const filteredFormData = Object.keys(data)
      .filter(key => !key.startsWith('section-') && data[key] !== undefined)
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});
    const structuredData = {
      ...filteredFormData,
      sections: sections.reduce((acc, section) => {
        acc[section.title] = section.description;
        return acc;
      }, {}),
      ...(!isEditMode && { createdby: currentUserId })
    };

    console.log('Données structurées envoyées au backend:', structuredData);
    console.log('JSON envoyé au backend :***************', JSON.stringify(structuredData, null, 2));

    const url = isEditMode 
      ? `${API_URL}/api/offers/${id}`
      : `${API_URL}/api/offers`;
    const method = isEditMode ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(structuredData)
    })
      .then(response => {
        if (!response.ok) {
          return Promise.reject(isEditMode 
            ? 'Erreur lors de la modification de l\'offre' 
            : 'Erreur lors de la création de l\'offre');
        }
        return response.json();
      })
      .then(data => {
        console.log('Succès:', data);
        showSnack(
  isEditMode 
    ? 'JobOffer updated successfully!' 
    : 'Offer created successfully!',
  'info'
);
          
        if (!isEditMode) {
          setSections([
            { id: Date.now(), title: "About", description: "" },
            { id: Date.now() + 1, title: "Required Skills", description: "" },
          ]);
        }
        navigate(`/my-offers?refresh=${Date.now()}`);
      })
      .catch(error => {
        console.error('Erreur:', error);
        showSnack(
  isEditMode
    ? 'Failed to update the offer'
    : 'Failed to create the offer','info'
);
      });
  };

  const startingDateValue = watch("startingDate");

  return (
    <Paper className="add-job-container" elevation={3}>
      <div className="title-container">
        <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
          {isEditMode ? 'Job Offer Update' : 'Job Offer Addition Request'}
        </Typography>
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

      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-container">
          <div className="global-container">
            <div className="left-container">
              <Controller
                name="jobTitle"
                control={control}
                render={({ field }) => (
                  <TextField 
                    {...field}
                    label="Job title"
                    type="text"
                    fullWidth
                    error={!!errors.jobTitle}
                    helperText={errors?.jobTitle?.message}
                  />
                )}
              />
              <Controller
                name="contract"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Contract type"
                    select
                    fullWidth
                    error={!!errors.contract}
                    helperText={errors?.contract?.message}
                  >
                    {contracts.map((contract) => (
                      <MenuItem key={contract.id} value={contract.id}>
                        {contract.contractTypeName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="yearsOfExp"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Years of experience"
                    type="number"
                    inputProps={{ step: 1 }}
                    onKeyDown={(e) => {
                      if (e.key === ',' || e.key === '.') {
                        e.preventDefault();
                      }
                    }}
                    fullWidth
                    error={!!errors.yearsOfExp}
                    helperText={errors?.yearsOfExp?.message}
                  />
                )}
              />
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Department"
                    select
                    fullWidth
                    error={!!errors.department}
                    helperText={errors?.department?.message}
                  >
                    {departments.map((department) => (
                      <MenuItem key={department.id} value={department.id}>
                        {department.departmentName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="salary"
                control={control}
                render={({ field }) => (
                  <TextField 
                    {...field}
                    label="Salary amount"
                    type="number"
                    fullWidth
                    error={!!errors.salary}
                    helperText={errors?.salary?.message}
                  />
                )}
              />
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Currency"
                    select
                    fullWidth
                    error={!!errors.currency}
                    helperText={errors?.currency?.message}
                  >
                    {currencies.map((currency) => (
                      <MenuItem key={currency.idCurrency} value={currency.idCurrency}>
                        {currency.currencyName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </div>
            <div className="right-container">
              <Controller
                name="workMode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Work mode"
                    select
                    fullWidth
                    error={!!errors.workMode}
                    helperText={errors?.workMode?.message}
                  >
                    {workModes.map((workMode) => (
                      <MenuItem key={workMode.idWorkMode} value={workMode.idWorkMode}>
                        {workMode.workModeName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="numberOfPos"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Number of Positions"
                    type="number"
                    inputProps={{ step: 1 }}
                    onKeyDown={(e) => {
                      if (e.key === ',' || e.key === '.') {
                        e.preventDefault();
                      }
                    }}
                    error={!!errors.numberOfPos}
                    helperText={errors?.numberOfPos?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="diploma"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Diploma"
                    select
                    error={!!errors.diploma}
                    helperText={errors?.diploma?.message}
                    fullWidth
                  >
                    {diplomas.map((diploma) => (
                      <MenuItem key={diploma.idDiplomaType} value={diploma.idDiplomaType}>
                        {diploma.diplomaName} in {diploma.speciality}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="projectOrClient"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Project/Client"
                    type="text"
                    error={!!errors.projectOrClient}
                    helperText={errors?.projectOrClient?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
  name="startingDate"
  control={control}
  rules={{ required: "Starting date is required" }} // exemple règle
  render={({ field }) => (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        label="Starting Date"
          value={field.value ? dayjs(field.value) : null} // ✅ conversion en Dayjs
        onChange={(newValue) => field.onChange(newValue ? newValue.toISOString() : "")}
        minDate={dayjs()} // ✅ date minimale = aujourd'hui
        slotProps={{
          textField: {
            fullWidth: true, // ✅ même largeur que tes autres champs
            error: !!errors.startingDate,
            helperText: errors?.startingDate?.message || "",
          },
        }}
      />
    </LocalizationProvider>
  )}
/>
             <Controller
  name="expirationDate"
  control={control}
  rules={{ required: "Expiration date is required" }}
  render={({ field }) => (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        label="Offer Expiration Date"
        value={field.value ? dayjs(field.value) : null} // ✅ conversion en Dayjs
        onChange={(newValue) => field.onChange(newValue ? newValue.toISOString() : "")}
         minDate={startingDateValue ? dayjs(startingDateValue) : null} // ✅ minDate aussi en Dayjs
        disabled={!startingDateValue}       // ✅ désactivé si pas de startingDate
        slotProps={{
          textField: {
            fullWidth: true, // ✅ même taille que les autres
            error: !!errors.expirationDate,
            helperText: errors?.expirationDate?.message || "",
          },
        }}
      />
    </LocalizationProvider>
  )}
/>
            </div>
          </div>
          <div className="all-sections-container">
            {showModal && (
              <div className="modal">
                <div className="modal-content">
                  <h2>Enter Section Title</h2>
                  <input
                    type="text"
                    placeholder="Section Title"
                    value={newSectionTitle}
                    onChange={handleInputChange}
                  />
                  <br />
                  <Button variant="outlined" color="primary" onClick={closeModal}>Cancel</Button>
                  <Button variant="contained" color="primary" onClick={addSection}>Validate</Button>
                </div>
              </div>
            )}
            {sections.map((section) => (
              <div key={section.id} style={{ marginBottom: '0px' }}>
                <TextField
                  value={section.description || ""}
                  label={section.title}
                  placeholder="Enter description..."
                  multiline
                  fullWidth
                  onChange={(e) => {
                    setSections(
                      sections.map((sec) => 
                        sec.id === section.id 
                          ? { ...sec, description: e.target.value } 
                          : sec
                      )
                    );
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => removeSection(section.id)}
                          edge="end"
                          size="small"
                          sx={{ fontSize: "5px" }}
                        >
                          <Close fontSize="small" color="primary" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      whiteSpace: 'pre-line',
                      alignItems: 'flex-start'
                    }
                  }}
                />
                <br />
              </div>
            ))}
            <div className="add-section-container">
              <Button 
                startIcon={<AddIcon />} 
                variant="contained" 
                color="primary" 
                onClick={openModal}
              >
                New Section
              </Button>
            </div>
          </div>
          <div className="form-actions">
            <Button 
              className="submit-btn" 
              type="submit" 
              size="large" 
              variant="contained" 
              color="primary"
            >
              {isEditMode ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </form>
    </Paper>
  );
};

export default AddJob;