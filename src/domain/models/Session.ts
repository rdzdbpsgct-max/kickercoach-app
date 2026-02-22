export interface Session {
  id: string;
  name: string;
  date: string;
  drillIds: string[];
  notes: string;
  totalDuration: number;
}
