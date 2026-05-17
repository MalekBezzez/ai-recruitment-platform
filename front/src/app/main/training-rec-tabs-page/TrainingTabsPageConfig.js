import authRoles from '../../auth/authRoles';
import TrainingTabsPage from './TrainingTabsPage';
const TrainingTabsPageConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: ':planId/training-recommendation-tabs',
      element: <TrainingTabsPage/>,
    },
    
  ],
};

export default TrainingTabsPageConfig;