import { signOut } from "firebase/auth";
import { auth } from "../../context/auth/connection/connection";
import { useNavigate } from "react-router-dom";
import React from "react";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logout successful");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

  React.useEffect(() => {
    handleLogout();
  }, []);

  return null;
};

export default Logout;
