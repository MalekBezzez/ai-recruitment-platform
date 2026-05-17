import authRoles from '../../auth/authRoles';
import CareerPathingResults from './CareerPathingResults';
const CareerPathingResultsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: ':planId/career-pathing-results',
      element: <CareerPathingResults/>,
    },
    
  ],
};

export default CareerPathingResultsConfig;