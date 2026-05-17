
import OffersProcess from './OffersProcess.jsx';
import authRoles from '../../auth/authRoles';



const OffersProcessConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'my-requests',
      element: <OffersProcess/>,
    },
  ],
};

export default OffersProcessConfig;