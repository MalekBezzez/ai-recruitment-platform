import authRoles from '../../auth/authRoles';
import WorkModeList from './WorkModeList';
const WorkModeListConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'work-mode-list',
      element: <WorkModeList/>,
    },
  ],
};

export default WorkModeListConfig;