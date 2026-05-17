import ApplicationsList from './ApplicationsList';
import authRoles from '../../auth/authRoles';


const ApplicationsListConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
 auth: authRoles.onlyGuest,
  routes: [
    {
      path: '/job-offers/:id/applications',
      element: <ApplicationsList />,
    },

     {
      path: '/job-offers/applications',
      element: <ApplicationsList />,
    },

  ],
};

export default ApplicationsListConfig;