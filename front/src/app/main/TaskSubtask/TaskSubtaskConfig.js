import TaskSubtaskPage from './TaskSubtaskPage';
import authRoles from '../../auth/authRoles';

const TaskSubtaskConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'tasks/:parentTaskId/subtasks',
      element: <TaskSubtaskPage />,
    },
  ],
};

export default TaskSubtaskConfig;
