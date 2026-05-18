import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { RegisterCompanyForm } from '@/features/auth/components/RegisterCompanyForm';
import { MainLayout } from '@/common/layouts/MainLayout';
import { DashboardPage } from '@/features/dashboard/components/DashboardPage';
import { MissionList } from '@/features/mission/components/MissionList';
import { MissionCreateForm } from '@/features/mission/components/MissionCreateForm';
import { VehicleList } from '@/features/vehicle/components/VehicleList';
import { ClientsPage } from '@/features/client/components/ClientsPage';
import { ExpensesPage } from '@/features/expense/components/ExpensesPage';
import { MaintenancePage } from '@/features/maintenance/components/MaintenancePage';
import { UsersPage } from '@/features/user/components/UsersPage';
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
                <DashboardPage />
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
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ClientsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/depenses"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ExpensesPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MaintenancePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <MainLayout>
                <UsersPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback : Redirige vers l'accueil */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}