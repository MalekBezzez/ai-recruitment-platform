import AddClient from './AddClient';
import authRoles from '../../auth/authRoles';

const AddClientConfig = {
  settings: {
    layout: {
      config: {}, // ou ajoute des configs spécifiques ici
    },
  },
  auth: authRoles.onlyGuest, // 🔒 change si nécessaire (admin, user, etc.)
  routes: [
    {
      path: 'clients/add',
      element: <AddClient />,
    },
  ],
};

export default AddClientConfig;
