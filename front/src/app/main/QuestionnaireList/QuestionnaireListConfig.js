import QuestionnaireListPage from './QuestionnaireListPage';
import authRoles from '../../auth/authRoles'; // si tu gères les rôles

const QuestionnaireListConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  auth: authRoles.onlyGuest, // ou onlyGuest / admin selon ton besoin
  routes: [
    {
      path: 'questionnaires',
      element: <QuestionnaireListPage />
    }
  ]
};

export default QuestionnaireListConfig;
