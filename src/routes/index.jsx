import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Logout from '../pages/logout';
import { useAuth } from '../context/auth/AuthContext.jsx';
import Gallery from '../pages/Gallery';
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/gallery" element={<Gallery />} />
    </Routes>
  );
}

export default AppRoutes;