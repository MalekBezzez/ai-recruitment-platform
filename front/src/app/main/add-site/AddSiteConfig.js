import authRoles from '../../auth/authRoles';
import AddSite from './AddSite';
const AddSiteConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'add-site',
      element: <AddSite/>,
    },
  ],
};

export default AddSiteConfig;