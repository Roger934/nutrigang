import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? 'bg-violet-100 text-violet-700'
        : 'text-gray-600 hover:bg-violet-50 hover:text-violet-700'
    }`;

  return (
    <header className="navbar">
      <div className="navbar-inner">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-lg font-bold text-gray-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-200">
            N
          </span>
          <span>Nutri<span className="text-violet-600">Gang</span></span>
        </Link>

        {/* Navegación */}
        <div className="flex items-center gap-1 sm:gap-2">

          {!user && (
            <>
              <NavLink
                to="/login"
                className={navLinkClass}
              >
                Iniciar sesión
              </NavLink>

              <NavLink
                to="/register"
                className={navLinkClass}
              >
                Registro
              </NavLink>
            </>
          )}

          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={navLinkClass}
            >
              Panel Admin
            </NavLink>
          )}

          {user?.role === 'client' && (
            <NavLink
              to="/client"
              className={navLinkClass}
            >
              Mi Perfil
            </NavLink>
          )}

          {user && (
            <div className="ml-4 flex items-center gap-3 border-l border-gray-200 pl-4">

              <span className="hidden sm:block text-sm text-gray-600">
                {user.name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-primary"
              >
                Salir
              </button>

            </div>
          )}

        </div>

      </div>
    </header>
  );
};

export default Navbar;
