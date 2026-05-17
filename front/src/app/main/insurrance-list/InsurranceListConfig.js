import InsurranceListPage from './InsurranceListPage';
import authRoles from '../../auth/authRoles';

const InsurranceListConfig = {
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
      path: 'insurrance-list',
      element: <InsurranceListPage />,
    },
  ],
};

export default InsurranceListConfig;
