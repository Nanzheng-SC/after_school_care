import request from '../request';

// 社区接口
export interface Neighborhood {
  neighborhood_id: string;
  name: string;
  district: string;
  contact: string;
  address: string;
  facility: string;
  service_scope: string;
}

// 获取所有社区
export const getAllNeighborhoods = async (): Promise<Neighborhood[]> => {
  const response = await request.get('/api/admin/neighborhood');
  return response.data;
};

// 新增社区
export const createNeighborhood = async (neighborhood: Omit<Neighborhood, 'neighborhood_id'>): Promise<Neighborhood> => {
  const response = await request.post('/api/admin/neighborhood', neighborhood);
  return response.data;
};

// 修改社区
export const updateNeighborhood = async (neighborhoodId: string, neighborhood: Partial<Neighborhood>): Promise<Neighborhood> => {
  const response = await request.put(`/api/admin/neighborhood/${neighborhoodId}`, neighborhood);
  return response.data;
};

// 删除社区
export const deleteNeighborhood = async (neighborhoodId: string): Promise<void> => {
  await request.delete(`/api/admin/neighborhood/${neighborhoodId}`);
};