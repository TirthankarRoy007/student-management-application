import api from "./axios";

export interface Subject {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface SubjectsResponse {
  count: number;
  rows: Subject[];
}

export const getSubjects = async (): Promise<SubjectsResponse> => {
  const response = await api.get<SubjectsResponse>("/subjects");
  return response.data;
};

export const createSubject = async (subject: { name: string; color?: string; icon?: string }): Promise<Subject> => {
    const response = await api.post<Subject>("/subjects", subject);
    return response.data;
};

export const updateSubject = async (id: string, subject: { name?: string; color?: string; icon?: string }): Promise<Subject> => {
    const response = await api.put<Subject>(`/subjects/${id}`, subject);
    return response.data;
}

export const deleteSubject = async (id: string): Promise<void> => {
    await api.delete(`/subjects/${id}`);
}

export const enrollSubject = async (studentId: string, subjectId: string): Promise<void> => {
    await api.post(`/students/${studentId}/subjects`, { subjectId });
}

export const getStudentSubjects = async (studentId: string): Promise<any[]> => { // Using any[] for now as UserSubject structure might vary, ideally UserSubject interface
    const response = await api.get(`/students/${studentId}/subjects`);
    return response.data;
}

