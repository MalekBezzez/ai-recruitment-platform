import InsurranceProfilePage from './InsurranceProfilePage';
import authRoles from '../../auth/authRoles';

const InsurranceProfileConfig = {
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
      path: 'insurrance-profile/:id',
      element: <InsurranceProfilePage />,
    },
  ],
};

export default InsurranceProfileConfig;
