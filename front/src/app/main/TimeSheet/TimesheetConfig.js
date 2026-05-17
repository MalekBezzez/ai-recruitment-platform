import Timesheet from './Timesheet';
import authRoles from '../../auth/authRoles';

const TimesheetConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'timesheet',
      element: <Timesheet />,
    },
  ],
};

export default TimesheetConfig;
