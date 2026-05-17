
import JobApplications from './JobApplications';
import authRoles from '../../auth/authRoles';

const JobApplicationsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'offers-applications',
      element: <JobApplications />,
    },
  ],
};

export default JobApplicationsConfig;