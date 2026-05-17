import PayslipDetailPage from './PayslipDetailPage';
import authRoles from '../../auth/authRoles';

const PayslipDetailConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'payslip-view/:id',
      element: <PayslipDetailPage />,
    },
  ],
};

export default PayslipDetailConfig;
