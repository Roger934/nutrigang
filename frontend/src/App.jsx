import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Navbar';

// #Lazy Loading
// Carga páginas solo cuando se necesitan.
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AdminHome = lazy(() => import('./pages/admin/AdminHome'));
const PatientsPage = lazy(() => import('./pages/admin/PatientsPage'));
const AppointmentsPage = lazy(() => import('./pages/admin/AppointmentsPage'));
const MeasurementsPage = lazy(() => import('./pages/admin/MeasurementsPage'));
const CalculationsPage = lazy(() => import('./pages/admin/CalculationsPage'));
const DietsPage = lazy(() => import('./pages/admin/DietsPage'));
const FoodsPage = lazy(() => import('./pages/admin/FoodsPage'));

// #React Router
// Define navegación principal del sistema.
function App() {
  return (
    <BrowserRouter>
      <Navbar />

      {/* #Lazy Loading */}
      {/* Suspense muestra mensaje mientras carga una página diferida. */}
      <Suspense fallback={<p>Cargando página...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="measurements" element={<MeasurementsPage />} />
            <Route path="calculations" element={<CalculationsPage />} />
            <Route path="diets" element={<DietsPage />} />
            <Route path="foods" element={<FoodsPage />} />
          </Route>

          <Route
            path="/client"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;