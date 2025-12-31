

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';
import request from '../../utils/request';

interface CourseInfo {
  name: string;
  teacher: string;
  time: string;
  location: string;
  image: string;
}



const EvaluationSubmitPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 状态管理
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [evaluationComment, setEvaluationComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // 加载状态
  const [_isLoading, setIsLoading] = useState<boolean>(false);
  const [courseInfo, setCourseInfo] = useState<CourseInfo>({
    name: '',
    teacher: '',
    time: '',
    location: '',
    image: ''
  });

  // 评分文本映射
  const ratingTexts: Record<number, string> = {
    1: '很差 - 非常不满意',
    2: '较差 - 不太满意',
    3: '一般 - 基本满意',
    4: '良好 - 比较满意',
    5: '优秀 - 非常满意'
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
    const courseId = searchParams.get('courseId');
    
    // 如果没有courseId，返回我的课程列表
    if (!courseId) {
      navigate('/my-courses');
      return;
    }
    
    const fetchCourseInfo = async () => {
      setIsLoading(true);
      try {
        // 使用真实API获取课程信息
        const response = await request.get(`/api/course/${courseId}`);
        const courseData = response.data;
        
        // 将后端数据转换为前端所需格式
        const formattedCourse: CourseInfo = {
          name: courseData.course_name || '',
          teacher: courseData.teacher_name || '',
          time: `${courseData.start_date || ''} ${courseData.start_time || ''}-${courseData.end_time || ''}`,
          location: courseData.location || '',
          image: courseData.image_url || ''
        };
        
        setCourseInfo(formattedCourse);
      } catch (error) {
        console.error('获取课程信息失败:', error);
        alert('获取课程信息失败，请稍后重试');
        navigate('/my-courses');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourseInfo();
  }, [searchParams, navigate]);

  // 表单验证
  const isFormValid = selectedRating > 0 && evaluationComment.trim().length > 0;

  // 字符计数器样式
  const getCharCounterClass = () => {
    const length = evaluationComment.length;
    if (length > 450) return `${styles.charCounter} ${styles.danger}`;
    if (length > 400) return `${styles.charCounter} ${styles.warning}`;
    return styles.charCounter;
  };



  // 处理评价内容变化
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEvaluationComment(e.target.value);
  };

  // 处理提交评价
  const handleSubmitEvaluation = async () => {
    if (!isFormValid || isSubmitting) return;

    const courseId = searchParams.get('courseId');
    
    // 按照后端API要求格式化评价数据
    const evaluationData = {
      parent_id: 'P001', // 假设当前家长ID为P001
      teacher_id: 'T001', // 从课程信息或其他方式获取老师ID
      course_id: courseId,
      eval_type: 'course', // 课程评价类型
      score: selectedRating,
      content: evaluationComment, // 评价内容
      timestamp: new Date().toISOString() // 提交时间
    };

    setIsSubmitting(true);
    
    try {
      // 使用真实接口提交评价
      await request.post('/api/evaluation', evaluationData);
      alert('评价提交成功！感谢您的反馈。');
      navigate('/my-courses');
    } catch (error) {
      console.error('提交评价失败:', error);
      alert('提交评价失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
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

  // 渲染分数输入
  const renderScoreInput = () => {
    return (
      <div className={styles.scoreInputContainer}>
        <input
          type="number"
          min="1"
          max="5"
          step="0.1"
          value={selectedRating}
          onChange={(e) => handleScoreChange(parseFloat(e.target.value))}
          className={`${styles.scoreInput} w-20 px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50`}
          placeholder="请输入分数"
        />
        <span className="ml-2 text-sm text-text-secondary">（1-5分，支持小数点后一位）</span>
      </div>
    );
  };

  // 处理分数变化
  const handleScoreChange = (score: number) => {
    if (!isNaN(score) && score >= 1 && score <= 5) {
      setSelectedRating(score);
    }
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
              {renderScoreInput()}
              <div className="mt-2 text-sm text-text-secondary">
                {selectedRating > 0 ? `您的评分为：${selectedRating.toFixed(1)}分` : '请输入1-5分'}
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

