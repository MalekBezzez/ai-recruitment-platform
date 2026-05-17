import RespondentListPage from './RespondentListPage';
import authRoles from '../../auth/authRoles';

const RespondentListPageConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest, // change to `admin` if needed
  routes: [
    {
      path: 'answers-overview/:questionnaireId',
      element: <RespondentListPage />,
    },
  ],
};

export default RespondentListPageConfig;
