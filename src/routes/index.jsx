import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Home from '../pages/Home';
import Login from '../pages/Login';
import { useAuth } from '../context/auth/AuthContext.jsx';
import Gallery from '../pages/Gallery';
import Upload from '../pages/Gallery/upload';
import Loader from '../components/Loader/index.jsx';

function AppRoutes() {
  const { loading , currentUseruid } = useAuth();
  useEffect(() => {
    const handleKeyDown = (e) => {
      if(e.keyCode === 8){
        window.history.back();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader/>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={!currentUseruid ? <Login /> : <Navigate to="/" />} />
      <Route path="/gallery" element={currentUseruid ? <Gallery /> : <Navigate to="/login" />} />
      <Route path="/upload" element={currentUseruid ? <Upload /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default AppRoutes;