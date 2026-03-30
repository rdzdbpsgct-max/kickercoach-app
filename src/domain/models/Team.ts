export interface Team {
  id: string;
  name: string;
  playerIds: [string, string];
  notes?: string;
  createdAt: string;
}
