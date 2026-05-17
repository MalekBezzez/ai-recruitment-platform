import MessageAnalyse from './MessageAnalyse';
import authRoles from '../../auth/authRoles';

const MessageAnalyseConfig = {
  settings: {
    settings: {
      layout: {
        config: {},
      },
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'MessageAnalyse/:questionnaireId',
      element: <MessageAnalyse />,
    },
  ],
};

export default MessageAnalyseConfig;
