import LeaveRequestEmployeeListPage from './LeaveRequestEmployeeListPage';
import authRoles from '../../auth/authRoles';

const LeaveRequestEmployeeListConfig = {
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
      path: 'LeaveRequestEmployeeList',
      element: <LeaveRequestEmployeeListPage />,
    },
  ],
};

export default LeaveRequestEmployeeListConfig;
