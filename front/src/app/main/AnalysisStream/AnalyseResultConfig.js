import AnalyseResultsPage from './AnalysisStream';
import authRoles from '../../auth/authRoles';

const AnalyseResultStreamConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest, // ou `user`, selon ton besoin
  routes: [
    {
      path: 'analyseresultss',
      element: <AnalyseResultsPage />,
    },
  ],
};

export default AnalyseResultStreamConfig;
