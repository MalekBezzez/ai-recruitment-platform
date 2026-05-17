import AnswersByQuestionnairePage from './AnswersByQuestionnairePage';
import authRoles from '../../auth/authRoles';

const AnswersByQuestionnaireConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  auth: authRoles.onlyGuest, // 🔐 Accessible aux utilisateurs connectés
  routes: [
    {
      path: 'answers-overview', // 🔗 Route disponible à /answers-overview
      element: <AnswersByQuestionnairePage />
    }
  ]
};

export default AnswersByQuestionnaireConfig;
