// Main.jsx
import 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  // Импортируем BrowserRouter
import App from './App.jsx';  // Импортируем ваш основной компонент

// Оборачиваем приложение в BrowserRouter и рендерим
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
