import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, Loader2, AlertTriangle, Info } from 'lucide-react';
import { alertApi } from '../../alert/services/alertApi';
import type { AlertResponse, AlertLevel } from '../../alert/types/alert.types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LEVEL_CONFIG: Record<
  AlertLevel,
  {
    label: string;
    rowBorder: string;
    badgeClass: string;
    iconColor: string;
    dotClass: string;
  }
> = {
  HIGH: {
    label: 'Critique',
    rowBorder: 'border-l-rose-500',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    iconColor: 'text-rose-500',
    dotClass: 'bg-rose-500',
  },
  MEDIUM: {
    label: 'Modéré',
    rowBorder: 'border-l-amber-500',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    iconColor: 'text-amber-500',
    dotClass: 'bg-amber-400',
  },
  LOW: {
    label: 'Faible',
    rowBorder: 'border-l-blue-400',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    iconColor: 'text-blue-400',
    dotClass: 'bg-blue-400',
  },
};

const formatRelativeTime = (isoString: string): string => {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  return `Il y a ${Math.floor(hours / 24)} j`;
};

const sortByLevel = (alerts: AlertResponse[]): AlertResponse[] => {
  const order: AlertLevel[] = ['HIGH', 'MEDIUM', 'LOW'];
  return [...alerts].sort((a, b) => order.indexOf(a.level) - order.indexOf(b.level));
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-10 px-6 gap-3">
    <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
      <CheckCircle2 className="w-7 h-7 text-emerald-500" />
    </div>
    <div className="text-center">
      <p className="text-sm font-semibold text-gray-800">Flotte en bonne santé</p>
      <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
        Aucune alerte active. Votre flotte est à jour et opérationnelle.
      </p>
    </div>
  </div>
);

// ─── Alert Row ────────────────────────────────────────────────────────────────

interface AlertRowProps {
  alert: AlertResponse;
}

const AlertRow: React.FC<AlertRowProps> = ({ alert }) => {
  const config = LEVEL_CONFIG[alert.level];
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border border-gray-100 border-l-4 bg-white hover:shadow-sm transition-shadow ${config.rowBorder}`}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 mt-0.5 ${config.iconColor}`}>
        <AlertTriangle className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 font-medium leading-snug line-clamp-2">
          {alert.message}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md border ${config.badgeClass}`}
          >
            {config.label}
          </span>
          <span className="text-xs text-gray-400">{alert.type}</span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-400">{formatRelativeTime(alert.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Widget ───────────────────────────────────────────────────────────────────

export const ActiveAlertsWidget: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await alertApi.fetchActiveAlerts();
        // Take the top 5 most critical
        setAlerts(sortByLevel(data).slice(0, 5));
      } catch {
        setError("Impossible de charger les alertes.");
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-50">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Alertes Critiques</h2>
            <p className="text-xs text-gray-400 mt-0.5">Top 5 des alertes les plus urgentes</p>
          </div>
        </div>
        {!isLoading && !error && alerts.length > 0 && (
          <span className="px-2.5 py-1 text-xs font-bold bg-rose-100 text-rose-600 rounded-full">
            {alerts.length} active{alerts.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
            <p className="text-sm text-gray-400">Analyse des alertes en cours…</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 py-6 text-sm text-rose-500">
            <Info className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        ) : alerts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <AlertRow key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveAlertsWidget;
