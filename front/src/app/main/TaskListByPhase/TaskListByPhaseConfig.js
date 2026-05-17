import TaskListByPhasePage from './TaskListByPhasePage';
import authRoles from '../../auth/authRoles';

const TaskListByPhaseConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'phasetasks/:phaseId',
      element: <TaskListByPhasePage />,
    },
  ],
};

export default TaskListByPhaseConfig;
