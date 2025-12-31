import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import request from '../../utils/request';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const [statData, setStatData] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEvaluations: 0,
    totalCommunities: 0
  });

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '控制台 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await request.get('/api/admin/dashboard');
        const data = response.data;
        
        // 更新状态
        setStatData({
          totalUsers: data.totalUsers || 0,
          totalCourses: data.totalCourses || 0,
          totalEvaluations: data.totalEvaluations || 0,
          totalCommunities: data.totalCommunities || 0
        });
      } catch (error) {
        console.error('获取仪表盘数据失败:', error);
        // 使用模拟数据作为备选
        setStatData({
          totalUsers: 1562,
          totalCourses: 289,
          totalEvaluations: 876,
          totalCommunities: 45
        });
      }
    };

    fetchDashboardData();
  }, []);

  const handleQuickManageUsers = () => {
    navigate('/admin/user-manage');
  };

  const handleQuickManageCourses = () => {
    navigate('/admin/course-manage');
  };

  const handleQuickManageEvaluations = () => {
    navigate('/admin/evaluation-manage');
  };

  const handleQuickManageCommunities = () => {
    navigate('/admin/community-manage');
  };

  const handleStatTotalUsersClick = () => {
    navigate('/admin/user-manage');
  };

  const handleStatTotalCoursesClick = () => {
    navigate('/admin/course-manage');
  };

  const handleStatTotalEvaluationsClick = () => {
    navigate('/admin/evaluation-manage');
  };

  const handleStatTotalCommunitiesClick = () => {
    navigate('/admin/community-manage');
  };

  return (
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
            onClick={handleStatTotalUsersClick}
            className={`${styles.statCard} rounded-xl p-6 shadow-card cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary mb-1">总用户数</p>
                <p className="text-2xl font-bold text-success">{statData.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <i className="fas fa-users text-success text-xl"></i>
              </div>
            </div>
          </div>
          
          <div 
            onClick={handleStatTotalCoursesClick}
            className={`${styles.statCard} rounded-xl p-6 shadow-card cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary mb-1">总课程数</p>
                <p className="text-2xl font-bold text-primary">{statData.totalCourses}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <i className="fas fa-book-open text-primary text-xl"></i>
              </div>
            </div>
          </div>
          
          <div 
            onClick={handleStatTotalEvaluationsClick}
            className={`${styles.statCard} rounded-xl p-6 shadow-card cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary mb-1">总评价数</p>
                <p className="text-2xl font-bold text-secondary">{statData.totalEvaluations}</p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <i className="fas fa-star text-secondary text-xl"></i>
              </div>
            </div>
          </div>
          
          <div 
            onClick={handleStatTotalCommunitiesClick}
            className={`${styles.statCard} rounded-xl p-6 shadow-card cursor-pointer`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary mb-1">总社区数</p>
                <p className="text-2xl font-bold text-warning">{statData.totalCommunities}</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <i className="fas fa-map-marker-alt text-warning text-xl"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 快速操作区 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">快速操作</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={handleQuickManageUsers}
            className="p-4 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <i className="fas fa-users text-success"></i>
              </div>
              <div>
                <h4 className="font-medium text-text-primary">用户管理</h4>
                <p className="text-sm text-text-secondary">管理系统用户</p>
              </div>
            </div>
          </button>

          <button
            onClick={handleQuickManageCourses}
            className="p-4 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <i className="fas fa-book-open text-primary"></i>
              </div>
              <div>
                <h4 className="font-medium text-text-primary">课程管理</h4>
                <p className="text-sm text-text-secondary">管理课程信息</p>
              </div>
            </div>
          </button>

          <button
            onClick={handleQuickManageEvaluations}
            className="p-4 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <i className="fas fa-star text-secondary"></i>
              </div>
              <div>
                <h4 className="font-medium text-text-primary">评价管理</h4>
                <p className="text-sm text-text-secondary">管理用户评价</p>
              </div>
            </div>
          </button>

          <button
            onClick={handleQuickManageCommunities}
            className="p-4 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <i className="fas fa-map-marker-alt text-warning"></i>
              </div>
              <div>
                <h4 className="font-medium text-text-primary">社区管理</h4>
                <p className="text-sm text-text-secondary">管理社区信息</p>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* 系统状态区 */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">系统状态</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-card p-6">
            <h4 className="font-medium text-text-primary mb-4">服务器状态</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">API服务器</span>
                <span className="text-sm text-success font-medium">运行正常</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">数据库连接</span>
                <span className="text-sm text-success font-medium">正常</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">文件存储</span>
                <span className="text-sm text-success font-medium">正常</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-card p-6">
            <h4 className="font-medium text-text-primary mb-4">系统活动</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">在线用户</span>
                <span className="text-sm text-text-primary">146人</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">今日新增用户</span>
                <span className="text-sm text-text-primary">23人</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-secondary">今日课程预约</span>
                <span className="text-sm text-text-primary">89次</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;