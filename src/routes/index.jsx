import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import { useAuth } from "../context/auth/AuthContext.jsx";
import Gallery from "../pages/Gallery";
import Upload from "../pages/Gallery/upload";
import Product from "../pages/Product";
import Loader from "../components/Loader";
import EditProduct from "../pages/EditProduct";
import Recycle from "../pages/Recycle";
import Profile from "../pages/Profile";
import EditImg from "../pages/EditImg";
function AppRoutes() {
  const { loading, currentUseruid } = useAuth();
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
        <Loader />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={!currentUseruid ? <Login /> : <Home />}
      />
      <Route
        path="/gallery"
        element={currentUseruid ? <Gallery /> : <Login />}
      />
      <Route path="/upload" element={currentUseruid ? <Upload /> : <Login />} />
      <Route
        path="/products"
        element={currentUseruid ? <Product /> : <Login />}
      />
      <Route
        path="/products/:id/edit"
        element={currentUseruid ? <EditProduct /> : <Login />}
      />
      <Route
        path="/products/:id/:imgId/edit"
        element={currentUseruid ? <EditImg /> : <Login />}
      />
      <Route
        path="/recycle"
        element={currentUseruid ? <Recycle /> : <Login />}
      />
      <Route
        path="/profile"
        element={currentUseruid ? <Profile /> : <Login />}
      />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default AppRoutes;
