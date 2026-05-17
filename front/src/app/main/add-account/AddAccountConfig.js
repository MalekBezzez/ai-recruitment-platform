import AddAccount from './AddAccountPage';
import authRoles from '../../auth/authRoles';

const AddAccountConfig = {
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
      path: 'add-account',
      element: <AddAccount />,
    },
  ],
};

export default AddAccountConfig;
