

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface Reply {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: 'admin' | 'teacher';
  content: string;
  time: string;
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

  // 模拟评价数据
  const mockEvaluations: Record<string, Evaluation> = {
    'eval1': {
      id: 'eval1',
      evaluatorName: '张家长',
      evaluatorAvatar: 'https://s.coze.cn/image/o6gKpS4lb08/',
      rating: 5,
      ratingScore: '5.0',
      courseName: '数学思维训练',
      teacherName: '李老师',
      evaluationTime: '2024-01-15 16:30',
      status: '已通过',
      statusClass: 'success',
      reviewTime: '2024-01-15 18:20',
      content: '李老师的数学思维训练课程非常棒！孩子很喜欢，课堂氛围活跃，老师很有耐心。通过有趣的游戏和互动，孩子对数学产生了浓厚的兴趣。课程内容设计得很合理，循序渐进，能够很好地培养孩子的逻辑思维能力。强烈推荐！',
      replies: [
        {
          id: 'reply1',
          authorName: '李老师',
          authorAvatar: 'https://s.coze.cn/image/i5xEHuTJxCk/',
          authorRole: 'teacher',
          content: '感谢张家长的认可！看到孩子在课堂上的进步和对数学的兴趣，我感到非常欣慰。我会继续努力，为孩子们提供更好的教学体验。',
          time: '2024-01-15 19:00'
        },
        {
          id: 'reply2',
          authorName: '管理员',
          authorAvatar: 'https://s.coze.cn/image/oc665RKjxlc/',
          authorRole: 'admin',
          content: '感谢您的积极评价！我们会持续关注教师的教学质量，为孩子们提供更好的课后托管服务。',
          time: '2024-01-15 20:30'
        }
      ]
    },
    'eval2': {
      id: 'eval2',
      evaluatorName: '王家长',
      evaluatorAvatar: 'https://s.coze.cn/image/6NRsF0sJpcs/',
      rating: 4,
      ratingScore: '4.0',
      courseName: '创意绘画启蒙',
      teacherName: '王老师',
      evaluationTime: '2024-01-14 14:20',
      status: '已通过',
      statusClass: 'success',
      reviewTime: '2024-01-14 16:15',
      content: '课程整体不错，老师很有耐心，孩子很喜欢画画。希望下次能有更多的材料可以选择。',
      replies: [
        {
          id: 'reply3',
          authorName: '王老师',
          authorAvatar: 'https://s.coze.cn/image/kJIu3E9sbAo/',
          authorRole: 'teacher',
          content: '感谢您的建议！我们会考虑增加更多的绘画材料选择，为孩子们提供更丰富的创作体验。',
          time: '2024-01-14 17:00'
        }
      ]
    }
  };

  // 加载评价数据
  useEffect(() => {
    const evaluationId = searchParams.get('evaluationId') || 'eval1';
    const evaluation = mockEvaluations[evaluationId] || mockEvaluations['eval1'];
    setEvaluationData(evaluation);
    setIsLoading(false);
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
  const handleSubmitReply = () => {
    const content = replyContent.trim();
    
    if (!content) {
      alert('请输入回复内容');
      return;
    }
    
    if (content.length > 500) {
      alert('回复内容不能超过500字');
      return;
    }
    
    // 创建新回复
    const newReply: Reply = {
      id: `reply-${Date.now()}`,
      authorName: '管理员',
      authorAvatar: 'https://s.coze.cn/image/ZvVCa_y0w9w/',
      authorRole: 'admin',
      content: content,
      time: new Date().toLocaleString('zh-CN')
    };
    
    // 更新评价数据
    if (evaluationData) {
      const updatedEvaluation = {
        ...evaluationData,
        replies: [...evaluationData.replies, newReply]
      };
      setEvaluationData(updatedEvaluation);
    }
    
    // 清空输入框
    setReplyContent('');
    
    // 显示成功提示
    alert('回复提交成功！');
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

  // 渲染星级评分
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <i 
          key={i}
          className={`fas fa-star ${i < rating ? styles.starRating : 'text-gray-300'}`}
        />
      );
    }
    return stars;
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
                  <div className="flex space-x-1">
                    {renderStars(evaluationData.rating)}
                  </div>
                  <span className="text-lg font-bold text-text-primary ml-2">{evaluationData.ratingScore}</span>
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

