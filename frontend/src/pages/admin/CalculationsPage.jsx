import { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';

// #Componentes funcionales
// Página administrativa para generar y consultar cálculos nutricionales.
const CalculationsPage = () => {
  // #useState
  // Guarda pacientes, mediciones, cálculos, formulario y mensajes.
  const [patients, setPatients] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [calculations, setCalculations] = useState([]);

  const [formData, setFormData] = useState({
    patient_id: '',
    measurement_id: '',
    activity_factor: '0.2',
    goal_adjustment: '0'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // #useEffect - montaje de componentes
  // Carga pacientes y cálculos al entrar a la vista.
  useEffect(() => {
    fetchPatients();
    fetchCalculations();
  }, []);

  // #useEffect - actualización
  // Cuando cambia el paciente seleccionado, carga sus mediciones.
  useEffect(() => {
    if (formData.patient_id) {
      fetchMeasurementsByPatient(formData.patient_id);
    } else {
      setMeasurements([]);
    }
  }, [formData.patient_id]);

  // #Async/Await
  // Consulta pacientes disponibles.
  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients');
      setPatients(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar pacientes');
    }
  };

  // #Async/Await
  // Consulta cálculos ya registrados.
  const fetchCalculations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/calculations');
      setCalculations(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar cálculos');
    } finally {
      setLoading(false);
    }
  };

  // #Consumo de APIs con axios
  // Carga mediciones filtradas por paciente.
  const fetchMeasurementsByPatient = async (patientId) => {
    try {
      const response = await api.get(`/measurements/patient/${patientId}`);
      setMeasurements(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar mediciones');
    }
  };

  // #Manejo de eventos en React
  // Actualiza el formulario cuando el usuario cambia campos.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
      ...(name === 'patient_id' ? { measurement_id: '' } : {})
    });
  };

  // #Formulario controlado
  // Solicita al backend generar un nuevo cálculo.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    // #Validaciones en frontend
    // Verifica que exista paciente y medición seleccionados.
    if (!formData.patient_id || !formData.measurement_id) {
      setError('Paciente y medición son obligatorios');
      return;
    }

    try {
      await api.post('/calculations', {
        patient_id: formData.patient_id,
        measurement_id: formData.measurement_id,
        activity_factor: Number(formData.activity_factor),
        goal_adjustment: Number(formData.goal_adjustment)
      });

      setMessage('Cálculo generado correctamente');

      setFormData({
        patient_id: '',
        measurement_id: '',
        activity_factor: '0.2',
        goal_adjustment: '0'
      });

      setMeasurements([]);
      fetchCalculations();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al generar cálculo');
    }
  };

  // #Bajas desde frontend
  // Elimina un cálculo registrado usando la API DELETE.
  const handleDelete = async (id) => {
    setMessage('');
    setError('');

    // #Interacción con el usuario
    // Solicita confirmación antes de eliminar un cálculo.
    const confirmed = window.confirm(
      '¿Desea eliminar este cálculo? Esta acción no se puede deshacer.'
    );

    if (!confirmed) return;

    try {
      await api.delete(`/calculations/${id}`);
      setMessage('Cálculo eliminado correctamente');
      fetchCalculations();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar cálculo');
    }
  };

  return (
    <section>
      <h2>Cálculos nutricionales</h2>

      {/* #Estados de carga, éxito y error */}
      {/* Muestra retroalimentación sin alerts del navegador. */}
      {loading && <p>Cargando cálculos...</p>}
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <h3>Generar cálculo</h3>

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
          <label htmlFor="measurement_id">Medición</label>
          <select
            id="measurement_id"
            name="measurement_id"
            value={formData.measurement_id}
            onChange={handleChange}
            required
            disabled={!formData.patient_id}
          >
            <option value="">Seleccionar medición</option>
            {measurements.map((measurement) => (
              <option key={measurement.id} value={measurement.id}>
                ID {measurement.id} - Peso {measurement.weight} kg - Talla {measurement.height} cm
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="activity_factor">Actividad física</label>
          <select
            id="activity_factor"
            name="activity_factor"
            value={formData.activity_factor}
            onChange={handleChange}
          >
            <option value="0">Encamado / sin actividad</option>
            <option value="0.1">Sedentario</option>
            <option value="0.2">Activo / gimnasio</option>
            <option value="0.3">Deportista</option>
          </select>
        </div>

        <div>
          <label htmlFor="goal_adjustment">Objetivo</label>
          <select
            id="goal_adjustment"
            name="goal_adjustment"
            value={formData.goal_adjustment}
            onChange={handleChange}
          >
            <option value="-0.1">Bajar peso (-10%)</option>
            <option value="0">Mantenimiento</option>
            <option value="0.1">Subir peso (+10%)</option>
          </select>
        </div>

        <button type="submit">Generar cálculo</button>
      </form>

      <h3>Resultados registrados</h3>

      {/* #Renderizado condicional */}
      {/* Muestra mensaje cuando no hay cálculos. */}
      {calculations.length === 0 && !loading ? (
        <p>No hay cálculos registrados.</p>
      ) : (
        // #Renderizado de listas
        // Renderiza cálculos almacenados en MySQL.
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>IMC</th>
              <th>Diagnóstico</th>
              <th>Peso ideal</th>
              <th>Lorentz</th>
              <th>ICC</th>
              <th>Pliegues</th>
              <th>Mifflin</th>
              <th>Harris</th>
              <th>Calorías</th>
              <th>Proteínas</th>
              <th>Grasas</th>
              <th>Carbos</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {calculations.map((calculation) => (
              <tr key={calculation.id}>
                <td>{calculation.id}</td>
                <td>{calculation.patient_name}</td>
                <td>{calculation.bmi}</td>
                <td>{calculation.bmi_diagnosis}</td>
                <td>{calculation.ideal_weight}</td>
                <td>{calculation.lorentz_weight}</td>
                <td>{calculation.waist_hip_index}</td>
                <td>{calculation.skinfold_sum}</td>
                <td>{calculation.mifflin}</td>
                <td>{calculation.harris_benedict}</td>
                <td>{calculation.total_calories}</td>
                <td>{calculation.proteins}</td>
                <td>{calculation.fats}</td>
                <td>{calculation.carbs}</td>
                <td>{calculation.created_at}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleDelete(calculation.id)}
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

export default CalculationsPage;