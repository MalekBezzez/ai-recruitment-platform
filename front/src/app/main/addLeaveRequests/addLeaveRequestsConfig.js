import AddLeaveRequestsPage  from './addLeaveRequestsPage';
import authRoles from '../../auth/authRoles';

const addLeaveRequestsConfig = {
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
      path: 'addLeaveRequest',
      element: <AddLeaveRequestsPage />,
    },
  ],
};

export default addLeaveRequestsConfig;
