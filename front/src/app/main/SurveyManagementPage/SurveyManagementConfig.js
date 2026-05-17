// 📁 src/app/main/survey-management/SurveyManagementConfig.js
import SurveyManagementPage from './SurveyManagementPage';
import authRoles from '../../auth/authRoles';

const SurveyManagementConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  auth: authRoles.onlyGuest, // Remplace par 'admin' si restreint
  routes: [
    {
      path: 'survey-management',
      element: <SurveyManagementPage />
    }
  ]
};

export default SurveyManagementConfig;
