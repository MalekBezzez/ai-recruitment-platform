import authRoles from '../../auth/authRoles';
import AddDiplomaType from './AddDiplomaType';
const DiplomaTypeConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'add-diploma-type',
      element: <AddDiplomaType/>,
    },
  ],
};

export default DiplomaTypeConfig;