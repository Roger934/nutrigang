import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

// #Componentes funcionales
// Página pública para registrar usuarios cliente.
const Register = () => {
  // #useState
  // Guarda datos del formulario de registro.
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // #Estados de carga, éxito y error
  // Maneja retroalimentación sin alerts del navegador.
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // #Manejo de eventos en React
  // Actualiza el formulario conforme el usuario escribe.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // #Formulario controlado
  // Envía datos de registro al backend.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    // #Validaciones en frontend
    // Verifica campos obligatorios.
    if (!formData.name || !formData.email || !formData.password) {
      setError('Nombre, correo y contraseña son obligatorios');
      return;
    }

    // #Validaciones en frontend
    // Verifica longitud mínima de contraseña.
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // #Validaciones en frontend
    // Verifica que las contraseñas coincidan.
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);

      // #Consumo de APIs con axios
      // Consume POST /api/auth/register para crear cliente.
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      setMessage('Usuario registrado correctamente. Redirigiendo al login...');

      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Registro</h1>

      <p>Registra una cuenta de cliente para consultar tu información nutricional.</p>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Correo</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      <p>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </main>
  );
};

export default Register;