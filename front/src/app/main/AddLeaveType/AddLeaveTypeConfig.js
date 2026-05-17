import AddLeaveTypePage from './AddLeaveTypePage';
import authRoles from '../../auth/authRoles';

const AddLeaveTypeConfig = {
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
      path: 'AddLeaveType',
      element: <AddLeaveTypePage/>,
    },
  ],
};

export default AddLeaveTypeConfig;
