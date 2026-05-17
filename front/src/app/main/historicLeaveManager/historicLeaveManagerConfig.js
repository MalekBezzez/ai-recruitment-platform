import HistoricLeaveManagerPage from './HistoricLeaveManagerPage' ;
import authRoles from '../../auth/authRoles';

const historicLeaveManagerConfig = {
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
      path: 'historicLeaveManager',
      element: <HistoricLeaveManagerPage />,
    },
  ],
};

export default historicLeaveManagerConfig;
