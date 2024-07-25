import { Goal, Task, User } from "../../types";

export const mockTasks: Task[] = [
  {
    id: 1,
    description: "Plan a family trip",
    deadline: new Date("2024-05-30"),
    belongsToId: "123-abc",
    status: "COMPLETED",
    percentageCompleted: 0,
    priority: "HIGH",
    relatedGoalId: 1,
    category: "FAMILY_AND_FRIENDS",
  },
  {
    id: 2,
    description: "Do course on LLMs",
    deadline: new Date("2024-05-30"),
    belongsToId: "123-abc",
    status: "IN_PROGRESS",
    percentageCompleted: 50,
    priority: "HIGH",
    relatedGoalId: 1,
    category: "CAREER",
  },
  {
    id: 3,
    description: "Go to the gym 3 times a week",
    deadline: new Date("2024-05-30"),
    belongsToId: "123-abc",
    status: "TO_DO",
    percentageCompleted: 0,
    priority: "HIGH",
    relatedGoalId: 1,
    category: "HEALTH_AND_WELLNESS",
  },
];

export const mockGoals: Goal[] = [
  {
    id: 1,
    description: "Organize summer vacation",
    month: 5,
    year: 2024,
    belongsToId: "123-abc",
    tasks: [],
    category: "FAMILY_AND_FRIENDS",
    status: "ACHIEVED",
  },
  {
    id: 2,
    description: "Learn about LLMs",
    month: 5,
    year: 2024,
    belongsToId: "123-abc",
    tasks: [],
    category: "CAREER",
    status: "IN_PROGRESS",
  },
  {
    id: 3,
    description: "Healthier habits",
    month: 5,
    year: 2024,
    belongsToId: "123-abc",
    tasks: [],
    category: "HEALTH_AND_WELLNESS",
    status: "NEEDS_IMPROVEMENT",
  },
];

export const mockUser: User = {
  id: "1fmnsdflsfsd",
  createdAt: new Date("2024-04-01"),
  email: "user@email.com",
  name: "user name",
  password: "wdlkfdf516546f#kdjf",
  tasks: mockTasks,
  goals: mockGoals,
  progress: [],
};
