import authRoles from '../../auth/authRoles';
import AddWorkMode from './AddWorkMode';
const WorkModeConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'add-work-mode',
      element: <AddWorkMode/>,
    },
  ],
};

export default WorkModeConfig;