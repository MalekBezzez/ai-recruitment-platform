import authRoles from '../../auth/authRoles';
import CoachingView from './CoachingView';
const CoachingViewConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: ':planId/coaching-results',
      element: <CoachingView/>,
    },
    
  ],
};

export default CoachingViewConfig;