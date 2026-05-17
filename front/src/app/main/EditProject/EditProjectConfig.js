import EditProject from './EditProject';
import authRoles from '../../auth/authRoles';

const EditProjectConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest, // Adjust auth roles as needed (e.g., onlyAdmin, user)
  routes: [
    {
      path: 'editproject/:id',
      element: <EditProject />,
    },
  ],
};

export default EditProjectConfig;