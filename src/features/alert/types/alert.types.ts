// Réexport depuis la source centrale pour ne pas casser les imports existants.
export type { AlertLevel, AlertType } from "../../../common/types/enums";

export interface AlertResponse {
  id: string;
  type: import("../../../common/types/enums").AlertType | string;
  level: import("../../../common/types/enums").AlertLevel | string;
  status: string;
  title: string | null;
  description: string | null;
  referenceId?: string | null;
  createdAt: string;
}
