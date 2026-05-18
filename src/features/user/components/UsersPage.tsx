import React, { useState, useEffect } from 'react';
import type { AxiosError } from 'axios';
import { userApi } from '../services/userApi';
import type { UserResponse, UserCreateRequest, Role } from '../types/user.types';
import { Users, Loader2, AlertCircle, Plus, X, Trash2, Mail, Shield, UserCog } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<UserCreateRequest>({
    email: '',
    password: '',
    role: 'OPERATOR',
  });

  const loadUsers = async () => {
    try {
      const data = await userApi.fetchUsers();
      // Adjust if backend returns Page<UserResponse> instead of UserResponse[]
      setUsers(Array.isArray(data) ? data : (data as any).content || []);
    } catch {
      setError('Impossible de charger les utilisateurs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void loadUsers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const created = await userApi.createUser(formData);
      setUsers((prev) => [created, ...prev]);
      setFormData({ email: '', password: '', role: 'OPERATOR' });
      setShowForm(false);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message ?? 'Erreur lors de la création.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await userApi.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch { 
      setError('Erreur lors de la suppression.'); 
    } finally { 
      setDeletingId(null); 
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
        <p className="text-sm text-gray-500 font-medium">Chargement des utilisateurs…</p>
      </div>
    );
  }

  const roleColors: Record<Role, string> = {
    ADMIN: 'bg-rose-50 text-rose-700 border-rose-200',
    MANAGER: 'bg-amber-50 text-amber-700 border-amber-200',
    OPERATOR: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50/50 px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100">
              <UserCog className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Gestion des Utilisateurs</h2>
              <p className="text-sm text-gray-500">Ajoutez et gérez les accès de votre équipe.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
              Total : <span className="text-gray-900">{users.length}</span>
            </span>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors"
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? 'Annuler' : 'Ajouter'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-rose-600 font-medium">{error}</p>
          </div>
        )}

        {/* Create Form */}
        {showForm && (
          <div className="px-6 py-5 border-b border-gray-100 bg-slate-50/50">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email" required value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-white text-sm"
                    placeholder="employe@entreprise.com"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Mot de passe provisoire *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password" required minLength={8} value={formData.password}
                    onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-white text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Rôle *</label>
                <select
                  value={formData.role} required
                  onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value as Role }))}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-white text-sm appearance-none"
                >
                  <option value="OPERATOR">Opérateur (Lecture seule)</option>
                  <option value="MANAGER">Manager (Gestion courante)</option>
                  <option value="ADMIN">Administrateur (Contrôle total)</option>
                </select>
              </div>
              <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-2">
                <button
                  type="submit" disabled={isSubmitting}
                  className="py-2.5 px-6 flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-600/20 text-white font-medium text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Créer l'utilisateur
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rôle</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <Users className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">Aucun utilisateur trouvé</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{user.email}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${roleColors[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => void handleDelete(user.id)}
                        disabled={deletingId === user.id}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-50"
                      >
                        {deletingId === user.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
