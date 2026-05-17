import LeaveRequestDetailPage from './LeaveRequestDetailPage';
import authRoles from '../../auth/authRoles';

const LeaveRequestDetailConfig = {
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
      path: 'LeaveRequestDetail/:id',
      element: <LeaveRequestDetailPage />,
    },
  ],
};

export default LeaveRequestDetailConfig;
