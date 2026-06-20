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
    <main>
      <h1>Login</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Correo</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </main>
  );
};

export default Login;