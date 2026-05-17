import EditTask from './EditTask';
import authRoles from '../../auth/authRoles';

const TaskEditConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest, 
  routes: [
    {
      path: 'phases/tasks/edit/:taskId',
      element: <EditTask />,
    },
  ],
};

export default TaskEditConfig;
