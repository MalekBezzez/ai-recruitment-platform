import ResetPassword1Page from './ResetPassword1Page'
import authRoles from '../../auth/authRoles';

const ResetPassword1Config = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'reset-password1',
      element: <ResetPassword1Page />,
    },
  ],
};

export default ResetPassword1Config;
