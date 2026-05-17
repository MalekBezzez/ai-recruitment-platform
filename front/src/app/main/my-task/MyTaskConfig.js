import MyTask from './MyTask';
import authRoles from '../../auth/authRoles';

const MyTaskConfig = {
  settings: {
    layout: {  
    config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'my-tasks',
      element: <MyTask/>,
    },
  ],
};

export default MyTaskConfig;