MyOfferProcessHistory

import MyOfferProcessHistory from './MyOfferProcessHistory';
import authRoles from '../../auth/authRoles';

const MyOfferProcessHistoryConfig = {
  settings: {
    layout: {  
    config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'my-joboffer-request-history',
      element: <MyOfferProcessHistory/>,
    },
  ],
};

export default MyOfferProcessHistoryConfig;