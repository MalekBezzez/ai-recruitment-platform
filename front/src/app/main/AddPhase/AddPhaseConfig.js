import AddPhase from './AddPhase';
import authRoles from '../../auth/authRoles';

const AddPhaseConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'addphase/:projectId',
      element: <AddPhase />,
    },
  ],
};

export default AddPhaseConfig;
