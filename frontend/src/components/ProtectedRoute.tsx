import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'parent' | 'teacher' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { userInfo, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login-register" replace />;
  }

  if (requiredRole && userInfo?.role !== requiredRole) {
    // 根据用户角色重定向到相应页面
    if (userInfo?.role === 'teacher') {
      return <Navigate to="/teacher-center" replace />;
    } else if (userInfo?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;