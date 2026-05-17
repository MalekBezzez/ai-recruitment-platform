import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import { showMessage } from 'app/store/fuse/messageSlice';
import { logoutUser, setUser } from 'app/store/userSlice';
import jwtService from './services/jwtService';

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [waitAuthCheck, setWaitAuthCheck] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Écouteur pour l'auto-login
    jwtService.on('onAutoLogin', () => {
      dispatch(showMessage({ message: 'Signing in with JWT' }));

      jwtService
        .signInWithToken()
        .then((user) => {
          success(user, 'Signed in with JWT');
        })
        .catch((error) => {
          pass(error.message);
        });
    });

    // Écouteur pour la connexion manuelle
    jwtService.on('onLogin', (user) => {
      success(user, 'Signed in');
    });

    // Écouteur pour la déconnexion
    jwtService.on('onLogout', () => {
      pass('Signed out');
      dispatch(logoutUser());
    });

    // Écouteur pour l'auto-déconnexion
    jwtService.on('onAutoLogout', (message) => {
      pass(message);
      dispatch(logoutUser());
    });

    // Écouteur pour l'absence de token
    jwtService.on('onNoAccessToken', () => {
      pass();
    });

    // Initialisation du service JWT
    jwtService.init();

    // Fonction pour gérer la réussite de l'authentification
    function success(user, message) {
      if (message) {
        dispatch(showMessage({ message }));
      }

      Promise.all([dispatch(setUser(user))]).then(() => {
        setWaitAuthCheck(false);
        setIsAuthenticated(true);
      });
    }

    // Fonction pour gérer l'échec de l'authentification
    function pass(message) {
      if (message) {
        dispatch(showMessage({ message }));
      }

      setWaitAuthCheck(false);
      setIsAuthenticated(false);
    }
  }, [dispatch]);

  return waitAuthCheck ? (
    <FuseSplashScreen />
  ) : (
    <AuthContext.Provider value={{ isAuthenticated }}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };