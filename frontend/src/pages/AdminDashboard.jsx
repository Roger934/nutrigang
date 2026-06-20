import { NavLink, Outlet } from 'react-router-dom';

// #Rutas anidadas
// Layout principal del panel admin con Outlet para renderizar subrutas.
const AdminDashboard = () => {
  return (
    <main>
      <h1>Panel de Administrador</h1>

      <nav>
        {/* #NavLink */}
        {/* Navegación interna del módulo administrador. */}
        <NavLink to="/admin">Inicio</NavLink>
        {' | '}
        <NavLink to="/admin/patients">Pacientes</NavLink>
        {' | '}
        <NavLink to="/admin/appointments">Citas</NavLink>
        {' | '}
        <NavLink to="/admin/measurements">Mediciones</NavLink>
        {' | '}
        <NavLink to="/admin/calculations">Cálculos</NavLink>
        {' | '}
        <NavLink to="/admin/diets">Dietas</NavLink>
        {' | '}
        <NavLink to="/admin/foods">Alimentos</NavLink>
      </nav>

      {/* #Children / Outlet */}
      {/* Renderiza el contenido de las rutas hijas del panel. */}
      <Outlet />
    </main>
  );
};

export default AdminDashboard;