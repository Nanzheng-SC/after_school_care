import request from '../request';

// 服务评价接口
export interface Evaluation {
  evaluation_id: string;
  parent_id: string;
  teacher_id: string;
  course_id: string;
  eval_time: string;
  eval_type: string;
  score: number;
  replied: boolean;
  content?: string;
}

// 获取所有评价
export const getAllEvaluations = async (): Promise<Evaluation[]> => {
  const response = await request.get('/api/admin/evaluations');
  return response.data;
};

// 获取单个评价
export const getEvaluationById = async (evaluationId: string): Promise<Evaluation> => {
  const response = await request.get(`/api/admin/evaluations/${evaluationId}`);
  return response.data;
};

// 获取特定家长的评价
export const getEvaluationsByParentId = async (parentId: string): Promise<Evaluation[]> => {
  const response = await request.get(`/api/admin/evaluations/parent/${parentId}`);
  return response.data;
};

// 获取特定教师的评价
export const getEvaluationsByTeacherId = async (teacherId: string): Promise<Evaluation[]> => {
  const response = await request.get(`/api/admin/evaluations/teacher/${teacherId}`);
  return response.data;
};

// 获取特定课程的评价
export const getEvaluationsByCourseId = async (courseId: string): Promise<Evaluation[]> => {
  const response = await request.get(`/api/admin/evaluations/course/${courseId}`);
  return response.data;
};

// 新增评价
export const createEvaluation = async (evaluation: Omit<Evaluation, 'evaluation_id' | 'eval_time'>): Promise<Evaluation> => {
  const response = await request.post('/api/admin/evaluations', evaluation);
  return response.data;
};

// 修改评价
export const updateEvaluation = async (evaluationId: string, evaluation: Partial<Evaluation>): Promise<Evaluation> => {
  const response = await request.put(`/api/admin/evaluations/${evaluationId}`, evaluation);
  return response.data;
};

// 删除评价
export const deleteEvaluation = async (evaluationId: string): Promise<void> => {
  await request.delete(`/api/admin/evaluations/${evaluationId}`);
};