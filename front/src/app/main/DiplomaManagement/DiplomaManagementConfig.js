import DiplomaManagementPage from './DiplomaManagementPage';
import authRoles from '../../auth/authRoles';

const DiplomaManagementConfig = {
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
      path: 'DiplomaManagementPage/:id',
      element: <DiplomaManagementPage />,
    },
  ],
};

export default DiplomaManagementConfig;
