import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../services/authApi';
import type { RegisterCompanyRequest } from '../types/auth.types';
import type { AxiosError } from 'axios';
import { Building2, User, Mail, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RegisterCompanyForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterCompanyRequest>({
    companyName: '',
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const register = useAuthStore((state) => state.register);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await authApi.registerCompany(formData);
      register(response.token);
      navigate('/');
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message ?? "Erreur lors de l'inscription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 font-sans text-gray-900">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-10">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-50 mb-5">
            <Building2 className="w-7 h-7 text-indigo-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Inscrire votre entreprise</h2>
          <p className="mt-2 text-sm text-gray-500">Créez votre compte TrOps et commencez à gérer votre flotte efficacement.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-rose-600 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Entreprise */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">1</span>
              <h3 className="text-sm font-semibold text-gray-800">Informations de l'entreprise</h3>
            </div>
            <div className="p-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-gray-50/50 focus:bg-white text-sm"
                    placeholder="Ex: Transports Dubois"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Administrateur */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">2</span>
              <h3 className="text-sm font-semibold text-gray-800">Compte Administrateur</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="adminFirstName"
                    required
                    value={formData.adminFirstName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-gray-50/50 focus:bg-white text-sm"
                    placeholder="Jean"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="adminLastName"
                    required
                    value={formData.adminLastName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-gray-50/50 focus:bg-white text-sm"
                    placeholder="Dupont"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Adresse email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="adminEmail"
                    required
                    value={formData.adminEmail}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-gray-50/50 focus:bg-white text-sm"
                    placeholder="jean.dupont@entreprise.com"
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="adminPassword"
                    required
                    minLength={8}
                    value={formData.adminPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-gray-50/50 focus:bg-white text-sm"
                    placeholder="••••••••"
                  />
                </div>
                <p className="text-xs text-gray-500 ml-1">Doit contenir au moins 8 caractères.</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-600/20 text-white font-medium text-sm sm:text-base transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Création en cours...</span>
                </>
              ) : (
                <>
                  <span>Créer mon compte entreprise</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};
