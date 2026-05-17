import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import history from '@history';
import _ from '@lodash';
import { setInitialSettings } from 'app/store/fuse/settingsSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import settingsConfig from 'app/configs/settingsConfig';
import jwtService from '../auth/services/jwtService';
import { useState } from 'react';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhotoPopup from 'src/app/main/PhotoPopup/PhotoPopup';
// Récupérer les données de l'utilisateur depuis le localStorage
const getUserFromLocalStorage = () => {
  const userData = JSON.parse(localStorage.getItem('user')) || {};
  const user = userData.user || {}; 
  return {
    photoURL: userData.photoURL || '', 
    email: user.email || 'johndoe@withinpixels.com', // Utilisez une valeur par défaut si `email` est manquant
    nom: user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : 'foulen ben foulen', // Utilisez une valeur par défaut si `firstname` ou `lastname` est manquant
  };
};

// Action asynchrone pour récupérer la photo de profil
export const fetchProfilePhoto = createAsyncThunk(
  'user/fetchProfilePhoto',
  async (userId, { dispatch }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Token non trouvé. Veuillez vous connecter.');
      }

      const tokenWithoutQuotes = token.replace(/"/g, '');


      // Vérifier que les données sont valides
      if (!response.data) {
        throw new Error('Aucune donnée trouvée pour la photo.');
      }

      // Créer une URL pour le Blob
      const imageUrl = URL.createObjectURL(response.data);
      return imageUrl;
    } catch (error) {
      dispatch(showMessage({ message: 'Erreur lors de la récupération de la photo' }));
      throw error;
    }
  }
);

export const setUser = createAsyncThunk('user/setUser', async (user, { dispatch, getState }) => {
  if (user.loginRedirectUrl) {
    settingsConfig.loginRedirectUrl = user.loginRedirectUrl; // par exemple '/apps/academy'
  }

  // Sauvegarder les données de l'utilisateur dans le localStorage
  localStorage.setItem('user', JSON.stringify(user));

  return user;
});

export const updateUserSettings = createAsyncThunk(
  'user/updateSettings',
  async (settings, { dispatch, getState }) => {
    const { user } = getState();
    const newUser = _.merge({}, user, { data: { settings } });

    dispatch(updateUserData(newUser));

    return newUser;
  }
);

export const updateUserShortcuts = createAsyncThunk(
  'user/updateShortucts',
  async (shortcuts, { dispatch, getState }) => {
    const { user } = getState();
    const newUser = {
      ...user,
      data: {
        ...user.data,
        shortcuts,
      },
    };

    dispatch(updateUserData(newUser));

    return newUser;
  }
);

export const logoutUser = () => async (dispatch, getState) => {
  const { user } = getState();

  if (!user.role || user.role.length === 0) {
    // est un invité
    return null;
  }

  // Supprimer les données de l'utilisateur du localStorage lors de la déconnexion
  localStorage.removeItem('user');

  history.push({
    pathname: '/',
  });

  dispatch(setInitialSettings());

  return dispatch(userLoggedOut());
};

export const updateUserData = (user) => async (dispatch, getState) => {
  if (!user.role || user.role.length === 0) {
    // est un invité
    return;
  }

  jwtService
    .updateUserData(user)
    .then(() => {
      dispatch(showMessage({ message: 'User data saved with api' }));
    })
    .catch((error) => {
      dispatch(showMessage({ message: error.message }));
    });
};

// Récupérer les données initiales depuis le localStorage
const { photoURL, email, nom } = getUserFromLocalStorage();

const initialState = {
  role: [], // invité
  data: {
    nom,
    photoURL,
    email,
    shortcuts: ['apps.calendar', 'apps.mailbox', 'apps.contacts', 'apps.tasks'],
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoggedOut: (state, action) => initialState,
  },
  extraReducers: {
    [updateUserSettings.fulfilled]: (state, action) => action.payload,
    [updateUserShortcuts.fulfilled]: (state, action) => action.payload,
    [setUser.fulfilled]: (state, action) => {
      const { photoURL, email, role, firstname, lastname } = action.payload;
      state.data.photoURL = photoURL || state.data.photoURL;
      state.data.email = email || state.data.email;
      state.data.role = role || state.data.role;
      state.data.nom = firstname && lastname ? `${firstname} ${lastname}` : state.data.nom;
    },
    [fetchProfilePhoto.fulfilled]: (state, action) => {
      // Mettre à jour l'URL de la photo dans l'état
      state.data.photoURL = action.payload;
    },
  },
});

export const { userLoggedOut } = userSlice.actions;

export const selectUser = ({ user }) => user;

export const selectUserShortcuts = ({ user }) => user.data.shortcuts;

export default userSlice.reducer;