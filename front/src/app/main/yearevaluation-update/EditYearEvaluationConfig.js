import EditYearEvaluation from './EditYearEvaluation';
import authRoles from '../../auth/authRoles';

const EditYearEvaluationConfig = {
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
      path: 'EditYearEvaluation/:emplyeeid/:id',
      element: <EditYearEvaluation />,
    },
  ],
};

export default EditYearEvaluationConfig;
