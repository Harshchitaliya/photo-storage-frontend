import React, { createContext, useState, useEffect, useContext } from "react";
import {  onAuthStateChanged } from "firebase/auth";
import {auth} from '../components/connection/connection'
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);


export const AuthProvider = ({ children }) => {
  const [currentUseruid, setCurrentUseruid] = useState(null);
  const [currentuser, Setcurrentuser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      
      if (user) {
        setCurrentUseruid(user.uid);
        Setcurrentuser(user)
      } else {
        setCurrentUseruid(null);
        Setcurrentuser(null)
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);



  return (
    <AuthContext.Provider value={{currentUseruid,currentuser,loading}}>
        {children}
        
    </AuthContext.Provider>
  );
};
