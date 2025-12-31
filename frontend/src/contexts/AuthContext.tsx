import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// 用户信息接口
export interface UserInfo {
  id: string;
  account: string;
  role: 'parent' | 'teacher' | 'admin';
  name?: string;
  teacher_id?: string;
  teacherName?: string;
  certificate?: string;
  neighborhood_id?: string;
  avg_score?: number;
  // 其他可能有的字段
}

// Auth上下文接口
interface AuthContextType {
  userInfo: UserInfo | null;
  login: (userInfo: UserInfo) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider组件
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const navigate = useNavigate();

  // 初始化时从localStorage加载用户信息
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('userInfo');
    if (savedUserInfo) {
      try {
        setUserInfo(JSON.parse(savedUserInfo));
      } catch (error) {
        console.error('解析用户信息失败:', error);
        localStorage.removeItem('userInfo');
      }
    }
  }, []);

  const login = (newUserInfo: UserInfo) => {
    setUserInfo(newUserInfo);
    localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
    navigate('/login-register');
  };

  const value: AuthContextType = {
    userInfo,
    login,
    logout,
    isLoggedIn: !!userInfo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};