import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../api/axiosConfig';

// #Estado global en React
// Centraliza usuario, token, login y logout para toda la aplicación.
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // #useState
  // Guarda el usuario autenticado y el estado de carga.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // #useEffect - montaje de componentes
  // Recupera usuario guardado al cargar la aplicación.
  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // #Async/Await
  // Ejecuta login consumiendo la API del backend.
  const login = async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password
    });

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    setUser(response.data.user);

    return response.data.user;
  };

  // #Manejo de eventos y lógica
  // Cierra sesión eliminando datos locales.
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    // #Children
    // Permite que los componentes hijos accedan al contexto global.
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  // #PropTypes
  // Valida que children sea contenido React válido.
  children: PropTypes.node.isRequired
};

// #Hook personalizado
// Facilita el acceso al contexto de autenticación.
export const useAuth = () => {
  return useContext(AuthContext);
};