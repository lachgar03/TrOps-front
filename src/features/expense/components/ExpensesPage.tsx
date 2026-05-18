import React, { useState, useEffect } from 'react';
import type { AxiosError } from 'axios';
import { expenseApi } from '../services/expenseApi';
import type { ExpenseResponse, ExpenseRequest } from '../types/expense.types';
import type { ExpenseCategory } from '@/common/types/enums';
import { vehicleApi } from '@/features/vehicle/services/vehicleApi';
import type { VehicleResponse } from '@/features/vehicle/types/vehicle.types';
import { Receipt, Loader2, AlertCircle, Plus, X, Trash2, Truck, DollarSign, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  FUEL: '⛽ Carburant',
  TOLL: '🛣️ Péage',
  MAINTENANCE_PART: '🔧 Pièce Maintenance',
  SALARY: '👤 Salaire',
  INSURANCE_PAYMENT: '🛡️ Assurance',
  OTHER: '📦 Autre',
};

const PAGE_SIZE = 10;

export const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<ExpenseRequest>({
    category: 'FUEL',
    amount: 0,
    expenseDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [expPage, vehPage] = await Promise.all([
          expenseApi.fetchExpenses(currentPage - 1, PAGE_SIZE),
          vehicleApi.fetchVehicles(0, 1000), // all for dropdown
        ]);
        setExpenses(expPage.content || []);
        setTotalPages(expPage.totalPages || 1);
        setTotalElements(expPage.totalElements || 0);
        setVehicles(vehPage.content || []);
      } catch {
        setError('Impossible de charger les données.');
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, [currentPage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await expenseApi.createExpense(formData);
      // Reload current page to reflect newly created (might be on page 1)
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        const expPage = await expenseApi.fetchExpenses(0, PAGE_SIZE);
        setExpenses(expPage.content || []);
        setTotalPages(expPage.totalPages || 1);
        setTotalElements(expPage.totalElements || 0);
      }
      setFormData({ category: 'FUEL', amount: 0, expenseDate: new Date().toISOString().split('T')[0] });
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
      await expenseApi.deleteExpense(id);
      const expPage = await expenseApi.fetchExpenses(currentPage - 1, PAGE_SIZE);
      setExpenses(expPage.content || []);
      setTotalPages(expPage.totalPages || 1);
      setTotalElements(expPage.totalElements || 0);
    } catch { 
      setError('Erreur lors de la suppression.'); 
    } finally { 
      setDeletingId(null); 
    }
  };

  const fmt = (val: number) => val.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden font-sans text-gray-900">
      {/* Header */}
      <div className="bg-gray-50/50 px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50">
            <Receipt className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Gestion des Dépenses</h2>
            <p className="text-sm text-gray-500">Suivi de toutes les dépenses de la flotte.</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Annuler' : 'Nouvelle Dépense'}
        </button>
      </div>

      {error && (
        <div className="mx-6 mt-4 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-rose-600 font-medium">{error}</p>
        </div>
      )}

      {showForm && (
        <div className="px-6 py-5 border-b border-gray-100 bg-amber-50/30">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Catégorie *</label>
              <select
                value={formData.category} required
                onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value as ExpenseCategory }))}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-white text-sm appearance-none"
              >
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Montant (MAD) *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><DollarSign className="h-5 w-5 text-gray-400" /></div>
                <input type="number" min="0" step="0.01" required
                  value={formData.amount || ''}
                  onChange={(e) => setFormData((p) => ({ ...p, amount: Number(e.target.value) }))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-white text-sm font-medium"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Date *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Calendar className="h-5 w-5 text-gray-400" /></div>
                <input type="date" required
                  value={formData.expenseDate}
                  onChange={(e) => setFormData((p) => ({ ...p, expenseDate: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-white text-sm"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Véhicule (optionnel)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Truck className="h-5 w-5 text-gray-400" /></div>
                <select
                  value={formData.vehicleId ?? ''}
                  onChange={(e) => setFormData((p) => ({ ...p, vehicleId: e.target.value || undefined }))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-white text-sm appearance-none"
                >
                  <option value="">Aucun</option>
                  {vehicles.map((v) => <option key={v.id} value={v.id}>{v.registrationNumber}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input type="text"
                value={formData.description ?? ''}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-white text-sm"
                placeholder="Description de la dépense..."
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-2">
              <button type="submit" disabled={isSubmitting}
                className="py-2.5 px-6 flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all disabled:opacity-70 shadow-sm"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
          <p className="text-sm text-gray-500 font-medium">Chargement...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Véhicule</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Montant</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="py-3 px-6 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <Receipt className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">Aucune dépense enregistrée</p>
                    </div>
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(exp.expenseDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-4 px-6 text-sm whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                        {CATEGORY_LABELS[exp.category] ?? exp.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">
                      {exp.vehicleRegistrationNumber ? (
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-800 text-xs font-mono border border-gray-200">{exp.vehicleRegistrationNumber}</span>
                      ) : '—'}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-rose-600 text-right whitespace-nowrap">{fmt(exp.amount)} MAD</td>
                    <td className="py-4 px-6 text-sm text-gray-600 max-w-[200px] truncate">{exp.description ?? '—'}</td>
                    <td className="py-4 px-6">
                      <button onClick={() => void handleDelete(exp.id)} disabled={deletingId === exp.id}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-50">
                        {deletingId === exp.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-gray-500">
            Page <span className="font-semibold text-gray-700">{currentPage}</span> sur{' '}
            <span className="font-semibold text-gray-700">{totalPages}</span>
            {' '}— {totalElements} dépenses au total
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
  );
};

export default ExpensesPage;
