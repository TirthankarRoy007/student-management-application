import api from "./axios";

export interface Task {
  id: string;
  subjectId: string;
  title: string;
  description?: string;
  estimatedMinutes?: number;
  dueDate?: number;
  status: 'pending' | 'completed' | 'skipped';
  subject?: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
  createdAt?: number;
  updatedAt?: number;
}

export interface CreateTaskDTO {
  subjectId: string;
  title: string;
  description?: string;
  estimatedMinutes?: number;
  dueDate?: number;
}

export interface TaskActivity {
  subjectId: string;
  taskId?: string;
  activityType: 'task_completed' | 'manual_log' | 'revision';
  minutesSpent: number;
  activityDate: number;
  activityTime: number;
}

export const getTasks = async (filters?: { subjectId?: string; status?: string }): Promise<Task[]> => {
  const params = new URLSearchParams();
  if (filters?.subjectId) params.append("subjectId", filters.subjectId);
  if (filters?.status) params.append("status", filters.status);
  
  const response = await api.get<Task[]>(`/tasks?${params.toString()}`);
  return response.data;
};

export const createTask = async (data: CreateTaskDTO): Promise<Task> => {
  const response = await api.post<Task>("/tasks", data);
  return response.data;
};

export const updateTask = async (id: string, data: Partial<Task>): Promise<Task> => {
  const response = await api.put<Task>(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

export const logActivity = async (data: TaskActivity): Promise<any> => {
  const response = await api.post("/activities", data);
  return response.data;
};

export const getActivities = async (filters?: { startDate?: number; endDate?: number; subjectId?: string }): Promise<TaskActivity[]> => {
  const params = new URLSearchParams();
  if (filters?.startDate) params.append("startDate", filters.startDate.toString());
  if (filters?.endDate) params.append("endDate", filters.endDate.toString());
  if (filters?.subjectId) params.append("subjectId", filters.subjectId);

  const response = await api.get<TaskActivity[]>(`/activities?${params.toString()}`);
  return response.data;
};