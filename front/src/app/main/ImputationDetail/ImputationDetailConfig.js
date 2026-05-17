import ImputationDetailPage from './ImputationDetailPage';
import authRoles from '../../auth/authRoles';

const ImputationDetailConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest, // ✅ change selon tes besoins (e.g. 'admin', 'user')
  routes: [
    {
      path: 'imputations/:imputationId',
      element: <ImputationDetailPage />,
    },
  ],
};

export default ImputationDetailConfig;
