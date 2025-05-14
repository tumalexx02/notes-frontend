import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Link as MuiLink, Divider, useTheme} from "@mui/material";
import { useAuthStore } from '../../store/AuthStore';
import { FormEvent, useEffect, useState } from 'react';

const LoginPage = () => {
  const theme = useTheme();

  const navigate = useNavigate();
  const {accessToken, login, loginErrorMessage, clearErrors} = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  useEffect(() => {
    clearErrors();
  }, [clearErrors]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()

    try {
      await login(email, password);
    } catch (error) {
      console.error('Ошибка при входе:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, width: "100%", p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
      <Typography color="text.primary" variant="h4" fontWeight={"medium"} sx={{ mb: 2, textAlign: "center" }}>
        Вход
      </Typography>
      <Divider />
      <TextField 
        size="small" 
        label="Email" 
        fullWidth margin="normal" 
        variant="outlined" 
        onChange={(e) => {
          clearErrors()
          setEmail(e.target.value)
        }} 
        sx={{ mt: 4 }}
      />
      <TextField 
        size="small" 
        label="Пароль" 
        fullWidth margin="normal" 
        variant="outlined" 
        type="password" 
        onChange={(e) => {
          clearErrors()
          setPassword(e.target.value)}
        } 
      />
      <Button 
        variant="contained" 
        color="primary" 
        fullWidth sx={{ mt: 3, mb: 2 }} 
        onClick={handleLogin}
      >
        Войти
      </Button>
      {loginErrorMessage && (
        <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
          {loginErrorMessage}
        </Typography>
      )}
      {accessToken && (
        <Typography color="success" sx={{ mt: 2, textAlign: "center" }}>
          Вы успешно вошли!
        </Typography>
      )}
      <Divider sx={{ mt: 2 }} />
      <Typography color="text.primary" variant="body1" sx={{ mt: 2, mb: 1, textAlign: "center" }}>
        Нет аккаунта? <MuiLink component={RouterLink} to="/auth/register" fontWeight="medium" color="primary" underline="hover">Зарегистрируйтесь</MuiLink>
      </Typography>
    </Box>
  );
};

export { LoginPage };