import LeaveRequestListPage from './LeaveRequestListPage';
import authRoles from '../../auth/authRoles';

const LeaveRequestListConfig = {
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
      path: 'demande-conge-list',
      element: <LeaveRequestListPage />,
    },
  ],
};

export default LeaveRequestListConfig;
