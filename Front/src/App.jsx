// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Импортируем Routes и Route
import { AuthProvider } from './context/AuthContext'; // Ваш контекст авторизации
import LoginPage from './pages/LoginPage'; // Страница входа
import RegisterPage from './pages/RegisterPage'; // Страница регистрации
import HomePage from './pages/HomePage'; // Импортируем главную страницу
import Dashboard from './pages/Dashboard'; // Страница Dashboard
import PrivateRoute from './routes/PrivateRoute';
import PharmaciesPage from "./pages/PharmaciesPage.jsx"; // Компонент маршрутизации
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>

        <Navbar /> {/* Тулбар отображается на каждой странице */}
        <div style={{ marginTop: '70px' }}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/pharmacies" element={<PharmaciesPage />} />
            </Routes>
        </div>

    </AuthProvider>
  );
}

export default App;
