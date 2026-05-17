// src/app/theme-layouts/layout1/ToolbarLayout1.js
import { ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Hidden from '@mui/material/Hidden';
import Toolbar from '@mui/material/Toolbar';
import clsx from 'clsx';
import React, { useEffect, memo } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { setUnreadCount } from '../../shared-components/notificationPanel/store/dataSlice';
import { selectFuseCurrentLayoutConfig, selectToolbarTheme } from 'app/store/fuse/settingsSlice';
import { selectFuseNavbar } from 'app/store/fuse/navbarSlice';
import AdjustFontSize from '../../shared-components/AdjustFontSize';
import FullScreenToggle from '../../shared-components/FullScreenToggle';
import LanguageSwitcher from '../../shared-components/LanguageSwitcher';
import NotificationPanelToggleButton from '../../shared-components/notificationPanel/NotificationPanelToggleButton';
import NavigationShortcuts from '../../shared-components/NavigationShortcuts';
import NavigationSearch from '../../shared-components/NavigationSearch';
import NavbarToggleButton from '../../shared-components/NavbarToggleButton';
import UserMenu from '../../shared-components/UserMenu';
import QuickPanelToggleButton from '../../shared-components/quickPanel/QuickPanelToggleButton';
import ChatPanelToggleButton from '../../shared-components/chatPanel/ChatPanelToggleButton';
import Box from '@mui/material/Box';

// 🔄 Remplacement : breadcrumbs basés sur l’historique
import BreadcrumbsProvider from 'src/app/components/BreadcrumbsProvider';
import BreadcrumbsTrail from 'src/app/components/BreadcrumbsTrail';

function ToolbarLayout1(props) {
  const config = useSelector(selectFuseCurrentLayoutConfig);
  const navbar = useSelector(selectFuseNavbar);
  const toolbarTheme = useSelector(selectToolbarTheme);
  const API_URL = process.env.REACT_APP_API_URL;

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // SSE notifications
  useEffect(() => {
    let userId = null;
    const token = localStorage.getItem('accessToken')?.replace(/"/g, '') || '';

    try {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      if (!user?.user?.id) throw new Error('No valid user found in localStorage');
      userId = user.user.id;
    } catch (err) {
      console.error('Error getting user ID:', err.message);
      return;
    }

    if (!userId) return;

    const fetchUnread = async () => {
      try {
        const res = await axios.get(`${API_URL}/notifications/${userId}/unread/count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setUnreadCount(res.data));
      } catch (err) {
        console.error('UnreadCount GET error:', err);
      }
    };

    fetchUnread();

    const evtSource = new EventSource(`${API_URL}/notifications/events?userId=${userId}`);

    evtSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      enqueueSnackbar(newNotification.title, { variant: 'info' });
      fetchUnread();
    };

    evtSource.onerror = (err) => {
      console.error('SSE error:', err);
      evtSource.close();
    };

    return () => {
      evtSource.close();
    };
  }, [dispatch, enqueueSnackbar, API_URL]);

  return (
    <ThemeProvider theme={toolbarTheme}>
      <BreadcrumbsProvider>
        <AppBar
          id="fuse-toolbar"
          className={clsx('flex relative z-20 shadow-md', props.className)}
          color="default"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? toolbarTheme.palette.background.paper
                : toolbarTheme.palette.background.default,
          }}
          position="static"
        >
          <Toolbar className="p-0 min-h-48 md:min-h-64">
            <div className="flex flex-1 px-16 items-center gap-12 overflow-hidden">
              {/* 🧭 Breadcrumbs dans la toolbar */}
          <Box sx={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
            <BreadcrumbsTrail />
          </Box>

              {config.navbar.display && config.navbar.position === 'left' && (
                <>
                  <Hidden lgDown>
                    {(config.navbar.style === 'style-3' ||
                      config.navbar.style === 'style-3-dense') && (
                      <NavbarToggleButton className="w-40 h-40 p-0 mx-0" />
                    )}
                    {config.navbar.style === 'style-1' && !navbar.open && (
                      <NavbarToggleButton className="w-40 h-40 p-0 mx-0" />
                    )}
                  </Hidden>

                  <Hidden lgUp>
                    <NavbarToggleButton className="w-40 h-40 p-0 mx-0 sm:mx-8" />
                  </Hidden>
                </>
              )}

              <Hidden lgDown>
                <NavigationShortcuts />
              </Hidden>
            </div>

            <div className="flex items-center px-8 h-full overflow-x-auto">
              <LanguageSwitcher />
              <AdjustFontSize />
              <FullScreenToggle />
              <NavigationSearch />
              <Hidden lgUp>
                <ChatPanelToggleButton />
              </Hidden>
              <QuickPanelToggleButton />
              <NotificationPanelToggleButton />
              <UserMenu />
            </div>

            {config.navbar.display && config.navbar.position === 'right' && (
              <>
                <Hidden lgDown>
                  {!navbar.open && <NavbarToggleButton className="w-40 h-40 p-0 mx-0" />}
                </Hidden>
                <Hidden lgUp>
                  <NavbarToggleButton className="w-40 h-40 p-0 mx-0 sm:mx-8" />
                </Hidden>
              </>
            )}
          </Toolbar>
        </AppBar>
      </BreadcrumbsProvider>
    </ThemeProvider>
  );
}

export default memo(ToolbarLayout1);
