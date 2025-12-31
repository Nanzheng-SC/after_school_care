import request from '../request';

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

// 课程接口
export interface Course {
  course_id: string;
  teacher_id: string;
  neighborhood_id: string;
  name: string;
  type: string;
  age_range: string;
  schedule: string;
  location?: string; // 新增location属性
}

// 获取所有教师
export const getAllTeachers = async (): Promise<Teacher[]> => {
  const response = await request.get('/api/admin/teachers');
  return response.data;
};

// 获取单个教师
export const getTeacherById = async (teacherId: string): Promise<Teacher> => {
  const response = await request.get(`/api/admin/teachers/${teacherId}`);
  return response.data;
};

// 获取特定社区的教师
export const getTeachersByNeighborhoodId = async (neighborhoodId: string): Promise<Teacher[]> => {
  const response = await request.get(`/api/admin/teachers/neighborhood/${neighborhoodId}`);
  return response.data;
};

// 获取特定专业的教师
export const getTeachersBySpecialty = async (specialty: string): Promise<Teacher[]> => {
  const response = await request.get(`/api/admin/teachers/specialty/${specialty}`);
  return response.data;
};

// 新增教师
export const createTeacher = async (teacher: Omit<Teacher, 'teacher_id' | 'avg_score'>): Promise<Teacher> => {
  const response = await request.post('/api/admin/teachers', teacher);
  return response.data;
};

// 修改教师
export const updateTeacher = async (teacherId: string, teacher: Partial<Teacher>): Promise<Teacher> => {
  const response = await request.put(`/api/admin/teachers/${teacherId}`, teacher);
  return response.data;
};

// 删除教师
export const deleteTeacher = async (teacherId: string): Promise<void> => {
  await request.delete(`/api/admin/teachers/${teacherId}`);
};

// 获取教师的课程
export const getTeacherCourses = async (teacherId: string): Promise<Course[]> => {
  const response = await request.get(`/api/teacher/${teacherId}/courses`);
  return response.data;
};

// 获取学生匹配数据
export const getStudentMatches = async (teacherId: string): Promise<any[]> => {
  const response = await request.get(`/api/teacher/${teacherId}/student-matches`);
  return response.data;
};

// 教师匹配接口
export interface TeacherMatching {
  matching_id: string;
  teacher_id: string;
  youth_id: string;
  youth_name: string;
  youth_age: number;
  parent_name: string;
  match_score: number;
  match_basis: string;
  match_time: string;
  status: string;
}

// 获取教师的匹配信息
export const getTeacherMatchingsByTeacherId = async (teacherId: string): Promise<TeacherMatching[]> => {
  const response = await request.get(`/api/teacher/${teacherId}/matchings`);
  return response.data;
};