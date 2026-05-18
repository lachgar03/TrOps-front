import React, { useState, useEffect } from 'react';
import type { AxiosError } from 'axios';
import { maintenanceApi } from '../services/maintenanceApi';
import type { MaintenanceResponse, MaintenanceRequest } from '../types/maintenance.types';
import type { MaintenanceStatus } from '@/common/types/enums';
import { vehicleApi } from '@/features/vehicle/services/vehicleApi';
import type { VehicleResponse } from '@/features/vehicle/types/vehicle.types';
import { Wrench, Loader2, AlertCircle, Plus, X, Truck, DollarSign, Calendar, PlayCircle, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  SCHEDULED: { label: 'Planifiée', class: 'bg-slate-100 text-slate-700 border-slate-200' },
  IN_PROGRESS: { label: 'En cours', class: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  COMPLETED: { label: 'Terminée', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

const PAGE_SIZE = 10;

export const MaintenancePage: React.FC = () => {
  const [logs, setLogs] = useState<MaintenanceResponse[]>([]);
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<MaintenanceRequest>({
    vehicleId: '',
    description: '',
    cost: 0,
    mileageAtMaintenance: 0,
    maintenanceDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      try {
        const [mData, vData] = await Promise.all([
          maintenanceApi.fetchAll(currentPage - 1, PAGE_SIZE),
          vehicleApi.fetchVehicles(0, 1000), // Dropdown vehicles
        ]);
        setLogs(mData.content || []);
        setTotalPages(mData.totalPages || 1);
        setTotalElements(mData.totalElements || 0);
        setVehicles(vData.content || []);
      } catch {
        setError('Impossible de charger les maintenances.');
      } finally {
        setIsLoading(false);
      }
    };
    void loadAll();
  }, [currentPage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await maintenanceApi.create(formData);
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        const mData = await maintenanceApi.fetchAll(0, PAGE_SIZE);
        setLogs(mData.content || []);
        setTotalPages(mData.totalPages || 1);
        setTotalElements(mData.totalElements || 0);
      }
      setFormData({ vehicleId: '', description: '', cost: 0, mileageAtMaintenance: 0, maintenanceDate: new Date().toISOString().split('T')[0] });
      setShowForm(false);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message ?? 'Erreur lors de la création.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id: string, nextStatus: MaintenanceStatus) => {
    setUpdatingId(id);
    try {
      const updated = await maintenanceApi.updateStatus(id, nextStatus);
      setLogs((prev) => prev.map((l) => (l.id === id ? updated : l)));
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message ?? 'Erreur lors de la mise à jour.');
    } finally {
      setUpdatingId(null);
    }
  };

  const fmt = (val: number) => val.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (isLoading && logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
        <p className="text-sm text-gray-500 font-medium">Chargement des maintenances…</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden font-sans text-gray-900">
      {/* Header */}
      <div className="bg-gray-50/50 px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50">
            <Wrench className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Maintenance Véhicules</h2>
            <p className="text-sm text-gray-500">Planifier et suivre les opérations de maintenance.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
            Total : <span className="text-gray-900">{totalElements}</span>
          </span>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Annuler' : 'Planifier'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-rose-600 font-medium">{error}</p>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="px-6 py-5 border-b border-gray-100 bg-amber-50/30">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Véhicule *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Truck className="h-5 w-5 text-gray-400" /></div>
                <select value={formData.vehicleId} required
                  onChange={(e) => setFormData((p) => ({ ...p, vehicleId: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-white text-sm appearance-none">
                  <option value="" disabled>Sélectionner…</option>
                  {vehicles.map((v) => <option key={v.id} value={v.id}>{v.registrationNumber}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Coût (MAD)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><DollarSign className="h-5 w-5 text-gray-400" /></div>
                <input type="number" min="0" step="0.01" value={formData.cost || ''}
                  onChange={(e) => setFormData((p) => ({ ...p, cost: Number(e.target.value) }))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-white text-sm font-medium"
                  placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Date *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Calendar className="h-5 w-5 text-gray-400" /></div>
                <input type="date" required value={formData.maintenanceDate}
                  onChange={(e) => setFormData((p) => ({ ...p, maintenanceDate: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-white text-sm" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Kilométrage</label>
              <input type="number" min="0" required value={formData.mileageAtMaintenance || ''}
                onChange={(e) => setFormData((p) => ({ ...p, mileageAtMaintenance: Number(e.target.value) }))}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-white text-sm"
                placeholder="km" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description *</label>
              <input type="text" required value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-white text-sm"
                placeholder="Vidange, freins, pneus…" />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-2">
              <button type="submit" disabled={isSubmitting}
                className="py-2.5 px-6 flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all disabled:opacity-70 shadow-sm">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Planifier la maintenance
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
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Véhicule</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Coût</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Statut</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">Aucune maintenance planifiée</p>
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const cfg = STATUS_CONFIG[log.status] ?? STATUS_CONFIG.SCHEDULED;
                const nextStatus: MaintenanceStatus | null =
                  log.status === 'SCHEDULED' ? 'IN_PROGRESS' :
                  log.status === 'IN_PROGRESS' ? 'COMPLETED' : null;

                return (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(log.maintenanceDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-800 text-xs font-mono border border-gray-200">{log.vehicleRegistrationNumber}</span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900 max-w-[200px] truncate">{log.description}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-700 text-right whitespace-nowrap">{fmt(log.cost)} MAD</td>
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${cfg.class}`}>{cfg.label}</span>
                    </td>
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      {nextStatus && (
                        <button
                          onClick={() => void handleStatusUpdate(log.id, nextStatus)}
                          disabled={updatingId === log.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors disabled:opacity-50"
                        >
                          {updatingId === log.id ? <Loader2 className="w-3 h-3 animate-spin" /> :
                            nextStatus === 'IN_PROGRESS' ? <PlayCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                          {nextStatus === 'IN_PROGRESS' ? 'Démarrer' : 'Terminer'}
                        </button>
                      )}
                      {!nextStatus && <span className="text-xs text-gray-400">—</span>}
                    </td>
                  </tr>
                );
              })
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
            {' '}— {totalElements} maintenances au total
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

export default MaintenancePage;
