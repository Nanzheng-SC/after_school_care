

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const AdminDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [globalSearchValue, setGlobalSearchValue] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '管理员后台 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleGlobalSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const searchTerm = globalSearchValue.trim();
      if (searchTerm) {
        console.log('搜索:', searchTerm);
        // 这里可以实现搜索功能
      }
    }
  };

  const handleMessageCenterClick = () => {
    console.log('打开消息中心');
    // 这里可以实现消息中心的侧边抽屉
  };

  const handleUserMenuClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      // 清除登录状态，例如清除localStorage中的token
      localStorage.removeItem('adminToken');
      // 跳转到登录页面
      navigate('/login-register');
    }
  };

  const handleQuickReviewCourses = () => {
    navigate('/admin-course-manage?status=pending');
  };

  const handleQuickReviewEvaluations = () => {
    navigate('/admin-evaluation-manage?status=pending');
  };

  const handleQuickManageRefunds = () => {
    navigate('/admin-refund-manage');
  };

  const handleQuickManageUsers = () => {
    navigate('/admin-user-manage');
  };

  const handleQuickSystemConfig = () => {
    navigate('/admin-system-config');
  };

  const handleQuickViewReports = () => {
    navigate('/admin-report');
  };

  const handleStatPendingCoursesClick = () => {
    navigate('/admin-course-manage?status=pending');
  };

  const handleStatPendingEvaluationsClick = () => {
    navigate('/admin-evaluation-manage?status=pending');
  };

  const handleStatPendingRefundsClick = () => {
    navigate('/admin-refund-manage');
  };

  const handleStatTotalUsersClick = () => {
    navigate('/admin-user-manage');
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
              <h1 className="text-xl font-bold text-text-primary">课智配 - 管理员后台</h1>
            </div>
          </div>
          
          {/* 搜索框 */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                value={globalSearchValue}
                onChange={(e) => setGlobalSearchValue(e.target.value)}
                onKeyPress={handleGlobalSearchKeyPress}
                placeholder="搜索用户、课程..." 
                className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm"></i>
            </div>
          </div>
          
          {/* 右侧操作区 */}
          <div className="flex items-center space-x-4">
            {/* 消息中心 */}
            <button 
              onClick={handleMessageCenterClick}
              className="relative p-2 rounded-lg hover:bg-gray-100"
            >
              <i className="fas fa-bell text-text-secondary"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            
            {/* 用户头像 */}
            <div className="relative">
              <button 
                onClick={handleUserMenuClick}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
              >
                <img 
                  src="https://s.coze.cn/image/0aoMVIeWe-U/" 
                  alt="管理员头像" 
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden md:block text-sm text-text-primary">管理员</span>
                <i className={`fas fa-chevron-down text-xs text-text-secondary transition-transform ${isUserMenuOpen ? 'transform rotate-180' : ''}`}></i>
              </button>
              
              {/* 用户下拉菜单 */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border-light z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <i className="fas fa-sign-out-alt text-text-secondary"></i>
                    <span>退出登录</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 左侧菜单 */}
      <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-border-light ${styles.sidebarTransition} z-40 transform lg:transform-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="p-4 space-y-2">
          <Link 
            to="/admin-dashboard" 
            className={`${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}
          >
            <i className="fas fa-tachometer-alt w-5"></i>
            <span>控制台</span>
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
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
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
            <h2 className="text-2xl font-bold text-text-primary mb-2">欢迎回来，管理员</h2>
            <p className="text-text-secondary">系统管理控制台 - 实时监控和管理平台运营状况</p>
          </div>

          {/* 数据概览区 */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div 
                onClick={handleStatPendingCoursesClick}
                className={`${styles.statCard} rounded-xl p-6 shadow-card cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">待审核课程</p>
                    <p className="text-2xl font-bold text-warning">12</p>
                    <p className="text-xs text-warning mt-1">
                      <i className="fas fa-arrow-up mr-1"></i>+3 今日
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-hourglass-half text-warning text-xl"></i>
                  </div>
                </div>
              </div>
              
              <div 
                onClick={handleStatPendingEvaluationsClick}
                className={`${styles.statCard} rounded-xl p-6 shadow-card cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">待审核评价</p>
                    <p className="text-2xl font-bold text-info">8</p>
                    <p className="text-xs text-success mt-1">
                      <i className="fas fa-arrow-down mr-1"></i>-2 今日
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-comments text-info text-xl"></i>
                  </div>
                </div>
              </div>
              
              <div 
                onClick={handleStatPendingRefundsClick}
                className={`${styles.statCard} rounded-xl p-6 shadow-card cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">待处理退款</p>
                    <p className="text-2xl font-bold text-danger">5</p>
                    <p className="text-xs text-text-secondary mt-1">
                      <i className="fas fa-clock mr-1"></i>需要处理
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-danger/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-undo text-danger text-xl"></i>
                  </div>
                </div>
              </div>
              
              <div 
                onClick={handleStatTotalUsersClick}
                className={`${styles.statCard} rounded-xl p-6 shadow-card cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">总用户数</p>
                    <p className="text-2xl font-bold text-success">2,847</p>
                    <p className="text-xs text-success mt-1">
                      <i className="fas fa-arrow-up mr-1"></i>+156 本月
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-users text-success text-xl"></i>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 快捷入口区 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-text-primary mb-6">快捷操作</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <button 
                onClick={handleQuickReviewCourses}
                className={`${styles.actionCard} bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover text-left`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-book text-warning text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">审核课程</h4>
                    <p className="text-sm text-text-secondary">处理待审核课程申请</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-warning/10 text-warning text-xs rounded-full">12 待处理</span>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={handleQuickReviewEvaluations}
                className={`${styles.actionCard} bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover text-left`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-star text-info text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">审核评价</h4>
                    <p className="text-sm text-text-secondary">管理用户评价内容</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-info/10 text-info text-xs rounded-full">8 待审核</span>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={handleQuickManageRefunds}
                className={`${styles.actionCard} bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover text-left`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-danger/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-undo text-danger text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">处理退款</h4>
                    <p className="text-sm text-text-secondary">审核用户退款申请</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-danger/10 text-danger text-xs rounded-full">5 待处理</span>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={handleQuickManageUsers}
                className={`${styles.actionCard} bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover text-left`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-user-cog text-primary text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">用户管理</h4>
                    <p className="text-sm text-text-secondary">管理家长和教师账户</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">2,847 总用户</span>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={handleQuickSystemConfig}
                className={`${styles.actionCard} bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover text-left`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-cog text-secondary text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">系统配置</h4>
                    <p className="text-sm text-text-secondary">配置系统参数和规则</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">系统设置</span>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={handleQuickViewReports}
                className={`${styles.actionCard} bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover text-left`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-chart-line text-success text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">数据报表</h4>
                    <p className="text-sm text-text-secondary">查看系统运营数据</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-success/10 text-success text-xs rounded-full">数据分析</span>
                  </div>
                </div>
              </button>
            </div>
          </section>

          {/* 最新动态区 */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">最新动态</h3>
                <Link to="#" className="text-primary hover:text-primary/80 text-sm">查看全部</Link>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-text-primary">
                      <strong>李老师</strong> 发布了新课程 <strong>"高级数学思维训练"</strong>，等待审核
                    </p>
                    <p className="text-xs text-text-secondary mt-1">2分钟前</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50">
                  <div className="w-2 h-2 bg-info rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-text-primary">
                      <strong>张家长</strong> 提交了课程评价，需要审核
                    </p>
                    <p className="text-xs text-text-secondary mt-1">15分钟前</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50">
                  <div className="w-2 h-2 bg-danger rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-text-primary">
                      <strong>王家长</strong> 申请了课程退款，等待处理
                    </p>
                    <p className="text-xs text-text-secondary mt-1">32分钟前</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-text-primary">
                      系统新增 <strong>5位</strong> 注册用户，包括3位家长和2位教师
                    </p>
                    <p className="text-xs text-text-secondary mt-1">1小时前</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-text-primary">
                      <strong>刘老师</strong> 完成了课程 <strong>"创意绘画启蒙"</strong>，等待家长评价
                    </p>
                    <p className="text-xs text-text-secondary mt-1">2小时前</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 系统状态区 */}
          <section className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 今日数据 */}
              <div className="bg-white rounded-xl shadow-card p-6">
                <h4 className="font-semibold text-text-primary mb-4">今日数据</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">新增用户</span>
                    <span className="text-lg font-bold text-success">+12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">课程报名</span>
                    <span className="text-lg font-bold text-primary">28</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">课程完成</span>
                    <span className="text-lg font-bold text-warning">15</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">新评价</span>
                    <span className="text-lg font-bold text-info">9</span>
                  </div>
                </div>
              </div>

              {/* 系统状态 */}
              <div className="bg-white rounded-xl shadow-card p-6">
                <h4 className="font-semibold text-text-primary mb-4">系统状态</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">服务器状态</span>
                    <span className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm text-success">正常</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">数据库连接</span>
                    <span className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm text-success">正常</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">API响应时间</span>
                    <span className="text-sm text-text-primary">120ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">在线用户</span>
                    <span className="text-sm text-text-primary">146人</span>
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
    </div>
  );
};

export default AdminDashboard;

