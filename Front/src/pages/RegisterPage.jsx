import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material"; // Импортируем компоненты из MUI

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        navigate("/dashboard");
      } else {
        // Если `data.detail` — это массив ошибок, преобразуем в строку
        setError(Array.isArray(data.detail) ? data.detail.map(err => err.msg).join(", ") : data.detail);
      }
    } catch {
      setError("Ошибка сети");
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
          Регистрация
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            name="last_name"
            label="Фамилия"
            variant="outlined"
            fullWidth
            required
            value={formData.last_name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            name="first_name"
            label="Имя"
            variant="outlined"
            fullWidth
            required
            value={formData.first_name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            name="middle_name"
            label="Отчество"
            variant="outlined"
            fullWidth
            required
            value={formData.middle_name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            type="email"
            name="email"
            label="Email"
            variant="outlined"
            fullWidth
            required
            value={formData.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            name="username"
            label="Username"
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
            Зарегистрироваться
          </Button>
        </form>

        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mt: 2, textAlign: "center" }}
        >
          Уже есть аккаунт?{" "}
          <Button
            component="a"
            href="/login"
            sx={{ padding: 0 }}
            variant="text"
          >
            Войти
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage;
