

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface CourseInfo {
  name: string;
  teacher: string;
  time: string;
  location: string;
  image: string;
}

interface EvaluationData {
  courseId: string;
  rating: number;
  comment: string;
  timestamp: string;
}

const EvaluationSubmitPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 状态管理
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [evaluationComment, setEvaluationComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [courseInfo, setCourseInfo] = useState<CourseInfo>({
    name: '数学思维训练',
    teacher: '李老师',
    time: '2024-01-20 14:00-16:00',
    location: '阳光社区',
    image: 'https://s.coze.cn/image/T3j12hyRXeg/'
  });

  // 评分文本映射
  const ratingTexts: Record<number, string> = {
    1: '很差 - 非常不满意',
    2: '较差 - 不太满意',
    3: '一般 - 基本满意',
    4: '良好 - 比较满意',
    5: '优秀 - 非常满意'
  };

  // 模拟课程数据
  const mockCourses: Record<string, CourseInfo> = {
    'course1': {
      name: '数学思维训练',
      teacher: '李老师',
      time: '2024-01-20 14:00-16:00',
      location: '阳光社区',
      image: 'https://s.coze.cn/image/9_VEZTgER7A/'
    },
    'course2': {
      name: '创意绘画启蒙',
      teacher: '王老师',
      time: '2024-01-21 10:00-11:30',
      location: '绿洲社区',
      image: 'https://s.coze.cn/image/_8ZeW2GdYdA/'
    },
    'course3': {
      name: 'Scratch编程入门',
      teacher: '陈老师',
      time: '2024-01-19 18:30-20:00',
      location: '智慧社区',
      image: 'https://s.coze.cn/image/L_ayZyo0cgM/'
    }
  };

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '提交课程评价 - 课智配';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // 加载课程信息
  useEffect(() => {
    const courseId = searchParams.get('courseId') || 'course1';
    const course = mockCourses[courseId] || mockCourses['course1'];
    setCourseInfo(course);
  }, [searchParams]);

  // 表单验证
  const isFormValid = selectedRating > 0 && evaluationComment.trim().length > 0;

  // 字符计数器样式
  const getCharCounterClass = () => {
    const length = evaluationComment.length;
    if (length > 450) return `${styles.charCounter} ${styles.danger}`;
    if (length > 400) return `${styles.charCounter} ${styles.warning}`;
    return styles.charCounter;
  };

  // 处理星级点击
  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
  };

  // 处理星级悬停
  const handleStarHover = (rating: number) => {
    setHoverRating(rating);
  };

  // 处理星级离开
  const handleStarLeave = () => {
    setHoverRating(0);
  };

  // 处理评价内容变化
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEvaluationComment(e.target.value);
  };

  // 处理提交评价
  const handleSubmitEvaluation = async () => {
    if (!isFormValid || isSubmitting) return;

    const courseId = searchParams.get('courseId') || 'course1';
    const evaluationData: EvaluationData = {
      courseId,
      rating: selectedRating,
      comment: evaluationComment.trim(),
      timestamp: new Date().toISOString()
    };

    setIsSubmitting(true);

    // 模拟提交过程
    setTimeout(() => {
      alert('评价提交成功！感谢您的反馈。');
      navigate('/my-courses');
    }, 1000);
  };

  // 处理取消
  const handleCancel = () => {
    if (selectedRating > 0 || evaluationComment.trim().length > 0) {
      if (window.confirm('您的评价内容将会丢失，确定要取消吗？')) {
        navigate('/my-courses');
      }
    } else {
      navigate('/my-courses');
    }
  };

  // 处理关闭模态框
  const handleCloseModal = () => {
    if (selectedRating > 0 || evaluationComment.trim().length > 0) {
      if (window.confirm('您的评价内容将会丢失，确定要关闭吗？')) {
        navigate('/my-courses');
      }
    } else {
      navigate('/my-courses');
    }
  };

  // 处理遮罩点击
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      } else if (e.key === 'Enter' && isFormValid && !isSubmitting) {
        handleSubmitEvaluation();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFormValid, isSubmitting]);

  // 渲染星级评分
  const renderStars = () => {
    const displayRating = hoverRating || selectedRating;
    
    return (
      <div className={styles.starRating}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <i
            key={rating}
            className={`fas fa-star ${styles.star} ${rating <= displayRating ? styles.active : ''}`}
            onClick={() => handleStarClick(rating)}
            onMouseEnter={() => handleStarHover(rating)}
            onMouseLeave={handleStarLeave}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 模态弹窗遮罩 */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 ${styles.modalBackdrop} z-50 flex items-center justify-center`}
        onClick={handleBackdropClick}
      >
        {/* 弹窗内容 */}
        <div className={`${styles.modalContent} bg-white rounded-xl shadow-modal w-full max-w-md mx-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
          {/* 弹窗头部 */}
          <div className="flex items-center justify-between p-6 border-b border-border-light">
            <h2 className="text-xl font-bold text-text-primary">提交课程评价</h2>
            <button 
              onClick={handleCloseModal}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <i className="fas fa-times text-text-secondary"></i>
            </button>
          </div>
          
          {/* 弹窗内容区 */}
          <div className="p-6">
            {/* 课程信息 */}
            <div className="mb-6 p-4 bg-bg-light rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <img 
                  src={courseInfo.image}
                  alt="课程图片" 
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">{courseInfo.name}</h3>
                  <p className="text-sm text-text-secondary">{courseInfo.teacher}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-text-secondary">
                <span>
                  <i className="fas fa-clock mr-1"></i>
                  {courseInfo.time}
                </span>
                <span>
                  <i className="fas fa-map-marker-alt mr-1"></i>
                  {courseInfo.location}
                </span>
              </div>
            </div>
            
            {/* 评分区域 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-primary mb-3">课程评分</label>
              {renderStars()}
              <div className="mt-2 text-sm text-text-secondary">
                {selectedRating > 0 ? ratingTexts[selectedRating] : '请点击星星进行评分'}
              </div>
            </div>
            
            {/* 评价内容 */}
            <div className="mb-6">
              <label htmlFor="evaluation-comment" className="block text-sm font-medium text-text-primary mb-3">
                评价内容 <span className="text-danger">*</span>
              </label>
              <textarea 
                id="evaluation-comment" 
                name="evaluation-comment"
                rows={4} 
                maxLength={500}
                placeholder="请分享您对这门课程的感受和建议..."
                className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} resize-none`}
                value={evaluationComment}
                onChange={handleCommentChange}
                required
              />
              <div className={getCharCounterClass()}>
                <span>{evaluationComment.length}</span>/500
              </div>
            </div>
            
            {/* 提交按钮区 */}
            <div className="flex space-x-3">
              <button 
                type="button" 
                onClick={handleCancel}
                className="flex-1 px-4 py-3 border border-border-light text-text-secondary rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button 
                type="button" 
                onClick={handleSubmitEvaluation}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? '提交中...' : '提交评价'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationSubmitPage;

