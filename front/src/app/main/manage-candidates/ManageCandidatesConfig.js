import ManageCandidates from './ManageCandidates';
import authRoles from '../../auth/authRoles';


const ManageCandidatesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'manage-candidates',
      element: <ManageCandidates />,
    },
  ],
};

export default ManageCandidatesConfig;