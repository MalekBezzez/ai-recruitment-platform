import EditClientPage from './EditClientPage';
import authRoles from '../../auth/authRoles';

const EditClientConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'clients/edit/:id',
      element: <EditClientPage />,
    },
  ],
};

export default EditClientConfig;
