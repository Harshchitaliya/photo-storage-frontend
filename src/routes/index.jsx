import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import { useAuth } from '../context/auth/AuthContext.jsx';
import Gallery from '../pages/Gallery';
import Upload from '../pages/Gallery/upload';
import Product from '../pages/Product';
import Loader from '../components/Loader';
import EditProduct from '../pages/EditProduct';
import Recycle from '../pages/Recycle';
import Profile from '../pages/Profile';
import EditImg from '../pages/EditImg';
import Removebackground from '../pages/Removebackground';
function AppRoutes() {
  const { loading , currentUseruid } = useAuth();
  // useEffect(() => {
  //   const handleKeyDown = (e) => {
  //     if(e.keyCode === 8){
  //       window.history.back();
  //     }
  //   };
  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);
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
      <Route path="/products" element={currentUseruid ? <Product /> : <Navigate to="/login" />} />
      <Route path="/products/:id/edit" element={currentUseruid ? <EditProduct /> : <Navigate to="/login" />} />
      <Route path="/recycle" element={currentUseruid ? <Recycle /> : <Navigate to="/login" />} />
      <Route path="/profile" element={currentUseruid ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/products/:id/:imgId/edit" element={currentUseruid ? <EditImg /> : <Navigate to="/login" />} />
      <Route path="/products/:id/:imgId/removebackground" element={currentUseruid ? <Removebackground /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default AppRoutes;