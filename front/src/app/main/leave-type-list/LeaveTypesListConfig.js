import LeaveTypesListPage from './LeaveTypesListPage';
import authRoles from '../../auth/authRoles';

const LeaveTypesListConfig = {
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
      path: 'leavetypeslist',
      element: <LeaveTypesListPage />,
    },
  ],
};

export default LeaveTypesListConfig;
