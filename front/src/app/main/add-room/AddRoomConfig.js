import authRoles from '../../auth/authRoles';
import AddRoom from './AddRoom';
const AddRoomConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'add-room',
      element: <AddRoom/>,
    },
  ],
};

export default AddRoomConfig;