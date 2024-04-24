export interface Task {
  id: number;
  description: string;
  deadline: Date;
  belongsToId: string;
  status: string;
  percentageCompleted?: number | null;
  priority: string;
  relatedGoalId?: number | null;
  category?: string | null;
}

export interface Goal {
  id: number;
  description: string;
  month: number;
  year: number;
  belongsToId: string;
  tasks: Task[];
  category: string;
  status?: string;
}
