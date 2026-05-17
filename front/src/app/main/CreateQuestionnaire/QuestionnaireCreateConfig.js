import CreateQuestionnairePage from './CreateQuestionnairePage';
import authRoles from '../../auth/authRoles';

const QuestionnaireCreateConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'create-questionnaire',
      element: <CreateQuestionnairePage />,
    },
  ],
};

export default QuestionnaireCreateConfig;
