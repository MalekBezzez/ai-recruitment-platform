import PhaseListByProjectPage from './PhaseListByProjectPage';
import authRoles from '../../auth/authRoles';

const PhaseListByProjectConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'projectphases/:projectId',
      element: <PhaseListByProjectPage />,
    },
  ],
};

export default PhaseListByProjectConfig;
