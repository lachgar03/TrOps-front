import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { RegisterCompanyForm } from '@/features/auth/components/RegisterCompanyForm';
import { MainLayout } from '@/common/layouts/MainLayout';
import { MissionList } from '@/features/mission/components/MissionList';
import { MissionCreateForm } from '@/features/mission/components/MissionCreateForm';
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

// Écran de Dashboard temporaire
const DashboardPlaceholder = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-4">Bienvenue sur le Dashboard TrOps</h2>
    <p className="text-gray-500 mb-2">Vous êtes correctement authentifié et sur l'espace sécurisé.</p>
    <p className="text-sm text-indigo-600 font-medium">L'architecture Frontend B2B est prête ! 🚀</p>
  </div>
);

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
                <DashboardPlaceholder />
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

        {/* Fallback : Redirige vers l'accueil (qui redirigera vers login si nécessaire) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}