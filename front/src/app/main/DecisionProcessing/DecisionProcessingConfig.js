import DecisionProcessingPage from './DecisionProcessingPage';
import authRoles from '../../auth/authRoles';

const DecisionProcessingConfig = {
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
      path: 'Decision/:id',
      element: <DecisionProcessingPage />,
    },
  ],
};

export default DecisionProcessingConfig;
