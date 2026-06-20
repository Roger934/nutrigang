import { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';

// #Componentes funcionales
// Página administrativa para consultar, crear, editar y eliminar mediciones.
const MeasurementsPage = () => {
  // #useState
  // Guarda mediciones, pacientes, formulario, modo edición y mensajes.
  const [measurements, setMeasurements] = useState([]);
  const [patients, setPatients] = useState([]);
  const [editingMeasurementId, setEditingMeasurementId] = useState(null);

  const [formData, setFormData] = useState({
    patient_id: '',
    weight: '',
    height: '',
    waist: '',
    hip: '',
    triceps: '',
    biceps: '',
    subscapular: '',
    suprailiac: '',
    cmb: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // #useEffect - montaje de componentes
  // Carga mediciones y pacientes al entrar a la vista.
  useEffect(() => {
    fetchMeasurements();
    fetchPatients();
  }, []);

  // #Async/Await
  // Consulta la API de mediciones usando axios.
  const fetchMeasurements = async () => {
    try {
      setLoading(true);
      const response = await api.get('/measurements');
      setMeasurements(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar mediciones');
    } finally {
      setLoading(false);
    }
  };

  // #Consumo de APIs con axios
  // Obtiene pacientes para seleccionar a quién pertenece la medición.
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
  // Envía los datos de medición al backend.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    // #Validaciones en frontend
    // Verifica datos mínimos para una medición antropométrica.
    if (!formData.patient_id || !formData.weight || !formData.height) {
      setError('Paciente, peso y talla son obligatorios');
      return;
    }

    if (Number(formData.weight) <= 0 || Number(formData.height) <= 0) {
      setError('Peso y talla deben ser mayores a cero');
      return;
    }

    try {
      const payload = {
        patient_id: formData.patient_id,
        weight: formData.weight,
        height: formData.height,
        waist: formData.waist || null,
        hip: formData.hip || null,
        triceps: formData.triceps || null,
        biceps: formData.biceps || null,
        subscapular: formData.subscapular || null,
        suprailiac: formData.suprailiac || null,
        cmb: formData.cmb || null
      };

      // #Altas y cambios desde frontend
      // Si hay editingMeasurementId actualiza; si no, crea una medición.
      if (editingMeasurementId) {
        await api.put(`/measurements/${editingMeasurementId}`, payload);
        setMessage('Medición actualizada correctamente');
      } else {
        await api.post('/measurements', payload);
        setMessage('Medición registrada correctamente');
      }

      setEditingMeasurementId(null);

      setFormData({
        patient_id: '',
        weight: '',
        height: '',
        waist: '',
        hip: '',
        triceps: '',
        biceps: '',
        subscapular: '',
        suprailiac: '',
        cmb: ''
      });

      fetchMeasurements();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar medición');
    }
  };

  // #Cambios a registros desde frontend
  // Carga la medición seleccionada en el formulario.
  const handleEdit = (measurement) => {
    setMessage('');
    setError('');

    setEditingMeasurementId(measurement.id);

    setFormData({
      patient_id: measurement.patient_id || '',
      weight: measurement.weight || '',
      height: measurement.height || '',
      waist: measurement.waist || '',
      hip: measurement.hip || '',
      triceps: measurement.triceps || '',
      biceps: measurement.biceps || '',
      subscapular: measurement.subscapular || '',
      suprailiac: measurement.suprailiac || '',
      cmb: measurement.cmb || ''
    });
  };

  // #Manejo de eventos en React
  // Cancela edición y limpia formulario.
  const handleCancelEdit = () => {
    setEditingMeasurementId(null);
    setMessage('');
    setError('');

    setFormData({
      patient_id: '',
      weight: '',
      height: '',
      waist: '',
      hip: '',
      triceps: '',
      biceps: '',
      subscapular: '',
      suprailiac: '',
      cmb: ''
    });
  };

  // #Bajas desde frontend
  // Elimina una medición mediante la API DELETE.
  const handleDelete = async (id) => {
    setMessage('');
    setError('');

    // #Interacción con el usuario
    // Solicita confirmación antes de eliminar una medición.
    const confirmed = window.confirm(
      '¿Desea eliminar esta medición? Esta acción no se puede deshacer.'
    );

    if (!confirmed) return;

    try {
      await api.delete(`/measurements/${id}`);
      setMessage('Medición eliminada correctamente');
      fetchMeasurements();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar medición');
    }
  };

  return (
    <section>
      <h2>Mediciones</h2>

      {/* #Estados de carga, éxito y error */}
      {/* Muestra retroalimentación sin alerts del navegador. */}
      {loading && <p>Cargando mediciones...</p>}
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <h3>{editingMeasurementId ? 'Editar medición' : 'Registrar medición'}</h3>

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
          <label htmlFor="weight">Peso (kg)</label>
          <input
            id="weight"
            name="weight"
            type="number"
            step="0.01"
            value={formData.weight}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="height">Talla (cm)</label>
          <input
            id="height"
            name="height"
            type="number"
            step="0.01"
            value={formData.height}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="waist">Cintura (cm)</label>
          <input
            id="waist"
            name="waist"
            type="number"
            step="0.01"
            value={formData.waist}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="hip">Cadera (cm)</label>
          <input
            id="hip"
            name="hip"
            type="number"
            step="0.01"
            value={formData.hip}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="triceps">Tríceps (mm)</label>
          <input
            id="triceps"
            name="triceps"
            type="number"
            step="0.01"
            value={formData.triceps}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="biceps">Bíceps (mm)</label>
          <input
            id="biceps"
            name="biceps"
            type="number"
            step="0.01"
            value={formData.biceps}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="subscapular">Subescapular (mm)</label>
          <input
            id="subscapular"
            name="subscapular"
            type="number"
            step="0.01"
            value={formData.subscapular}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="suprailiac">Suprailiaco (mm)</label>
          <input
            id="suprailiac"
            name="suprailiac"
            type="number"
            step="0.01"
            value={formData.suprailiac}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="cmb">CMB (cm)</label>
          <input
            id="cmb"
            name="cmb"
            type="number"
            step="0.01"
            value={formData.cmb}
            onChange={handleChange}
          />
        </div>

        <button type="submit">
          {editingMeasurementId ? 'Actualizar medición' : 'Guardar medición'}
        </button>

        {editingMeasurementId && (
          <button type="button" onClick={handleCancelEdit}>
            Cancelar edición
          </button>
        )}
      </form>

      <h3>Listado de mediciones</h3>

      {/* #Renderizado condicional */}
      {/* Muestra mensaje cuando no hay mediciones. */}
      {measurements.length === 0 && !loading ? (
        <p>No hay mediciones registradas.</p>
      ) : (
        // #Renderizado de listas
        // Renderiza mediciones obtenidas desde MySQL.
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>Peso</th>
              <th>Talla</th>
              <th>Cintura</th>
              <th>Cadera</th>
              <th>Tríceps</th>
              <th>Bíceps</th>
              <th>Subescapular</th>
              <th>Suprailiaco</th>
              <th>CMB</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {measurements.map((measurement) => (
              <tr key={measurement.id}>
                <td>{measurement.id}</td>
                <td>{measurement.patient_name}</td>
                <td>{measurement.weight}</td>
                <td>{measurement.height}</td>
                <td>{measurement.waist}</td>
                <td>{measurement.hip}</td>
                <td>{measurement.triceps}</td>
                <td>{measurement.biceps}</td>
                <td>{measurement.subscapular}</td>
                <td>{measurement.suprailiac}</td>
                <td>{measurement.cmb}</td>
                <td>{measurement.created_at}</td>
                <td>
                  <button type="button" onClick={() => handleEdit(measurement)}>
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(measurement.id)}
                  >
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

export default MeasurementsPage;