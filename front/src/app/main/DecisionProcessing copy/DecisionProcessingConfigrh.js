import DecisionProcessingPagerh from './DecisionProcessingPagerh';
import authRoles from '../../auth/authRoles';

const DecisionProcessingConfigrh = {
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
      path: 'Decisionrh/:id',
      element: <DecisionProcessingPagerh />,
    },
  ],
};

export default DecisionProcessingConfigrh;
