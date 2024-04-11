export interface Task {
  id: number;
  description: string;
  deadline: string;
  belongsToId: string;
  status: string;
  percentageCompleted?: number | null;
  priority: string;
  relatedGoalId?: number | null;
  category?: string | null;
}
