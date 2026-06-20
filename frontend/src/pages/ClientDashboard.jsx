import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

// #Cliente logueado
// Vista de solo lectura para consultar perfil, cita, dieta, medición y cálculo.
const ClientDashboard = () => {
  // #useState
  // Guarda la información privada del cliente autenticado.
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // #useEffect - montaje de componentes
  // Carga la información del cliente al entrar a la vista.
  useEffect(() => {
    fetchClientProfile();
  }, []);

  // #Async/Await
  // Consume la API protegida del cliente.
  const fetchClientProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/client/profile');
      setProfileData(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Error al cargar información del cliente'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Cargando información del cliente...</p>;
  }

  if (error) {
    return (
      <main>
        <h1>Panel del Cliente</h1>
        <p>{error}</p>
      </main>
    );
  }

  if (!profileData) {
    return (
      <main>
        <h1>Panel del Cliente</h1>
        <p>No hay información disponible.</p>
      </main>
    );
  }

  const {
    patient,
    nextAppointment,
    latestDiet,
    latestMeasurement,
    latestCalculation
  } = profileData;

  return (
    <main>
      <h1>Panel del Cliente</h1>

      {/* #Renderizado condicional */}
      {/* Muestra secciones solo si existe información asociada. */}

      <section>
        <h2>Mi perfil</h2>
        <p><strong>Nombre:</strong> {patient.full_name}</p>
        <p><strong>Edad:</strong> {patient.age}</p>
        <p><strong>Sexo:</strong> {patient.gender}</p>
        <p><strong>Teléfono:</strong> {patient.phone}</p>
        <p><strong>Notas:</strong> {patient.notes || 'Sin notas'}</p>
      </section>

      <section>
        <h2>Mi próxima cita</h2>

        {nextAppointment ? (
          <>
            <p><strong>Fecha:</strong> {nextAppointment.appointment_date}</p>
            <p><strong>Estado:</strong> {nextAppointment.status}</p>
            <p><strong>Notas:</strong> {nextAppointment.notes || 'Sin notas'}</p>
          </>
        ) : (
          <p>No hay citas registradas.</p>
        )}
      </section>

      <section>
        <h2>Mi dieta asignada</h2>

        {latestDiet ? (
          <>
            <p><strong>Título:</strong> {latestDiet.title}</p>
            <p><strong>Descripción:</strong> {latestDiet.description || 'Sin descripción'}</p>
            <p><strong>Desayuno:</strong> {latestDiet.breakfast}</p>
            <p><strong>Colación 1:</strong> {latestDiet.snack1 || 'No asignada'}</p>
            <p><strong>Comida:</strong> {latestDiet.lunch}</p>
            <p><strong>Colación 2:</strong> {latestDiet.snack2 || 'No asignada'}</p>
            <p><strong>Cena:</strong> {latestDiet.dinner}</p>
          </>
        ) : (
          <p>No hay dieta asignada.</p>
        )}
      </section>

      <section>
        <h2>Última medición</h2>

        {latestMeasurement ? (
          <>
            <p><strong>Peso:</strong> {latestMeasurement.weight} kg</p>
            <p><strong>Talla:</strong> {latestMeasurement.height} cm</p>
            <p><strong>Cintura:</strong> {latestMeasurement.waist || 'No registrada'}</p>
            <p><strong>Cadera:</strong> {latestMeasurement.hip || 'No registrada'}</p>
            <p><strong>Fecha:</strong> {latestMeasurement.created_at}</p>
          </>
        ) : (
          <p>No hay mediciones registradas.</p>
        )}
      </section>

      <section>
        <h2>Último cálculo nutricional</h2>

        {latestCalculation ? (
          <>
            <p><strong>IMC:</strong> {latestCalculation.bmi}</p>
            <p><strong>Diagnóstico:</strong> {latestCalculation.bmi_diagnosis}</p>
            <p><strong>Peso ideal:</strong> {latestCalculation.ideal_weight} kg</p>
            <p><strong>Calorías estimadas:</strong> {latestCalculation.total_calories} kcal</p>
            <p><strong>Proteínas:</strong> {latestCalculation.proteins} g</p>
            <p><strong>Grasas:</strong> {latestCalculation.fats} g</p>
            <p><strong>Carbohidratos:</strong> {latestCalculation.carbs} g</p>
          </>
        ) : (
          <p>No hay cálculos registrados.</p>
        )}
      </section>
    </main>
  );
};

export default ClientDashboard;