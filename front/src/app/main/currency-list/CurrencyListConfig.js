import authRoles from '../../auth/authRoles';
import CurrencyList from './CurrencyList';
const CurrencyListConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'currency-list',
      element: <CurrencyList/>,
    },
  ],
};

export default CurrencyListConfig;