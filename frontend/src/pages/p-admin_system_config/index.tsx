

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import { getAllSystemParameters, createSystemParameter, updateSystemParameter } from '../../utils/api/systemParameterApi';

interface SystemConfigFormData {
  'teacher-rating-weight': number;
  'interest-match-weight': number;
  'learning-style-weight': number;
  'academic-course-price': number;
  'interest-course-price': number;
  'sports-course-price': number;
  'art-course-price': number;
  'tech-course-price': number;
  'refund-time-limit': number;
  'refund-review-time': number;
  'refund-fee': number;
  'teacher-weekly-limit': number;
  'course-capacity-limit': number;
}

const AdminSystemConfigPage: React.FC = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState<SystemConfigFormData>({
    'teacher-rating-weight': 60,
    'interest-match-weight': 30,
    'learning-style-weight': 10,
    'academic-course-price': 80,
    'interest-course-price': 60,
    'sports-course-price': 70,
    'art-course-price': 90,
    'tech-course-price': 100,
    'refund-time-limit': 24,
    'refund-review-time': 24,
    'refund-fee': 0,
    'teacher-weekly-limit': 15,
    'course-capacity-limit': 20,
  });

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '系统参数配置 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  // 获取系统参数数据
  useEffect(() => {
    const fetchSystemParameters = async () => {
      try {
        const parameters = await getAllSystemParameters();
        if (parameters.length > 0) {
          // 将参数映射到表单数据
          const updatedFormData = { ...formData };
          parameters.forEach(param => {
            if (param.name in updatedFormData) {
              updatedFormData[param.name as keyof SystemConfigFormData] = parseFloat(param.value);
            }
          });
          setFormData(updatedFormData);
        } else {
          // 如果没有参数，初始化默认参数
          initializeDefaultParameters();
        }
      } catch (err) {
        console.error('获取系统参数失败:', err);
      }
    };

    fetchSystemParameters();
  }, []);

  // 初始化默认参数
  const initializeDefaultParameters = async () => {
    try {
      const defaultParams = Object.entries(formData).map(([name, value]) => ({
        name,
        type: name.includes('weight') ? 'weight' : 
          name.includes('price') ? 'price' : 
            name.includes('limit') ? 'limit' : 'config',
        value: value.toString(),
        scope: 'system'
      }));

      // 批量创建默认参数
      for (const param of defaultParams) {
        await createSystemParameter(param);
      }
    } catch (err) {
      console.error('初始化默认参数失败:', err);
    }
  };

  const handleWeightChange = (field: keyof SystemConfigFormData, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInputChange = (field: keyof SystemConfigFormData, value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    setFormData(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const calculateTotalWeight = () => {
    return formData['teacher-rating-weight'] + formData['interest-match-weight'] + formData['learning-style-weight'];
  };

  const isWeightValid = () => {
    return calculateTotalWeight() === 100;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isWeightValid()) {
      alert('匹配算法权重总和必须为100%，请重新调整');
      return;
    }
    
    try {
      // 获取所有系统参数
      const parameters = await getAllSystemParameters();
      
      // 更新或创建参数
      for (const [name, value] of Object.entries(formData)) {
        const existingParam = parameters.find(p => p.name === name);
        if (existingParam) {
          // 更新现有参数
          await updateSystemParameter(existingParam.parameter_id, {
            value: value.toString(),
            effective_time: new Date().toISOString()
          });
        } else {
          // 创建新参数
          await createSystemParameter({
            name,
            type: name.includes('weight') ? 'weight' : 
              name.includes('price') ? 'price' : 
                name.includes('limit') ? 'limit' : 'config',
            value: value.toString(),
            scope: 'system'
          });
        }
      }
      
      setShowSuccessModal(true);
    } catch (err) {
      console.error('保存系统配置失败:', err);
      alert('保存系统配置失败，请稍后重试');
    }
  };

  const handleCancel = () => {
    if (confirm('确定要取消修改吗？未保存的更改将丢失。')) {
      setFormData({
        'teacher-rating-weight': 60,
        'interest-match-weight': 30,
        'learning-style-weight': 10,
        'academic-course-price': 80,
        'interest-course-price': 60,
        'sports-course-price': 70,
        'art-course-price': 90,
        'tech-course-price': 100,
        'refund-time-limit': 24,
        'refund-review-time': 24,
        'refund-fee': 0,
        'teacher-weekly-limit': 15,
        'course-capacity-limit': 20,
      });
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  const handleModalBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowSuccessModal(false);
    }
  };

  return (
    <div className="p-6">
      {/* 页面头部 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">系统参数配置</h2>
            <nav className="flex items-center space-x-2 text-sm text-text-secondary">
              <Link to="/admin-dashboard" className="hover:text-primary">首页</Link>
              <i className="fas fa-chevron-right text-xs"></i>
              <span>系统配置</span>
            </nav>
          </div>
        </div>
      </div>

      {/* 配置表单 */}
      <form onSubmit={handleFormSubmit} className="space-y-8">
        {/* 匹配算法权重配置 */}
        <section className={`bg-white rounded-xl shadow-card p-6 ${styles.configCard}`}>
          <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
            <i className="fas fa-magic text-primary mr-3"></i>
            智能匹配算法权重
          </h3>
          
          <div className="space-y-6">
            {/* 教师评分权重 */}
            <div className="space-y-3">
              <label htmlFor="teacher-rating-weight" className="block text-sm font-medium text-text-primary">
                教师评分权重 <span className="text-text-secondary font-normal">(当前: {formData['teacher-rating-weight']}%)</span>
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <input 
                    type="range" 
                    id="teacher-rating-weight" 
                    name="teacher-rating-weight"
                    min="0" 
                    max="100" 
                    value={formData['teacher-rating-weight']}
                    onChange={(e) => handleWeightChange('teacher-rating-weight', parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm font-medium text-text-primary w-12 text-center">{formData['teacher-rating-weight']}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={styles.weightProgress}
                    style={{ width: `${formData['teacher-rating-weight']}%` }}
                  ></div>
                </div>
                <p className="text-xs text-text-secondary">教师的历史评分对匹配结果的影响程度</p>
              </div>
            </div>

            {/* 兴趣匹配权重 */}
            <div className="space-y-3">
              <label htmlFor="interest-match-weight" className="block text-sm font-medium text-text-primary">
                兴趣匹配权重 <span className="text-text-secondary font-normal">(当前: {formData['interest-match-weight']}%)</span>
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <input 
                    type="range" 
                    id="interest-match-weight" 
                    name="interest-match-weight"
                    min="0" 
                    max="100" 
                    value={formData['interest-match-weight']}
                    onChange={(e) => handleWeightChange('interest-match-weight', parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm font-medium text-text-primary w-12 text-center">{formData['interest-match-weight']}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={styles.weightProgress}
                    style={{ width: `${formData['interest-match-weight']}%` }}
                  ></div>
                </div>
                <p className="text-xs text-text-secondary">学生兴趣与课程内容的匹配程度权重</p>
              </div>
            </div>

            {/* 学习风格匹配权重 */}
            <div className="space-y-3">
              <label htmlFor="learning-style-weight" className="block text-sm font-medium text-text-primary">
                学习风格匹配权重 <span className="text-text-secondary font-normal">(当前: {formData['learning-style-weight']}%)</span>
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <input 
                    type="range" 
                    id="learning-style-weight" 
                    name="learning-style-weight"
                    min="0" 
                    max="100" 
                    value={formData['learning-style-weight']}
                    onChange={(e) => handleWeightChange('learning-style-weight', parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm font-medium text-text-primary w-12 text-center">{formData['learning-style-weight']}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={styles.weightProgress}
                    style={{ width: `${formData['learning-style-weight']}%` }}
                  ></div>
                </div>
                <p className="text-xs text-text-secondary">学生学习风格与教师教学风格的匹配权重</p>
              </div>
            </div>

            {/* 权重总和验证 */}
            <div className={`p-4 rounded-lg border ${isWeightValid() ? 'bg-success/10 border-success/20' : 'bg-danger/10 border-danger/20'}`}>
              <div className="flex items-center space-x-2">
                <i className={`${isWeightValid() ? 'fas fa-check-circle text-success' : 'fas fa-exclamation-triangle text-danger'}`}></i>
                <span className={`text-sm font-medium ${isWeightValid() ? 'text-success' : 'text-danger'}`}>
                  权重总和: <span>{calculateTotalWeight()}%</span>
                  {!isWeightValid() && '，请调整至100%'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 课程价格体系配置 */}
        <section className={`bg-white rounded-xl shadow-card p-6 ${styles.configCard}`}>
          <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
            <i className="fas fa-dollar-sign text-success mr-3"></i>
            课程价格体系
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 学科类课程价格 */}
            <div className="space-y-3">
              <label htmlFor="academic-course-price" className="block text-sm font-medium text-text-primary">
                学科类课程价格
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">¥</span>
                <input 
                  type="number" 
                  id="academic-course-price" 
                  name="academic-course-price"
                  value={formData['academic-course-price']}
                  onChange={(e) => handleInputChange('academic-course-price', e.target.value)}
                  min="0" 
                  step="1"
                  className={`w-full pl-8 pr-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} text-sm`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">/课时</span>
              </div>
              <p className="text-xs text-text-secondary">数学、语文、英语等学科类课程的标准价格</p>
            </div>

            {/* 兴趣类课程价格 */}
            <div className="space-y-3">
              <label htmlFor="interest-course-price" className="block text-sm font-medium text-text-primary">
                兴趣类课程价格
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">¥</span>
                <input 
                  type="number" 
                  id="interest-course-price" 
                  name="interest-course-price"
                  value={formData['interest-course-price']}
                  onChange={(e) => handleInputChange('interest-course-price', e.target.value)}
                  min="0" 
                  step="1"
                  className={`w-full pl-8 pr-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} text-sm`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">/课时</span>
              </div>
              <p className="text-xs text-text-secondary">音乐、美术、手工等兴趣类课程的标准价格</p>
            </div>

            {/* 体育类课程价格 */}
            <div className="space-y-3">
              <label htmlFor="sports-course-price" className="block text-sm font-medium text-text-primary">
                体育类课程价格
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">¥</span>
                <input 
                  type="number" 
                  id="sports-course-price" 
                  name="sports-course-price"
                  value={formData['sports-course-price']}
                  onChange={(e) => handleInputChange('sports-course-price', e.target.value)}
                  min="0" 
                  step="1"
                  className={`w-full pl-8 pr-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} text-sm`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">/课时</span>
              </div>
              <p className="text-xs text-text-secondary">篮球、足球、游泳等体育类课程的标准价格</p>
            </div>

            {/* 艺术类课程价格 */}
            <div className="space-y-3">
              <label htmlFor="art-course-price" className="block text-sm font-medium text-text-primary">
                艺术类课程价格
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">¥</span>
                <input 
                  type="number" 
                  id="art-course-price" 
                  name="art-course-price"
                  value={formData['art-course-price']}
                  onChange={(e) => handleInputChange('art-course-price', e.target.value)}
                  min="0" 
                  step="1"
                  className={`w-full pl-8 pr-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} text-sm`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">/课时</span>
              </div>
              <p className="text-xs text-text-secondary">绘画、书法、乐器等艺术类课程的标准价格</p>
            </div>

            {/* 科技类课程价格 */}
            <div className="space-y-3">
              <label htmlFor="tech-course-price" className="block text-sm font-medium text-text-primary">
                科技类课程价格
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">¥</span>
                <input 
                  type="number" 
                  id="tech-course-price" 
                  name="tech-course-price"
                  value={formData['tech-course-price']}
                  onChange={(e) => handleInputChange('tech-course-price', e.target.value)}
                  min="0" 
                  step="1"
                  className={`w-full pl-8 pr-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} text-sm`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">/课时</span>
              </div>
              <p className="text-xs text-text-secondary">编程、机器人、科技制作等科技类课程的标准价格</p>
            </div>
          </div>
        </section>

        {/* 退款规则配置 */}
        <section className={`bg-white rounded-xl shadow-card p-6 ${styles.configCard}`}>
          <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
            <i className="fas fa-undo-alt text-warning mr-3"></i>
            退款规则配置
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 退款时限 */}
            <div className="space-y-3">
              <label htmlFor="refund-time-limit" className="block text-sm font-medium text-text-primary">
                退款申请时限
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  id="refund-time-limit" 
                  name="refund-time-limit"
                  value={formData['refund-time-limit']}
                  onChange={(e) => handleInputChange('refund-time-limit', e.target.value)}
                  min="0" 
                  step="1"
                  className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} text-sm`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">小时</span>
              </div>
              <p className="text-xs text-text-secondary">课程开始前多少小时内允许申请退款</p>
            </div>

            {/* 退款审核时间 */}
            <div className="space-y-3">
              <label htmlFor="refund-review-time" className="block text-sm font-medium text-text-primary">
                退款审核时间
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  id="refund-review-time" 
                  name="refund-review-time"
                  value={formData['refund-review-time']}
                  onChange={(e) => handleInputChange('refund-review-time', e.target.value)}
                  min="0" 
                  step="1"
                  className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} text-sm`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">小时</span>
              </div>
              <p className="text-xs text-text-secondary">退款申请的审核处理时间</p>
            </div>

            {/* 退款手续费 */}
            <div className="space-y-3">
              <label htmlFor="refund-fee" className="block text-sm font-medium text-text-primary">
                退款手续费
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">¥</span>
                <input 
                  type="number" 
                  id="refund-fee" 
                  name="refund-fee"
                  value={formData['refund-fee']}
                  onChange={(e) => handleInputChange('refund-fee', e.target.value)}
                  min="0" 
                  step="1"
                  className={`w-full pl-8 pr-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} text-sm`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">元</span>
              </div>
              <p className="text-xs text-text-secondary">申请退款时收取的手续费用</p>
            </div>
          </div>
        </section>

        {/* 系统限制配置 */}
        <section className={`bg-white rounded-xl shadow-card p-6 ${styles.configCard}`}>
          <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
            <i className="fas fa-sliders-h text-info mr-3"></i>
            系统限制配置
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 教师每周课程限制 */}
            <div className="space-y-3">
              <label htmlFor="teacher-weekly-limit" className="block text-sm font-medium text-text-primary">
                教师每周课程限制
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  id="teacher-weekly-limit" 
                  name="teacher-weekly-limit"
                  value={formData['teacher-weekly-limit']}
                  onChange={(e) => handleInputChange('teacher-weekly-limit', e.target.value)}
                  min="0" 
                  step="1"
                  className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} text-sm`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">节/周</span>
              </div>
              <p className="text-xs text-text-secondary">单个教师每周最多可以开设的课程数量</p>
            </div>

            {/* 课程容量限制 */}
            <div className="space-y-3">
              <label htmlFor="course-capacity-limit" className="block text-sm font-medium text-text-primary">
                课程容量限制
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  id="course-capacity-limit" 
                  name="course-capacity-limit"
                  value={formData['course-capacity-limit']}
                  onChange={(e) => handleInputChange('course-capacity-limit', e.target.value)}
                  min="1" 
                  step="1"
                  className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} text-sm`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">人/课</span>
              </div>
              <p className="text-xs text-text-secondary">单个课程的最大学生容量</p>
            </div>
          </div>
        </section>

        {/* 操作按钮 */}
        <div className="flex items-center justify-end space-x-4">
          <button 
            type="button" 
            onClick={handleCancel}
            className="px-6 py-3 border border-border-light rounded-lg text-text-secondary hover:bg-gray-50 transition-colors"
          >
            <i className="fas fa-times mr-2"></i>
            取消修改
          </button>
          <button 
            type="submit"
            disabled={!isWeightValid()}
            className={`px-6 py-3 rounded-lg transition-colors ${
              isWeightValid() 
                ? 'bg-primary text-white hover:bg-primary/90' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <i className="fas fa-save mr-2"></i>
            保存配置
          </button>
        </div>
      </form>

      {/* 成功模态框 */}
      {showSuccessModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleModalBackgroundClick}
        >
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-success/10 mb-4">
                <i className="fas fa-check text-2xl text-success"></i>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">配置保存成功</h3>
              <p className="text-text-secondary mb-6">系统参数配置已成功更新，新的配置将立即生效。</p>
              <div className="flex space-x-3">
                <button 
                  onClick={handleSuccessModalClose}
                  className="flex-1 bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSystemConfigPage;

