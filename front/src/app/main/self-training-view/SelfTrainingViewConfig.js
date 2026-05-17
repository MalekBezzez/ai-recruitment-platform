import authRoles from '../../auth/authRoles';
import SelfTrainingView from './SelfTrainingView';
const SelfTrainingViewConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: ':planId/self-training-results',
      element: <SelfTrainingView/>,
    },
    
  ],
};

export default SelfTrainingViewConfig;