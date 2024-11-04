import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Logout from '../pages/Logout/index.jsx';
import { useAuth } from '../context/auth/AuthContext.jsx';
import Gallery from '../pages/Gallery';
import Upload from '../pages/Gallery/upload';
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/upload" element={<Upload />} /> // for testing purpose
    </Routes>
  );
}

export default AppRoutes;