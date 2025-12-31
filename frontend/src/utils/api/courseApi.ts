import request from '../request';

// Course接口从mockData.ts迁移过来
export interface Course {
  course_id: string;
  teacher_id: string;
  neighborhood_id: string;
  name: string;
  type: string;
  age_range: string;
  schedule: string;
  matching_degree?: number; // 匹配度（百分比）
}

// 获取所有课程
export const getAllCourses = async (): Promise<Course[]> => {
  const response = await request.get('/api/course');
  return response.data;
};

// 获取家长的课程列表（包含匹配度）
export const getParentCourses = async (parentId: string): Promise<Course[]> => {
  const response = await request.get(`/api/parent/${parentId}/courses`);
  return response.data;
};

// 获取单个课程
export const getCourseById = async (courseId: string): Promise<Course> => {
  const response = await request.get(`/api/course/${courseId}`);
  return response.data;
};

// 新增课程
export const createCourse = async (course: Omit<Course, 'course_id'>): Promise<Course> => {
  const response = await request.post('/api/admin/course', course);
  return response.data;
};

// 修改课程
export const updateCourse = async (courseId: string, course: Partial<Course>): Promise<Course> => {
  const response = await request.put(`/api/admin/course/${courseId}`, course);
  return response.data;
};

// 删除课程
export const deleteCourse = async (courseId: string): Promise<void> => {
  await request.delete(`/api/admin/course/${courseId}`);
};