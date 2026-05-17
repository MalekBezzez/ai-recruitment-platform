import authRoles from '../../auth/authRoles';
import CareerRecommendationSummary from './CareerRecommendationSummary';


const  CareerRecommendationSummaryConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'career-pathing-recommendation-plan',
      element: <CareerRecommendationSummary/>,
    },
  ],
};

export default CareerRecommendationSummaryConfig ;