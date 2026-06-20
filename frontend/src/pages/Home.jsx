import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// #Componentes funcionales
// Página pública o de bienvenida según el estado de sesión.
const Home = () => {
  const { user } = useAuth();

  return (
    <main>
      <h1>NutriGang</h1>
      <p>Sistema web para gestión nutricional.</p>

      <section>
        <h2>Funcionalidades</h2>
        <p>Gestión de pacientes, citas, mediciones, cálculos nutricionales y dietas.</p>
      </section>

      {!user && (
        // #Renderizado condicional
        // Muestra login y registro solo cuando no hay usuario autenticado.
        <nav>
          <Link to="/login">Iniciar sesión</Link>
          {' | '}
          <Link to="/register">Registrarse</Link>
        </nav>
      )}

      {user?.role === 'admin' && (
        // #Renderizado condicional
        // Redirección visual para administrador autenticado.
        <nav>
          <Link to="/admin">Ir al panel de administrador</Link>
        </nav>
      )}

      {user?.role === 'client' && (
        // #Renderizado condicional
        // Redirección visual para cliente autenticado.
        <nav>
          <Link to="/client">Ir a mi panel</Link>
        </nav>
      )}
    </main>
  );
};

export default Home;