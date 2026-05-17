import EmployeeAnswersPage from './EmployeeAnswersPage';
import authRoles from '../../auth/authRoles';

const EmployeeAnswersPageConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest, // ou admin selon ton besoin
  routes: [
    {
      path: 'answers/:questionnaireId/:employeId',
      element: <EmployeeAnswersPage />,
    },
  ],
};

export default EmployeeAnswersPageConfig;
