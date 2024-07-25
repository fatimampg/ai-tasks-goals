export interface User {
  id: string;
  createdAt: Date;
  email: string;
  name: string;
  password: string;
  tasks: Task[];
  goals: Goal[];
  progress: Progress[];
}
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

export interface AddTasksParams {
  description: string;
  priority: string;
  category: string;
  deadline: Date;
}
export interface AddGoalsParams {
  description: string;
  month: number;
  year: number;
  category: string;
}
export interface FetchGoalsParams {
  month: number;
  year: number;
}
export interface FetchTasksParams {
  gte: Date;
  lte: Date;
}

export interface Entry {
  content: {
    tasks: Task[];
    goals: Goal[];
  };
}

export interface GoalStatusUpdate {
  id: number;
  status: "ACHIEVED" | "IN_PROGRESS" | "NEEDS_IMPROVEMENT";
}

export interface Progress {
  id: number;
  month: number;
  year: number;
  summary: string;
  recommendations: string;
  progressBelongsToId: string;
}
