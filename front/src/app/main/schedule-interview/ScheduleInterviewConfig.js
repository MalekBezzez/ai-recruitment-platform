import authRoles from '../../auth/authRoles';
import ScheduleInterview from './ScheduleInterview';
const ScheduleInterviewConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'schedule-interview/:applicationId',
      element: <ScheduleInterview/>,
    },
    {
      path: 'schedule-interview/edit/:id',
      element: <ScheduleInterview/>,
    },

  ],
};

export default ScheduleInterviewConfig;