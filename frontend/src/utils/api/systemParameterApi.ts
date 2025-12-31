import request from '../request';

// 系统参数接口
export interface SystemParameter {
  parameter_id: string;
  name: string;
  type: string;
  value: string;
  scope: string;
  effective_time: string;
  version: string;
}

// 获取所有系统参数
export const getAllSystemParameters = async (): Promise<SystemParameter[]> => {
  const response = await request.get('/api/admin/system-parameters');
  return response.data;
};

// 获取单个系统参数
export const getSystemParameterById = async (parameterId: string): Promise<SystemParameter> => {
  const response = await request.get(`/api/admin/system-parameters/${parameterId}`);
  return response.data;
};

// 根据参数名获取系统参数
export const getSystemParameterByName = async (name: string): Promise<SystemParameter> => {
  const response = await request.get(`/api/admin/system-parameters/name/${name}`);
  return response.data;
};

// 根据参数类型获取系统参数
export const getSystemParametersByType = async (type: string): Promise<SystemParameter[]> => {
  const response = await request.get(`/api/admin/system-parameters/type/${type}`);
  return response.data;
};

// 新增系统参数
export const createSystemParameter = async (parameter: Omit<SystemParameter, 'parameter_id' | 'effective_time' | 'version'>): Promise<SystemParameter> => {
  const response = await request.post('/api/admin/system-parameters', parameter);
  return response.data;
};

// 修改系统参数
export const updateSystemParameter = async (parameterId: string, parameter: Partial<SystemParameter>): Promise<SystemParameter> => {
  const response = await request.put(`/api/admin/system-parameters/${parameterId}`, parameter);
  return response.data;
};

// 删除系统参数
export const deleteSystemParameter = async (parameterId: string): Promise<void> => {
  await request.delete(`/api/admin/system-parameters/${parameterId}`);
};