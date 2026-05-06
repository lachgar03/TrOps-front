import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, CheckCircle2, Loader2, AlertTriangle, Info, X } from 'lucide-react';
import { alertApi } from '../services/alertApi';
import type { AlertResponse, AlertLevel } from '../types/alert.types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LEVEL_CONFIG: Record<
  AlertLevel,
  { label: string; badgeClass: string; dotClass: string; iconClass: string }
> = {
  HIGH: {
    label: 'Critique',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotClass: 'bg-rose-500',
    iconClass: 'text-rose-500',
  },
  MEDIUM: {
    label: 'Modéré',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500',
    iconClass: 'text-amber-500',
  },
  LOW: {
    label: 'Faible',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    dotClass: 'bg-blue-400',
    iconClass: 'text-blue-400',
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

// ─── Component ────────────────────────────────────────────────────────────────

export const AlertDropdown: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertResponse[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resolvingIds, setResolvingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadAlerts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await alertApi.fetchActiveAlerts();
      // Map backend DTO to UI-friendly shape: use title or description as message
      const normalized = data.map((d) => ({
        ...d,
        // prefer title, fallback to description
        title: d.title ?? d.description ?? '',
      }));
      // Sort: HIGH first, then MEDIUM, then LOW
      const order: AlertLevel[] = ['HIGH', 'MEDIUM', 'LOW'];
      normalized.sort((a, b) => order.indexOf(a.level as AlertLevel) - order.indexOf(b.level as AlertLevel));
      setAlerts(normalized);
    } catch {
      setError('Impossible de charger les alertes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load alerts when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => { void loadAlerts(); }, 0);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [isOpen, loadAlerts]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResolve = async (id: string) => {
    setResolvingIds((prev) => new Set(prev).add(id));
    try {
      await alertApi.resolveAlert(id);
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch {
      // Silent fail: keep alert in list
    } finally {
      setResolvingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const hasAlerts = alerts.length > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Ouvrir les alertes"
        aria-expanded={isOpen}
        className="relative p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {/* Unread badge */}
        {hasAlerts && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-semibold text-gray-800">Alertes Actives</span>
              {hasAlerts && (
                <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-rose-100 text-rose-600 rounded-full">
                  {alerts.length}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-105 overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                <p className="text-sm text-gray-400">Chargement des alertes…</p>
              </div>
            ) : error ? (
              <div className="flex items-center gap-3 px-5 py-8 text-sm text-rose-500">
                <Info className="w-5 h-5 shrink-0" />
                {error}
              </div>
            ) : !hasAlerts ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="text-sm font-medium text-gray-700">Aucune alerte active</p>
                <p className="text-xs text-gray-400 text-center">
                  Votre flotte fonctionne sans anomalies détectées.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {alerts.map((alert) => {
                  const config = LEVEL_CONFIG[alert.level as AlertLevel];
                  const isResolving = resolvingIds.has(alert.id);
                  return (
                    <li
                      key={alert.id}
                      className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50/50 transition-colors group"
                    >
                      {/* Level indicator dot */}
                      <span
                        className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${config.dotClass}`}
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 leading-snug">{alert.title ?? alert.description}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border ${config.badgeClass}`}
                          >
                            {config.label}
                          </span>
                            <span className="text-xs text-gray-400">
                              {formatRelativeTime(alert.createdAt)}
                            </span>
                        </div>
                      </div>

                      {/* Resolve button */}
                      <button
                        onClick={() => void handleResolve(alert.id)}
                        disabled={isResolving}
                        aria-label={`Acquitter l'alerte ${alert.id}`}
                        className="shrink-0 p-1.5 rounded-lg text-gray-300 hover:text-emerald-500 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isResolving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          {hasAlerts && (
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/60">
              <p className="text-xs text-gray-400 text-center">
                Cliquez sur <CheckCircle2 className="w-3 h-3 inline-block mx-0.5 text-emerald-500" /> pour acquitter une alerte
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlertDropdown;
