import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Link as MuiLink, useTheme, Divider} from "@mui/material";
import { FormEvent, useEffect, useState } from 'react';
import { useAuthStore } from '../../store/AuthStore';

const RegisterPage = () => {
  const theme = useTheme();

  const navigate = useNavigate();
  const {jwtToken, createAccount, registerErrorMessage, clearErrors} = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (jwtToken) {
      navigate('/');
    }
  }, [jwtToken, navigate]);

  useEffect(() => {
    clearErrors();
  }, [clearErrors]);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()

    try {
      await createAccount(name, email, password);
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, width: "100%", p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
      <Typography color="text.primary" variant="h4" fontWeight={"medium"} sx={{ mb: 2, textAlign: "center" }}>
        Регистрация
      </Typography>
      <Divider />
      <TextField size="small" label="Имя" fullWidth margin="normal" variant="outlined" onChange={(e) => {
        clearErrors()
        setName(e.target.value)
      }} sx={{ mt: 4 }} />
      <TextField size="small" label="Email" fullWidth margin="normal" variant="outlined" onChange={(e) => {
        clearErrors()
        setEmail(e.target.value)
      }} />
      <TextField size="small" label="Пароль" fullWidth margin="normal" variant="outlined" type="password" onChange={(e) => {
        clearErrors()
        setPassword(e.target.value)
      }} />
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 3, mb: 2 }} onClick={handleRegister}>
        Зарегистрироваться
      </Button>
      {registerErrorMessage && (
        <Typography color="error" sx={{textAlign: "center" }}>
          {registerErrorMessage}
        </Typography>
      )}
      {jwtToken && (
        <Typography color="success" sx={{ textAlign: "center" }}>
          Вы успешно вошли!
        </Typography>
      )}
      <Divider sx={{ mt: 2 }} />
      <Typography color="text.primary" variant="body1" sx={{ mt: 2, mb: 1, textAlign: "center" }}>
        Уже есть аккаунт? <MuiLink component={RouterLink} to="/auth/login" fontWeight="medium" color="primary" underline="hover">Войдите</MuiLink>
      </Typography>
    </Box>
  );
};

export { RegisterPage };