import HistoryWorkflowLeaveListPage from './HistoryWorkflowLeaveListPage';
import authRoles from '../../auth/authRoles';

const HistoryWorkflowLeaveListConfig = {
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
      path: 'HistoryWorkflowLeaveList',
      element: <HistoryWorkflowLeaveListPage />,
    },
  ],
};

export default HistoryWorkflowLeaveListConfig;
