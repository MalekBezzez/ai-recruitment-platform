import LeaveRequestDetailsPage from './LeaveRequestDetailsPage';
import authRoles from '../../auth/authRoles';

const LeaveRequestDetailsConfig = {
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
      path: 'detaildemande/:id',
      element: <LeaveRequestDetailsPage />,
    },
  ],
};

export default LeaveRequestDetailsConfig;
