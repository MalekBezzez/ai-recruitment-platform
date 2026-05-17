import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectUser } from 'app/store/userSlice';

function UserMenu(props) {
  const user = useSelector(selectUser);

  // Récupérer les informations de l'utilisateur depuis le localStorage
  const userData = JSON.parse(localStorage.getItem('user')) || {};
const API_URL = process.env.REACT_APP_API_URL;

console.log('API_URL:', API_URL);
  const [userMenu, setUserMenu] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null); // État pour stocker l'URL de l'image

  // Récupérer l'image de l'utilisateur depuis le backend
  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const userId = userData.user.id; // Récupérer l'ID de l'utilisateur
        if (!userId) return;

        // Récupérer le token depuis le localStorage
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.error('Token non trouvé. Veuillez vous connecter.');
          return;
        }

        // Supprimer les guillemets du token si présents
        const tokenWithoutQuotes = token.replace(/"/g, '');

        // Faire la requête pour récupérer l'image
        const response = await axios.get(`${API_URL}/photos/user/${userId}`, {
          responseType: 'blob', // Traiter la réponse comme un Blob
          headers: {
            Authorization: `Bearer ${tokenWithoutQuotes}`, // Inclure le token dans l'en-tête
          },
        });

        // Créer une URL pour le Blob
        const imageUrl = URL.createObjectURL(response.data);
        setPhotoUrl(imageUrl);
      } catch (error) {
        console.error('Erreur lors de la récupération de la photo:', error);
      }
    };

    fetchPhoto();
  }, [userData.id]);

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };

  return (
    <>
      <Button
        className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6"
        onClick={userMenuClick}
        color="inherit"
      >
        <div className="hidden md:flex flex-col mx-4 items-end">
          <Typography component="span" className="font-semibold flex">
            {userData.user.firstname + " " + userData.user.lastname || 'Guest'}
          </Typography>
          <Typography className="text-11 font-medium capitalize" color="text.secondary">
            {userData.user.role || 'Guest'}
          </Typography>
        </div>

        {/* Afficher l'image récupérée depuis la base de données */}
        {photoUrl ? (
          <Avatar className="md:mx-4" alt="user photo" src={photoUrl} />
        ) : (
          <Avatar className="md:mx-4">{userData.firstname?.[0] || 'G'}</Avatar>
        )}
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{
          paper: 'py-8',
        }}
      >
        {!user.role || user.role.length !== 0 ? (
          <>
            <MenuItem component={Link} to="/sign-in" role="button">
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:lock-closed</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign In" />
            </MenuItem>
            <MenuItem component={Link} to="/sign-up" role="button">
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:user-add </FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign up" />
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem component={Link} to={`/employee-profile/${userData.user.id}`} onClick={userMenuClose} role="button">
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:user-circle</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </MenuItem>
            <MenuItem component={Link} to={`/Change-Password`} onClick={userMenuClose} role="button">
            <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:lock-closed</FuseSvgIcon>
            </ListItemIcon>
              <ListItemText primary="Change password" />
            </MenuItem>
            <MenuItem component={Link} to="/uploadphoto" onClick={userMenuClose} role="button">
            <ListItemIcon className="min-w-40">
  <FuseSvgIcon>heroicons-outline:camera</FuseSvgIcon>
</ListItemIcon>
              <ListItemText primary="Edit photo" />
            </MenuItem>
            <MenuItem
              component={NavLink}
              to="/sign-out"
              onClick={() => {
                userMenuClose();
              }}
            >
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:logout</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign out" />
            </MenuItem>
          </>
        )}
      </Popover>
    </>
  );
}

export default UserMenu;