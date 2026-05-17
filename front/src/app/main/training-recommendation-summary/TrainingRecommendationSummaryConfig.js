import authRoles from '../../auth/authRoles';
import TrainingRecommendationSummary from './TrainingRecommendationSummary';
const TrainingRecommendationSummaryConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'training-recommendation-plan',
      element: <TrainingRecommendationSummary/>,
    },
  ],
};

export default TrainingRecommendationSummaryConfig ;