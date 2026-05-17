import AddDepartmentPage from './AddDepartmentPage';
import authRoles from '../../auth/authRoles';

const AddDepartmentConfig = {
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
      path: 'AddDepartment',
      element: <AddDepartmentPage/>,
    },
  ],
};

export default AddDepartmentConfig;
