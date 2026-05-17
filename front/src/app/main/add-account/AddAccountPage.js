import React, { useState, useEffect } from 'react';
import { 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  MenuItem,
  Checkbox,
  FormControlLabel,
  Collapse,
  IconButton,Snackbar,Alert,
  Box
} from '@mui/material';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const schemaStep1 = yup.object().shape({
  firstname: yup.string().required('First name is required'),
  lastname: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  role: yup.string().required('Role is required'),
  cin: yup.string().required('CIN is required'),
  personalPhone: yup.string().required('Personal phone is required'),
  birthDate: yup.string().required('Birth date is required'),
});

const schemaStep2 = yup.object().shape({
  address: yup.string(),
  workplace: yup.string().required('Workplace is required'),
  professionalemail: yup.string().email('Invalid professional email'),
  businessUnit: yup.string(),
  seniority: yup.string().required('Seniority is required'),
  contract: yup.string().required('Contract is required'),
  jobTitle: yup.string().required('Job title is required'),
  manager: yup.string(),
  worktime: yup.string(),
  mobilePhone: yup.string(),
});

const schemaStep3 = yup.object().shape({
  personalAddress: yup.string().required('Personal address is required'),
  nationality: yup.string().required('Nationality is required'),
  bankAccountNumber: yup.string().required('Bank account number is required'),
  socialSecurityCode: yup.string().required('Social security code is required'),
});

const schemaStep4 = yup.object().shape({
  martialStatus: yup.string(),
  gender: yup.string(),
  numberOfChildren: yup.number().positive().integer(),
  diplomas: yup.array().of(
    yup.object().shape({
      speciality: yup.string(),
      institution: yup.string(),
      diplomeType: yup.string(),
      diplomaYear: yup.string().nullable(),
    })
  ),
  otherInformation: yup.object().shape({
    stcServi: yup.boolean(),
    mariageDate: yup.date().nullable(),
    bankDomiciliation: yup.boolean()
  })
  // .test(
  //   'mariageDate-required-if-married',
  //   'Mariage date is required when martial status is MARRIED',
  //   function(value) {
  //     const { martialStatus } = this.parent;
  //     if (martialStatus === 'MARRIED' && !value?.mariageDate) {
  //       return false;
  //     }
  //     return true;
  //   }
  // )
});

const schemaStep5 = yup.object().shape({
  policyNumberIns: yup.string().required('Policy number is required'),
  insuranceGroup: yup.string().required('Insurance is required'),
});

const steps = ['Basic Information', 'Professional Information', 'Personal Information', 'Additional Information', 'Insurance Information'];
const API_URL = process.env.REACT_APP_API_URL;

console.log('API_URL:', API_URL);


const styles = {
  sectionTitle: {
    backgroundColor: '#f5f5f5',
    padding: '8px 16px',
    borderRadius: '4px',
    marginBottom: '16px',
  },
  diplomaSection: {
    borderLeft: '4px solid #3f51b5',
    paddingLeft: '16px',
    marginBottom: '24px',
  },
  formContainer: {
    padding: '40px',
    maxWidth: '800px',
    margin: 'auto'
  }
};

