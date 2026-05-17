import AddSubtask from './AddSubtask';
import authRoles from '../../auth/authRoles';

const AddSubtaskConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'tasks/add-subtask/:parentTaskId/phase/:phaseId',
      element: <AddSubtask />,
    },
  ],
};

export default AddSubtaskConfig;
 