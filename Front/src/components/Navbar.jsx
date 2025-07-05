import 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from "@mui/material";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navItems}>
        <Link to="/" style={styles.link}>Главная</Link>
        {user && (
          <Link to="/dashboard" style={styles.link}>Профиль</Link>
        )}
      </div>
      <div style={styles.userSection}>
        {user ? (
          <>
            <span style={styles.username}>{user.username}</span>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              sx={{
                backgroundColor: 'white',
                borderColor: 'red',
                color: 'red',
                '&:hover': {
                  backgroundColor: '#ffcccc', // Светлый оттенок красного при наведении
                  borderColor: '#ff4d4d',
                },
              }}
            >
              Выйти
            </Button>
          </>
        ) : (
          <Link to="/login" style={styles.link}>Войти</Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#1976d2', // Оставляем основной цвет синего
    color: 'white',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 10,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
    boxSizing: 'border-box',
    fontFamily: 'Roboto, sans-serif', // Сменил на более современный шрифт
    transition: 'all 0.3s ease',
  },
  navItems: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    color: 'white',
    fontSize: '18px',
    fontWeight: '500',
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#ffd700', // Цвет при наведении
    },
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  username: {
    fontWeight: '600',
    fontSize: '18px',
  },
};

export default Navbar;
