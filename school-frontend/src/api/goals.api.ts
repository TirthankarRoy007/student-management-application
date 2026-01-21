import api from "./axios";

export interface Goal {
  id: string;
  subjectId: string;
  targetType: 'task_count' | 'minutes' | 'mixed';
  targetValue: number;
  currentAmount?: number;
  progressPercentage?: number;
  isVirtual?: boolean;
  subject?: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
}

export interface CreateGoalDTO {
  subjectId: string;
  targetType: 'task_count' | 'minutes';
  targetValue: number;
}

export const getGoals = async (): Promise<Goal[]> => {
  const response = await api.get<Goal[]>("/goals");
  return response.data;
};

export const createGoal = async (data: CreateGoalDTO): Promise<Goal> => {
  const response = await api.post<Goal>("/goals", data);
  return response.data;
};

export const deleteGoal = async (id: string): Promise<void> => {
  await api.delete(`/goals/${id}`);
};

// We will use getActivities from task.api to calculate progress
