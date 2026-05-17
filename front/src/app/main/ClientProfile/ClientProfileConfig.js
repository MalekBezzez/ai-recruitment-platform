import ClientProfilePage from './ClientProfilePage';
import authRoles from '../../auth/authRoles';

const ClientProfileConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest, // 🔐 Modifie selon le rôle autorisé (admin, user, etc.)
  routes: [
    {
      path: 'clients/:id', // 🔍 Affichage du profil client
      element: <ClientProfilePage />,
    },
  ],
};

export default ClientProfileConfig;
