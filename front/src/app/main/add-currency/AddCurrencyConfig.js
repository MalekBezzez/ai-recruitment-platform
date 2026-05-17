import authRoles from '../../auth/authRoles';
import AddCurrency from './AddCurrency';
const AddCurrencyConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'add-currency',
      element: <AddCurrency/>,
    },
  ],
};

export default AddCurrencyConfig;