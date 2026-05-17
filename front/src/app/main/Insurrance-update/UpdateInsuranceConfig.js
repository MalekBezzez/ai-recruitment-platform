import UpdateInsurancePage from './UpdateInsurancePage';
import authRoles from '../../auth/authRoles';

const UpdateInsuranceConfig = {
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
      path: 'insurrance-update/:id',
      element: <UpdateInsurancePage />,
    },
  ],
};

export default UpdateInsuranceConfig;
