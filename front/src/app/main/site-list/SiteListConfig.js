import authRoles from '../../auth/authRoles';
import SiteList from './SiteList';
const SiteListConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'site-list',
      element: <SiteList/>,
    },
  ],
};

export default SiteListConfig;