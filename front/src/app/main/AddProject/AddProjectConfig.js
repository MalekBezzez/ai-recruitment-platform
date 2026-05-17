import AddProject from './AddProject';
import authRoles from '../../auth/authRoles';

const AddProjectConfig = {
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
      path: 'addproject',
      element: <AddProject/>,
    },
  ],
};

export default AddProjectConfig;
