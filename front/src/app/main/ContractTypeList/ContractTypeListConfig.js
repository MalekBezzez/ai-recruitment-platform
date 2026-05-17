import ContractTypeListPage from './ContractTypeListPage';
import authRoles from '../../auth/authRoles';

const ContractTypeListConfig = {
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
      path: 'ContractTypeList',
      element: <ContractTypeListPage />,
    },
  ],
};

export default ContractTypeListConfig;
