import EmployeeProfilePage from './EmployeeProfilePage';
import authRoles from '../../auth/authRoles';

const EmployeeProfileConfig = {
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
      path: 'Employee-profile/:id',
      element: <EmployeeProfilePage />,
    },
  ],
};

export default EmployeeProfileConfig;