function AddAccount() {
  const [managers, setManagers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [contractTypes, setContractTypes] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [showOtherInfo, setShowOtherInfo] = useState(false);
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

  const { control, handleSubmit, formState: { errors }, trigger, setError } = useForm({
    resolver: yupResolver(
      activeStep === 0 ? schemaStep1 :
      activeStep === 1 ? schemaStep2 :
      activeStep === 2 ? schemaStep3 :
      activeStep === 3 ? schemaStep4 :
      schemaStep5
    ),
    defaultValues: {
      diplomas: [{ speciality: '', institution: '', diplomeType: '', diplomaYear: '' }],
      otherInformation: {
        stcServi: false,
        mariageDate: null,
        bankDomiciliation: false
      },
      manager: '',
      contract: '',
      businessUnit: '',
      insuranceGroup: ''
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "diplomas",
  });

  useEffect(() => {
    const fetchManagers = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        showSnack('Token not found. Please log in.');
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token.replace(/"/g, '')}`,
          },
        };

        const response = await axios.get(`${API_URL}/employee/managers`, config);
        setManagers(response.data); 
      } catch (error) {
        console.error('Error fetching managers:', error);
        showSnack('Failed to fetch managers. Please try again.');
      }
    };

    fetchManagers();
  }, []);

  useEffect(() => {
    const fetchContractTypes = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        showSnack('Token not found. Please log in.');
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token.replace(/"/g, '')}`,
          },
        };

        const response = await axios.get(`${API_URL}/contract-types`, config);
        setContractTypes(response.data);
      } catch (error) {
        console.error('Error fetching contract types:', error);
        showSnack('Failed to fetch contract types. Please try again.');
      }
    };
    fetchContractTypes();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        showSnack('Token not found. Please log in.');
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token.replace(/"/g, '')}`,
          },
        };

        const response = await axios.get(`${API_URL}/departments`, config);
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
        showSnack('Failed to fetch departments. Please try again.');
      }
    };
    fetchDepartments();
  }, []);
 
  useEffect(() => {
    const fetchInsurances = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        showSnack('Token not found. Please log in.');
        return;
      }
  
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token.replace(/"/g, '')}`,
          },
        };
  console.log('Token:', token.replace(/"/g, ''));
        const response = await axios.get(`${API_URL}/insurances/valid`, config);
        setInsurances(response.data);
      } catch (error) {
        console.error('Error fetching insurances:', error);
        showSnack('Failed to fetch insurances. Please try again.');
      }
    };
  
    fetchInsurances();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const addDiploma = () => {
    append({ speciality: '', institution: '', diplomeType: '', diplomaYear: '' });
  };
// Mappe le nom de champ renvoyé par le backend vers le name du formulaire
// Fonction pour mapper le nom de champ renvoyé par le backend vers le nom du formulaire
const backendFieldToFormField = (field) => {
  switch (field) {
    case 'email': return 'email';
    case 'cin': return 'cin';
    // Ajouter d'autres champs uniques si le backend peut les renvoyer
    default: return field; // fallback
  }
};

