import ChannelManagerPage from './ChannelManagerPage';
import authRoles from '../../auth/authRoles';

const ChannelManagerConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest, // ou `authRoles.user`, selon les rôles que tu définis
  routes: [
    {
      path: 'channel-manager',
      element: <ChannelManagerPage />,
    },
  ],
};

export default ChannelManagerConfig;
