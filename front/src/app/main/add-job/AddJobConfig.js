
import AddJob from './AddJob';
import authRoles from '../../auth/authRoles';


const AddJobConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'add-joboffer',
      element: <AddJob />,
    },
  ],
};

export default AddJobConfig;