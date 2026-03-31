export interface Team {
  id: string;
  name: string;
  playerIds: [string, string];
  notes?: string;
  roles?: string;
  strengths?: string;
  weaknesses?: string;
  isActive?: boolean;
  createdAt: string;
}
