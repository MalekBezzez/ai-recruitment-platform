import EmployeeUpdatePage from './EmployeeUpdatePage' ;
import authRoles from '../../auth/authRoles';

const EmployeeUpdateConfig = {
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
      path: 'Employee-update/:id',
      element: <EmployeeUpdatePage />,
    },
  ],
};

export default EmployeeUpdateConfig;
