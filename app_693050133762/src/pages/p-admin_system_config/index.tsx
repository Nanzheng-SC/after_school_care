

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

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
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isWeightValid()) {
      alert('匹配算法权重总和必须为100%，请重新调整');
      return;
    }
    
    console.log('保存系统配置:', formData);
    setShowSuccessModal(true);
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
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border-light h-16 z-50">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo区域 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleSidebarToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <i className="fas fa-bars text-gray-600"></i>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-graduation-cap text-white text-sm"></i>
              </div>
              <h1 className="text-xl font-bold text-text-primary">课智配</h1>
            </div>
          </div>
          
          {/* 搜索框 */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="搜索课程、教师..." 
                className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm"></i>
            </div>
          </div>
          
          {/* 右侧操作区 */}
          <div className="flex items-center space-x-4">
            {/* 消息中心 */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <i className="fas fa-bell text-text-secondary"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            
            {/* 用户头像 */}
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
                <img 
                  src="https://s.coze.cn/image/QjPGS3tBZQo/" 
                  alt="管理员头像" 
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden md:block text-sm text-text-primary">管理员</span>
                <i className="fas fa-chevron-down text-xs text-text-secondary"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 左侧菜单 */}
      <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-border-light ${styles.sidebarTransition} z-40 transform lg:transform-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="p-4 space-y-2">
          <Link 
            to="/admin-dashboard" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-tachometer-alt w-5"></i>
            <span>数据概览</span>
          </Link>
          <Link 
            to="/admin-user-manage" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-users w-5"></i>
            <span>用户管理</span>
          </Link>
          <Link 
            to="/admin-community-manage" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-building w-5"></i>
            <span>社区管理</span>
          </Link>
          <Link 
            to="/admin-course-manage" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-book-open w-5"></i>
            <span>课程管理</span>
          </Link>
          <Link 
            to="/admin-evaluation-manage" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-star w-5"></i>
            <span>评价管理</span>
          </Link>
          <Link 
            to="/admin-refund-manage" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-undo w-5"></i>
            <span>退款管理</span>
          </Link>
          <Link 
            to="/admin-system-config" 
            className={`${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}
          >
            <i className="fas fa-cog w-5"></i>
            <span>系统配置</span>
          </Link>
          <Link 
            to="/admin-report" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-chart-bar w-5"></i>
            <span>数据报表</span>
          </Link>
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className="lg:ml-64 pt-16 min-h-screen">
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
                  <p className="text-xs text-text-secondary">编程、机器人、科学实验等科技类课程的标准价格</p>
                </div>
              </div>
            </section>

            {/* 退款规则配置 */}
            <section className={`bg-white rounded-xl shadow-card p-6 ${styles.configCard}`}>
              <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
                <i className="fas fa-undo text-warning mr-3"></i>
                退款规则配置
              </h3>
              
              <div className="space-y-6">
                {/* 退款申请时间限制 */}
                <div className="space-y-3">
                  <label htmlFor="refund-time-limit" className="block text-sm font-medium text-text-primary">
                    退款申请时间限制
                  </label>
                  <div className="flex items-center space-x-4">
                    <input 
                      type="number" 
                      id="refund-time-limit" 
                      name="refund-time-limit"
                      value={formData['refund-time-limit']}
                      onChange={(e) => handleInputChange('refund-time-limit', e.target.value)}
                      min="0" 
                      max="168"
                      className={`w-24 px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} text-sm`}
                    />
                    <span className="text-sm text-text-secondary">小时（课程开始前）</span>
                  </div>
                  <p className="text-xs text-text-secondary">家长可申请退款的最晚时间，超过此时间将无法申请退款</p>
                </div>

                {/* 退款审核时间 */}
                <div className="space-y-3">
                  <label htmlFor="refund-review-time" className="block text-sm font-medium text-text-primary">
                    退款审核时间限制
                  </label>
                  <div className="flex items-center space-x-4">
                    <input 
                      type="number" 
                      id="refund-review-time" 
                      name="refund-review-time"
                      value={formData['refund-review-time']}
                      onChange={(e) => handleInputChange('refund-review-time', e.target.value)}
                      min="0" 
                      max="72"
                      className={`w-24 px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} text-sm`}
                    />
                    <span className="text-sm text-text-secondary">小时（管理员审核时限）</span>
                  </div>
                  <p className="text-xs text-text-secondary">管理员需要在规定时间内完成退款申请的审核</p>
                </div>

                {/* 退款手续费 */}
                <div className="space-y-3">
                  <label htmlFor="refund-fee" className="block text-sm font-medium text-text-primary">
                    退款手续费比例
                  </label>
                  <div className="flex items-center space-x-4">
                    <input 
                      type="number" 
                      id="refund-fee" 
                      name="refund-fee"
                      value={formData['refund-fee']}
                      onChange={(e) => handleInputChange('refund-fee', e.target.value)}
                      min="0" 
                      max="50"
                      step="0.1"
                      className={`w-24 px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} text-sm`}
                    />
                    <span className="text-sm text-text-secondary">%（当前：免费退款）</span>
                  </div>
                  <p className="text-xs text-text-secondary">退款时收取的手续费比例，0表示免费退款</p>
                </div>
              </div>
            </section>

            {/* 系统限制配置 */}
            <section className={`bg-white rounded-xl shadow-card p-6 ${styles.configCard}`}>
              <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
                <i className="fas fa-shield-alt text-info mr-3"></i>
                系统限制配置
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 教师每周最大课程数 */}
                <div className="space-y-3">
                  <label htmlFor="teacher-weekly-limit" className="block text-sm font-medium text-text-primary">
                    教师每周最大课程数
                  </label>
                  <div className="flex items-center space-x-4">
                    <input 
                      type="number" 
                      id="teacher-weekly-limit" 
                      name="teacher-weekly-limit"
                      value={formData['teacher-weekly-limit']}
                      onChange={(e) => handleInputChange('teacher-weekly-limit', e.target.value)}
                      min="1" 
                      max="30"
                      className={`w-24 px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} text-sm`}
                    />
                    <span className="text-sm text-text-secondary">节/周</span>
                  </div>
                  <p className="text-xs text-text-secondary">限制教师每周最多可排课程数量，防止过度劳累</p>
                </div>

                {/* 课程最大容量 */}
                <div className="space-y-3">
                  <label htmlFor="course-capacity-limit" className="block text-sm font-medium text-text-primary">
                    单节课程最大容量
                  </label>
                  <div className="flex items-center space-x-4">
                    <input 
                      type="number" 
                      id="course-capacity-limit" 
                      name="course-capacity-limit"
                      value={formData['course-capacity-limit']}
                      onChange={(e) => handleInputChange('course-capacity-limit', e.target.value)}
                      min="1" 
                      max="50"
                      className={`w-24 px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} text-sm`}
                    />
                    <span className="text-sm text-text-secondary">人/节</span>
                  </div>
                  <p className="text-xs text-text-secondary">单节课程最多可报名的学生数量</p>
                </div>
              </div>
            </section>

            {/* 操作按钮区 */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border-light">
              <button 
                type="button" 
                onClick={handleCancel}
                className="px-6 py-3 border border-border-light text-text-secondary rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                取消
              </button>
              <button 
                type="submit" 
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium"
              >
                <i className="fas fa-save mr-2"></i>
                保存配置
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* 侧边栏遮罩 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={handleSidebarToggle}
        ></div>
      )}

      {/* 成功提示弹窗 */}
      {showSuccessModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={handleModalBackgroundClick}
        >
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check text-success text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">配置保存成功</h3>
              <p className="text-sm text-text-secondary mb-6">系统参数已更新，新配置将立即生效</p>
              <button 
                onClick={handleSuccessModalClose}
                className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSystemConfigPage;

