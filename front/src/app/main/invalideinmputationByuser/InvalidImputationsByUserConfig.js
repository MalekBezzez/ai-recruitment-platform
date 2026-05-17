import InvalidImputationsByUserPage from './InvalidImputationsByUserPage';
import authRoles from '../../auth/authRoles';

const InvalidImputationsByUserConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'imputations/valid/:userId',
      element: <InvalidImputationsByUserPage />,
    },
  ],
};

export default InvalidImputationsByUserConfig;
