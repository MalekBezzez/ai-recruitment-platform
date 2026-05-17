import AddInsurance from './addInsurrancePage';
import authRoles from '../../auth/authRoles';

const addInsurranceConfig = {
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
      path: 'addinsurance',
      element: <AddInsurance/>,
    },
  ],
};

export default addInsurranceConfig;
