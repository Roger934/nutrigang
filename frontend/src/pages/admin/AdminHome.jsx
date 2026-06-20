const modules = ['Pacientes', 'Citas', 'Mediciones', 'Planes', 'Calculos', 'Alimentos'];

const AdminHome = () => (
  <section>
    <div>
      <p className="text-sm font-semibold text-emerald-600">Vista general</p>
      <h2 className="mt-1">Resumen administrativo</h2>
      <p className="mt-2 max-w-2xl text-gray-500">
        Administra la operacion diaria de tus pacientes desde un solo lugar.
      </p>
    </div>

    <div className="dashboard-grid">
      {modules.map((item) => (
        <article key={item} className="stat-card">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-lg font-bold text-emerald-700">
            {item.charAt(0)}
          </span>
          <h3 className="mt-4 pt-0">{item}</h3>
          <p className="mt-1 text-sm text-gray-500">Consulta y administra registros.</p>
        </article>
      ))}
    </div>
  </section>
);

export default AdminHome;
