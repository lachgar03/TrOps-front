import React, { useState, useMemo } from 'react';
import { missionApi } from '../services/missionApi';
import type { MissionRequest } from '../types/mission.types';
import { Truck, Users, DollarSign, Loader2, CheckCircle2, AlertCircle, TrendingUp, TrendingDown, ClipboardList } from 'lucide-react';

// Mocks temporaires en attendant les modules Flotte et Clients
const MOCK_VEHICLES = [
  { id: 'v1-uuid', registration: 'AB-123-CD' },
  { id: 'v2-uuid', registration: 'EF-456-GH' },
  { id: 'v3-uuid', registration: 'XY-999-ZZ' },
];

const MOCK_CLIENTS = [
  { id: 'c1-uuid', name: 'Logistics Corp' },
  { id: 'c2-uuid', name: 'Express Delivery' },
  { id: 'c3-uuid', name: 'Global Freight' },
];

export const MissionCreateForm: React.FC = () => {
  const [formData, setFormData] = useState<MissionRequest>({
    vehicleId: '',
    clientId: '',
    revenues: 0,
    costs: 0,
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calcul du profit en temps réel
  const profit = useMemo(() => {
    return Number(formData.revenues) - Number(formData.costs);
  }, [formData.revenues, formData.costs]);

  const isProfitPositive = profit >= 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'revenues' || name === 'costs' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage(null);

    try {
      await missionApi.createMission(formData);
      setStatus('success');
      // Réinitialiser le formulaire après succès
      setFormData({ vehicleId: '', clientId: '', revenues: 0, costs: 0 });
      
      // Retour à l'état initial après 3 secondes
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.response?.data?.message || 'Erreur lors de la création de la mission.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden font-sans text-gray-900">
      <div className="bg-gray-50/50 px-6 py-5 border-b border-gray-100 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50">
          <ClipboardList className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Nouvelle Mission</h2>
          <p className="text-sm text-gray-500">Planifiez et assignez une nouvelle mission de transport.</p>
        </div>
      </div>

      <div className="p-6">
        {status === 'success' && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-700 font-medium">Mission créée avec succès !</p>
          </div>
        )}

        {status === 'error' && errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 font-medium">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Sélection du Véhicule */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Véhicule assigné</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Truck className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="vehicleId"
                  required
                  value={formData.vehicleId}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-white text-sm appearance-none"
                >
                  <option value="" disabled>Sélectionner un véhicule...</option>
                  {MOCK_VEHICLES.map((v) => (
                    <option key={v.id} value={v.id}>{v.registration}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sélection du Client */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Client</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="clientId"
                  required
                  value={formData.clientId}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-white text-sm appearance-none"
                >
                  <option value="" disabled>Sélectionner un client...</option>
                  {MOCK_CLIENTS.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Revenus */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Revenus prévus (MAD)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="revenues"
                  min="0"
                  step="0.01"
                  required
                  value={formData.revenues || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-white text-sm font-medium"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Coûts */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Coûts estimés (MAD)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="costs"
                  min="0"
                  step="0.01"
                  required
                  value={formData.costs || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none bg-white text-sm font-medium"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Insight-Driven UI: Encart Profit Temps Réel */}
          <div className={`mt-6 p-5 rounded-xl border transition-colors duration-300 flex items-center justify-between ${
            isProfitPositive 
              ? 'bg-emerald-50 border-emerald-100' 
              : 'bg-rose-50 border-rose-100'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                isProfitPositive ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
              }`}>
                {isProfitPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </div>
              <div>
                <p className={`text-sm font-semibold ${isProfitPositive ? 'text-emerald-800' : 'text-rose-800'}`}>
                  Profit Estimé
                </p>
                <p className={`text-xs ${isProfitPositive ? 'text-emerald-600/80' : 'text-rose-600/80'}`}>
                  Calculé automatiquement avant soumission
                </p>
              </div>
            </div>
            <div className={`text-2xl font-bold tracking-tight ${isProfitPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
              {profit > 0 ? '+' : ''}{profit.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="py-2.5 px-6 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-600/20 text-white font-medium text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Création...</span>
                </>
              ) : (
                <span>Créer la mission</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
