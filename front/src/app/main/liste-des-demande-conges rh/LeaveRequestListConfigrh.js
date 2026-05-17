import LeaveRequestListPagerh from './LeaveRequestListPagerh';
import authRoles from '../../auth/authRoles';

const LeaveRequestListConfigrh = {
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
      path: 'demande-conge-listrh',
      element: <LeaveRequestListPagerh />,
    },
  ],
};

export default LeaveRequestListConfigrh;
