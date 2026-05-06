/**
 * Centralisation de tous les enums/unions partagés du Design System TrOps.
 * Les features importent depuis ici pour éviter les couplages inversés.
 */

// ─── Mission ──────────────────────────────────────────────────────────────────

export const MissionStatus = {
  PLANNED: 'PLANNED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type MissionStatus = (typeof MissionStatus)[keyof typeof MissionStatus];

export const ProfitabilityScore = {
  PROFITABLE: 'PROFITABLE',
  MEDIUM: 'MEDIUM',
  LOSS: 'LOSS',
} as const;

export type ProfitabilityScore = (typeof ProfitabilityScore)[keyof typeof ProfitabilityScore];

// ─── Alert ───────────────────────────────────────────────────────────────────

export type AlertLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type AlertType =
  | 'MAINTENANCE'
  | 'FUEL'
  | 'INSURANCE'
  | 'DRIVER'
  | 'FINANCIAL'
  | 'SYSTEM';
