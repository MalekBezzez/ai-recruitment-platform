import authRoles from '../../auth/authRoles';
import InterviewsList from './InterviewsList';
const InterviewsListConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
     // Vue générale sans paramètre (tous les entretiens)
    {
      path: 'interviews-list',
      element: <InterviewsList />,
    },
    // Vue spécifique avec un ID de candidature
    {
      path: 'interviews-list/:id',
      element: <InterviewsList />,
    },
  ],
};

export default InterviewsListConfig;