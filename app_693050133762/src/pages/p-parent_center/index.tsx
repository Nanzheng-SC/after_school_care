

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface PersonalInfo {
  fullName: string;
  phone: string;
  email: string;
}

interface FamilyInfo {
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
}

const ParentCenter: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPersonalEditMode, setIsPersonalEditMode] = useState(false);
  const [isFamilyEditMode, setIsFamilyEditMode] = useState(false);
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
  
  // 表单数据
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '张小明',
    phone: '13812348888',
    email: 'zhangxiaoming@example.com'
  });
  
  const [familyInfo, setFamilyInfo] = useState<FamilyInfo>({
    address: '北京市朝阳区阳光花园3号楼2单元102室',
    emergencyContact: '李小红',
    emergencyPhone: '13912349999'
  });

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '家长中心 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  // 侧边栏切换
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 个人信息编辑
  const handlePersonalEdit = () => {
    setIsPersonalEditMode(true);
  };

  const handlePersonalCancel = () => {
    setIsPersonalEditMode(false);
  };

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('个人信息保存成功', personalInfo);
    setIsPersonalEditMode(false);
  };

  // 家庭信息编辑
  const handleFamilyEdit = () => {
    setIsFamilyEditMode(true);
  };

  const handleFamilyCancel = () => {
    setIsFamilyEditMode(false);
  };

  const handleFamilySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('家庭信息保存成功', familyInfo);
    setIsFamilyEditMode(false);
  };

  // 优先级设置
  const handlePriorityOpen = () => {
    setIsPriorityModalOpen(true);
  };

  const handlePriorityClose = () => {
    setIsPriorityModalOpen(false);
  };

  const handlePrioritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('优先级设置保存成功');
    setIsPriorityModalOpen(false);
  };

  // 管理子女信息
  const handleManageChildren = () => {
    navigate('/teen-info-manage');
  };

  // 消息中心
  const handleMessageCenter = () => {
    console.log('打开消息中心');
  };

  // 支付管理
  const handleManagePayment = () => {
    console.log('跳转到支付管理页面');
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
            <button 
              onClick={handleMessageCenter}
              className="relative p-2 rounded-lg hover:bg-gray-100"
            >
              <i className="fas fa-bell text-text-secondary"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            
            {/* 用户头像 */}
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
                <img 
                  src="https://s.coze.cn/image/EjD5QpUcRr8/" 
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
                <h2 className="text-2xl font-bold text-text-primary mb-2">家长中心</h2>
                <nav className="text-sm text-text-secondary">
                  <span>首页</span>
                  <i className="fas fa-chevron-right mx-2"></i>
                  <span className="text-primary">家长中心</span>
                </nav>
              </div>
            </div>
          </div>

          {/* 个人信息区 */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">个人信息</h3>
                {!isPersonalEditMode && (
                  <button 
                    onClick={handlePersonalEdit}
                    className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                  >
                    <i className="fas fa-edit mr-2"></i>编辑
                  </button>
                )}
              </div>
              
              {!isPersonalEditMode && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <i className="fas fa-user text-primary text-xl"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-text-primary">{personalInfo.fullName}</h4>
                        <p className="text-sm text-text-secondary">家长姓名</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                        <i className="fas fa-phone text-success text-xl"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-text-primary">{personalInfo.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3')}</h4>
                        <p className="text-sm text-text-secondary">联系电话</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                        <i className="fas fa-envelope text-info text-xl"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-text-primary">{personalInfo.email.replace(/(.{4})(.*)(@.*)/, '$1***$3')}</h4>
                        <p className="text-sm text-text-secondary">邮箱地址</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {isPersonalEditMode && (
                <form onSubmit={handlePersonalSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="full-name" className="block text-sm font-medium text-text-primary mb-2">姓名</label>
                      <input 
                        type="text" 
                        id="full-name" 
                        value={personalInfo.fullName}
                        onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                        className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">联系电话</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        value={personalInfo.phone}
                        onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                        className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">邮箱地址</label>
                      <input 
                        type="email" 
                        id="email" 
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                        className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <button 
                      type="button" 
                      onClick={handlePersonalCancel}
                      className="px-4 py-2 border border-border-light rounded-lg hover:bg-gray-50"
                    >
                      取消
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                      保存
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>

          {/* 家庭信息区 */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">家庭信息</h3>
                {!isFamilyEditMode && (
                  <button 
                    onClick={handleFamilyEdit}
                    className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                  >
                    <i className="fas fa-edit mr-2"></i>编辑
                  </button>
                )}
              </div>
              
              {!isFamilyEditMode && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                        <i className="fas fa-home text-warning text-xl"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-text-primary">{familyInfo.address}</h4>
                        <p className="text-sm text-text-secondary">家庭住址</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-danger/10 rounded-lg flex items-center justify-center">
                        <i className="fas fa-user-friends text-danger text-xl"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-text-primary">{familyInfo.emergencyContact}</h4>
                        <p className="text-sm text-text-secondary">紧急联系人</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                        <i className="fas fa-phone-alt text-info text-xl"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-text-primary">{familyInfo.emergencyPhone.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3')}</h4>
                        <p className="text-sm text-text-secondary">紧急联系电话</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {isFamilyEditMode && (
                <form onSubmit={handleFamilySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-text-primary mb-2">家庭住址</label>
                      <textarea 
                        id="address" 
                        rows={3}
                        value={familyInfo.address}
                        onChange={(e) => setFamilyInfo({...familyInfo, address: e.target.value})}
                        className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                      />
                    </div>
                    <div>
                      <label htmlFor="emergency-contact" className="block text-sm font-medium text-text-primary mb-2">紧急联系人</label>
                      <input 
                        type="text" 
                        id="emergency-contact" 
                        value={familyInfo.emergencyContact}
                        onChange={(e) => setFamilyInfo({...familyInfo, emergencyContact: e.target.value})}
                        className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                      />
                    </div>
                    <div>
                      <label htmlFor="emergency-phone" className="block text-sm font-medium text-text-primary mb-2">紧急联系电话</label>
                      <input 
                        type="tel" 
                        id="emergency-phone" 
                        value={familyInfo.emergencyPhone}
                        onChange={(e) => setFamilyInfo({...familyInfo, emergencyPhone: e.target.value})}
                        className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <button 
                      type="button" 
                      onClick={handleFamilyCancel}
                      className="px-4 py-2 border border-border-light rounded-lg hover:bg-gray-50"
                    >
                      取消
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                      保存
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>

          {/* 支付信息区 */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">支付信息</h3>
                <button 
                  onClick={handleManagePayment}
                  className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  <i className="fas fa-credit-card mr-2"></i>管理
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border-light rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <i className="fab fa-weixin text-success text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary">微信支付</h4>
                      <p className="text-sm text-text-secondary">已绑定：138****8888</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">已绑定</span>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-border-light rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                      <i className="fab fa-alipay text-info text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary">支付宝</h4>
                      <p className="text-sm text-text-secondary">已绑定：zhang***@example.com</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">已绑定</span>
                </div>
                
                <div className="flex items-center justify-between p-4 border-2 border-dashed border-border-light rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-plus text-text-secondary text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary">添加银行卡</h4>
                      <p className="text-sm text-text-secondary">支持各大银行储蓄卡</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                    添加
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 子女信息概览 */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">子女信息</h3>
                <button 
                  onClick={handleManageChildren}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  <i className="fas fa-users mr-2"></i>管理子女信息
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 border border-border-light rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-child text-primary text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary">张小华</h4>
                      <p className="text-sm text-text-secondary">8岁，男</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">兴趣爱好：</span>
                      <span className="text-text-primary">数学、编程</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">学习风格：</span>
                      <span className="text-text-primary">逻辑思维型</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">当前课程：</span>
                      <span className="text-text-primary">3门</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-border-light rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-girl text-success text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary">张小美</h4>
                      <p className="text-sm text-text-secondary">6岁，女</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">兴趣爱好：</span>
                      <span className="text-text-primary">绘画、音乐</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">学习风格：</span>
                      <span className="text-text-primary">艺术创造型</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">当前课程：</span>
                      <span className="text-text-primary">2门</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-2 border-dashed border-border-light rounded-lg flex items-center justify-center">
                  <button onClick={handleManageChildren} className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <i className="fas fa-user-plus text-text-secondary text-xl"></i>
                    </div>
                    <h4 className="font-medium text-text-primary mb-1">添加子女</h4>
                    <p className="text-sm text-text-secondary">为更多孩子安排课程</p>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 冲突解决优先级设置 */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">冲突解决优先级</h3>
                <button 
                  onClick={handlePriorityOpen}
                  className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  <i className="fas fa-cog mr-2"></i>设置
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 border border-border-light rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-text-primary">当前优先级</h4>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">课程评分优先</span>
                  </div>
                  <p className="text-sm text-text-secondary">当课程预约发生冲突时，系统将按照以下优先级为您推荐解决方案：</p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 bg-primary text-white text-xs rounded-full flex items-center justify-center">1</span>
                      <span className="text-sm text-text-primary">课程评分</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 bg-secondary text-white text-xs rounded-full flex items-center justify-center">2</span>
                      <span className="text-sm text-text-primary">教师评分</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 bg-secondary text-white text-xs rounded-full flex items-center justify-center">3</span>
                      <span className="text-sm text-text-primary">课程类型</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 侧边栏遮罩 */}
      {isSidebarOpen && (
        <div 
          onClick={handleSidebarToggle}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        ></div>
      )}

      {/* 冲突解决优先级设置弹窗 */}
      {isPriorityModalOpen && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalOverlay} onClick={handlePriorityClose}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className={`${styles.modalContent} bg-white rounded-xl shadow-xl max-w-md w-full`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-text-primary">设置冲突解决优先级</h3>
                  <button 
                    onClick={handlePriorityClose}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
                
                <form onSubmit={handlePrioritySubmit} className="space-y-4">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-text-primary">优先级顺序</label>
                    
                    <div>
                      <label className="flex items-center space-x-3 p-3 border border-border-light rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="radio" name="priority-1" value="course-rating" className="text-primary focus:ring-primary" defaultChecked />
                        <span className="flex-1">课程评分</span>
                        <span className="w-6 h-6 bg-primary text-white text-xs rounded-full flex items-center justify-center">1</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="flex items-center space-x-3 p-3 border border-border-light rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="radio" name="priority-2" value="teacher-rating" className="text-primary focus:ring-primary" defaultChecked />
                        <span className="flex-1">教师评分</span>
                        <span className="w-6 h-6 bg-secondary text-white text-xs rounded-full flex items-center justify-center">2</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="flex items-center space-x-3 p-3 border border-border-light rounded-lg cursor-pointer hover:bg-gray-50">
                        <input type="radio" name="priority-3" value="course-type" className="text-primary focus:ring-primary" defaultChecked />
                        <span className="flex-1">课程类型</span>
                        <span className="w-6 h-6 bg-secondary text-white text-xs rounded-full flex items-center justify-center">3</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <button 
                      type="button" 
                      onClick={handlePriorityClose}
                      className="px-4 py-2 border border-border-light rounded-lg hover:bg-gray-50"
                    >
                      取消
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                      保存设置
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentCenter;

