import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import _ from '@lodash';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import 'src/styles/style.css';

import React, { useState } from 'react';

import { Snackbar,Alert} from  '@mui/material';
const schema = yup.object().shape({
  name: yup.string().required('Insurance name is required'),
  description: yup.string().required('Description is required'),
  insuranceProvider: yup.string().required('Insurance provider is required'),
  contactInfo: yup.string().required('Contact info is required'),
  startDate: yup.date().required('Start date is required'),
   endDate: yup
    .date()
    .required("End Date is required")
    .min(
      yup.ref("startDate"),
      "End Date must be later than Start Date"
    ),
});

const defaultValues = {
  name: '',
  description: '',
  insuranceProvider: '',
  contactInfo: '',
  startDate: '',
  endDate: '',
};
const API_URL = process.env.REACT_APP_API_URL;

console.log('API_URL:', API_URL);
function AddInsurance() {
  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
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

  const { isValid, dirtyFields, errors } = formState;

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error("Token not found in localStorage");

      const config = {
        headers: {
          Authorization: `Bearer ${token.replace(/"/g, '')}`,
        },
      };

      const response = await axios.post(`${API_URL}/insurances`, data, config);
      console.log('Insurance added:', response.data);
      showSnack('Insurance successfully added!');
      reset(); // Reset the form after submission
    } catch (error) {
      console.log('Error adding insurance:', error);
      showSnack("An error occurred while adding the insurance.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Paper className="h-full sm:h-auto md:flex md:items-center md:justify-end w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1">
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
        <div className="text-center">
          <Typography className="mt-8 text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-left">
            Add an Insurance
          </Typography>
          <Typography className="mt-4 text-lg text-gray-600 text-left">
            Please fill in the insurance details.
          </Typography>
          <form
            name="addInsuranceForm"
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
                  label="Insurance Name"
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-20"
                  label="Description"
                  error={!!errors.description}
                  helperText={errors?.description?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="insuranceProvider"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-20"
                  label="Insurance Provider"
                  error={!!errors.insuranceProvider}
                  helperText={errors?.insuranceProvider?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="contactInfo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-20"
                  label="Contact Info"
                  error={!!errors.contactInfo}
                  helperText={errors?.contactInfo?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-20"
                  label="Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.startDate}
                  helperText={errors?.startDate?.message}
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
            <Button
              variant="contained"
              color="secondary"
              className="w-full mt-6"
              aria-label="Add an Insurance"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
              size="large"
            >
              Add Insurance
            </Button>
          </form>
        </div>
      </Paper>
    </div>
  );
}

export default AddInsurance;
