import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Box, Typography } from "@mui/material";

const Dashboard = () => {
  const { user, token, logout, login } = useAuth();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [newData, setNewData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    middle_name: user?.middle_name || "",
    email: user?.email || "",
    username: user?.username || "",
  });

  const [newPassword, setNewPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  // Обработка изменения данных
  const handleDataChange = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const username = user.username;
      const response = await fetch(`http://127.0.0.1:8000/update/${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newData),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = { ...user, ...newData };
        login(updatedUser, token);

        setSuccessMessage("Данные успешно обновлены");
        setOpenEditDialog(false);  // Закрытие диалога
      } else {
        setError(data.detail || "Ошибка обновления данных");
      }
    } catch {
      setError("Ошибка соединения с сервером");
    }
  };

  // Обработка смены пароля
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword.newPassword !== newPassword.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      const username = user.username;
      const response = await fetch(`http://127.0.0.1:8000/change-password/${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: newPassword.oldPassword,
          newPassword: newPassword.newPassword,
          confirmPassword: newPassword.confirmPassword,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setSuccessMessage("Пароль успешно изменен");
        setNewPassword({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setOpenPasswordDialog(false);  // Закрытие диалога
      } else {
        setError(data?.detail?.msg || "Ошибка смены пароля");
      }
    } catch (error) {
      console.error("Ошибка соединения с сервером:", error);
      setError("Ошибка соединения с сервером");
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Личный кабинет</Typography>
      {error && <div className="error" style={{ color: 'red' }}>{error}</div>}
      {successMessage && <div className="success" style={{ color: 'green' }}>{successMessage}</div>}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Информация о пользователе</Typography>
        <Box>
          <p><strong>Фамилия:</strong> {user?.last_name}</p>
          <p><strong>Имя:</strong> {user?.first_name}</p>
          <p><strong>Отчество:</strong> {user?.middle_name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Логин:</strong> {user?.username}</p>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" color="primary" onClick={() => setOpenEditDialog(true)}>
            Редактировать данные
          </Button>

          <Button variant="outlined" color="secondary" onClick={() => setOpenPasswordDialog(true)} >
            Сменить пароль
          </Button>
        </Box>

        <Button variant="outlined" color="error" onClick={logout} style={{ marginTop: '10px' }} >
          Выйти
        </Button>
      </Box>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Изменение данных</DialogTitle>
        <DialogContent>
          <form onSubmit={handleDataChange}>
            <TextField
              label="Фамилия"
              fullWidth
              margin="normal"
              value={newData.last_name}
              onChange={(e) => setNewData({ ...newData, last_name: e.target.value })}
              required
            />
            <TextField
              label="Имя"
              fullWidth
              margin="normal"
              value={newData.first_name}
              onChange={(e) => setNewData({ ...newData, first_name: e.target.value })}
              required
            />
            <TextField
              label="Отчество"
              fullWidth
              margin="normal"
              value={newData.middle_name}
              onChange={(e) => setNewData({ ...newData, middle_name: e.target.value })}
              required
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={newData.email}
              onChange={(e) => setNewData({ ...newData, email: e.target.value })}
              required
            />
            <TextField
              label="Логин"
              fullWidth
              margin="normal"
              value={newData.username}
              onChange={(e) => setNewData({ ...newData, username: e.target.value })}
              required
            />
            <DialogActions>
              <Button onClick={() => setOpenEditDialog(false)} color="secondary">Отменить</Button>
              <Button type="submit" color="primary">Сохранить</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle>Смена пароля</DialogTitle>
        <DialogContent>
          <form onSubmit={handlePasswordChange}>
            <TextField
              label="Старый пароль"
              type="password"
              fullWidth
              margin="normal"
              value={newPassword.oldPassword}
              onChange={(e) => setNewPassword({ ...newPassword, oldPassword: e.target.value })}
              required
            />
            <TextField
              label="Новый пароль"
              type="password"
              fullWidth
              margin="normal"
              value={newPassword.newPassword}
              onChange={(e) => setNewPassword({ ...newPassword, newPassword: e.target.value })}
              required
            />
            <TextField
              label="Подтвердите новый пароль"
              type="password"
              fullWidth
              margin="normal"
              value={newPassword.confirmPassword}
              onChange={(e) => setNewPassword({ ...newPassword, confirmPassword: e.target.value })}
              required
            />
            <DialogActions>
              <Button onClick={() => setOpenPasswordDialog(false)} color="secondary">Отменить</Button>
              <Button type="submit" color="primary">Изменить пароль</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
