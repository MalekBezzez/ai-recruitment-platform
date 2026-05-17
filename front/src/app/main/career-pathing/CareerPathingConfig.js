import CareerPathing from './CareerPathing.jsx'
import authRoles from '../../auth/authRoles';

const CareerPathingConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'career-pathing-start',
      element: <CareerPathing />,
    },
  ],
};

export default CareerPathingConfig;