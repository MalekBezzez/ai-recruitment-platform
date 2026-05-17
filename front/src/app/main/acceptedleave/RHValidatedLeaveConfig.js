import RHValidatedLeavesPage from './RHValidatedLeavesPage';
import authRoles from '../../auth/authRoles';

const RHValidatedLeavesConfig = {
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
      path: 'validatedleaves',
      element: <RHValidatedLeavesPage />,
    },
  ],
};

export default RHValidatedLeavesConfig;
