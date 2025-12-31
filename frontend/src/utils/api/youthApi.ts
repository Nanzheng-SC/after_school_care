import request from '../request';

// 青少年接口
export interface Youth {
  youth_id: string;
  family_id: string;
  name: string;
  age: number;
  health_note: string;
  interest: string;
  learning_style: string;
}

// 教师接口
export interface Teacher {
  teacher_id: string;
  neighborhood_id: string;
  name: string;
  certificate: string;
  specialty: string;
  teaching_style: string;
  available_time: string;
  avg_score: number;
}

// 获取所有学生
export const getAllYouths = async (): Promise<Youth[]> => {
  const response = await request.get('/api/admin/youth');
  return response.data;
};

// 获取单个学生
export const getYouthById = async (youthId: string): Promise<Youth> => {
  const response = await request.get(`/api/admin/youth/${youthId}`);
  return response.data;
};

// 新增学生
export const createYouth = async (youth: Omit<Youth, 'youth_id'>): Promise<Youth> => {
  const response = await request.post('/api/admin/youth', youth);
  return response.data;
};

// 修改学生
export const updateYouth = async (youthId: string, youth: Partial<Youth>): Promise<Youth> => {
  const response = await request.put(`/api/admin/youth/${youthId}`, youth);
  return response.data;
};

// 删除学生
export const deleteYouth = async (youthId: string): Promise<void> => {
  await request.delete(`/api/admin/youth/${youthId}`);
};

// 获取学生匹配的老师
export const getYouthMatchingTeachers = async (youthId: string): Promise<Teacher[]> => {
  const response = await request.get(`/api/youth/${youthId}/matching`);
  return response.data;
};