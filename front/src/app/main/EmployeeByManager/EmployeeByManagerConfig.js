// EmployeeByManagerConfig.jsx
import EmployeeByManagerPage from './EmployeeByManagerPage';
import authRoles from '../../auth/authRoles';

const EmployeeByManagerConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'employees-by-manager/:managerId' ,
      element: <EmployeeByManagerPage />,
    },
  ],
};

export default EmployeeByManagerConfig;