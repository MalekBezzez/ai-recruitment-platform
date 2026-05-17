import React from 'react';
import authRoles from '../../auth/authRoles';
import HomeWelcomePage from './HomeWelcomePage';

const HomeWelcomeConfig = {
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
      path: 'Home',
      element: <HomeWelcomePage />,
    },
  ],
};

export default HomeWelcomeConfig;
