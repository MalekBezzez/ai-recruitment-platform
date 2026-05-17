import EditPhase from './EditPhase';
import authRoles from '../../auth/authRoles';

const EditPhaseConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'editphase/:projectId/:phaseId',
      element: <EditPhase />,
    },
  ],
};

export default EditPhaseConfig;