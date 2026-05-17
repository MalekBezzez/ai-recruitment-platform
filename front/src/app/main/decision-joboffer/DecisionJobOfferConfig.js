
import DecisionJobOffer from './DecisionJobOffer';
import authRoles from '../../auth/authRoles';

const DecisionJobOfferConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'training-recommendation-start',
      element: <DecisionJobOffer />,
    },
  ],
};

export default DecisionJobOfferConfig;