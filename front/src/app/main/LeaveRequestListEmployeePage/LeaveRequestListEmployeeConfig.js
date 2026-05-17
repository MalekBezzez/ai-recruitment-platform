import LeaveRequestListEmployeePage from './LeaveRequestListEmployeePage';
import authRoles from '../../auth/authRoles';

const LeaveRequestListEmployeeConfig = {
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
      path: 'LeaveRequestListEmployee/:id',
      element: <LeaveRequestListEmployeePage />,
    },
  ],
};

export default LeaveRequestListEmployeeConfig;
