import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Inicio', end: true },
  { to: '/admin/patients', label: 'Pacientes' },
  { to: '/admin/appointments', label: 'Citas' },
  { to: '/admin/measurements', label: 'Mediciones' },
  { to: '/admin/calculations', label: 'Calculos' },
  { to: '/admin/diets', label: 'Dietas' },
  { to: '/admin/foods', label: 'Alimentos' }
];

const AdminDashboard = () => {
  const navClass = ({ isActive }) =>
    `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`;

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
          Espacio de trabajo
        </p>
        <h1 className="mt-2 text-xl font-bold text-gray-950">Administracion</h1>
        <p className="mt-1 text-sm leading-5 text-gray-500">
          Gestion nutricional centralizada.
        </p>

        <nav className="admin-nav" aria-label="Navegacion administrativa">
          {links.map((link) => (
            <NavLink key={link.to} {...link} className={navClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="admin-content">
        <Outlet />
      </div>
    </main>
  );
};

export default AdminDashboard;
