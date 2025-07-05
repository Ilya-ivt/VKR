import 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth(); // Получаем информацию о пользователе

  return (
    <Container>
      {/* Заголовок */}
      <Box textAlign="center" marginTop={4}>
        <Typography variant="h3" gutterBottom>
          Добро пожаловать в наш реестр аптек!
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Это приложение позволяет найти аптеки, узнать их графики работы и получить подробную информацию.
        </Typography>

        {/* Кнопки для перехода */}
        <Box marginTop={3}>
          {user ? (
            <>
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={Link}
                to="/pharmacies"
              >
                Перейти к таблице
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                component={Link}
                to="/dashboard"
                sx={{ marginLeft: 2 }}
              >
                Перейти в личный кабинет
              </Button>
            </>
          ) : (
            <Typography variant="h6" color="textSecondary">
              Пожалуйста, авторизуйтесь, чтобы просматривать таблицы и личный кабинет.
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
