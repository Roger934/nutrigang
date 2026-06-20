import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Nombre, correo y contrasena son obligatorios');
      return;
    }
    if (formData.password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contrasenas no coinciden');
      return;
    }

    try {
      setLoading(true);
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      setMessage('Usuario registrado correctamente. Redirigiendo al login...');
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-container page">
      <section className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-5xl items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="hidden lg:block">
          <p className="text-sm font-semibold text-emerald-600">Tu salud, organizada</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-950">Crea tu espacio nutricional.</h1>
          <p className="mt-4 leading-7 text-gray-600">
            Consulta tus citas, avances y planes alimenticios en una experiencia clara y segura.
          </p>
        </div>

        <div className="card w-full">
          <div className="mb-6">
            <p className="text-sm font-semibold text-emerald-600">Nueva cuenta</p>
            <h2 className="mt-1 text-3xl font-bold text-gray-950">Registro</h2>
            <p className="mt-2 text-sm text-gray-500">Completa tus datos para comenzar.</p>
          </div>

          {message && <p className="alert-success mb-4">{message}</p>}
          {error && <p className="alert-error mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="form sm:grid-cols-2">
            <div className="form-group sm:col-span-2">
              <label htmlFor="name" className="label">Nombre completo</label>
              <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className="input" placeholder="Tu nombre" />
            </div>
            <div className="form-group sm:col-span-2">
              <label htmlFor="email" className="label">Correo</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="input" placeholder="correo@ejemplo.com" />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="label">Contrasena</label>
              <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required className="input" placeholder="Minimo 6 caracteres" />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword" className="label">Confirmar contrasena</label>
              <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className="input" placeholder="Repite tu contrasena" />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary sm:col-span-2">
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Ya tienes cuenta?{' '}
            <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">Inicia sesion</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;
