import AddContractTypePage from './AddContractTypePage';
import authRoles from '../../auth/authRoles';

const AddContractTypeConfig = {
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
      path: 'AddContractType',
      element: <AddContractTypePage/>,
    },
  ],
};

export default AddContractTypeConfig;
