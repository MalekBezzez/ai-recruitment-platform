import EmployeeAndChannelListPage from './EmployeeAndChannelListPage';
import authRoles from '../../auth/authRoles';

const EmployeeAndChannelConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest, // ou autre selon tes rôles définis
  routes: [
    {
      path: 'employee-channel-list',
      element: <EmployeeAndChannelListPage />,
    },
  ],
};

export default EmployeeAndChannelConfig;
