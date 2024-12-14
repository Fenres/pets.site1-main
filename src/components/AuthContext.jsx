// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

// Создаем контекст
const AuthContext = createContext();

// Создаем провайдер для контекста
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);

  useEffect(() => {
    // Сохраняем токен в localStorage, когда он меняется
    if (authToken) {
      localStorage.setItem('authToken', authToken);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [authToken]);

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста
export const useAuth = () => useContext(AuthContext);
