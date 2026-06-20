import { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';

// #Componentes funcionales
// Página administrativa para consultar, crear, editar y eliminar dietas.
const DietsPage = () => {
  // #useState
  // Guarda dietas, pacientes, formulario, modo edición y mensajes.
  const [diets, setDiets] = useState([]);
  const [patients, setPatients] = useState([]);
  const [editingDietId, setEditingDietId] = useState(null);

  const [formData, setFormData] = useState({
    patient_id: '',
    title: '',
    description: '',
    breakfast: '',
    snack1: '',
    lunch: '',
    snack2: '',
    dinner: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // #useEffect - montaje de componentes
  // Carga dietas y pacientes al entrar a la vista.
  useEffect(() => {
    fetchDiets();
    fetchPatients();
  }, []);

  // #Async/Await
  // Consulta la API de dietas usando axios.
  const fetchDiets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/diets');
      setDiets(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar dietas');
    } finally {
      setLoading(false);
    }
  };

  // #Consumo de APIs con axios
  // Obtiene pacientes para seleccionar a quién asignar la dieta.
  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients');
      setPatients(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar pacientes');
    }
  };

  // #Manejo de eventos en React
  // Actualiza el formulario cuando el usuario escribe.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // #Formulario controlado
  // Envía los datos de dieta al backend.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    // #Validaciones en frontend
    // Verifica campos obligatorios de la dieta.
    if (
      !formData.patient_id ||
      !formData.title ||
      !formData.breakfast ||
      !formData.lunch ||
      !formData.dinner
    ) {
      setError('Paciente, título, desayuno, comida y cena son obligatorios');
      return;
    }

    try {
      const payload = {
        patient_id: formData.patient_id,
        title: formData.title,
        description: formData.description || null,
        breakfast: formData.breakfast,
        snack1: formData.snack1 || null,
        lunch: formData.lunch,
        snack2: formData.snack2 || null,
        dinner: formData.dinner
      };

      // #Altas y cambios desde frontend
      // Si hay editingDietId actualiza; si no, crea una dieta.
      if (editingDietId) {
        await api.put(`/diets/${editingDietId}`, payload);
        setMessage('Dieta actualizada correctamente');
      } else {
        await api.post('/diets', payload);
        setMessage('Dieta registrada correctamente');
      }

      setEditingDietId(null);

      setFormData({
        patient_id: '',
        title: '',
        description: '',
        breakfast: '',
        snack1: '',
        lunch: '',
        snack2: '',
        dinner: ''
      });

      fetchDiets();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar dieta');
    }
  };

  // #Cambios a registros desde frontend
  // Carga la dieta seleccionada en el formulario.
  const handleEdit = (diet) => {
    setMessage('');
    setError('');

    setEditingDietId(diet.id);

    setFormData({
      patient_id: diet.patient_id || '',
      title: diet.title || '',
      description: diet.description || '',
      breakfast: diet.breakfast || '',
      snack1: diet.snack1 || '',
      lunch: diet.lunch || '',
      snack2: diet.snack2 || '',
      dinner: diet.dinner || ''
    });
  };

  // #Manejo de eventos en React
  // Cancela edición y limpia formulario.
  const handleCancelEdit = () => {
    setEditingDietId(null);
    setMessage('');
    setError('');

    setFormData({
      patient_id: '',
      title: '',
      description: '',
      breakfast: '',
      snack1: '',
      lunch: '',
      snack2: '',
      dinner: ''
    });
  };

  // #Bajas desde frontend
  // Elimina una dieta mediante la API DELETE.
  const handleDelete = async (id) => {
    setMessage('');
    setError('');

    // #Interacción con el usuario
    // Solicita confirmación antes de eliminar una dieta.
    const confirmed = window.confirm(
      '¿Desea eliminar esta dieta? Esta acción no se puede deshacer.'
    );

    if (!confirmed) return;

    try {
      await api.delete(`/diets/${id}`);
      setMessage('Dieta eliminada correctamente');
      fetchDiets();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar dieta');
    }
  };

  return (
    <section>
      <h2>Dietas</h2>

      {/* #Estados de carga, éxito y error */}
      {/* Muestra retroalimentación sin alerts del navegador. */}
      {loading && <p>Cargando dietas...</p>}
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <h3>{editingDietId ? 'Editar dieta' : 'Registrar dieta'}</h3>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="patient_id">Paciente</label>
          <select
            id="patient_id"
            name="patient_id"
            value={formData.patient_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar paciente</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.full_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title">Título</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="breakfast">Desayuno</label>
          <textarea
            id="breakfast"
            name="breakfast"
            value={formData.breakfast}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="snack1">Colación 1</label>
          <textarea
            id="snack1"
            name="snack1"
            value={formData.snack1}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="lunch">Comida</label>
          <textarea
            id="lunch"
            name="lunch"
            value={formData.lunch}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="snack2">Colación 2</label>
          <textarea
            id="snack2"
            name="snack2"
            value={formData.snack2}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="dinner">Cena</label>
          <textarea
            id="dinner"
            name="dinner"
            value={formData.dinner}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">
          {editingDietId ? 'Actualizar dieta' : 'Guardar dieta'}
        </button>

        {editingDietId && (
          <button type="button" onClick={handleCancelEdit}>
            Cancelar edición
          </button>
        )}
      </form>

      <h3>Listado de dietas</h3>

      {/* #Renderizado condicional */}
      {/* Muestra mensaje cuando no hay dietas. */}
      {diets.length === 0 && !loading ? (
        <p>No hay dietas registradas.</p>
      ) : (
        // #Renderizado de listas
        // Renderiza dietas obtenidas desde MySQL.
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>Título</th>
              <th>Desayuno</th>
              <th>Comida</th>
              <th>Cena</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {diets.map((diet) => (
              <tr key={diet.id}>
                <td>{diet.id}</td>
                <td>{diet.patient_name}</td>
                <td>{diet.title}</td>
                <td>{diet.breakfast}</td>
                <td>{diet.lunch}</td>
                <td>{diet.dinner}</td>
                <td>
                  <button type="button" onClick={() => handleEdit(diet)}>
                    Editar
                  </button>

                  <button type="button" onClick={() => handleDelete(diet.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default DietsPage;