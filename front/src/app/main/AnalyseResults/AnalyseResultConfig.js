import AnalyseResultPage from './AnalyseResultsPage';
import authRoles from '../../auth/authRoles';

const AnalyseResultConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest, // ou `onlyGuest`, selon tes règles
  routes: [
    {
      path: 'analyseresults/:id',
      element: <AnalyseResultPage />,
    },
  ],
};

export default AnalyseResultConfig;
