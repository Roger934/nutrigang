import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// #Formulario controlado
// Maneja email y password mediante useState.
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // #Estados de carga, éxito y error
  // Controla retroalimentación visual sin alerts del navegador.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  // #Manejo de eventos en React
  // Actualiza el estado cuando el usuario escribe.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // #Async/Await
  // Envía credenciales al backend y espera respuesta.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    // #Validaciones en frontend
    // Evita enviar campos vacíos al backend.
    if (!formData.email || !formData.password) {
      setError('Email y contraseña son obligatorios');
      setLoading(false);
      return;
    }

    try {
      const user = await login(formData.email, formData.password);

      // #Renderizado condicional por rol
      // Redirige según tipo de usuario autenticado.
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/client');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Error al iniciar sesión'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-container page">
      <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md items-center">
        <div className="card w-full">
          <div className="mb-6 text-center">
            <p className="mb-2 text-sm font-medium text-emerald-700">
              Acceso al sistema
            </p>

            <h1 className="text-3xl font-bold text-gray-950">
              Iniciar sesión
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Ingresa tus credenciales para acceder a NutriGang.
            </p>
          </div>

          {error && (
            <p className="alert-error mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="email" className="label">
                Correo
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="label">
                Contraseña
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input"
                placeholder="Ingresa tu contraseña"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Login;
