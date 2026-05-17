import ProjectDetailPage from './ProjectDetailPage';
import authRoles from '../../auth/authRoles';

const ProjectDetailPageConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest, // 🔐 adapte si nécessaire : .admin, .user, etc.
  routes: [
    {
      path: 'projectprofile/:projectId',
      element: <ProjectDetailPage />,
    },
  ],
};

export default ProjectDetailPageConfig;
