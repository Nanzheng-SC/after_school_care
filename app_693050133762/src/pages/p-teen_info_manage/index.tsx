

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface Teenager {
  id: number;
  name: string;
  gender: string;
  birthdate: string;
  personality: string;
  health: string;
  interests: string[];
  learningStyle: string;
  learningNotes: string;
}

interface FormData {
  name: string;
  gender: string;
  birthdate: string;
  personality: string;
  health: string;
  interests: string[];
  learningStyle: string;
  learningNotes: string;
  otherInterests: string;
}

const TeenInfoManagePage: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTeenModalOpen, setIsTeenModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentEditingId, setCurrentEditingId] = useState<number | null>(null);
  const [currentDeletingId, setCurrentDeletingId] = useState<number | null>(null);
  const [teensData, setTeensData] = useState<Teenager[]>([
    {
      id: 1,
      name: '张小明',
      gender: '男',
      birthdate: '2016-05-15',
      personality: '活泼开朗，喜欢与人交流，好奇心强',
      health: '健康，无特殊状况',
      interests: ['阅读', '体育', '编程'],
      learningStyle: '动觉型',
      learningNotes: '动手能力强，喜欢实践操作，学习速度快'
    },
    {
      id: 2,
      name: '张小美',
      gender: '女',
      birthdate: '2018-09-22',
      personality: '文静细心，喜欢安静的活动',
      health: '健康，无特殊状况',
      interests: ['绘画', '音乐', '手工'],
      learningStyle: '视觉型',
      learningNotes: '对色彩敏感，喜欢通过图片和视频学习'
    }
  ]);

  // 表单数据
  const [formData, setFormData] = useState<FormData>({
    name: '',
    gender: '',
    birthdate: '',
    personality: '',
    health: '',
    interests: [],
    learningStyle: '',
    learningNotes: '',
    otherInterests: ''
  });

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '子女信息管理 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  // 计算年龄
  const calculateAge = (birthdate: string): string => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age + '岁';
  };

  // 格式化日期
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  };

  // 切换侧边栏
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 打开添加子女模态框
  const openAddModal = () => {
    setCurrentEditingId(null);
    resetForm();
    setIsTeenModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // 打开编辑子女模态框
  const openEditModal = (teenId: number) => {
    setCurrentEditingId(teenId);
    const teen = teensData.find(t => t.id === teenId);
    if (teen) {
      const formDataForEdit: FormData = {
        name: teen.name,
        gender: teen.gender,
        birthdate: teen.birthdate,
        personality: teen.personality || '',
        health: teen.health || '',
        interests: [...teen.interests],
        learningStyle: teen.learningStyle || '',
        learningNotes: teen.learningNotes || '',
        otherInterests: ''
      };
      setFormData(formDataForEdit);
    }
    setIsTeenModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // 关闭子女信息模态框
  const closeTeenModal = () => {
    setIsTeenModalOpen(false);
    document.body.style.overflow = 'auto';
    setCurrentEditingId(null);
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      name: '',
      gender: '',
      birthdate: '',
      personality: '',
      health: '',
      interests: [],
      learningStyle: '',
      learningNotes: '',
      otherInterests: ''
    });
  };

  // 处理表单输入变化
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 处理兴趣爱好复选框变化
  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  // 处理表单提交
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { otherInterests, ...mainFormData } = formData;
    const allInterests = [...mainFormData.interests];
    
    if (otherInterests) {
      const additionalInterests = otherInterests.split(',')
        .map(interest => interest.trim())
        .filter(interest => interest);
      allInterests.push(...additionalInterests);
    }

    const teenData: Teenager = {
      ...mainFormData,
      interests: allInterests,
      id: currentEditingId || Math.max(...teensData.map(t => t.id), 0) + 1
    };

    if (currentEditingId) {
      // 编辑模式
      setTeensData(prev => prev.map(teen => 
        teen.id === currentEditingId ? { ...teen, ...teenData } : teen
      ));
      showSuccessMessage('子女信息更新成功！');
    } else {
      // 添加模式
      setTeensData(prev => [...prev, teenData]);
      showSuccessMessage('子女信息添加成功！');
    }

    closeTeenModal();
    resetForm();
  };

  // 打开删除确认模态框
  const openDeleteModal = (teenId: number) => {
    setCurrentDeletingId(teenId);
    setIsDeleteModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // 关闭删除确认模态框
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    document.body.style.overflow = 'auto';
    setCurrentDeletingId(null);
  };

  // 确认删除
  const handleDeleteConfirm = () => {
    if (currentDeletingId) {
      setTeensData(prev => prev.filter(teen => teen.id !== currentDeletingId));
      closeDeleteModal();
      showSuccessMessage('子女信息删除成功！');
    }
  };

  // 显示成功消息
  const showSuccessMessage = (message: string) => {
    // 创建临时提示元素
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 right-6 bg-success text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    toast.innerHTML = `
      <div class="flex items-center space-x-2">
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // 显示提示
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);
    
    // 3秒后隐藏
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border-light h-16 z-50">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo区域 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleSidebar}
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
                className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
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
                  src="https://s.coze.cn/image/SOvJmAnV3oE/" 
                  alt="用户头像" 
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden md:block text-sm text-text-primary">张家长</span>
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
            to="/home" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-home w-5"></i>
            <span>首页</span>
          </Link>
          <Link 
            to="/course-list" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-book-open w-5"></i>
            <span>课程中心</span>
          </Link>
          <Link 
            to="/my-courses" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-user-graduate w-5"></i>
            <span>我的课程</span>
          </Link>
          <Link 
            to="/match-result" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-magic w-5"></i>
            <span>匹配结果</span>
          </Link>
          <Link 
            to="/course-calendar" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-calendar-alt w-5"></i>
            <span>课程日历</span>
          </Link>
          <Link 
            to="/parent-center" 
            className={`${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}
          >
            <i className="fas fa-user-circle w-5"></i>
            <span>家长中心</span>
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
                <h2 className="text-2xl font-bold text-text-primary mb-2">子女信息管理</h2>
                <nav className="text-sm text-text-secondary">
                  <Link to="/home" className="hover:text-primary">首页</Link>
                  <span className="mx-2">/</span>
                  <Link to="/parent-center" className="hover:text-primary">家长中心</Link>
                  <span className="mx-2">/</span>
                  <span className="text-text-primary">子女信息管理</span>
                </nav>
              </div>
              <button 
                onClick={openAddModal}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <i className="fas fa-plus mr-2"></i>添加子女
              </button>
            </div>
          </div>

          {/* 子女列表区 */}
          <section className="bg-white rounded-xl shadow-card">
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-light">
                      <th className="text-left py-3 px-4 font-semibold text-text-primary">姓名</th>
                      <th className="text-left py-3 px-4 font-semibold text-text-primary">性别</th>
                      <th className="text-left py-3 px-4 font-semibold text-text-primary">出生日期</th>
                      <th className="text-left py-3 px-4 font-semibold text-text-primary">年龄</th>
                      <th className="text-left py-3 px-4 font-semibold text-text-primary">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teensData.map(teen => (
                      <tr key={teen.id} className={`border-b border-border-light ${styles.tableRowHover}`}>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-primary font-medium text-sm">{teen.name.charAt(0)}</span>
                            </div>
                            <span className="font-medium text-text-primary">{teen.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-text-primary">{teen.gender}</td>
                        <td className="py-4 px-4 text-text-secondary">{formatDate(teen.birthdate)}</td>
                        <td className="py-4 px-4 text-text-primary">{calculateAge(teen.birthdate)}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => openEditModal(teen.id)}
                              className="px-3 py-1 text-primary hover:bg-primary/10 rounded-lg text-sm"
                            >
                              <i className="fas fa-edit mr-1"></i>编辑
                            </button>
                            <button 
                              onClick={() => openDeleteModal(teen.id)}
                              className="px-3 py-1 text-danger hover:bg-danger/10 rounded-lg text-sm"
                            >
                              <i className="fas fa-trash mr-1"></i>删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* 空状态 */}
              {teensData.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-user-plus text-3xl text-text-secondary"></i>
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">暂无子女信息</h3>
                  <p className="text-text-secondary mb-6">添加子女信息后，系统将为您推荐适合的课程</p>
                  <button 
                    onClick={openAddModal}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    <i className="fas fa-plus mr-2"></i>立即添加
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* 侧边栏遮罩 */}
      {isSidebarOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        ></div>
      )}

      {/* 子女信息编辑模态框 */}
      {isTeenModalOpen && (
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 ${styles.modalBackdrop} z-50`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeTeenModal();
            }
          }}
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className={`bg-white rounded-xl shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto ${styles.modalEnter}`}>
              <div className="flex items-center justify-between p-6 border-b border-border-light">
                <h3 className="text-xl font-bold text-text-primary">
                  {currentEditingId ? '编辑子女信息' : '添加子女信息'}
                </h3>
                <button 
                  onClick={closeTeenModal}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <i className="fas fa-times text-text-secondary"></i>
                </button>
              </div>
              
              <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
                {/* 基本信息 */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-text-primary">基本信息</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="teen-name" className="block text-sm font-medium text-text-primary">姓名 *</label>
                      <input 
                        type="text" 
                        id="teen-name" 
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                        placeholder="请输入子女姓名" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="teen-gender" className="block text-sm font-medium text-text-primary">性别 *</label>
                      <select 
                        id="teen-gender" 
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                        required
                      >
                        <option value="">请选择性别</option>
                        <option value="男">男</option>
                        <option value="女">女</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="teen-birthdate" className="block text-sm font-medium text-text-primary">出生日期 *</label>
                    <input 
                      type="date" 
                      id="teen-birthdate" 
                      value={formData.birthdate}
                      onChange={(e) => handleInputChange('birthdate', e.target.value)}
                      className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                      required 
                    />
                  </div>
                </div>
                
                {/* 个性特征 */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-text-primary">个性特征</h4>
                  
                  <div className="space-y-2">
                    <label htmlFor="teen-personality" className="block text-sm font-medium text-text-primary">性格特点</label>
                    <textarea 
                      id="teen-personality" 
                      rows={3}
                      value={formData.personality}
                      onChange={(e) => handleInputChange('personality', e.target.value)}
                      className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                      placeholder="例如：活泼开朗、认真细致、喜欢思考等"
                    ></textarea>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="teen-health" className="block text-sm font-medium text-text-primary">健康信息</label>
                    <textarea 
                      id="teen-health" 
                      rows={2}
                      value={formData.health}
                      onChange={(e) => handleInputChange('health', e.target.value)}
                      className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                      placeholder="如有特殊健康状况或过敏史，请在此说明"
                    ></textarea>
                  </div>
                </div>
                
                {/* 兴趣偏好 */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-text-primary">兴趣偏好</h4>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-primary">兴趣爱好 (可多选)</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['阅读', '绘画', '音乐', '体育', '编程', '手工', '数学', '英语', '科学'].map((interest) => (
                        <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={formData.interests.includes(interest)}
                            onChange={(e) => handleInterestChange(interest, e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm text-text-primary">{interest}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="teen-other-interests" className="block text-sm font-medium text-text-primary">其他兴趣爱好</label>
                    <input 
                      type="text" 
                      id="teen-other-interests" 
                      value={formData.otherInterests}
                      onChange={(e) => handleInputChange('otherInterests', e.target.value)}
                      className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                      placeholder="请输入其他兴趣爱好，用逗号分隔"
                    />
                  </div>
                </div>
                
                {/* 学习风格 */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-text-primary">学习风格</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">偏好的学习方式</label>
                      <div className="space-y-2">
                        {[
                          { value: '视觉型', label: '视觉型 - 喜欢通过图片、图表学习' },
                          { value: '听觉型', label: '听觉型 - 喜欢通过听讲、讨论学习' },
                          { value: '动觉型', label: '动觉型 - 喜欢通过实践、动手学习' },
                          { value: '读写型', label: '读写型 - 喜欢通过阅读、写作学习' }
                        ].map((style) => (
                          <label key={style.value} className="flex items-center space-x-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="learning-style" 
                              value={style.value}
                              checked={formData.learningStyle === style.value}
                              onChange={(e) => handleInputChange('learningStyle', e.target.value)}
                              className="rounded"
                            />
                            <span className="text-sm text-text-primary">{style.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="teen-learning-notes" className="block text-sm font-medium text-text-primary">学习特点说明</label>
                      <textarea 
                        id="teen-learning-notes" 
                        rows={3}
                        value={formData.learningNotes}
                        onChange={(e) => handleInputChange('learningNotes', e.target.value)}
                        className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                        placeholder="例如：学习速度快、需要重复练习、喜欢独立思考等"
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                {/* 操作按钮 */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border-light">
                  <button 
                    type="button" 
                    onClick={closeTeenModal}
                    className="px-6 py-2 border border-border-light text-text-secondary rounded-lg hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    保存
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认模态框 */}
      {isDeleteModalOpen && (
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 ${styles.modalBackdrop} z-50`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeDeleteModal();
            }
          }}
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className={`bg-white rounded-xl shadow-modal w-full max-w-md ${styles.modalEnter}`}>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-exclamation-triangle text-danger text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">确认删除</h3>
                <p className="text-text-secondary mb-6">删除后将无法恢复，确定要删除这位子女的信息吗？</p>
                <div className="flex items-center justify-center space-x-4">
                  <button 
                    onClick={closeDeleteModal}
                    className="px-6 py-2 border border-border-light text-text-secondary rounded-lg hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleDeleteConfirm}
                    className="px-6 py-2 bg-danger text-white rounded-lg hover:bg-danger/90"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeenInfoManagePage;

