import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage'; // Você precisará criar este componente
import ProjectPage from './pages/ProjectPage';
import RegisterPage from './pages/RegisterPage'; // Opcional para a Sprint 5

const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/projects/:id" 
        element={
          <PrivateRoute>
            <ProjectPage />
          </PrivateRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App