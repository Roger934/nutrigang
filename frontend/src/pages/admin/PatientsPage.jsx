import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

// #Componentes funcionales
// Página administrativa para consultar, crear, editar y eliminar pacientes.
const PatientsPage = () => {
  // #useState
  // Guarda lista de pacientes, formulario, modo edición y estados de retroalimentación.
  const [patients, setPatients] = useState([]);
  // #useState
  // Guarda usuarios cliente disponibles para vinculación.
  const [clientUsers, setClientUsers] = useState([]);
  const [editingPatientId, setEditingPatientId] = useState(null);

  const [formData, setFormData] = useState({
    user_id: "",
    full_name: "",
    age: "",
    gender: "",
    phone: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // #useEffect - montaje de componentes
  // Carga pacientes al entrar a la vista.
  useEffect(() => {
    fetchPatients();
    fetchClientUsers();
  }, []);

  // #Async/Await
  // Consulta la API de pacientes usando axios.
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await api.get("/patients");
      setPatients(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar pacientes");
    } finally {
      setLoading(false);
    }
  };

  // #Consumo de APIs REST
  // Obtiene usuarios cliente registrados para vincularlos a pacientes.
  const fetchClientUsers = async () => {
    try {
      const response = await api.get("/auth/clients");
      setClientUsers(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al cargar usuarios cliente",
      );
    }
  };

  // #Manejo de eventos en React
  // Actualiza el formulario conforme el usuario escribe.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // #Formulario controlado
  // Envía los datos del formulario al backend.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    // #Validaciones en frontend
    // Verifica que los campos obligatorios estén completos.
    if (
      !formData.full_name ||
      !formData.age ||
      !formData.gender ||
      !formData.phone
    ) {
      setError("Nombre, edad, sexo y teléfono son obligatorios");
      return;
    }

    // #Validaciones en frontend
    // Verifica que la edad esté dentro de un rango válido.
    if (Number(formData.age) < 1 || Number(formData.age) > 120) {
      setError("La edad debe estar entre 1 y 120 años");
      return;
    }

    // #Validaciones en frontend
    // Verifica que el teléfono tenga al menos 10 dígitos.
    if (formData.phone.length < 10) {
      setError("El teléfono debe tener al menos 10 dígitos");
      return;
    }

    try {
      const payload = {
        user_id: formData.user_id || null,
        full_name: formData.full_name,
        age: formData.age,
        gender: formData.gender,
        phone: formData.phone,
        notes: formData.notes || null,
      };

      // #Altas y cambios desde frontend
      // Si hay editingPatientId actualiza; si no, registra un nuevo paciente.
      if (editingPatientId) {
        await api.put(`/patients/${editingPatientId}`, payload);
        setMessage("Paciente actualizado correctamente");
      } else {
        await api.post("/patients", payload);
        setMessage("Paciente registrado correctamente");
      }

      setEditingPatientId(null);

      setFormData({
        user_id: "",
        full_name: "",
        age: "",
        gender: "",
        phone: "",
        notes: "",
      });

      fetchPatients();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar paciente");
    }
  };

  // #Cambios a registros desde frontend
  // Carga los datos del paciente seleccionado en el formulario.
  const handleEdit = (patient) => {
    setMessage("");
    setError("");

    setEditingPatientId(patient.id);

    setFormData({
      user_id: patient.user_id || "",
      full_name: patient.full_name || "",
      age: patient.age || "",
      gender: patient.gender || "",
      phone: patient.phone || "",
      notes: patient.notes || "",
    });
  };

  // #Manejo de eventos en React
  // Cancela la edición y limpia el formulario.
  const handleCancelEdit = () => {
    setEditingPatientId(null);
    setMessage("");
    setError("");

    setFormData({
      user_id: "",
      full_name: "",
      age: "",
      gender: "",
      phone: "",
      notes: "",
    });
  };

  // #Bajas desde frontend
  // Elimina un paciente consumiendo la API DELETE.
  const handleDelete = async (id) => {
    setMessage("");
    setError("");

    // #Interacción con el usuario
    // Solicita confirmación antes de eliminar un registro.
    const confirmed = window.confirm(
      "¿Desea eliminar este paciente? Esta acción también puede eliminar sus citas, mediciones y dietas asociadas.",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/patients/${id}`);
      setMessage("Paciente eliminado correctamente");
      fetchPatients();
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar paciente");
    }
  };

  return (
    <section>
      <h2>Pacientes</h2>

      {/* #Estados de carga, éxito y error */}
      {/* Muestra retroalimentación sin usar alerts del navegador. */}
      {loading && <p>Cargando pacientes...</p>}
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <h3>{editingPatientId ? "Editar paciente" : "Registrar paciente"}</h3>

      <form onSubmit={handleSubmit}>
        <div>
          {/* #Relación entre entidades */}
          {/* Permite vincular un usuario cliente con un paciente. */}
          <div>
            <label htmlFor="user_id">Usuario vinculado</label>

            <select
              id="user_id"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
            >
              <option value="">Sin vincular</option>

              {clientUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.email}
                </option>
              ))}
            </select>
          </div>
          <label htmlFor="full_name">Nombre completo</label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="age">Edad</label>
          <input
            id="age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="gender">Sexo</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar</option>
            <option value="male">Hombre</option>
            <option value="female">Mujer</option>
          </select>
        </div>

        <div>
          <label htmlFor="phone">Teléfono</label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            required
          />
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
          {editingPatientId ? "Actualizar paciente" : "Guardar paciente"}
        </button>

        {editingPatientId && (
          <button type="button" onClick={handleCancelEdit}>
            Cancelar edición
          </button>
        )}
      </form>

      <h3>Listado de pacientes</h3>

      {/* #Renderizado condicional */}
      {/* Muestra mensaje cuando no hay pacientes. */}
      {patients.length === 0 && !loading ? (
        <p>No hay pacientes registrados.</p>
      ) : (
        // #Renderizado de listas
        // Renderiza pacientes obtenidos desde MySQL.
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Nombre</th>
              <th>Edad</th>
              <th>Sexo</th>
              <th>Teléfono</th>
              <th>Notas</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.user_id || "Sin vincular"}</td>
                <td>{patient.full_name}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>{patient.phone}</td>
                <td>{patient.notes}</td>
                <td>
                  <button type="button" onClick={() => handleEdit(patient)}>
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(patient.id)}
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

export default PatientsPage;
