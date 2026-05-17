import authRoles from '../../auth/authRoles';
import StructuredTrainingView from './StructuredTrainingView';
const StructuredTrainingViewConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: ':planId/structured-training-results',
      element: <StructuredTrainingView/>,
    },
    
  ],
};

export default StructuredTrainingViewConfig;