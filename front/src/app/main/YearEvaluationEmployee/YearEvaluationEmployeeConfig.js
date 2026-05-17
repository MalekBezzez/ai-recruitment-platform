import YearEvaluationEmployeePage from './YearEvaluationEmployeePage'; 
import authRoles from '../../auth/authRoles';

const YearEvaluationEmployeeConfig = {
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
      path: 'YearEvaluation/:id',
      element: <YearEvaluationEmployeePage />, 
    },
  ],
};

export default YearEvaluationEmployeeConfig;