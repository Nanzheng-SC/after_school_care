import React, { useState, useEffect } from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';

interface LayoutProps {
  userRole: 'parent' | 'teacher' | 'admin';
  hideSearch?: boolean;
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ userRole, hideSearch = false, children }) => {
  const [userName, setUserName] = useState<string>('用户');
  const [userAvatar, setUserAvatar] = useState<string>('https://s.coze.cn/image/EjD5QpUcRr8/');

  useEffect(() => {
    // 从localStorage获取用户信息
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        // 根据用户角色获取不同的用户名字段
        if (userRole === 'parent') {
          setUserName(userInfo.fullName || userInfo.name || '家长用户');
        } else if (userRole === 'teacher') {
          setUserName(userInfo.name || '教师用户');
        } else if (userRole === 'admin') {
          setUserName(userInfo.name || '管理员');
        }
        // 如果有头像信息，设置头像
        if (userInfo.avatar) {
          setUserAvatar(userInfo.avatar);
        }
      } catch (error) {
        console.error('解析用户信息失败:', error);
      }
    }
  }, [userRole]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        userRole={userRole} 
        userName={userName} 
        userAvatar={userAvatar} 
        hideSearch={hideSearch} 
      />
      <main className="pt-16">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default Layout;