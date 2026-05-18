import React, { useState, useEffect } from 'react';
import { Truck, Loader2, AlertCircle, ChevronDown, TrendingUp, TrendingDown, Minus, Wrench, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { vehicleApi } from '../services/vehicleApi';
import type { VehicleResponse, VehicleFinancialSummary } from '../types/vehicle.types';

const PAGE_SIZE = 10;

// ─── Sub-component: Financial Summary Panel ────────────────────────────────────

interface FinancialPanelProps {
  vehicleId: string;
}

const FinancialPanel: React.FC<FinancialPanelProps> = ({ vehicleId }) => {
  const [summary, setSummary] = useState<VehicleFinancialSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await vehicleApi.fetchVehicleFinancialSummary(vehicleId);
        if (!cancelled) setSummary(data);
      } catch {
        if (!cancelled) setError('Impossible de charger les données financières.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [vehicleId]);

  const fmt = (val: number) =>
    val.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-6 bg-indigo-50/40">
        <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
        <span className="text-sm text-gray-500">Chargement du bilan financier…</span>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="flex items-center gap-2 py-6 px-6 bg-rose-50/40">
        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
        <span className="text-sm text-rose-600">{error ?? 'Données indisponibles.'}</span>
      </div>
    );
  }

  const isProfit = summary.totalProfit >= 0;

  const stats: { label: string; value: string; icon: React.ReactNode; color: string; bg: string }[] = [
    {
      label: 'Revenus totaux',
      value: `${fmt(summary.totalRevenues)} MAD`,
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50 border-emerald-100',
    },
    {
      label: 'Coûts totaux',
      value: `${fmt(summary.totalCosts)} MAD`,
      icon: <TrendingDown className="w-4 h-4" />,
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-100',
    },
    {
      label: 'Profit net',
      value: `${isProfit ? '+' : ''}${fmt(summary.totalProfit)} MAD`,
      icon: <Minus className="w-4 h-4" />,
      color: isProfit ? 'text-indigo-700' : 'text-rose-700',
      bg: isProfit ? 'bg-indigo-50 border-indigo-100' : 'bg-rose-50 border-rose-100',
    },
  ];

  return (
    <div className="px-6 py-4 bg-gray-50/60 border-t border-gray-100">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Bilan Financier Agrégé
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`flex items-start gap-3 p-3 rounded-xl border ${stat.bg}`}
          >
            <div className={`mt-0.5 ${stat.color}`}>{stat.icon}</div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              <p className={`text-sm font-bold mt-0.5 ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

export const VehicleList: React.FC = () => {
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      try {
        const data = await vehicleApi.fetchVehicles(currentPage - 1, PAGE_SIZE);
        setVehicles(data.content || []);
        setTotalPages(data.totalPages || 1);
        setTotalElements(data.totalElements || 0);
      } catch {
        setError('Impossible de charger la flotte.');
      } finally {
        setIsLoading(false);
      }
    };
    void fetchVehicles();
  }, [currentPage]);

  const toggleRow = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (isLoading && vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
        <p className="text-sm text-gray-500 font-medium">Chargement de la flotte…</p>
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
      {/* Card Header */}
      <div className="bg-gray-50/50 px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50">
            <Truck className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Gestion de la Flotte</h2>
            <p className="text-sm text-gray-500">Cliquez sur une ligne pour afficher le bilan financier.</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
          Total : <span className="text-gray-900">{totalElements}</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-8" />
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Immatriculation
              </th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                Statut
              </th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-12 text-center text-gray-500 text-sm">
                  Aucun véhicule trouvé. Ajoutez un véhicule à votre flotte.
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => {
                const isExpanded = expandedId === vehicle.id;
                return (
                  <React.Fragment key={vehicle.id}>
                    {/* Main Row */}
                    <tr
                      onClick={() => toggleRow(vehicle.id)}
                      className={`cursor-pointer transition-colors border-b border-gray-50 ${
                        isExpanded
                          ? 'bg-indigo-50/40 border-indigo-100'
                          : 'hover:bg-gray-50/60'
                      }`}
                    >
                      {/* Expand chevron */}
                      <td className="py-4 pl-6 pr-2 w-8">
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-indigo-500' : ''
                          }`}
                        />
                      </td>

                      {/* Registration */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-800 text-xs font-mono font-medium border border-gray-200">
                            {vehicle.registrationNumber}
                          </span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        {vehicle.isUnderMaintenance ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Wrench className="w-3 h-3" />
                            En maintenance
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            En service
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* Expandable Financial Row */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={3} className="p-0">
                          <FinancialPanel vehicleId={vehicle.id} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
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
            {' '}— {totalElements} véhicules au total
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

export default VehicleList;
