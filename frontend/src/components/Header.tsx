import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  userRole: 'parent' | 'teacher' | 'admin';
  userName?: string;
  userAvatar?: string;
  hideSearch?: boolean;
  onSidebarToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  userRole,
  userName = '用户',
  userAvatar = 'https://s.coze.cn/image/EjD5QpUcRr8/',
  hideSearch = false,
  onSidebarToggle
}) => {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('adminToken');
    navigate('/login-register');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-border-light h-16 z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo区域 */}
        <div className="flex items-center space-x-4">
          {onSidebarToggle && (
            <button 
              onClick={onSidebarToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <i className="fas fa-bars text-gray-600"></i>
            </button>
          )}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-graduation-cap text-white text-sm"></i>
            </div>
            <h1 className="text-xl font-bold text-text-primary">课智配</h1>
          </div>
        </div>
        
        {/* 搜索框（可隐藏） */}
        {!hideSearch && (
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="搜索课程、教师..." 
                className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm"></i>
            </div>
          </div>
        )}
        
        {/* 用户头像与退出登录 */}
        <div className="relative">
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
          >
            <img 
              src={userAvatar} 
              alt={`${userName}头像`} 
              className="w-8 h-8 rounded-full"
            />
            <span className="hidden md:block text-sm text-text-primary">{userName}</span>
            <i className="fas fa-chevron-down text-xs text-text-secondary"></i>
          </button>
          
          {/* 下拉菜单 */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-gray-100"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>退出登录
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;