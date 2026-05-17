import PredictionResultListPage from './PredictionResultListPage';
import authRoles from '../../auth/authRoles'; // ajuste le rôle selon ton besoin

const PredictionResultListConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  auth: authRoles.onlyGuest, 
  routes: [
    {
      path: 'prediction-results',
      element: <PredictionResultListPage />
    }
  ]
};

export default PredictionResultListConfig;
