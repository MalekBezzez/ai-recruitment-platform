import PayslipListPage from './PayslipListPage';
import authRoles from '../../auth/authRoles';

const PayslipListConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'payslip-list',
      element: <PayslipListPage />,
    },
  ],
};

export default PayslipListConfig;
