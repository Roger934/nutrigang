  import { Link, NavLink, useNavigate } from 'react-router-dom';
  import { useAuth } from '../context/AuthContext';

  // #NavLink
  // Permite navegación con enlaces activos dentro de React Router.
  const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // #Manejo de eventos en React
    // Cierra sesión y redirige al inicio.
    const handleLogout = () => {
      logout();
      navigate('/');
    };

    return (
      <header>
        <nav>
          <Link to="/">NutriGang</Link>
          {' | '}

          {!user && (
            <>
              {/* #Usuario no logueado */}
              <NavLink to="/login">Login</NavLink>
              {' | '}
              <NavLink to="/register">Registro</NavLink>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              {/* #Renderizado condicional */}
              {/* Muestra opciones exclusivas del administrador. */}
              <NavLink to="/admin">Panel Admin</NavLink>
            </>
          )}

          {user?.role === 'client' && (
            <>
              {/* #Renderizado condicional */}
              {/* Muestra opciones exclusivas del cliente. */}
              <NavLink to="/client">Panel Cliente</NavLink>
            </>
          )}

          {user && (
            <>
              {' | '}
              <span>{user.name}</span>
              {' | '}
              <button type="button" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          )}
        </nav>
      </header>
    );
  };

  export default Navbar;