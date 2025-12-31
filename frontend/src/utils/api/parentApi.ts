import request from '../request';

// 家长接口
export interface Parent {
  parent_id: string;
  family_id: string;
  name: string;
  phone: string;
  payment_account: string;
  register_time: string;
  account_status: string;
}

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

// 获取所有家长
export const getAllParents = async (): Promise<Parent[]> => {
  const response = await request.get('/api/admin/parents');
  return response.data;
};

// 获取单个家长
export const getParentById = async (parentId: string): Promise<Parent> => {
  const response = await request.get(`/api/admin/parents/${parentId}`);
  return response.data;
};

// 新增家长
export const createParent = async (parent: Omit<Parent, 'parent_id' | 'register_time' | 'account_status'>): Promise<Parent> => {
  const response = await request.post('/api/admin/parents', parent);
  return response.data;
};

// 修改家长
export const updateParent = async (parentId: string, parent: Partial<Parent>): Promise<Parent> => {
  const response = await request.put(`/api/admin/parents/${parentId}`, parent);
  return response.data;
};

// 删除家长
export const deleteParent = async (parentId: string): Promise<void> => {
  await request.delete(`/api/admin/parents/${parentId}`);
};

// 更新家长账户状态
export const updateParentStatus = async (parentId: string, status: string): Promise<Parent> => {
  const response = await request.patch(`/api/admin/parents/${parentId}/status`, { status });
  return response.data;
};

// 新增子女
export const createYouth = async (parentId: string, youth: Partial<Youth>): Promise<Youth> => {
  const response = await request.post(`/api/parent/${parentId}/youths`, youth);
  return response.data;
};

// 获取单个子女详情
export const getParentYouthById = async (parentId: string, youthId: string): Promise<Youth> => {
  const response = await request.get(`/api/parent/${parentId}/youths/${youthId}`);
  return response.data;
};

// 获取家长的所有子女
export const getParentYouths = async (parentId: string): Promise<Youth[]> => {
  const response = await request.get(`/api/parent/${parentId}/youths`);
  return response.data;
};

// 修改子女信息
export const updateYouth = async (parentId: string, youthId: string, youth: Partial<Youth>): Promise<Youth> => {
  const response = await request.put(`/api/parent/${parentId}/youths/${youthId}`, youth);
  return response.data;
};

// 删除子女信息
export const deleteYouth = async (parentId: string, youthId: string): Promise<void> => {
  await request.delete(`/api/parent/${parentId}/youths/${youthId}`);
};

// 获取所有社区
export const getNeighborhoods = async (parentId: string): Promise<any[]> => {
  const response = await request.get(`/api/parent/${parentId}/neighborhoods`);
  return response.data;
};

// 获取所有课程
export const getCourses = async (parentId: string): Promise<any[]> => {
  const response = await request.get(`/api/parent/${parentId}/courses`);
  return response.data;
};