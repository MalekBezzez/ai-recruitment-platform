import OfferDetails from './OfferDetails';
import authRoles from '../../auth/authRoles';


const OfferDetailsConfig = {
  settings: {
    layout: {  
    config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'offer-details',
      element: <OfferDetails />,
    },
  ],
};

export default OfferDetailsConfig;