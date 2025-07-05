import 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, token } = useAuth();

  if (!token) {
    // Если нет пользователя (не авторизован), перенаправляем на страницу входа
    return <Navigate to="/login" />;
  }

  // Если пользователь авторизован, показываем дочерние компоненты
  return <div>{children}</div>;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
