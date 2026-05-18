import React, { useState, useEffect } from 'react';
import type { AxiosError } from 'axios';
import { clientApi } from '../services/clientApi';
import type { ClientResponse, ClientRequest } from '../types/client.types';
import { Users, Loader2, AlertCircle, Plus, X, Trash2, Mail, Phone, MapPin, User, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 10;

export const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ClientRequest>({ name: '', email: '', phone: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const loadClients = async () => {
      setIsLoading(true);
      try {
        const data = await clientApi.fetchClients(currentPage - 1, PAGE_SIZE);
        setClients(data.content || []);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      } catch {
        setError('Impossible de charger les clients.');
      } finally {
        setIsLoading(false);
      }
    };
    void loadClients();
  }, [currentPage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await clientApi.createClient(formData);
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        const data = await clientApi.fetchClients(0, PAGE_SIZE);
        setClients(data.content || []);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      }
      setFormData({ name: '', email: '', phone: '', address: '' });
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
      await clientApi.deleteClient(id);
      const data = await clientApi.fetchClients(currentPage - 1, PAGE_SIZE);
      setClients(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch {
      setError('Erreur lors de la suppression.');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading && clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
        <p className="text-sm text-gray-500 font-medium">Chargement des clients…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50/50 px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Gestion des Clients</h2>
              <p className="text-sm text-gray-500">Répertoire de vos clients et partenaires.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
              Total : <span className="text-gray-900">{totalElements}</span>
            </span>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors"
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showForm ? 'Annuler' : 'Nouveau Client'}
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
          <div className="px-6 py-5 border-b border-gray-100 bg-indigo-50/30">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Nom *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text" required value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-white text-sm"
                    placeholder="Nom du client"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email" value={formData.email ?? ''}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-white text-sm"
                    placeholder="email@entreprise.com"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel" value={formData.phone ?? ''}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-white text-sm"
                    placeholder="+212 6XX-XXXXXX"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Adresse</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text" value={formData.address ?? ''}
                    onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-white text-sm"
                    placeholder="Casablanca, Maroc"
                  />
                </div>
              </div>
              <div className="sm:col-span-2 flex justify-end pt-2">
                <button
                  type="submit" disabled={isSubmitting}
                  className="py-2.5 px-6 flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-600/20 text-white font-medium text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Créer le client
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
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Téléphone</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Adresse</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <Users className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">Aucun client trouvé</p>
                      <p className="text-xs text-gray-400">Ajoutez votre premier client pour commencer.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{client.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{client.email ?? '—'}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{client.phone ?? '—'}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{client.address ?? '—'}</td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => void handleDelete(client.id)}
                        disabled={deletingId === client.id}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-50"
                        aria-label={`Supprimer ${client.name}`}
                      >
                        {deletingId === client.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-500">
              Page <span className="font-semibold text-gray-700">{currentPage}</span> sur{' '}
              <span className="font-semibold text-gray-700">{totalPages}</span>
              {' '}— {totalElements} clients au total
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:text-indigo-600 hover:border-indigo-200 border border-transparent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('ellipsis');
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === 'ellipsis' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-xs">…</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setCurrentPage(item as number)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors border ${
                        currentPage === item
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'text-gray-600 border-transparent hover:bg-white hover:border-gray-200'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:text-indigo-600 hover:border-indigo-200 border border-transparent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsPage;
