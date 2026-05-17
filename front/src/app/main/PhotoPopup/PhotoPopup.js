import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Dialog,
  DialogContent,
  IconButton,
  Avatar,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { selectUser } from 'app/store/userSlice';

const PhotoPopup = () => {
  const [open, setOpen] = useState(false);
  const { data } = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsLoading(true); // Réinitialiser l'état de chargement
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      {/* Avatar cliquable */}
      <IconButton onClick={handleOpen} sx={{ p: 0 }}>
        <Avatar
          src={data.photoURL}
          alt="Photo de profil"
          sx={{ 
            width: 64, 
            height: 64,
            cursor: 'pointer',
            '&:hover': {
              transform: 'scale(1.05)',
              transition: 'transform 0.3s'
            }
          }}
        />
      </IconButton>

      {/* Popup de la photo */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            maxHeight: '90vh',
            overflow: 'hidden'
          }
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.common.white,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)'
            },
            zIndex: 1
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ p: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {isLoading && (
            <Box 
              display="flex" 
              justifyContent="center" 
              alignItems="center" 
              minHeight="300px"
            >
              <CircularProgress />
            </Box>
          )}
          
          {data.photoURL ? (
            <img
              src={data.photoURL}
              alt="Photo de profil en grand"
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                display: isLoading ? 'none' : 'block',
                objectFit: 'contain'
              }}
              onLoad={handleImageLoad}
            />
          ) : (
            <Box 
              display="flex" 
              justifyContent="center" 
              alignItems="center" 
              minHeight="300px"
              flexDirection="column"
            >
              <Typography variant="h6" color="textSecondary">
                Aucune photo disponible
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhotoPopup;