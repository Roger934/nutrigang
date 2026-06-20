import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

// #Componentes funcionales
// La aplicación se renderiza usando componentes React.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* #Estado global en React */}
    {/* AuthProvider comparte autenticación en toda la aplicación. */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);