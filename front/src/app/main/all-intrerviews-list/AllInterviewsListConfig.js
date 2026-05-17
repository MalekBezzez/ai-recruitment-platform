import AllInterviewsList from './AllInterviewsList'
import authRoles from '../../auth/authRoles';


const AllInterviewsListConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
 auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'all-interviews-list',
      element: <AllInterviewsList />,
    },
  ],
};

export default AllInterviewsListConfig;