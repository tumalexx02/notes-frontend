import { Outlet } from "react-router-dom";
import { AppBar, Box, Button, Toolbar, Typography, Menu, MenuItem, Divider, ListItemIcon, useTheme, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useAuthStore } from '../../store/AuthStore';
import { MouseEvent, useEffect, useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UserIcon from '@mui/icons-material/AccountBox';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useThemeStore } from '../../store/ThemeStore';

const MainPage = () => {
  const theme = useTheme();

  const { user, getUserId, logout } = useAuthStore();
  const { mode, toggleMode } = useThemeStore();

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    getUserId();
  }, []);

  const handleMenuClick = (event: MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const [openClosePopup, setOpenClosePopup] = useState(false);

  const handleClickOpen = () => {
    setOpenClosePopup(true);
  };

  const handleClose = () => {
    setOpenClosePopup(false);
  };


  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar color='default' position="static" sx={{boxShadow: 1}}>
        <Toolbar sx={{ display: "flex", justifyContent: "start", backgroundColor: theme.palette.background.default, minHeight: '48px !important' }}>
          <Button color='inherit' onClick={handleMenuClick} sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
            <AccountCircleIcon sx={{ marginRight: 0.5 }} />
            <Typography variant="body2" fontWeight={"medium"} sx={{textTransform: 'none'}}>
              {user?.name || "Имя пользователя"}
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: theme.palette.background.paper }}>
        <Outlet />
      </Box>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 200,
            backgroundColor: theme.palette.background.default,
            borderRadius: 2,
            boxShadow: 1
          },
        }}
      >
        <MenuItem color='primary' onClick={handleCloseMenu} sx={{fontSize: '14px'}}>
          <ListItemIcon>
            <UserIcon color='primary' />
          </ListItemIcon>
          Профиль
        </MenuItem>
        <Divider />
        <MenuItem color='primary' onClick={toggleMode} sx={{fontSize: '14px'}}>
          <ListItemIcon>
            {mode === 'light' ? <DarkModeIcon color='primary' /> : <LightModeIcon color='primary' />}
          </ListItemIcon>
          {mode === 'light' ? 'Темная тема' : 'Светлая тема'}
        </MenuItem>
        <Divider />
        <MenuItem color='primary' onClick={handleClickOpen} sx={{fontSize: '14px'}}>
          <ListItemIcon>
            <ExitToAppIcon color='primary' />
          </ListItemIcon>
          Выйти
        </MenuItem>
      </Menu>

      <Dialog open={openClosePopup} onClose={handleClose}>
        <DialogTitle>Выход</DialogTitle>
        <DialogContent>
          Вы уверены, что хотите выйти?
        </DialogContent>
        <Divider />
        <DialogActions sx={{display: 'flex', justifyContent: 'space-between'}}>
          <Button onClick={logout} color="primary">
            Выйти
          </Button>
          <Button onClick={handleClose} sx={{color: "text.secondary"}}>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MainPage;