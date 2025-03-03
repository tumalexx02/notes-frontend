import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import './index.css';
import { ThemeProvider, Typography, createTheme } from '@mui/material';
import AuthLayout from './layout/Auth/Auth';
import { LoginPage } from './pages/Login/Login';
import { RegisterPage } from './pages/Register/Register';
import { RequireAuth } from './helpers/RequireAuth';
import MainPage from './layout/Main/Main';
import { useThemeStore } from './store/ThemeStore';

const App = () => {
  const { mode } = useThemeStore();

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? "#2A2A72" : "#babaff",
      },
      secondary: {
        main: "#388659",
      },
      background: {
        default: mode === 'light' ? "#EAF6FF" : "#1B1B1B",
        paper: mode === 'light' ? "#FBFFFE" : "#1E1E1E"
      },
    },
  });

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RequireAuth><MainPage /></RequireAuth>,
    },
    {
      path: '/auth',
      element: <AuthLayout />,
      children: [
        {
          path: 'login',
          element: <LoginPage />
        },
        {
          path: 'register',
          element: <RegisterPage />
        },
        {
          path: '*',
          element: <Navigate to="/auth/login" />
        }
      ]
    },
    {
      path: '/public',
      element: <Typography variant="h1" component="h1">Public</Typography>
    },
    {
      path: '*',
      element: <Typography variant="h1" component="h1">Not Found :(</Typography>
    }
  ]);

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);