// Fonction corrigée pour onSubmit
const onSubmit = async (data) => {
  if (activeStep !== steps.length - 1) {
    handleNext();
    return;
  }

  const token = localStorage.getItem('accessToken');
  if (!token) {
    showSnack('Token not found. Please log in.');
    return;
  }

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token.replace(/"/g, '')}`,
      },
    };

    // Dates formatées
    const formattedBirthDate = data.birthDate
      ? new Date(data.birthDate).toISOString()
      : null;
    const formattedMariageDate = data.otherInformation?.mariageDate
      ? new Date(data.otherInformation.mariageDate).toISOString()
      : null;

    // Préparez le tableau formaté de diplômes
    const diplomasPayload = data.diplomas
      .filter(d =>
        d.speciality ||
        d.institution ||
        d.diplomeType ||
        d.diplomaYear
      )
      .map(d => ({
        speciality: d.speciality,
        institution: d.institution,
        diplomeType: d.diplomeType,
        diplomaYear: d.diplomaYear
      }));

    // Construisez le payload complet
    const employeePayload = {
      ...data,
      birthDate: formattedBirthDate,
      otherInformation: {
        ...data.otherInformation,
        mariageDate: formattedMariageDate,
      },
      diplomas: diplomasPayload,
      managerId: data.manager || null,
      contractTypeId: data.contract || null,
      departmentId: data.businessUnit || null,
      insuranceGroupId: data.insuranceGroup || null,
    };

    console.log("Payload envoyé :", employeePayload);

    // Création de l'employé
    const employeeResponse = await axios.post(
      `${API_URL}/employee/employees`,
      employeePayload,
      config
    );

    const employeeId = employeeResponse.data.id;

    // Si vous voulez créer les diplômes séparément :
    if (diplomasPayload.length > 0) {
      await Promise.all(
        diplomasPayload.map(diploma =>
          axios.post(
            `${API_URL}/diplomas/employee/${employeeId}`,
            diploma,
            config
          )
        )
      );
    }

    showSnack('Account created successfully');
    navigate('/Employee-list');
  } catch (error) {
    const resp = error?.response;

    // Log complet pour diagnostiquer
    console.log('AXIOS ERROR:', {
      status: resp?.status,
      data: resp?.data,
      headers: resp?.headers,
      typeofData: typeof resp?.data,
    });

    // Normalisation du body : JSON -> objet, string JSON -> parse, sinon string brut
    let errData = resp?.data;
    if (typeof errData === 'string') {
      try { 
        errData = JSON.parse(errData); 
      } catch (e) { 
        // garde la string si ce n'est pas du JSON valide
      }
    }

    // Cas spécifique pour les erreurs de duplication (409)
    if (resp?.status === 409) {
      // Cas 1: Backend renvoie { field, value, message }
      if (errData && typeof errData === 'object' && errData.field) {
        const field = backendFieldToFormField(errData.field);
        const duplicatedValue = errData.value || '';
        const errorMessage = duplicatedValue
          ? `This value is already used: ${duplicatedValue}`
          : `This value is already used`;
        
        // Affichage de l'showSnacke
        showSnack(`Duplication Error: ${errorMessage}`);
        
        // Définir l'erreur sur le champ
        setError(field, {
          type: 'manual',
          message: errorMessage
        });
        
        return;
      }

      // Cas 2: Si c'est une string, essayer de détecter le champ
      if (typeof errData === 'string') {
        if (/email/i.test(errData)) {
          showSnack('Duplication Error: This email is already used');
          setError('email', { type: 'manual', message: 'This email is already used' });
          return;
        }
        if (/\bcin\b/i.test(errData)) {
          showSnack('Duplication Error: This CIN is already used');
          setError('cin', { type: 'manual', message: 'This CIN is already used' });
          return;
        }
        
        // Cas générique pour duplication
        showSnack(`Duplication Error: ${errData}`);
        return;
      }
      
      // Cas générique si on ne peut pas déterminer le champ
      showSnack('Duplication Error: A value you entered is already used');
      return;
    }

    // Autres erreurs
    console.error('Error:', resp?.data || error.message);
    showSnack(`Failed to add employee: ${resp?.data?.message || error.message}`);
  }
};
  

  return (
    <Paper elevation={3} sx={styles.formContainer}>
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


      <Typography variant="h4" gutterBottom>
        Add an Employee
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ marginBottom: '20px' }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <form onSubmit={handleSubmit(onSubmit)}>
        {activeStep === 0 && (
  <Grid container spacing={3}>
    <Grid item xs={6}>
      <Controller
        name="firstname"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={
              <span>
                First Name <span style={{ color: 'red' }}>*</span>
              </span>
            }
            fullWidth
            error={!!errors.firstname}
            helperText={errors?.firstname?.message}
          />
        )}
      />
    </Grid>

    <Grid item xs={6}>
      <Controller
        name="lastname"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={
              <span>
                Last Name <span style={{ color: 'red' }}>*</span>
              </span>
            }
            fullWidth
            error={!!errors.lastname}
            helperText={errors?.lastname?.message}
          />
        )}
      />
    </Grid>

    <Grid item xs={12}>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={
              <span>
                Email <span style={{ color: 'red' }}>*</span>
              </span>
            }
            type="email"
            fullWidth
            error={!!errors.email}
            helperText={errors?.email?.message}
          />
        )}
      />
    </Grid>

    <Grid item xs={6}>
      <Controller
        name="cin"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={
              <span>
                CIN <span style={{ color: 'red' }}>*</span>
              </span>
            }
            fullWidth
            error={!!errors.cin}
            helperText={errors?.cin?.message}
          />
        )}
      />
    </Grid>

    <Grid item xs={6}>
      <Controller
        name="personalPhone"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={
              <span>
                Personal Phone <span style={{ color: 'red' }}>*</span>
              </span>
            }
            fullWidth
            error={!!errors.personalPhone}
            helperText={errors?.personalPhone?.message}
          />
        )}
      />
    </Grid>

    <Grid item xs={6}>
      <Controller
        name="birthDate"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={
              <span>
                Birth Date <span style={{ color: 'red' }}>*</span>
              </span>
            }
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors.birthDate}
            helperText={errors?.birthDate?.message}
          />
        )}
      />
    </Grid>

    <Grid item xs={6}>
      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={
              <span>
                Role <span style={{ color: 'red' }}>*</span>
              </span>
            }
            select
            fullWidth
            error={!!errors.role}
            helperText={errors?.role?.message}
          >
            <MenuItem value="RH">RH</MenuItem>
            <MenuItem value="MANAGER">MANAGER</MenuItem>
            <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
          </TextField>
        )}
      />
    </Grid>
  </Grid>
)}


       {activeStep === 1 && (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <Controller
        name="address"
        control={control}
        render={({ field }) => (
          <TextField 
            {...field} 
            label="Address" 
            fullWidth 
            error={!!errors.address} 
            helperText={errors?.address?.message} 
          />
        )}
      />
    </Grid>

    <Grid item xs={6}>
      <Controller
        name="workplace"
        control={control}
        render={({ field }) => (
          <TextField 
            {...field} 
            label={
              <span>
                Workplace <span style={{ color: 'red' }}>*</span>
              </span>
            }
            fullWidth 
            error={!!errors.workplace} 
            helperText={errors?.workplace?.message} 
          />
        )}
      />
    </Grid>

    <Grid item xs={6}>
      <Controller
        name="professionalemail"
        control={control}
        render={({ field }) => (
          <TextField 
            {...field} 
            label="Professional Email" 
            type="email" 
            fullWidth 
            error={!!errors.professionalemail} 
            helperText={errors?.professionalemail?.message} 
          />
        )}
      />
    </Grid>

    <Grid item xs={6}>
      <Controller
        name="mobilePhone"
        control={control}
        render={({ field }) => (
          <TextField 
            {...field} 
            label="Mobile Phone" 
            fullWidth 
            error={!!errors.mobilePhone} 
            helperText={errors?.mobilePhone?.message} 
          />
        )}
      />
    </Grid>

    <Grid item xs={6}>
      <Controller
        name="contract"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={
              <span>
                Contract Type <span style={{ color: 'red' }}>*</span>
              </span>
            }
            select
            fullWidth
            value={field.value || ''}
            error={!!errors.contract}
            helperText={errors?.contract?.message}
          >
            <MenuItem value=""><em>Select contract type</em></MenuItem>
            {contractTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.contractTypeName}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </Grid>

    <Grid item xs={6}>
      <Controller
        name="seniority"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={
              <span>
                Seniority <span style={{ color: 'red' }}>*</span>
              </span>
            }
            select
            fullWidth
            error={!!errors.seniority}
            helperText={errors?.seniority?.message}
          >
            <MenuItem value="BEGINNER">Beginner</MenuItem>
            <MenuItem value="JUNIOR">Junior</MenuItem>
            <MenuItem value="MIDJUNIOR">Mid junior</MenuItem>
            <MenuItem value="SENIOR">Senior</MenuItem>
          </TextField>
        )}
      />
    </Grid>

    <Grid item xs={6}>
      <Controller
        name="businessUnit"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Business Unit"
            select
            fullWidth
            value={field.value || ''}
            error={!!errors.businessUnit}
            helperText={errors?.businessUnit?.message}
          >
            <MenuItem value=""><em>Select department</em></MenuItem>
            {departments.map((department) => (
              <MenuItem key={department.id} value={department.id}>
                {department.departmentName}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </Grid>

    <Grid item xs={6}>
      <Controller
        name="jobTitle"
        control={control}
        render={({ field }) => (
          <TextField 
            {...field} 
            label={
              <span>
                Job Title <span style={{ color: 'red' }}>*</span>
              </span>
            }
            fullWidth 
            error={!!errors.jobTitle} 
            helperText={errors?.jobTitle?.message} 
          />
        )}
      />
    </Grid>

    <Grid item xs={12}>
      <Controller
        name="worktime"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Work Time"
            select
            fullWidth
            error={!!errors.worktime}
            helperText={errors?.worktime?.message}
          >
            <MenuItem value="H40">40 hours</MenuItem>
            <MenuItem value="H48">48 hours</MenuItem>
            <MenuItem value="MATERNITY">Maternity</MenuItem>
          </TextField>
        )}
      />
    </Grid>

    <Grid item xs={12}>
      <Controller
        name="manager"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Manager"
            select
            fullWidth
            value={field.value || ''}
            error={!!errors.manager}
            helperText={errors?.manager?.message}
          >
            <MenuItem value=""><em>No manager</em></MenuItem>
            {managers.map((manager) => (
              <MenuItem key={manager.id} value={manager.id}>
                {manager.firstname} {manager.lastname}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </Grid>
  </Grid>
)}


       {activeStep === 2 && (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <Controller
        name="personalAddress"
        control={control}
        render={({ field }) => (
          <TextField 
            {...field} 
            label={
              <span>
                Personal Address <span style={{ color: 'red' }}>*</span>
              </span>
            }
            fullWidth 
            error={!!errors.personalAddress} 
            helperText={errors?.personalAddress?.message} 
          />
        )}
      />
    </Grid>

    <Grid item xs={12}>
      <Controller
        name="nationality"
        control={control}
        render={({ field }) => (
          <TextField 
            {...field} 
            label={
              <span>
                Nationality <span style={{ color: 'red' }}>*</span>
              </span>
            }
            fullWidth 
            error={!!errors.nationality} 
            helperText={errors?.nationality?.message} 
          />
        )}
      />
    </Grid>

    <Grid item xs={6}>
      <Controller
        name="bankAccountNumber"
        control={control}
        render={({ field }) => (
          <TextField 
            {...field} 
            label={
              <span>
                Bank Account Number <span style={{ color: 'red' }}>*</span>
              </span>
            }
            fullWidth 
            error={!!errors.bankAccountNumber} 
            helperText={errors?.bankAccountNumber?.message} 
          />
        )}
      />
    </Grid>

    <Grid item xs={6}>
      <Controller
        name="socialSecurityCode"
        control={control}
        render={({ field }) => (
          <TextField 
            {...field} 
            label={
              <span>
                Social Security Code <span style={{ color: 'red' }}>*</span>
              </span>
            }
            fullWidth 
            error={!!errors.socialSecurityCode} 
            helperText={errors?.socialSecurityCode?.message} 
          />
        )}
      />
    </Grid>
  </Grid>
)}


        {activeStep === 3 && (
          <Grid container spacing={3}>
            {fields.map((diploma, index) => (
              <React.Fragment key={diploma.id}>
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item>
                    <Typography variant="h6" gutterBottom>
                      Diploma {index + 1}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={() => remove(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`diplomas[${index}].speciality`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Speciality"
                        fullWidth
                        error={!!errors.diplomas?.[index]?.speciality}
                        helperText={errors.diplomas?.[index]?.speciality?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`diplomas[${index}].institution`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Institution"
                        fullWidth
                        error={!!errors.diplomas?.[index]?.institution}
                        helperText={errors.diplomas?.[index]?.institution?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`diplomas[${index}].diplomeType`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Diploma Type"
                        fullWidth
                        error={!!errors.diplomas?.[index]?.diplomeType}
                        helperText={errors.diplomas?.[index]?.diplomeType?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name={`diplomas[${index}].diplomaYear`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Diploma Year"
                        fullWidth
                        type="number"
                        error={!!errors.diplomas?.[index]?.diplomaYear}
                        helperText={errors.diplomas?.[index]?.diplomaYear?.message}
                      />
                    )}
                  />
                </Grid>
              </React.Fragment>
            ))}

            <Grid item xs={12}>
              <Button type="button" onClick={addDiploma} variant="contained" color="secondary">
                Add Another Diploma
              </Button>
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Gender"
                    select
                    fullWidth
                    error={!!errors.gender}
                    helperText={errors?.gender?.message}
                  >
                    <MenuItem value="MALE">Male</MenuItem>
                    <MenuItem value="FEMALE">Female</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="numberOfChildren"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Number of Children"
                    type="number"
                    fullWidth
                    error={!!errors.numberOfChildren}
                    helperText={errors?.numberOfChildren?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="martialStatus"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Marital Status"
                    select
                    fullWidth
                    error={!!errors.martialStatus}
                    helperText={errors?.martialStatus?.message}
                  >
                    <MenuItem value="SINGLE">Single</MenuItem>
                    <MenuItem value="MARRIED">Married</MenuItem>
                    <MenuItem value="DIVORCED">Divorced</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Box 
                  display="flex" 
                  justifyContent="space-between" 
                  alignItems="center"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setShowOtherInfo(!showOtherInfo)}
                >
                  <Typography variant="h6">Other Information</Typography>
                  <IconButton>
                    {showOtherInfo ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>

                <Collapse in={showOtherInfo}>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                      <Controller
                        name="otherInformation.stcServi"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...field}
                                checked={field.value || false}
                                onChange={(e) => field.onChange(e.target.checked)}
                              />
                            }
                            label="STC Servi"
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <Controller
                        name="otherInformation.mariageDate"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Marriage Date"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={field.value ? formatDate(field.value) : ''}
                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                            error={errors.otherInformation?.mariageDate}
                            helperText={errors.otherInformation?.mariageDate?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <Controller
                        name="otherInformation.bankDomiciliation"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...field}
                                checked={field.value || false}
                                onChange={(e) => field.onChange(e.target.checked)}
                              />
                            }
                            label="Bank Domiciliation"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Collapse>
              </Paper>
            </Grid>
          </Grid>
        )}

        {activeStep === 4 && (
  <Grid container spacing={3}>
    <Grid item xs={6}>
      <Controller
        name="policyNumberIns"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={
              <span>
                Insurance Code <span style={{ color: 'red' }}>*</span>
              </span>
            }
            fullWidth
            error={!!errors.policyNumberIns}
            helperText={errors?.policyNumberIns?.message}
          />
        )}
      />
    </Grid>

    <Grid item xs={6}>
      <Controller
        name="insuranceGroup"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={
              <span>
                Insurance <span style={{ color: 'red' }}>*</span>
              </span>
            }
            select
            fullWidth
            value={field.value || ''}
            error={!!errors.insuranceGroup}
            helperText={errors?.insuranceGroup?.message}
          >
            <MenuItem value=""><em>Select insurance</em></MenuItem>
            {insurances.map((insurance) => (
              <MenuItem key={insurance.id} value={insurance.id}>
                {insurance.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </Grid>
  </Grid>
)}


        <Grid item xs={12} sx={{ mt: 3 }}>
          <Grid container justifyContent="flex-end" spacing={2}>
            <Grid item>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
            </Grid>
            <Grid item>
              <Button type="submit" variant="contained" color="primary">
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        
      </form>
      
    </Paper>
  );
} 

export default AddAccount;