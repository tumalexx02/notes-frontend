import { Box, IconButton } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { useThemeStore } from '../../store/ThemeStore';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import HomeIcon from '@mui/icons-material/Home';

const PublicLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { mode, toggleMode } = useThemeStore();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%', backgroundColor: theme.palette.background.paper }}>
      <IconButton onClick={toggleMode} sx={{position: 'absolute', top: 16, right: 16}}>
        {mode === 'light' ? <DarkModeIcon color='primary' /> : <LightModeIcon color='primary' />}
      </IconButton>
      <IconButton onClick={() => navigate('/')} sx={{position: 'absolute', top: 16, left: 16}}>
        <HomeIcon color='primary' />
      </IconButton>
      <Outlet />
    </Box>
  );
};

export default PublicLayout; 