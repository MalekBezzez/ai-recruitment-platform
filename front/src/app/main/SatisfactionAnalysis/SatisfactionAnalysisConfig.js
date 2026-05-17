import SatisfactionAnalysisPage from './SatisfactionAnalysisPage';
import authRoles from '../../auth/authRoles';


const SatisfactionAnalysisConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest, 
  routes: [
    {
      path: '/satisfaction-analysis/:questionnaireId', 
      element: <SatisfactionAnalysisPage />,
    },
  ],
};

export default SatisfactionAnalysisConfig;