import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import withReducer from 'app/store/withReducer';
import { useSnackbar } from 'notistack';
import { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import NotificationTemplate from 'app/theme-layouts/shared-components/notificationPanel/NotificationTemplate';
import NotificationModel from './model/NotificationModel';
import NotificationCard from './NotificationCard';
import axios from 'axios';
import {
  addNotification,
  dismissAll,
  dismissItem,
  getNotifications,
  selectNotifications,
  getUnreadCount,
} from './store/dataSlice';
import reducer from './store';
import {
  closeNotificationPanel,
  selectNotificationPanelState,
  toggleNotificationPanel,
} from './store/stateSlice';

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.background.default,
    width: 320,
  },
}));

function NotificationPanel(props) {
  const location = useLocation();
  const dispatch = useDispatch();
  const state = useSelector(selectNotificationPanelState);
  const notifications = useSelector(selectNotifications);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
  console.log('NotificationPanel state:', state);

  if (state) {
    // ➜ Le panneau est ouvert
    
    dispatch(getNotifications());
  }

}, [state, dispatch]);  
  
  
  useEffect(() => {
    if (state) {
      dispatch(closeNotificationPanel());
    }
    // eslint-disable-next-line
	}, [location, dispatch]);

  function handleClose() {
    dispatch(closeNotificationPanel());
  }

  function handleDismiss(id) {
    dispatch(dismissItem(id));
  }
  function handleDismissAll() {
    dispatch(dismissAll());
  }

  function demoNotification() {   // c'est une methode 
    const item = NotificationModel({ title: 'Great Job! this is awesome.' });

    enqueueSnackbar(item.title, {   // c'est qui apparait lorsque je clique make example 
      key: item.id,
      // autoHideDuration: 3000,
      content: () => (
        <NotificationTemplate
          item={item}
          onClose={() => {
            closeSnackbar(item.id);
          }}
        />
      ),
    });

    dispatch(addNotification(item));
  }

  return (
    <StyledSwipeableDrawer
      open={state}
      anchor="right"
      onOpen={(ev) => {}}
      onClose={(ev) => dispatch(toggleNotificationPanel())}
      disableSwipeToOpen
    >
      <IconButton className="m-4 absolute top-0 right-0 z-999" onClick={handleClose} size="large">
        <FuseSvgIcon color="action">heroicons-outline:x</FuseSvgIcon>
      </IconButton>
      {notifications.length > 0 ? (
        <FuseScrollbars className="p-16">
          <div className="flex flex-col gap-y-12">
            <div className="flex justify-between items-end pt-136 mb-36">
              <Typography className="text-28 font-semibold leading-none">Notifications</Typography>
              <Typography
                className="text-12 underline cursor-pointer"
                color="secondary"
                onClick={handleDismissAll}
              >
                dismiss all
              </Typography>
            </div>
            {notifications.map((item) => (
  <NotificationCard
    key={item.id}
    item={{
      id: item.id,
      title: item.message,   /// mapping deja correcte 
      time: item.createdAt,
      read: item.read,
      icon: 'heroicons-outline:bell',
      variant: item.read ? 'info' : 'warning',
    }}
    onClose={() => handleDismiss(item.id)}
    onMarkAsRead={async () => {
    await dispatch(dismissItem(item.id)); // ✅ Met à jour le backend & store
    dispatch(getUnreadCount());           // ✅ Rafraîchit le compteur unread
  }}
  />
))}

          </div>
        </FuseScrollbars>
      ) : (
        <div className="flex flex-1 items-center justify-center p-16">
          <Typography className="text-24 text-center" color="text.secondary">
            There are no notifications for now.
          </Typography>
        </div>
      )}
    
    </StyledSwipeableDrawer>
  );
}

export default withReducer('notificationPanel', reducer)(memo(NotificationPanel));