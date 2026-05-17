import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import reducer from './store';
import { selectNotifications } from './store/dataSlice';

import { selectUnreadCount } from '../notificationPanel/store/dataSlice';

import { toggleNotificationPanel } from './store/stateSlice';

function NotificationPanelToggleButton(props) {
  const notifications = useSelector(selectNotifications);
  const dispatch = useDispatch();

  // what i added 

  const unreadCount = useSelector(selectUnreadCount);

  return (
    <IconButton
      className="w-40 h-40"
      onClick={(ev) => dispatch(toggleNotificationPanel())}
      size="large"
    >
       <Badge
        color="secondary"
        badgeContent={unreadCount}     // Affiche le nombre exact
        invisible={unreadCount === 0} // Masque le badge si = 0  On bien 
      >
        {props.children}
      </Badge>
    </IconButton>
  );
}

NotificationPanelToggleButton.defaultProps = {
  children: <FuseSvgIcon>heroicons-outline:bell</FuseSvgIcon>,
};

export default withReducer('notificationPanel', reducer)(NotificationPanelToggleButton);