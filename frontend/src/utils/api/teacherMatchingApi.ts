import request from '../request';

// 师资匹配接口
export interface TeacherMatching {
  match_id: string;
  youth_id: string;
  teacher_id: string;
  match_time: string;
  algorithm_version: string;
  match_score: number;
  match_basis: string;
}

// 获取所有师资匹配记录
export const getAllTeacherMatchings = async (): Promise<TeacherMatching[]> => {
  const response = await request.get('/api/admin/teacher-matchings');
  return response.data;
};

// 获取单个师资匹配记录
export const getTeacherMatchingById = async (matchId: string): Promise<TeacherMatching> => {
  const response = await request.get(`/api/admin/teacher-matchings/${matchId}`);
  return response.data;
};

// 获取特定学生的师资匹配记录
export const getTeacherMatchingsByYouthId = async (youthId: string): Promise<TeacherMatching[]> => {
  const response = await request.get(`/api/admin/teacher-matchings/youth/${youthId}`);
  return response.data;
};

// 获取特定教师的师资匹配记录
export const getTeacherMatchingsByTeacherId = async (teacherId: string): Promise<TeacherMatching[]> => {
  const response = await request.get(`/api/teacher/${teacherId}/student-matches`);
  return response.data;
};

// 获取教师的所有课程
export const getTeacherCourses = async (teacherId: string): Promise<any[]> => {
  const response = await request.get(`/api/teacher/${teacherId}/courses`);
  return response.data;
};

// 新增师资匹配记录
export const createTeacherMatching = async (matching: Omit<TeacherMatching, 'match_id' | 'match_time' | 'algorithm_version'>): Promise<TeacherMatching> => {
  const response = await request.post('/api/admin/teacher-matchings', matching);
  return response.data;
};

// 删除师资匹配记录
export const deleteTeacherMatching = async (matchId: string): Promise<void> => {
  await request.delete(`/api/admin/teacher-matchings/${matchId}`);
};