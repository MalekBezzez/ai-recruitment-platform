import AddYearEvaluation from './AddYearEvaluation';
import authRoles from '../../auth/authRoles';

const AddYearEvaluationConfig = {
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
      path: 'AddYearEvaluation/:id',
      element: <AddYearEvaluation/>,
    },
  ],
};

export default AddYearEvaluationConfig;
