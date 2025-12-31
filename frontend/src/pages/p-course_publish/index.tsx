

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';
import request from '../../utils/request';

interface CourseFormData {
  courseName: string;
  courseType: string;
  ageGroups: string[];
  courseDate: string;
  courseTime: string;
  courseDuration: string;
  courseDescription: string;
  courseLocation: string;
}

interface ConflictCourse {
  name: string;
  time: string;
}

const CoursePublishPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');
  const isEditMode = !!courseId;
  
  const [formData, setFormData] = useState<CourseFormData>({
    courseName: '',
    courseType: '',
    ageGroups: [],
    courseDate: '',
    courseTime: '',
    courseDuration: '',
    courseDescription: '',
    courseLocation: ''
  });
  // const [loading, setLoading] = useState(false);

  const [showConflictModal, setShowConflictModal] = useState(false);
  const [ageGroupError, setAgeGroupError] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [conflictCourses] = useState<ConflictCourse[]>([
    { name: '数学思维训练', time: '2024-01-20 14:00-16:00' }
  ]);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '发布课程 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  // 设置最小日期为今天
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.querySelector('#course-date') as HTMLInputElement;
    if (dateInput) {
      dateInput.setAttribute('min', today);
    }
  }, []);

  // 编辑模式下获取课程详情
  useEffect(() => {
    if (isEditMode && courseId) {
      const fetchCourseDetail = async () => {
        try {
          // 使用管理员API路径获取课程详情
          const response = await request.get(`/api/admin/course/${courseId}`);
          const courseDetail = response.data;
          // 解析schedule字段以获取日期和时间
          const scheduleParts = courseDetail.schedule ? courseDetail.schedule.split(' ') : ['', ''];
          // 根据后端返回的数据结构填充表单
          setFormData({
            courseName: courseDetail.name || '',
            courseType: courseDetail.type || '',
            ageGroups: courseDetail.age_range ? courseDetail.age_range.split(',') : [],
            courseDate: scheduleParts[0] || '',
            courseTime: scheduleParts[1] || '',
            courseDuration: '', // 后端可能没有这个字段，需要根据实际情况调整
            courseDescription: courseDetail.description || '',
            courseLocation: courseDetail.location || ''
          });
        } catch (error) {
          console.error('获取课程详情失败:', error);
          alert('获取课程详情失败，请稍后重试');
        }
      };

      fetchCourseDetail();
    }
  }, [isEditMode, courseId]);

  // ESC键关闭弹窗
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleCloseModal = () => {
    navigate(-1);
  };

  const handleInputChange = (field: keyof CourseFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAgeGroupChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      ageGroups: checked 
        ? [...prev.ageGroups, value]
        : prev.ageGroups.filter(age => age !== value)
    }));
    setAgeGroupError(false);
  };

  const handleFieldBlur = (field: string) => {
    setTouchedFields(prev => new Set([...prev, field]));
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof CourseFormData)[] = [
      'courseName',
      'courseType', 
      'courseDate',
      'courseTime',
      'courseDuration',
      'courseDescription',
      'courseLocation'
    ];

    const hasEmptyRequired = requiredFields.some(field => { const value = formData[field]; return typeof value === 'string' && !value.trim(); });
    
    if (hasEmptyRequired) {
      requiredFields.forEach(field => {
        const value = formData[field]; if (typeof value === 'string' && !value.trim()) {
          setTouchedFields(prev => new Set([...prev, field]));
        }
      });
      return false;
    }

    if (formData.ageGroups.length === 0) {
      setAgeGroupError(true);
      return false;
    }

    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // 构建后端API需要的数据结构
      // const timeParts = formData.courseTime.split('-');
      const apiData = {
        course_id: courseId || `C${Date.now()}`, // 如果是新建，生成一个临时ID
        teacher_id: 'T001', // 这里应该从当前登录用户获取，临时使用固定值
        neighborhood_id: 'N001', // 社区ID，根据实际情况从登录用户或选择器获取
        name: formData.courseName,
        type: formData.courseType,
        age_range: formData.ageGroups.join(','), // 后端要求逗号分隔的年龄范围
        schedule: `${formData.courseDate} ${formData.courseTime}`, // 后端要求的schedule格式
        description: formData.courseDescription,
        location: formData.courseLocation,
        capacity: '20', // 假设默认容量为20
        status: 'pending' // 新增课程默认状态为待审核
      };

      console.log('提交的课程数据:', apiData);

      // 根据是否是编辑模式选择POST或PUT方法
      if (isEditMode) {
        // 修改课程：使用PUT方法，只需要body
        await request.put(`/api/admin/course/${courseId}`, apiData);
        alert('课程更新成功！');
      } else {
        // 新增课程：使用POST方法，需要body和headers
        await request.post('/api/admin/course', apiData, {
          headers: {
            'Content-Type': 'application/json',
            // 根据后端要求添加其他必要的headers
          }
        });
        alert('课程发布成功！');
      }

      handleCloseModal();
    } catch (error) {
      console.error('课程操作失败:', error);
      alert('课程操作失败，请稍后重试');
    }
  };

  const handleResolveConflict = () => {
    setShowConflictModal(false);
  };

  const handleOverrideConflict = () => {
    alert('课程发布成功！');
    handleCloseModal();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const isFieldInvalid = (field: keyof CourseFormData): boolean => {
    const value = formData[field];
    return touchedFields.has(field) && typeof value === 'string' && !value.trim();
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 模态弹窗遮罩 */}
      <div 
        className={`fixed inset-0 ${styles.modalBackdrop} z-50 flex items-center justify-center p-4`}
        onClick={handleBackdropClick}
      >
        {/* 模态弹窗 */}
        <div className="bg-white rounded-xl shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* 弹窗头部 */}
          <div className="flex items-center justify-between p-6 border-b border-border-light">
            <h2 className="text-xl font-bold text-text-primary">发布新课程</h2>
            <button 
              onClick={handleCloseModal}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-times text-text-secondary"></i>
            </button>
          </div>
          
          {/* 弹窗内容 */}
          <div className="p-6">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* 课程名称 */}
              <div className="space-y-2">
                <label htmlFor="course-name" className="block text-sm font-medium text-text-primary">
                  课程名称 *
                </label>
                <input 
                  type="text" 
                  id="course-name" 
                  name="course-name" 
                  value={formData.courseName}
                  onChange={(e) => handleInputChange('courseName', e.target.value)}
                  onBlur={() => handleFieldBlur('courseName')}
                  className={`w-full px-4 py-3 border rounded-lg ${styles.formInputFocus} ${
                    isFieldInvalid('courseName') ? 'border-danger' : 'border-border-light'
                  }`}
                  placeholder="请输入课程名称"
                  required
                />
              </div>
              
              {/* 课程类型 */}
              <div className="space-y-2">
                <label htmlFor="course-type" className="block text-sm font-medium text-text-primary">
                  课程类型 *
                </label>
                <select 
                  id="course-type" 
                  name="course-type" 
                  value={formData.courseType}
                  onChange={(e) => handleInputChange('courseType', e.target.value)}
                  onBlur={() => handleFieldBlur('courseType')}
                  className={`w-full px-4 py-3 border rounded-lg ${styles.formInputFocus} ${
                    isFieldInvalid('courseType') ? 'border-danger' : 'border-border-light'
                  }`}
                  required
                >
                  <option value="">请选择课程类型</option>
                  <option value="subject">学科类</option>
                  <option value="interest">兴趣类</option>
                  <option value="sports">体育类</option>
                  <option value="art">艺术类</option>
                  <option value="tech">科技类</option>
                </select>
              </div>
              
              {/* 适合年龄段 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">适合年龄段 *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'age-4-6', value: '4-6岁' },
                    { id: 'age-7-10', value: '7-10岁' },
                    { id: 'age-11-14', value: '11-14岁' },
                    { id: 'age-15-18', value: '15-18岁' }
                  ].map((ageGroup) => (
                    <label key={ageGroup.id} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        id={ageGroup.id} 
                        name="age-groups" 
                        value={ageGroup.value}
                        checked={formData.ageGroups.includes(ageGroup.value)}
                        onChange={(e) => handleAgeGroupChange(ageGroup.value, e.target.checked)}
                        className={`w-4 h-4 border-2 border-border-light rounded ${styles.checkboxCustom} appearance-none relative`}
                      />
                      <span className="text-sm text-text-primary">{ageGroup.value}</span>
                    </label>
                  ))}
                </div>
                {ageGroupError && (
                  <p className="text-danger text-xs">请至少选择一个年龄段</p>
                )}
              </div>
              
              {/* 课时安排 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">课时安排 *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="course-date" className="block text-sm font-medium text-text-primary">
                      上课日期
                    </label>
                    <input 
                      type="date" 
                      id="course-date" 
                      name="course-date" 
                      value={formData.courseDate}
                      onChange={(e) => handleInputChange('courseDate', e.target.value)}
                      onBlur={() => handleFieldBlur('courseDate')}
                      className={`w-full px-4 py-3 border rounded-lg ${styles.formInputFocus} ${
                        isFieldInvalid('courseDate') ? 'border-danger' : 'border-border-light'
                      }`}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="course-time" className="block text-sm font-medium text-text-primary">
                      上课时间
                    </label>
                    <input 
                      type="time" 
                      id="course-time" 
                      name="course-time" 
                      value={formData.courseTime}
                      onChange={(e) => handleInputChange('courseTime', e.target.value)}
                      onBlur={() => handleFieldBlur('courseTime')}
                      className={`w-full px-4 py-3 border rounded-lg ${styles.formInputFocus} ${
                        isFieldInvalid('courseTime') ? 'border-danger' : 'border-border-light'
                      }`}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="course-duration" className="block text-sm font-medium text-text-primary">
                    课时长度（小时）
                  </label>
                  <select 
                    id="course-duration" 
                    name="course-duration" 
                    value={formData.courseDuration}
                    onChange={(e) => handleInputChange('courseDuration', e.target.value)}
                    onBlur={() => handleFieldBlur('courseDuration')}
                    className={`w-full px-4 py-3 border rounded-lg ${styles.formInputFocus} ${
                      isFieldInvalid('courseDuration') ? 'border-danger' : 'border-border-light'
                    }`}
                    required
                  >
                    <option value="">请选择课时长度</option>
                    <option value="1">1小时</option>
                    <option value="1.5">1.5小时</option>
                    <option value="2">2小时</option>
                    <option value="2.5">2.5小时</option>
                    <option value="3">3小时</option>
                  </select>
                </div>
              </div>
              
              {/* 课程描述 */}
              <div className="space-y-2">
                <label htmlFor="course-description" className="block text-sm font-medium text-text-primary">
                  课程描述 *
                </label>
                <textarea 
                  id="course-description" 
                  name="course-description" 
                  rows={5}
                  value={formData.courseDescription}
                  onChange={(e) => handleInputChange('courseDescription', e.target.value)}
                  onBlur={() => handleFieldBlur('courseDescription')}
                  className={`w-full px-4 py-3 border rounded-lg ${styles.formInputFocus} resize-none ${
                    isFieldInvalid('courseDescription') ? 'border-danger' : 'border-border-light'
                  }`}
                  placeholder="请详细描述课程内容、教学目标、适合人群等信息..."
                  required
                />
                <p className="text-xs text-text-secondary">建议详细描述课程特色，有助于提高匹配成功率</p>
              </div>
              
              {/* 上课地点 */}
              <div className="space-y-2">
                <label htmlFor="course-location" className="block text-sm font-medium text-text-primary">
                  上课地点 *
                </label>
                <input 
                  type="text" 
                  id="course-location" 
                  name="course-location" 
                  value={formData.courseLocation}
                  onChange={(e) => handleInputChange('courseLocation', e.target.value)}
                  onBlur={() => handleFieldBlur('courseLocation')}
                  className={`w-full px-4 py-3 border rounded-lg ${styles.formInputFocus} ${
                    isFieldInvalid('courseLocation') ? 'border-danger' : 'border-border-light'
                  }`}
                  placeholder="请输入详细的上课地址"
                  required
                />
                <p className="text-xs text-text-secondary">例如：阳光社区活动中心2楼教室A</p>
              </div>
            </form>
          </div>
          
          {/* 弹窗底部 */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border-light bg-gray-50 rounded-b-xl">
            <button 
              type="button" 
              onClick={handleCloseModal}
              className="px-6 py-3 border border-border-light text-text-primary rounded-lg hover:bg-gray-100 transition-colors"
            >
              取消
            </button>
            <button 
              type="submit" 
              form="course-publish-form"
              onClick={handleFormSubmit}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <i className="fas fa-plus mr-2"></i>
              发布课程
            </button>
          </div>
        </div>
      </div>

      {/* 冲突提醒弹窗 */}
      {showConflictModal && (
        <div className={`fixed inset-0 ${styles.modalBackdrop} z-60 flex items-center justify-center p-4`}>
          <div className="bg-white rounded-xl shadow-modal w-full max-w-md">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-exclamation-triangle text-danger text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">排期冲突提醒</h3>
              <p className="text-text-secondary mb-6">您选择的时间段与以下课程存在冲突：</p>
              <div className="space-y-2 mb-6 text-left">
                {conflictCourses.map((course, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-text-primary">{course.name}</p>
                    <p className="text-sm text-text-secondary">{course.time}</p>
                  </div>
                ))}
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={handleResolveConflict}
                  className="flex-1 px-4 py-2 border border-border-light text-text-primary rounded-lg hover:bg-gray-100"
                >
                  调整时间
                </button>
                <button 
                  onClick={handleOverrideConflict}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  继续发布
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePublishPage;

