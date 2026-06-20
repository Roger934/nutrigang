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
  // #Estado visual
  // Controla quÃ© apartado del panel se muestra sin modificar los datos.
  const [activeSection, setActiveSection] = useState('profile');

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
    const isUnlinkedPatient = error.includes('No existe un paciente vinculado');

    return (
      <main className="app-container page">
        <section className="mx-auto max-w-2xl rounded-3xl border border-emerald-100 bg-white p-7 text-center shadow-sm sm:p-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl font-bold text-emerald-700">N</span>
          <h1 className="mt-5 text-2xl font-bold text-gray-950">Panel del Cliente</h1>
          {isUnlinkedPatient ? (
            <>
              <p className="mt-3 text-lg font-semibold text-emerald-700">Tu cuenta ya esta lista</p>
              <p className="mx-auto mt-2 max-w-lg leading-7 text-gray-600">
                Espera a que tu nutriologo te registre como su nuevo paciente. Cuando complete el alta, aqui podras consultar tu perfil, citas, mediciones y dieta.
              </p>
            </>
          ) : (
            <p className="alert-error mt-5 text-left">{error}</p>
          )}
        </section>
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
    <main className="app-container page client-content">
      <div className="page-header">
        <div>
          <p className="text-sm font-semibold text-emerald-600">Mi espacio</p>
          <h1 className="page-title mt-1">Panel del Cliente</h1>
          <p className="page-subtitle mt-2">Consulta tu informacion nutricional y tu progreso.</p>
        </div>
      </div>

      {/* #Navegacion visual */}
      {/* Permite consultar una seccion o mostrar toda la informacion. */}
      <nav className="client-tabs" aria-label="Secciones del panel del cliente">
        {[
          ['profile', 'Mi perfil', 'client-tab-profile'],
          ['appointment', 'Proxima cita', 'client-tab-appointment'],
          ['diet', 'Mi dieta', 'client-tab-diet'],
          ['measurement', 'Medicion', 'client-tab-measurement'],
          ['calculation', 'Calculo', 'client-tab-calculation'],
          ['all', 'Mostrar todo', 'client-tab-all']
        ].map(([id, label, colorClass]) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveSection(id)}
            className={`client-tab ${colorClass} ${activeSection === id ? 'client-tab-active' : ''}`}
            aria-pressed={activeSection === id}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* #Renderizado condicional */}
      {/* Muestra secciones solo si existe información asociada. */}

      {(activeSection === 'profile' || activeSection === 'all') && <section className="client-panel-profile">
        <h2>Mi perfil</h2>
        <p><strong>Nombre:</strong> {patient.full_name}</p>
        <p><strong>Edad:</strong> {patient.age}</p>
        <p><strong>Sexo:</strong> {patient.gender}</p>
        <p><strong>Teléfono:</strong> {patient.phone}</p>
        <p><strong>Notas:</strong> {patient.notes || 'Sin notas'}</p>
      </section>}

      {(activeSection === 'appointment' || activeSection === 'all') && <section className="client-panel-appointment">
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
      </section>}

      {(activeSection === 'diet' || activeSection === 'all') && <section className="client-panel-diet">
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
      </section>}

      {(activeSection === 'measurement' || activeSection === 'all') && <section className="client-panel-measurement">
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
      </section>}

      {(activeSection === 'calculation' || activeSection === 'all') && <section className="client-panel-calculation">
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
      </section>}
    </main>
  );
};

export default ClientDashboard;
