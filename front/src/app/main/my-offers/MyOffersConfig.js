import MyOffers from './MyOffers.jsx';
import authRoles from '../../auth/authRoles';

const MyOffersConfig = {
  settings: {
    layout: {  
    config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'my-offers',
      element: <MyOffers key={new URLSearchParams(window.location.search).get('refresh') || 'default'} />,
    },
  ],
};

export default MyOffersConfig;

