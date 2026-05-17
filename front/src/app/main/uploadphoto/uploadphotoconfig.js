import UploadPhotoPage from './UploadPhotoPage'; // Updated import
import authRoles from '../../auth/authRoles';

const uploadphotoconfig = {
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
      path: 'uploadphoto',
      element: <UploadPhotoPage />, 
    },
  ],
};

export default uploadphotoconfig;