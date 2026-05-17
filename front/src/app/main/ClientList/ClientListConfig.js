import ClientListPage from './ClientListPage';
import authRoles from '../../auth/authRoles';

const ClientListConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.onlyGuest, // 🔐 modifie selon ton système d'auth (admin, user, etc.)
  routes: [
    {
      path: 'clients',
      element: <ClientListPage />,
    },
  ],
};

export default ClientListConfig;
