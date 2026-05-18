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
  | 'HIGH_COST_VEHICLE'
  | 'LOW_PROFIT_CLIENT'
  | 'LOSS_MISSION'
  | 'UPCOMING_MAINTENANCE'
  | 'DOCUMENT_EXPIRATION';

// ─── Maintenance ──────────────────────────────────────────────────────────────

export type MaintenanceStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';

// ─── Expense ─────────────────────────────────────────────────────────────────

export type ExpenseCategory =
  | 'FUEL'
  | 'TOLL'
  | 'MAINTENANCE_PART'
  | 'SALARY'
  | 'INSURANCE_PAYMENT'
  | 'OTHER';

// ─── User ────────────────────────────────────────────────────────────────────

export type UserRole = 'ADMIN' | 'MANAGER' | 'OPERATOR';
