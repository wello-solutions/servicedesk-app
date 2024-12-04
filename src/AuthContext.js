import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    try {
      const storedAuth = sessionStorage.getItem('auth');
      return storedAuth ? JSON.parse(storedAuth) : null;
    } catch (error) {
      console.error("Failed to parse auth data from session storage:", error);
      return null;
    }
  });

  const login = (domain, email, password) => {
    const authData = { domain, email, password };
    setAuth(authData);
    sessionStorage.setItem('auth', JSON.stringify(authData));
  };

  const logout = () => {
    setAuth(null);
    sessionStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};