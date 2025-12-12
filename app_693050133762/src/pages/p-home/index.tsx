

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [globalSearchValue, setGlobalSearchValue] = useState('');

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '课智配 - 智能匹配课后托管服务';
    return () => { document.title = originalTitle; };
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleUserMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleDocumentClick = () => {
    setIsUserDropdownOpen(false);
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const handleQuickFindTeacher = () => {
    navigate('/match-result');
  };

  const handleQuickViewCourses = () => {
    navigate('/course-list');
  };

  const handleQuickMyCourses = () => {
    navigate('/my-courses');
  };

  const handleQuickAddChild = () => {
    navigate('/teen-info-manage');
  };

  const handleCourseCardClick = (courseId: string, e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('button')) {
      navigate(`/course-detail?courseId=${courseId}`);
    }
  };

  const handleEnrollButtonClick = (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation();
    console.log(`打开支付确认弹窗，课程ID: ${courseId}`);
    // 实际实现中应该是：
    // window.open(`/payment-confirm?courseId=${courseId}`, 'payment', 'width=600,height=500');
  };

  const handleMessageCenterClick = () => {
    console.log('打开消息中心');
    // 实际实现中应该打开消息中心侧边抽屉
  };

  const handleAnnouncementClick = () => {
    console.log('查看公告详情');
    // 实际实现中应该跳转到公告详情页或打开详情弹窗
  };

  const handleViewAllAnnouncements = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('查看全部公告');
    // 实际实现中应该跳转到公告列表页
  };

  const handleGlobalSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const searchTerm = globalSearchValue.trim();
      if (searchTerm) {
        navigate(`/course-list?search=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  const handleUserLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('确定要退出登录吗？')) {
      navigate('/login-register');
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
                value={globalSearchValue}
                onChange={(e) => setGlobalSearchValue(e.target.value)}
                onKeyPress={handleGlobalSearchKeyPress}
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
              onClick={handleMessageCenterClick}
              className="relative p-2 rounded-lg hover:bg-gray-100"
            >
              <i className="fas fa-bell text-text-secondary"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            
            {/* 用户头像 */}
            <div className="relative">
              <button 
                onClick={handleUserMenuToggle}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
              >
                <img 
                  src="https://s.coze.cn/image/OUgZ3szV3ss/" 
                  alt="用户头像" 
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden md:block text-sm text-text-primary">张家长</span>
                <i className="fas fa-chevron-down text-xs text-text-secondary"></i>
              </button>
              
              {/* 用户下拉菜单 */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-border-light z-10">
                  <Link 
                    to="/parent-center" 
                    className="block px-4 py-3 text-sm text-text-primary hover:bg-gray-50"
                  >
                    <i className="fas fa-user-circle mr-2"></i>个人中心
                  </Link>
                  <div className="border-t border-border-light"></div>
                  <Link 
                    to="/login-register" 
                    onClick={handleUserLogout}
                    className="block px-4 py-3 text-sm text-danger hover:bg-gray-50"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>退出登录
                  </Link>
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
            to="/home" 
            className={`${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}
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
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
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
            <h2 className="text-2xl font-bold text-text-primary mb-2">欢迎回来，张家长</h2>
            <p className="text-text-secondary">为您的孩子找到最适合的课后托管课程</p>
          </div>

          {/* 快捷入口区 */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <button 
                onClick={handleQuickFindTeacher}
                className={`bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover ${styles.cardHover} text-left`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-search text-primary text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">为孩子找老师</h3>
                    <p className="text-sm text-text-secondary">智能匹配推荐</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={handleQuickViewCourses}
                className={`bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover ${styles.cardHover} text-left`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-book text-success text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">浏览课程</h3>
                    <p className="text-sm text-text-secondary">丰富课程选择</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={handleQuickMyCourses}
                className={`bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover ${styles.cardHover} text-left`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-calendar-check text-warning text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">我的课程</h3>
                    <p className="text-sm text-text-secondary">管理已报名课程</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={handleQuickAddChild}
                className={`bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover ${styles.cardHover} text-left`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-user-plus text-info text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">添加子女</h3>
                    <p className="text-sm text-text-secondary">完善子女信息</p>
                  </div>
                </div>
              </button>
            </div>
          </section>

          {/* 推荐课程区 */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-text-primary">为您推荐</h3>
              <Link 
                to="/course-list" 
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                查看更多 <i className="fas fa-arrow-right ml-1"></i>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 课程卡片1 */}
              <div 
                onClick={(e) => handleCourseCardClick('course1', e)}
                className={`bg-white rounded-xl shadow-card hover:shadow-card-hover ${styles.cardHover} overflow-hidden cursor-pointer`}
              >
                <img 
                  src="https://s.coze.cn/image/gpjbKFJD228/" 
                  alt="数学思维训练课程" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">学科类</span>
                    <span className="px-3 py-1 bg-gray-100 text-text-secondary text-xs font-medium rounded-full">7-10岁</span>
                  </div>
                  <h4 className="font-semibold text-text-primary mb-2">数学思维训练</h4>
                  <p className="text-sm text-text-secondary mb-4">通过趣味游戏和互动练习，培养孩子的数学思维能力和逻辑推理能力。</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <img 
                        src="https://s.coze.cn/image/8A_pf1ijl1s/" 
                        alt="李老师头像" 
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-text-secondary">李老师</span>
                      <div className="flex items-center space-x-1">
                        <i className="fas fa-star text-warning text-xs"></i>
                        <span className="text-xs text-text-secondary">4.9</span>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-primary">¥80</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-text-secondary mb-4">
                    <span><i className="fas fa-clock mr-1"></i>周六 14:00-16:00</span>
                    <span><i className="fas fa-map-marker-alt mr-1"></i>阳光社区</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">已预约 8/12人</span>
                    <button 
                      onClick={(e) => handleEnrollButtonClick(e, 'course1')}
                      className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                    >
                      立即报名
                    </button>
                  </div>
                </div>
              </div>

              {/* 课程卡片2 */}
              <div 
                onClick={(e) => handleCourseCardClick('course2', e)}
                className={`bg-white rounded-xl shadow-card hover:shadow-card-hover ${styles.cardHover} overflow-hidden cursor-pointer`}
              >
                <img 
                  src="https://s.coze.cn/image/8JPcmdrnJws/" 
                  alt="创意绘画课程" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">艺术类</span>
                    <span className="px-3 py-1 bg-gray-100 text-text-secondary text-xs font-medium rounded-full">4-6岁</span>
                  </div>
                  <h4 className="font-semibold text-text-primary mb-2">创意绘画启蒙</h4>
                  <p className="text-sm text-text-secondary mb-4">激发孩子的想象力和创造力，通过色彩和形状表达内心世界。</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <img 
                        src="https://s.coze.cn/image/70kvRXdmMNU/" 
                        alt="王老师头像" 
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-text-secondary">王老师</span>
                      <div className="flex items-center space-x-1">
                        <i className="fas fa-star text-warning text-xs"></i>
                        <span className="text-xs text-text-secondary">4.8</span>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-primary">¥60</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-text-secondary mb-4">
                    <span><i className="fas fa-clock mr-1"></i>周日 10:00-11:30</span>
                    <span><i className="fas fa-map-marker-alt mr-1"></i>绿洲社区</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">已预约 5/10人</span>
                    <button 
                      onClick={(e) => handleEnrollButtonClick(e, 'course2')}
                      className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                    >
                      立即报名
                    </button>
                  </div>
                </div>
              </div>

              {/* 课程卡片3 */}
              <div 
                onClick={(e) => handleCourseCardClick('course3', e)}
                className={`bg-white rounded-xl shadow-card hover:shadow-card-hover ${styles.cardHover} overflow-hidden cursor-pointer`}
              >
                <img 
                  src="https://s.coze.cn/image/2YvEarGtU4s/" 
                  alt="编程入门课程" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-3 py-1 bg-info/10 text-info text-xs font-medium rounded-full">科技类</span>
                    <span className="px-3 py-1 bg-gray-100 text-text-secondary text-xs font-medium rounded-full">11-14岁</span>
                  </div>
                  <h4 className="font-semibold text-text-primary mb-2">Scratch编程入门</h4>
                  <p className="text-sm text-text-secondary mb-4">通过可视化编程工具，让孩子学习编程逻辑和问题解决能力。</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <img 
                        src="https://s.coze.cn/image/nZapXZpiwh0/" 
                        alt="陈老师头像" 
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-text-secondary">陈老师</span>
                      <div className="flex items-center space-x-1">
                        <i className="fas fa-star text-warning text-xs"></i>
                        <span className="text-xs text-text-secondary">4.7</span>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-primary">¥100</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-text-secondary mb-4">
                    <span><i className="fas fa-clock mr-1"></i>周五 18:30-20:00</span>
                    <span><i className="fas fa-map-marker-alt mr-1"></i>智慧社区</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">已预约 3/8人</span>
                    <button 
                      onClick={(e) => handleEnrollButtonClick(e, 'course3')}
                      className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                    >
                      立即报名
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 公告信息区 */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">最新公告</h3>
                <button 
                  onClick={handleViewAllAnnouncements}
                  className="text-primary hover:text-primary/80 text-sm"
                >
                  查看全部
                </button>
              </div>
              
              <div className="space-y-4">
                <div 
                  onClick={handleAnnouncementClick}
                  className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary mb-1">系统升级通知</h4>
                    <p className="text-sm text-text-secondary mb-2">为了提供更好的服务体验，系统将于本周日凌晨2:00-4:00进行升级维护。</p>
                    <span className="text-xs text-text-secondary">2024-01-15</span>
                  </div>
                </div>
                
                <div 
                  onClick={handleAnnouncementClick}
                  className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary mb-1">新教师入驻</h4>
                    <p className="text-sm text-text-secondary mb-2">本周新增5位优秀教师入驻平台，涵盖数学、英语、艺术等多个领域。</p>
                    <span className="text-xs text-text-secondary">2024-01-12</span>
                  </div>
                </div>
                
                <div 
                  onClick={handleAnnouncementClick}
                  className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary mb-1">寒假课程安排</h4>
                    <p className="text-sm text-text-secondary mb-2">寒假期间课程安排已更新，新增多种兴趣班和托管服务。</p>
                    <span className="text-xs text-text-secondary">2024-01-10</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 数据概览区 */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">已报名课程</p>
                    <p className="text-2xl font-bold text-text-primary">5</p>
                    <p className="text-xs text-success mt-1">
                      <i className="fas fa-arrow-up mr-1"></i>+2 本月
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-book text-primary text-xl"></i>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">智能匹配</p>
                    <p className="text-2xl font-bold text-text-primary">12</p>
                    <p className="text-xs text-success mt-1">
                      <i className="fas fa-arrow-up mr-1"></i>+3 本周
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-magic text-success text-xl"></i>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">待评价课程</p>
                    <p className="text-2xl font-bold text-text-primary">2</p>
                    <p className="text-xs text-warning mt-1">
                      <i className="fas fa-clock mr-1"></i>请及时评价
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-star text-warning text-xl"></i>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">子女数量</p>
                    <p className="text-2xl font-bold text-text-primary">2</p>
                    <p className="text-xs text-text-secondary mt-1">
                      <i className="fas fa-user-plus mr-1"></i>可添加更多
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-users text-info text-xl"></i>
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

export default HomePage;

