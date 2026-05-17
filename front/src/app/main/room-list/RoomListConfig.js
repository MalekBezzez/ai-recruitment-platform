import authRoles from '../../auth/authRoles';
import RoomList from './RoomList';
const RoomListConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'room-list',
      element: <RoomList/>,
    },
  ],
};

export default RoomListConfig;