import React, { useEffect, useState } from 'react';
import { missionApi } from '../services/missionApi';
import type { MissionResponse } from '../types/mission.types';
import { FileSpreadsheet, Loader2, TrendingUp, TrendingDown, Calendar, Truck, User, DollarSign, AlertCircle } from 'lucide-react';

export const MissionList: React.FC = () => {
  const [missions, setMissions] = useState<MissionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const data = await missionApi.getMissions();
        setMissions(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Impossible de charger les missions.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMissions();
  }, []);

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
        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Erreur</h3>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden font-sans text-gray-900">
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
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Profit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {missions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-500 text-sm">
                  Aucune mission trouvée. Créez-en une pour commencer.
                </td>
              </tr>
            ) : (
              missions.map((mission) => {
                const isProfitPositive = mission.profit >= 0;
                
                return (
                  <tr key={mission.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(mission.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-800 text-xs font-mono font-medium border border-gray-200">
                          {mission.vehicleRegistrationNumber}
                        </span>
                      </div>
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
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        isProfitPositive 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {isProfitPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {mission.profit > 0 ? '+' : ''}{mission.profit.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
