import AnswerQuestionnairePage from './AnswerQuestionnairePage';
import authRoles from '../../auth/authRoles';

const AnswerQuestionnaireConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'survey/:questionnaireId/answer',
      element: <AnswerQuestionnairePage />
    }
  ]
};

export default AnswerQuestionnaireConfig;
