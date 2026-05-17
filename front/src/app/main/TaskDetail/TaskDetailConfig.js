import TaskDetailPage from './TaskDetailPage';
import authRoles from '../../auth/authRoles';

const TaskDetailConfig = {
  settings: { layout: { config: {} } },
  auth: authRoles.onlyGuest, // modifie selon besoin
  routes: [
    {
      path: 'tasks/detail/:taskId',
      element: <TaskDetailPage />,
    },
  ],
};

export default TaskDetailConfig;
