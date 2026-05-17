import EmployeeListPage from './EmployeeListPage';
import authRoles from '../../auth/authRoles';

const EmployeeListConfig = {
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
      path: 'Employee-list',
      element: <EmployeeListPage />,
    },
  ],
};

export default EmployeeListConfig;
