import authRoles from '../../auth/authRoles';
import DiplomaTypeOffer from './DiplomaTypeOffer';
const DiplomaTypeOfferConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'diploma-type',
      element: <DiplomaTypeOffer/>,
    },
  ],
};

export default DiplomaTypeOfferConfig;