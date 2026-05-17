
import SurveyListPage from './SurveyListPage';
import authRoles from '../../auth/authRoles';

const SurveyListConfig = {
  settings: {
    layout: {
      config: {
     
      }
    }
  },
  auth: authRoles.onlyGuest, 
  routes: [
    {
      path: 'surveys',
      element: <SurveyListPage />
    }
  ]
};

export default SurveyListConfig;
