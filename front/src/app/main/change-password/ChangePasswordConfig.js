import ChangePasswordPage from './ChangePasswordPage';
import authRoles from '../../auth/authRoles';

const ChangePasswordConfig = {
  settings: {
    settings: {
      layout: {
        config: {},
      },
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'Change-Password',
      element: <ChangePasswordPage />,
    },
  ],
};

export default ChangePasswordConfig;
