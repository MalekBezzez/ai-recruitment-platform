import ProjectListPage from './ProjectListPage';
import authRoles from '../../auth/authRoles';

const ProjectListConfig = {
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
      path: 'projectlist',
      element: <ProjectListPage />,
    },
  ],
};


export default ProjectListConfig;
