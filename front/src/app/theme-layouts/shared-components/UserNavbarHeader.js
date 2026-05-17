import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from 'react-redux';

const Root = styled('div')(({ theme }) => ({
  '& .username, & .email': {
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },

  '& .avatar': {
    background: theme.palette.background.default,
    transition: theme.transitions.create('all', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
    bottom: 0,
    '& > img': {
      borderRadius: '50%',
    },
  },
}));

function UserNavbarHeader(props) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState('');
  const userData = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    const fetchProfilePhoto = async () => {
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
        setImageUrl(imageUrl);
      } catch (error) {
        dispatch(showMessage({ message: 'Erreur lors de la récupération de la photo' }));
        console.error(error);
      }
    };

    if (userData.user.id) {
   //   fetchProfilePhoto();
    }
  }, [userData.id, dispatch]);

  // Assurez-vous que `user.data` est défini
  const userDataSafe = user?.data || {};
  const nom = userDataSafe.nom || '';
  const email = userDataSafe.email || '';

  return (
    <Root className="user relative flex flex-col items-center justify-center p-16 pb-14 shadow-0">
      {/* <div className="flex items-center justify-center mb-24">
        <Avatar
          sx={{
            backgroundColor: 'background.paper',
            color: 'text.secondary',
          }}
          className="avatar text-32 font-bold w-96 h-96"
          src={imageUrl}
          alt={nom}
        >
          {nom.charAt(0)}
        </Avatar>
      </div>
      <Typography className="username text-14 whitespace-nowrap font-medium">
        {nom}
      </Typography>
      <Typography className="email text-13 whitespace-nowrap font-medium" color="text.secondary">
        {email}
      </Typography> */}
    </Root>
  );
}

export default UserNavbarHeader;