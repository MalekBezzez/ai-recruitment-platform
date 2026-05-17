import DepartmentListPage from './DepartmentListPage';
import authRoles from '../../auth/authRoles';

const DepartmentListConfig = {
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
      path: 'DepartmentList',
      element: <DepartmentListPage />,
    },
  ],
};

export default DepartmentListConfig;
