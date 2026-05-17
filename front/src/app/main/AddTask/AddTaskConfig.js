import AddTask from './AddTask';
import authRoles from '../../auth/authRoles';

const AddTaskConfig = {
  settings: {
    settings: {
      layout: {
        config: {},
      },
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'addtask/:phaseId', 
      element: <AddTask />,
    },
  ],
  
};

export default AddTaskConfig;
