import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { RegisterCompanyForm } from '@/features/auth/components/RegisterCompanyForm';
import { MainLayout } from '@/common/layouts/MainLayout';
import { MissionList } from '@/features/mission/components/MissionList';
import { MissionCreateForm } from '@/features/mission/components/MissionCreateForm';
import { VehicleList } from '@/features/vehicle/components/VehicleList';
import { ActiveAlertsWidget } from '@/features/dashboard/components/ActiveAlertsWidget';
import type { JSX } from 'react';

/**
 * Empêche l'accès aux pages privées si non connecté
 */
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

/**
 * Empêche l'accès aux pages de login/register si déjà connecté
 */
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes Publiques */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegisterCompanyForm />
            </PublicRoute>
          } 
        />

        {/* Routes Protégées (Layout Principal) */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <ActiveAlertsWidget />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/missions" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <MissionList />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/missions/new" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <MissionCreateForm />
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        {/* Route Flotte */}
        <Route
          path="/flotte"
          element={
            <ProtectedRoute>
              <MainLayout>
                <VehicleList />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback : Redirige vers l'accueil (qui redirigera vers login si nécessaire) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}