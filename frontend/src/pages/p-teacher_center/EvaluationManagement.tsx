import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import request from '../../utils/request';
import { getEvaluationsByTeacherId } from '../../utils/api/evaluationApi';

interface Evaluation {
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

const EvaluationManagement: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);

  // Get teacher ID from localStorage
  const getTeacherId = (): string => {
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        return userInfo.teacher_id || userInfo.id || 'T001';
      } catch (error) {
        console.error('解析用户信息失败:', error);
        return 'T001';
      }
    }
    return 'T001';
  };

  useEffect(() => {
    const fetchEvaluations = async () => {
      setIsLoading(true);
      try {
        const teacherId = getTeacherId();
        const teacherEvaluations = await getEvaluationsByTeacherId(teacherId);
        setEvaluations(teacherEvaluations);
        console.log('获取到的评价数据:', teacherEvaluations);
      } catch (error) {
        console.error('获取评价失败:', error);
        setEvaluations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvaluations();
  }, []);

  const filteredEvaluations = evaluations.filter(evaluation => 
    (evaluation.content && evaluation.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
    evaluation.eval_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReply = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setReplyContent('');
    setShowReplyModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseReplyModal = () => {
    setShowReplyModal(false);
    document.body.style.overflow = 'auto';
  };

  const handleSaveReply = async () => {
    if (selectedEvaluation) {
      try {
        // 调用更新评价的API来保存回复
        await request.put(`/api/admin/evaluations/${selectedEvaluation.evaluation_id}`, {
          replied: true,
          content: replyContent
        });
        
        // 更新本地状态
        setEvaluations(prevEvaluations => 
          prevEvaluations.map(evalItem => 
            evalItem.evaluation_id === selectedEvaluation.evaluation_id
              ? { ...evalItem, replied: true, content: replyContent }
              : evalItem
          )
        );
        
        handleCloseReplyModal();
        alert('回复保存成功！');
      } catch (error) {
        console.error('保存回复失败:', error);
        alert('保存回复失败，请稍后重试！');
      }
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 页面头部 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">评价管理</h2>
        <nav className="text-sm text-text-secondary">
          <span>首页</span>
          <i className="fas fa-chevron-right mx-2"></i>
          <span>教师中心</span>
          <i className="fas fa-chevron-right mx-2"></i>
          <span className="text-primary">评价管理</span>
        </nav>
      </div>

      {/* 搜索框 */}
      <div className="mb-6">
        <div className="relative w-full max-w-md">
          <input 
            type="text" 
            placeholder="搜索评价内容或类型..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
          />
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm"></i>
        </div>
      </div>

      {/* 评价列表 */}
      <section>
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">我的评价</h3>
            <div className="text-sm text-text-secondary">
              待回复: {evaluations.filter(evalItem => !evalItem.replied).length} / 总计: {evaluations.length}
            </div>
          </div>
          
          {isLoading ? (
            <div className="animate-pulse">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="mb-4 p-4 border border-border-light rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-12 bg-gray-200 rounded"></div>
                      <div className="h-3 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="h-12 bg-gray-200 rounded mb-3"></div>
                  <div className="flex justify-end">
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredEvaluations.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-star text-5xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 text-lg">暂无评价数据</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvaluations.map((evaluation) => (
                <div key={evaluation.evaluation_id} className="border border-border-light rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <span className="text-sm text-text-secondary font-medium">{evaluation.score}分</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${evaluation.eval_type === '课程评价' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                        {evaluation.eval_type}
                      </span>
                      <span className="text-xs text-text-tertiary">{formatDate(evaluation.eval_time)}</span>
                      {!evaluation.replied && (
                        <span className="px-2 py-1 bg-danger/10 text-danger text-xs rounded-full">
                          待回复
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-text-secondary mb-2">评价内容:</p>
                    <p className="text-text-primary">{evaluation.content || '暂无评价内容'}</p>
                  </div>
                  
                  {evaluation.replied && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center text-sm text-text-tertiary mb-1">
                        <i className="fas fa-reply mr-2"></i>
                        <span>我的回复:</span>
                      </div>
                      <p className="text-sm text-text-primary">已回复</p>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => handleReply(evaluation)}
                      disabled={evaluation.replied}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${evaluation.replied ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90'}`}
                    >
                      <i className={`fas fa-comment ${evaluation.replied ? '' : 'mr-2'}`}></i>
                      {evaluation.replied ? '已回复' : '回复'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 回复评价弹窗 */}
      {showReplyModal && selectedEvaluation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text-primary">回复评价</h3>
              <button 
                onClick={handleCloseReplyModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-text-secondary mb-2">评价信息:</p>
              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center text-warning">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i key={star} className={`fas fa-star ${star <= selectedEvaluation.score ? 'text-warning' : 'text-gray-300'}`}></i>
                    ))}
                  </div>
                  <span className="text-sm text-text-secondary">{formatDate(selectedEvaluation.eval_time)}</span>
                </div>
                <p className="text-sm text-text-primary">{selectedEvaluation.content || '暂无评价内容'}</p>
              </div>
              
              <div>
                <p className="text-sm text-text-secondary mb-2">回复内容:</p>
                <textarea 
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="请输入回复内容..."
                  className="w-full border border-border-light rounded-lg p-3 min-h-[100px]"
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={handleCloseReplyModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button 
                onClick={handleSaveReply}
                disabled={!replyContent.trim()}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${!replyContent.trim() ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90'}`}
              >
                保存回复
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationManagement;
