

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';
import request from '../../utils/request';

interface Reply {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: 'admin' | 'teacher';
  content: string;
  time: string;
}

// 后端回复数据接口
interface ReplyData {
  reply_id: string;
  author_type: 'admin' | 'teacher';
  content: string;
  reply_date: string;
}

interface Evaluation {
  id: string;
  evaluatorName: string;
  evaluatorAvatar: string;
  rating: number;
  ratingScore: string;
  courseName: string;
  teacherName: string;
  evaluationTime: string;
  status: string;
  statusClass: string;
  reviewTime: string;
  content: string;
  replies: Reply[];
}

const EvaluationView: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [evaluationData, setEvaluationData] = useState<Evaluation | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '评价详情 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);



  // 加载评价数据
  useEffect(() => {
    const fetchEvaluationData = async () => {
      try {
        setIsLoading(true);
        // 根据对接文档，评价接口是 /api/evaluation/:evaluationId
        const evaluationId = searchParams.get('evaluationId') || 'eval1';
        const response = await request.get(`/api/evaluation/${evaluationId}`);
        const evaluation = response.data;
        
        if (evaluation) {
          // 将后端数据映射到前端Evaluation接口
          const formattedEvaluation: Evaluation = {
            id: evaluation.evaluation_id || evaluationId,
            evaluatorName: evaluation.parent_name || '未知家长',
            evaluatorAvatar: 'https://s.coze.cn/image/o6gKpS4lb08/', // 后端可能没有提供头像
            rating: evaluation.score || 0,
            ratingScore: `${evaluation.score || 0}.0`,
            courseName: evaluation.course_name || '未知课程',
            teacherName: evaluation.teacher_name || '未知教师',
            evaluationTime: evaluation.evaluation_date || new Date().toLocaleString('zh-CN'),
            status: evaluation.status === 1 ? '已通过' : '未通过',
            statusClass: evaluation.status === 1 ? 'success' : 'warning',
            reviewTime: evaluation.review_date || '',
            content: evaluation.content || '',
            replies: (evaluation.replies || []).map((reply: ReplyData) => ({
              id: reply.reply_id || `reply-${Date.now()}`,
              authorName: reply.author_type === 'admin' ? '管理员' : '教师',
              authorAvatar: reply.author_type === 'admin' ? 'https://s.coze.cn/image/oc665RKjxlc/' : 'https://s.coze.cn/image/i5xEHuTJxCk/',
              authorRole: reply.author_type === 'admin' ? 'admin' : 'teacher',
              content: reply.content || '',
              time: reply.reply_date || new Date().toLocaleString('zh-CN')
            }))
          };
          setEvaluationData(formattedEvaluation);
        }
      } catch (error) {
        console.error('获取评价数据失败:', error);
        // 保留评价数据为空的状态，不使用虚拟数据
        setEvaluationData(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvaluationData();
  }, [searchParams]);

  // 关闭抽屉
  const handleCloseDrawer = () => {
    navigate(-1);
  };

  // 点击遮罩层关闭抽屉
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      navigate(-1);
    }
  };

  // 处理回复输入
  const handleReplyInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setReplyContent(value);
    }
  };

  // 提交回复
  const handleSubmitReply = async () => {
    const content = replyContent.trim();
    
    if (!content) {
      alert('请输入回复内容');
      return;
    }
    
    if (content.length > 500) {
      alert('回复内容不能超过500字');
      return;
    }
    
    try {
      // 调用后端API提交回复
      await request.post(`/api/evaluation/${evaluationData?.id}/reply`, {
        content: content,
        author_type: 'admin' // 假设当前登录用户是管理员
      });
      
      // 重新获取评价数据以更新回复列表
      const response = await request.get(`/api/evaluation/${evaluationData?.id}`);
      const updatedEvaluation = response.data;
      
      if (updatedEvaluation) {
        // 格式化并更新评价数据
        const formattedEvaluation: Evaluation = {
          id: updatedEvaluation.evaluation_id || evaluationData?.id || '',
          evaluatorName: updatedEvaluation.parent_name || '未知家长',
          evaluatorAvatar: 'https://s.coze.cn/image/o6gKpS4lb08/',
          rating: updatedEvaluation.score || 0,
          ratingScore: `${updatedEvaluation.score || 0}.0`,
          courseName: updatedEvaluation.course_name || '未知课程',
          teacherName: updatedEvaluation.teacher_name || '未知教师',
          evaluationTime: updatedEvaluation.evaluation_date || new Date().toLocaleString('zh-CN'),
          status: updatedEvaluation.status === 1 ? '已通过' : '未通过',
          statusClass: updatedEvaluation.status === 1 ? 'success' : 'warning',
          reviewTime: updatedEvaluation.review_date || '',
          content: updatedEvaluation.content || '',
          replies: (updatedEvaluation.replies || []).map((reply: ReplyData) => ({
            id: reply.reply_id || `reply-${Date.now()}`,
            authorName: reply.author_type === 'admin' ? '管理员' : '教师',
            authorAvatar: reply.author_type === 'admin' ? 'https://s.coze.cn/image/oc665RKjxlc/' : 'https://s.coze.cn/image/i5xEHuTJxCk/',
            authorRole: reply.author_type === 'admin' ? 'admin' : 'teacher',
            content: reply.content || '',
            time: reply.reply_date || new Date().toLocaleString('zh-CN')
          }))
        };
        setEvaluationData(formattedEvaluation);
      }
      
      // 清空输入框
      setReplyContent('');
      
      // 显示成功提示
      alert('回复提交成功！');
    } catch (error) {
      console.error('提交回复失败:', error);
      alert('提交回复失败，请稍后重试');
    }
  };

  // 处理Enter键提交
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitReply();
    }
  };

  // 处理ESC键关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate(-1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  // 直接显示分数
  const renderScore = (rating: number) => {
    return `${rating}.0`;
  };

  if (isLoading || !evaluationData) {
    return (
      <div className={styles.pageWrapper}>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="text-white text-lg">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {/* 抽屉遮罩层 */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${styles.drawerOverlay}`}
        onClick={handleOverlayClick}
      >
        {/* 评价详情抽屉 */}
        <div className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-drawer ${styles.drawerPanel}`}>
          {/* 抽屉头部 */}
          <div className="flex items-center justify-between p-6 border-b border-border-light">
            <h2 className="text-xl font-bold text-text-primary">评价详情</h2>
            <button 
              onClick={handleCloseDrawer}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-times text-text-secondary"></i>
            </button>
          </div>
          
          {/* 抽屉内容 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 评价基本信息 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={evaluationData.evaluatorAvatar}
                  alt="评价者头像" 
                  className="w-12 h-12 rounded-full"
                  data-category="人物"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">{evaluationData.evaluatorName}</h3>
                  <p className="text-sm text-text-secondary">{evaluationData.evaluationTime}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-lg font-bold text-text-primary">{evaluationData.ratingScore}</span>
                </div>
              </div>
              
              {/* 课程和教师信息 */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-book text-primary w-5"></i>
                  <div>
                    <p className="text-sm text-text-secondary">课程</p>
                    <p className="font-medium text-text-primary">{evaluationData.courseName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-chalkboard-teacher text-success w-5"></i>
                  <div>
                    <p className="text-sm text-text-secondary">教师</p>
                    <p className="font-medium text-text-primary">{evaluationData.teacherName}</p>
                  </div>
                </div>
              </div>
              
              {/* 评价状态 */}
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 bg-${evaluationData.statusClass}/10 text-${evaluationData.statusClass} text-xs font-medium rounded-full`}>
                  {evaluationData.status}
                </span>
                <span className="text-sm text-text-secondary">审核时间：{evaluationData.reviewTime}</span>
              </div>
            </div>
            
            {/* 评价内容 */}
            <div className="space-y-3">
              <h3 className="font-semibold text-text-primary">评价内容</h3>
              <div className="bg-white border border-border-light rounded-lg p-4">
                <p className="text-text-primary leading-relaxed">
                  {evaluationData.content}
                </p>
              </div>
            </div>
            
            {/* 回复列表 */}
            <div className="space-y-3">
              <h3 className="font-semibold text-text-primary">回复</h3>
              <div className="space-y-4">
                {evaluationData.replies.map((reply) => (
                  <div key={reply.id} className={`${styles.replyItem} ${styles[reply.authorRole]}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <img 
                        src={reply.authorAvatar}
                        alt={`${reply.authorName}头像`}
                        className="w-8 h-8 rounded-full"
                        data-category="人物"
                      />
                      <span className="font-medium text-text-primary text-sm">{reply.authorName}</span>
                      <span className={`px-2 py-1 bg-${reply.authorRole === 'admin' ? 'primary' : 'success'}/10 text-${reply.authorRole === 'admin' ? 'primary' : 'success'} text-xs rounded-full`}>
                        {reply.authorRole === 'admin' ? '管理员' : '教师'}
                      </span>
                      <span className="text-xs text-text-secondary">{reply.time}</span>
                    </div>
                    <p className="text-sm text-text-primary leading-relaxed">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 回复输入框 */}
            <div className="space-y-3">
              <h3 className="font-semibold text-text-primary">添加回复</h3>
              <div className="bg-white border border-border-light rounded-lg p-4">
                <textarea 
                  value={replyContent}
                  onChange={handleReplyInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="请输入回复内容..."
                  rows={4}
                  className={`w-full p-3 border border-border-light rounded-lg ${styles.inputFocus} resize-none`}
                  maxLength={500}
                />
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-xs ${replyContent.length > 450 ? 'text-warning' : 'text-text-secondary'}`}>
                    {replyContent.length}/500
                  </span>
                  <button 
                    onClick={handleSubmitReply}
                    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    回复
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationView;

