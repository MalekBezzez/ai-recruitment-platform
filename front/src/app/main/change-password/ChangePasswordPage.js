import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import _ from '@lodash';
import Paper from '@mui/material/Paper';
import FormHelperText from '@mui/material/FormHelperText';
import axios from 'axios';
import 'src/styles/style.css'; 

const schema = yup.object().shape({
  oldPassword: yup.string().required('You must enter your old password'),
  newPassword: yup
    .string()
    .required('Please enter your new password.')
    .min(8, 'Password is too short - should be 8 chars minimum.'),
  confirmNewPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
});
const API_URL = process.env.REACT_APP_API_URL; 
 
console.log('API_URL:', API_URL);
const defaultValues = {
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

function ChangePasswordPage() {
  const { control, formState, handleSubmit, reset } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors, setError } = formState;

  const onSubmit = async ({ oldPassword, newPassword }) => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) throw new Error("User not found in localStorage");
      const user = JSON.parse(userString);
      if (!user || !user.user.email) throw new Error("Email not found in user object");
      const email = user.user.email;
      const response = await axios.put(`${API_URL}/auth/modifier/${email}`, {
        oldPassword,
        newPassword,
      });
      console.log(response.data);
      this.emit('onLogin', response);
    } catch (error) {
      if (error.response) {
        error.response.data.errors.forEach((err) => {
          setError(err.field, {
            type: 'manual',
            message: err.message,
          });
        });
      } else {
        console.error(error.message);
        alert("An error occurred: " + error.message);
      }
    }}
 

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Paper className="h-full sm:h-auto md:flex md:items-center md:justify-end w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1">
     
        <div className="text-center">
          {/* <img className="w-48 mx-auto " src="assets/images/logo/logo.svg" alt="logo" /> */}
          <Typography className="mt-8 text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-left" >
            Change Password
          </Typography>
          <Typography className="mt-4 text-lg text-gray-600 text-left">
            For your security, please choose a strong password that is at least 8 characters long, includes upper and lower case letters, and contains numbers and symbols.
          </Typography>
          <form
            name="changePasswordForm"
            noValidate
            className="mt-6 sm:mt-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="oldPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-20"
                  label="Old Password"
                  type="password"
                  error={!!errors.oldPassword}
                  helperText={errors?.oldPassword?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-20"
                  label="New Password"
                  type="password"
                  error={!!errors.newPassword}
                  helperText={errors?.newPassword?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="confirmNewPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-20"
                  label="Confirm New Password"
                  type="password"
                  error={!!errors.confirmNewPassword}
                  helperText={errors?.confirmNewPassword?.message}
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
              aria-label="Change Password"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
              size="large"
            >
              Change Password
            </Button>
          </form>
        </div>
      </Paper>
    </div>
  );
}

export default ChangePasswordPage;