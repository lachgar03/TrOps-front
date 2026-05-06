import React, { useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import { missionApi } from '../services/missionApi';
import type { MissionResponse } from '../types/mission.types';
import { FileSpreadsheet, Loader2, Calendar, Truck, User, DollarSign, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { StatusBadge } from '../../../common/components/StatusBadge';

// ─── Pagination config ────────────────────────────────────────────────────────
const PAGE_SIZE = 10;

// ─── Component ────────────────────────────────────────────────────────────────

export const MissionList: React.FC = () => {
  const [missions, setMissions] = useState<MissionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const data = await missionApi.getMissions();
        setMissions(Array.isArray(data) ? data : []);
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        setError(axiosErr.response?.data?.message ?? 'Impossible de charger les missions.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchMissions();
  }, []);

  // ── Pagination logic ──
  const totalPages = Math.max(1, Math.ceil(missions.length / PAGE_SIZE));
  const paginated = missions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
        <p className="text-sm text-gray-500 font-medium">Chargement des missions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Erreur</h3>
          <p className="text-sm text-rose-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden font-sans text-gray-900">
      {/* Header */}
      <div className="bg-gray-50/50 px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Registre des Missions</h2>
            <p className="text-sm text-gray-500">Historique complet et rentabilité par mission.</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
          Total : <span className="text-gray-900">{missions.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Date</div>
              </th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2"><Truck className="w-4 h-4" /> Véhicule</div>
              </th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2"><User className="w-4 h-4" /> Client</div>
              </th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                <div className="flex items-center justify-end gap-2"><DollarSign className="w-4 h-4" /> Revenus</div>
              </th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                <div className="flex items-center justify-end gap-2"><DollarSign className="w-4 h-4" /> Coûts</div>
              </th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Rentabilité</th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <FileSpreadsheet className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">Aucune mission trouvée</p>
                    <p className="text-xs text-gray-400">Créez votre première mission pour commencer.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((mission) => (
                <tr key={mission.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(mission.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-800 text-xs font-mono font-medium border border-gray-200">
                      {mission.vehicleRegistrationNumber}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900 font-medium whitespace-nowrap">
                    {mission.clientName}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 text-right whitespace-nowrap">
                    {mission.revenues.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600 text-right whitespace-nowrap">
                    {mission.costs.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex flex-col items-end gap-1.5">
                      <div className={`text-sm font-semibold ${mission.profit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {mission.profit > 0 ? '+' : ''}
                        {mission.profit.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                          Marge: {mission.profitMargin?.toFixed(1) ?? '0'}%
                        </span>
                        <StatusBadge score={mission.profitabilityScore} />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center whitespace-nowrap">
                    <StatusBadge status={mission.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-gray-500">
            Page <span className="font-semibold text-gray-700">{currentPage}</span> sur{' '}
            <span className="font-semibold text-gray-700">{totalPages}</span>
            {' '}— {missions.length} missions au total
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-white hover:text-indigo-600 hover:border-indigo-200 border border-transparent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Page précédente"
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
                    onClick={() => setCurrentPage(item)}
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
              aria-label="Page suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
