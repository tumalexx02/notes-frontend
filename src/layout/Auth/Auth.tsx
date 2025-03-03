import { Outlet } from "react-router-dom";
import { Box, Button, Container, IconButton, useTheme } from "@mui/material";
import { useThemeStore } from '../../store/ThemeStore';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const AuthLayout = () => {
  const theme = useTheme();
  
  const { mode, toggleMode } = useThemeStore();

  return (
    <Box 
    sx={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundColor: theme.palette.background.paper
    }}
    >
      <IconButton onClick={toggleMode} sx={{position: 'absolute', top: 16, right: 16}}>
        {mode === 'light' ? <DarkModeIcon color='primary' /> : <LightModeIcon color='primary' />}
      </IconButton>
      <Container 
        sx={{ 
          flexGrow: 1, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          backgroundColor: theme.palette.background.default
        }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default AuthLayout;
