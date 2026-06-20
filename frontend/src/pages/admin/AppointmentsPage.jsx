import { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';

// #Componentes funcionales
// Página administrativa para consultar, crear, editar y eliminar citas.
const AppointmentsPage = () => {
  // #useState
  // Guarda citas, pacientes, formulario, modo edición y mensajes de estado.
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);

  const [formData, setFormData] = useState({
    patient_id: '',
    appointment_date: '',
    status: 'pending',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // #useEffect - montaje de componentes
  // Carga citas y pacientes al entrar a la vista.
  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, []);

  // #Async/Await
  // Consulta la API de citas usando axios.
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/appointments');
      setAppointments(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar citas');
    } finally {
      setLoading(false);
    }
  };

  // #Async/Await
  // Consulta pacientes para llenar el select del formulario.
  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients');
      setPatients(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar pacientes');
    }
  };

  // #Manejo de eventos en React
  // Actualiza el formulario cuando el usuario escribe o selecciona datos.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // #Formulario controlado
  // Envía los datos de la cita al backend.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    // #Validaciones en frontend
    // Verifica que paciente, fecha y estado estén completos.
    if (
      !formData.patient_id ||
      !formData.appointment_date ||
      !formData.status
    ) {
      setError('Paciente, fecha y estado son obligatorios');
      return;
    }

    try {
      const payload = {
        patient_id: formData.patient_id,
        appointment_date: formData.appointment_date,
        status: formData.status,
        notes: formData.notes || null
      };

      // #Altas y cambios desde frontend
      // Si hay editingAppointmentId actualiza; si no, crea una nueva cita.
      if (editingAppointmentId) {
        await api.put(`/appointments/${editingAppointmentId}`, payload);
        setMessage('Cita actualizada correctamente');
      } else {
        await api.post('/appointments', payload);
        setMessage('Cita registrada correctamente');
      }

      setEditingAppointmentId(null);

      setFormData({
        patient_id: '',
        appointment_date: '',
        status: 'pending',
        notes: ''
      });

      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar cita');
    }
  };

  // #Cambios a registros desde frontend
  // Carga los datos de la cita seleccionada en el formulario.
  const handleEdit = (appointment) => {
    setMessage('');
    setError('');

    setEditingAppointmentId(appointment.id);

    setFormData({
      patient_id: appointment.patient_id || '',
      appointment_date: appointment.appointment_date
        ? appointment.appointment_date.slice(0, 16)
        : '',
      status: appointment.status || 'pending',
      notes: appointment.notes || ''
    });
  };

  // #Manejo de eventos en React
  // Cancela la edición y limpia el formulario.
  const handleCancelEdit = () => {
    setEditingAppointmentId(null);
    setMessage('');
    setError('');

    setFormData({
      patient_id: '',
      appointment_date: '',
      status: 'pending',
      notes: ''
    });
  };

  // #Bajas desde frontend
  // Elimina una cita consumiendo la API DELETE.
  const handleDelete = async (id) => {
    setMessage('');
    setError('');

    // #Interacción con el usuario
    // Solicita confirmación antes de eliminar una cita.
    const confirmed = window.confirm(
      '¿Desea eliminar esta cita? Esta acción no se puede deshacer.'
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/appointments/${id}`);
      setMessage('Cita eliminada correctamente');
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar cita');
    }
  };

  return (
    <section>
      <h2>Citas</h2>

      {/* #Estados de carga, éxito y error */}
      {/* Muestra retroalimentación sin alerts del navegador. */}
      {loading && <p>Cargando citas...</p>}
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <h3>{editingAppointmentId ? 'Editar cita' : 'Registrar cita'}</h3>

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
          <label htmlFor="appointment_date">Fecha y hora</label>
          <input
            id="appointment_date"
            name="appointment_date"
            type="datetime-local"
            value={formData.appointment_date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="status">Estado</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="pending">Pendiente</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes">Notas</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <button type="submit">
          {editingAppointmentId ? 'Actualizar cita' : 'Guardar cita'}
        </button>

        {editingAppointmentId && (
          <button type="button" onClick={handleCancelEdit}>
            Cancelar edición
          </button>
        )}
      </form>

      <h3>Listado de citas</h3>

      {/* #Renderizado condicional */}
      {/* Muestra mensaje cuando no hay citas registradas. */}
      {appointments.length === 0 && !loading ? (
        <p>No hay citas registradas.</p>
      ) : (
        // #Renderizado de listas
        // Renderiza citas obtenidas desde MySQL.
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Notas</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.id}</td>
                <td>{appointment.patient_name}</td>
                <td>{appointment.appointment_date}</td>
                <td>{appointment.status}</td>
                <td>{appointment.notes}</td>
                <td>
                  <button type="button" onClick={() => handleEdit(appointment)}>
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(appointment.id)}
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

export default AppointmentsPage;