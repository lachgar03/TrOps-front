import React from 'react';
import { Clock, Play, CheckCircle2, XCircle, TrendingUp, Minus, TrendingDown } from 'lucide-react';
import { MissionStatus, ProfitabilityScore } from '../types/enums';

interface StatusBadgeProps {
  status?: MissionStatus;
  score?: ProfitabilityScore;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, score }) => {
  if (status) {
    switch (status) {
      case MissionStatus.PLANNED:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="w-3 h-3" />
            Planifiée
          </span>
        );
      case MissionStatus.IN_PROGRESS:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Play className="w-3 h-3" />
            En cours
          </span>
        );
      case MissionStatus.COMPLETED:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Terminée
          </span>
        );
      case MissionStatus.CANCELLED:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" />
            Annulée
          </span>
        );
      default:
        return null;
    }
  }

  if (score) {
    switch (score) {
      case ProfitabilityScore.PROFITABLE:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <TrendingUp className="w-3 h-3" />
            Rentable
          </span>
        );
      case ProfitabilityScore.MEDIUM:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Minus className="w-3 h-3" />
            Moyen
          </span>
        );
      case ProfitabilityScore.LOSS:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <TrendingDown className="w-3 h-3" />
            Perte
          </span>
        );
      default:
        return null;
    }
  }

  return null;
};
