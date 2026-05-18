import React, { useState, useEffect } from 'react';
import { BarChart3, DollarSign, Truck, Users, AlertTriangle, Loader2, TrendingUp, TrendingDown, Wrench } from 'lucide-react';
import { dashboardApi } from '../services/dashboardApi';
import type { DashboardSummary } from '../types/dashboard.types';
import { ActiveAlertsWidget } from './ActiveAlertsWidget';

const fmt = (val: number) =>
  val.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const summary = await dashboardApi.getSummary();
        setData(summary);
      } catch {
        setError('Impossible de charger le tableau de bord.');
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
        <p className="text-sm text-gray-500 font-medium">Chargement du tableau de bord…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
        <p className="text-sm text-rose-500">{error ?? 'Données indisponibles.'}</p>
      </div>
    );
  }

  const isNetPositive = data.netProfit >= 0;

  const kpis = [
    {
      label: 'Revenus Totaux',
      value: `${fmt(data.totalRevenue)} MAD`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50 border-emerald-100',
      iconBg: 'bg-emerald-100',
    },
    {
      label: 'Coûts Totaux',
      value: `${fmt(data.totalCosts)} MAD`,
      icon: <TrendingDown className="w-5 h-5" />,
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-100',
      iconBg: 'bg-rose-100',
    },
    {
      label: 'Profit Net',
      value: `${isNetPositive ? '+' : ''}${fmt(data.netProfit)} MAD`,
      icon: <DollarSign className="w-5 h-5" />,
      color: isNetPositive ? 'text-indigo-700' : 'text-rose-700',
      bg: isNetPositive ? 'bg-indigo-50 border-indigo-100' : 'bg-rose-50 border-rose-100',
      iconBg: isNetPositive ? 'bg-indigo-100' : 'bg-rose-100',
    },
  ];

  const stats = [
    { label: 'Missions Actives', value: data.activeMissions, icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Véhicules', value: data.totalVehicles, icon: <Truck className="w-4 h-4" /> },
    { label: 'En Maintenance', value: data.vehiclesUnderMaintenance, icon: <Wrench className="w-4 h-4" /> },
    { label: 'Clients', value: data.totalClients, icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`p-5 rounded-xl border ${kpi.bg} flex items-start gap-4`}>
            <div className={`flex-shrink-0 w-11 h-11 rounded-xl ${kpi.iconBg} flex items-center justify-center ${kpi.color}`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{kpi.label}</p>
              <p className={`text-xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Vehicles */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <Truck className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-gray-800">Top 5 Véhicules (Profit)</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {data.topVehicles.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-400 text-center">Aucune donnée.</p>
            ) : (
              data.topVehicles.map((v, i) => (
                <div key={v.vehicleId} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                    <span className="text-sm font-mono font-medium text-gray-800 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">{v.registrationNumber}</span>
                  </div>
                  <span className={`text-sm font-semibold ${v.totalProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {v.totalProfit > 0 ? '+' : ''}{fmt(v.totalProfit)} MAD
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Clients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-gray-800">Top 5 Clients (Revenus)</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {data.topClients.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-400 text-center">Aucune donnée.</p>
            ) : (
              data.topClients.map((c, i) => (
                <div key={c.clientId} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                    <span className="text-sm font-medium text-gray-800">{c.clientName}</span>
                  </div>
                  <span className={`text-sm font-semibold ${c.totalProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {c.totalProfit > 0 ? '+' : ''}{fmt(c.totalProfit)} MAD
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Missions at Loss */}
      {data.missionsAtLoss.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-rose-50/50 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-rose-700">Missions en Perte</h3>
            <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-rose-100 text-rose-600 rounded-full">{data.missionsAtLoss.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="py-2.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Véhicule</th>
                  <th className="py-2.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="py-2.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Revenus</th>
                  <th className="py-2.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Coûts</th>
                  <th className="py-2.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Perte</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.missionsAtLoss.map((m) => (
                  <tr key={m.missionId} className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-3 px-6">
                      <span className="text-xs font-mono font-medium bg-gray-100 px-2 py-0.5 rounded border border-gray-200">{m.vehicleRegistration}</span>
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-900">{m.clientName}</td>
                    <td className="py-3 px-6 text-sm text-gray-600 text-right">{fmt(m.revenues)} MAD</td>
                    <td className="py-3 px-6 text-sm text-gray-600 text-right">{fmt(m.costs)} MAD</td>
                    <td className="py-3 px-6 text-sm font-semibold text-rose-600 text-right">{fmt(m.profit)} MAD</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Alerts Widget */}
      <ActiveAlertsWidget />
    </div>
  );
};

export default DashboardPage;
