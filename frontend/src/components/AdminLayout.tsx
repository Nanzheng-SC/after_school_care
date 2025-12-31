import React, { useState, useEffect } from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState<string>('管理员');
  const [userAvatar, setUserAvatar] = useState<string>('https://s.coze.cn/image/pauc4pB2CvY/');
  const location = useLocation();
  const navigate = useNavigate();

  // 获取用户信息
  useEffect(() => {
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        setUserName(userInfo.name || '管理员');
        if (userInfo.avatar) {
          setUserAvatar(userInfo.avatar);
        }
      } catch (error) {
        console.error('解析用户信息失败:', error);
      }
    }
  }, []);

  // 切换侧边栏
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 获取当前路径，用于设置活动状态
  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  // 获取当前路径的子路径，用于设置活动状态
  const isActiveChild = (path: string) => {
    return location.pathname === `/admin/${path}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        userRole="admin" 
        userName={userName} 
        userAvatar={userAvatar}
        onSidebarToggle={toggleSidebar}
      />

      {/* 左侧菜单 */}
      <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-border-light z-40 transform lg:transform-none transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="p-4 space-y-2">
          <Link 
            to="/admin/dashboard" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium ${isActiveChild('dashboard') ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'}`}
          >
            <i className="fas fa-tachometer-alt w-5"></i>
            <span>数据概览</span>
          </Link>
          <Link 
            to="/admin/user-manage" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium ${isActiveChild('user-manage') ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'}`}
          >
            <i className="fas fa-users w-5"></i>
            <span>用户管理</span>
          </Link>
          <Link 
            to="/admin/community-manage" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium ${isActiveChild('community-manage') ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'}`}
          >
            <i className="fas fa-building w-5"></i>
            <span>社区管理</span>
          </Link>
          <Link 
            to="/admin/course-manage" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium ${isActiveChild('course-manage') ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'}`}
          >
            <i className="fas fa-book-open w-5"></i>
            <span>课程管理</span>
          </Link>
          <Link 
            to="/admin/evaluation-manage" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium ${isActiveChild('evaluation-manage') ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'}`}
          >
            <i className="fas fa-star w-5"></i>
            <span>评价管理</span>
          </Link>
          <Link 
            to="/admin/system-config" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium ${isActiveChild('system-config') ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'}`}
          >
            <i className="fas fa-cog w-5"></i>
            <span>系统配置</span>
          </Link>
          <Link 
            to="/admin/report" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium ${isActiveChild('report') ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'}`}
          >
            <i className="fas fa-chart-bar w-5"></i>
            <span>数据报表</span>
          </Link>
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <Outlet />
      </main>

      {/* 侧边栏遮罩 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;