import MyTaskHistory from './MyTaskHistory';
import authRoles from '../../auth/authRoles';




const MyTaskHistoryConfig = {
  settings: {
    layout: {  
    config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'processed-requests',
      element: <MyTaskHistory/>,
    },
  ],
};

export default MyTaskHistoryConfig;