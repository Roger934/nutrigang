import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroImage from '../assets/hero.png';

const features = [
  {
    number: '01',
    title: 'Pacientes',
    description: 'Expedientes, datos de contacto y seguimiento en un solo lugar.',
    color: 'from-violet-500 to-purple-600'
  },
  {
    number: '02',
    title: 'Citas',
    description: 'Organiza las consultas y manten visible la siguiente visita.',
    color: 'from-purple-500 to-fuchsia-500'
  },
  {
    number: '03',
    title: 'Mediciones',
    description: 'Registra la evolucion antropometrica de cada paciente.',
    color: 'from-indigo-500 to-violet-600'
  },
  {
    number: '04',
    title: 'Planes',
    description: 'Crea y consulta dietas con informacion clara y ordenada.',
    color: 'from-violet-600 to-indigo-700'
  }
];

// #Componentes funcionales
// Pagina publica o de bienvenida segun el estado de sesion.
const Home = () => {
  const { user } = useAuth();

  return (
    <main className="overflow-hidden">
      <section className="relative">
        <div className="pointer-events-none absolute -left-32 top-12 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-40 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl" />

        <div className="app-container grid min-h-[calc(100vh-4rem)] items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_0_4px_rgba(139,92,246,0.15)]" />
              Gestion nutricional simple y centralizada
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.05] tracking-[-0.04em] text-gray-950 sm:text-6xl lg:text-7xl">
              Nutrici&oacute;n con orden,
              <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
                progreso con claridad.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
              NutriGang conecta la administraci&oacute;n de pacientes con su seguimiento nutricional para que cada consulta sea m&aacute;s clara, &aacute;gil y profesional.
            </p>

            {!user && (
              // #Renderizado condicional
              // Muestra login y registro solo cuando no hay usuario autenticado.
              <nav className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/login" className="btn btn-primary px-7">
                  Iniciar sesi&oacute;n
                  <span className="ml-2" aria-hidden="true">&rarr;</span>
                </Link>
                <Link to="/register" className="btn btn-outline border-violet-200 px-7 text-violet-700">
                  Crear mi cuenta
                </Link>
              </nav>
            )}

            {user?.role === 'admin' && (
              // #Renderizado condicional
              // Redireccion visual para administrador autenticado.
              <nav className="mt-8">
                <Link to="/admin" className="btn btn-primary px-7">
                  Ir al panel de administrador <span className="ml-2">&rarr;</span>
                </Link>
              </nav>
            )}

            {user?.role === 'client' && (
              // #Renderizado condicional
              // Redireccion visual para cliente autenticado.
              <nav className="mt-8">
                <Link to="/client" className="btn btn-primary px-7">
                  Consultar mi progreso <span className="ml-2">&rarr;</span>
                </Link>
              </nav>
            )}

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-gray-500">
              {['Informacion centralizada', 'Acceso por roles', 'Seguimiento integral'].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">&#10003;</span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:mx-0">
            <div className="absolute inset-8 rotate-6 rounded-[2.5rem] bg-gradient-to-br from-violet-500 to-purple-700 opacity-15 blur-sm" />
            <div className="relative rounded-[2rem] border border-white/70 bg-white/90 p-4 shadow-[0_35px_90px_-35px_rgba(76,29,149,0.45)] backdrop-blur sm:p-6">
              <div className="flex items-center justify-between border-b border-violet-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 font-bold text-white">N</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Vista general</p>
                    <p className="text-xs text-gray-500">Tu consulta, bajo control</p>
                  </div>
                </div>
                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">Hoy</span>
              </div>

              <div className="grid gap-3 py-5 sm:grid-cols-3">
                {[
                  ['Pacientes', '24', 'bg-violet-50 text-violet-700'],
                  ['Citas', '08', 'bg-purple-100 text-purple-700'],
                  ['Planes', '16', 'bg-fuchsia-50 text-fuchsia-700']
                ].map(([label, value, color]) => (
                  <div key={label} className={`rounded-2xl p-4 ${color}`}>
                    <p className="text-xs font-semibold opacity-70">{label}</p>
                    <p className="mt-1 text-2xl font-black">{value}</p>
                  </div>
                ))}
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 via-violet-950 to-purple-900 p-5 text-white">
                <div className="relative z-10 max-w-[65%]">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">Seguimiento</p>
                  <p className="mt-2 text-xl font-bold">Toda la informacion que necesitas.</p>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15">
                    <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400" />
                  </div>
                </div>
                <img src={heroImage} alt="" className="absolute -bottom-10 -right-8 w-44 rotate-[-8deg] opacity-80" />
              </div>
            </div>

            <div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-xl sm:-left-8">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 font-bold text-green-700">&#10003;</span>
              <div>
                <p className="text-xs text-gray-500">Estado</p>
                <p className="text-sm font-bold text-gray-900">Todo actualizado</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-violet-100 bg-white/70 py-20">
        <div className="app-container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">Una plataforma completa</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">Todo fluye desde un mismo lugar</h2>
            <p className="mt-4 leading-7 text-gray-600">Menos tiempo buscando informaci&oacute;n y m&aacute;s tiempo acompa&ntilde;ando el progreso de cada paciente.</p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article key={feature.title} className="group rounded-3xl border border-violet-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-100">
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-sm font-bold text-white shadow-lg`}>
                  {feature.number}
                </span>
                <h3 className="mt-6 text-lg font-bold text-gray-950">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{feature.description}</p>
                <div className="mt-5 h-1 w-10 rounded-full bg-violet-200 transition-all duration-300 group-hover:w-20 group-hover:bg-violet-500" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="app-container py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 px-6 py-12 text-center shadow-2xl shadow-violet-200 sm:px-12">
          <div className="absolute -left-16 -top-20 h-56 w-56 rounded-full border-[32px] border-white/5" />
          <div className="absolute -bottom-24 -right-12 h-64 w-64 rounded-full bg-fuchsia-400/10" />
          <div className="relative mx-auto max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-200">NutriGang</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Una experiencia clara para profesionales y pacientes.</h2>
            <p className="mt-4 leading-7 text-violet-100">Organiza la consulta, da seguimiento al progreso y mant&eacute;n cada plan nutricional al alcance.</p>
            {!user && (
              <Link to="/register" className="btn mt-7 bg-white px-7 text-violet-700 shadow-lg hover:-translate-y-0.5 hover:bg-violet-50">
                Comenzar ahora
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
