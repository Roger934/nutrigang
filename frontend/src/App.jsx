import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Navbar';

// #Lazy Loading
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
const FoodDetail = lazy(() => import('./pages/admin/FoodDetail'));

// #React Router
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-gray-900">
        <Navbar />

        {/* #Lazy Loading */}
        <Suspense
          fallback={
            <main className="app-container page">
              <div className="card text-center">
                <p className="text-sm font-medium text-violet-700">
                  Cargando página...
                </p>
              </div>
            </main>
          }
        >
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
              <Route path="foods/:foodId" element={<FoodDetail />} />
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
      </div>
    </BrowserRouter>
  );
}

export default App;
