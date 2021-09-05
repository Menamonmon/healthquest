import { User } from "@firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
});

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(auth.currentUser);
  }, []);

  auth.onAuthStateChanged((user) => {
    setUser(user);
  });
  return (
    <AuthContext.Provider value={{ isAuthenticated: Boolean(user), user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
