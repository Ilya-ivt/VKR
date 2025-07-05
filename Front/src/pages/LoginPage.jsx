import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material"; // Импортируем компоненты из MUI

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const response = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      login(data.user, data.token);  // Входим и сохраняем данные
      navigate("/dashboard"); // Перенаправляем в личный кабинет
    } else {
      setError(data.detail || "Ошибка входа");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" sx={{ mb: 4 }}>
          Вход в систему
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            name="username"
            label="Логин"
            variant="outlined"
            fullWidth
            required
            value={formData.username}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            type="password"
            name="password"
            label="Пароль"
            variant="outlined"
            fullWidth
            required
            value={formData.password}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              padding: "12px",
              fontWeight: "bold",
              marginTop: "16px",
            }}
          >
            Войти
          </Button>
        </form>

        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mt: 2, textAlign: "center" }}
        >
          Нет аккаунта?{" "}
          <Button
            component="a"
            href="/register"
            sx={{ padding: 0 }}
            variant="text"
          >
            Зарегистрироваться
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
