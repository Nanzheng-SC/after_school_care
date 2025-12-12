

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface ScheduleItem {
  id: string;
  courseId: string;
  courseName: string;
  courseType: string;
  startTime: string;
  endTime: string;
  location: string;
  currentEnrollment: number;
  maxCapacity: number;
  status: 'pending' | 'published' | 'ended' | 'cancelled';
}

const TeacherCourseSchedule: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 模拟课程排期数据
  const [scheduleData] = useState<ScheduleItem[]>([
    {
      id: 'schedule-001',
      courseId: 'course-001',
      courseName: '数学思维训练',
      courseType: '学科类',
      startTime: '2024-01-20 14:00',
      endTime: '2024-01-20 16:00',
      location: '阳光社区活动室A',
      currentEnrollment: 8,
      maxCapacity: 12,
      status: 'published'
    },
    {
      id: 'schedule-002',
      courseId: 'course-002',
      courseName: '创意绘画启蒙',
      courseType: '艺术类',
      startTime: '2024-01-21 10:00',
      endTime: '2024-01-21 11:30',
      location: '绿洲社区艺术室',
      currentEnrollment: 5,
      maxCapacity: 10,
      status: 'pending'
    },
    {
      id: 'schedule-003',
      courseId: 'course-003',
      courseName: 'Scratch编程入门',
      courseType: '科技类',
      startTime: '2024-01-19 18:30',
      endTime: '2024-01-19 20:00',
      location: '智慧社区创客空间',
      currentEnrollment: 3,
      maxCapacity: 8,
      status: 'published'
    },
    {
      id: 'schedule-004',
      courseId: 'course-004',
      courseName: '英语口语练习',
      courseType: '学科类',
      startTime: '2024-01-18 16:00',
      endTime: '2024-01-18 17:30',
      location: '阳光社区教室B',
      currentEnrollment: 12,
      maxCapacity: 15,
      status: 'ended'
    },
    {
      id: 'schedule-005',
      courseId: 'course-005',
      courseName: '书法基础训练',
      courseType: '艺术类',
      startTime: '2024-01-22 15:00',
      endTime: '2024-01-22 16:30',
      location: '绿洲社区文化室',
      currentEnrollment: 0,
      maxCapacity: 10,
      status: 'cancelled'
    }
  ]);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '课程排期管理 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  // 筛选数据
  const filteredData = scheduleData.filter(schedule => {
    const matchesSearch = schedule.courseName.toLowerCase().includes(courseSearchTerm.toLowerCase());
    const matchesStatus = !statusFilter || schedule.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 分页逻辑
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // 格式化日期时间
  const formatDateTime = (datetime: string): string => {
    const date = new Date(datetime);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 格式化时间
  const formatTime = (datetime: string): string => {
    const date = new Date(datetime);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 获取状态文本
  const getStatusText = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'pending': '待开始',
      'published': '进行中',
      'ended': '已结束',
      'cancelled': '已取消'
    };
    return statusMap[status] || status;
  };

  // 事件处理函数
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handlePublishCourse = () => {
    console.log('打开课程发布弹窗');
    // 实际实现中会跳转到 P-COURSE_PUBLISH.html 或打开模态弹窗
  };

  const handleCourseSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseSearchTerm(e.target.value);
    setCurrentPage(1); // 重置到第一页
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // 重置到第一页
  };

  const handleReset = () => {
    setCourseSearchTerm('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  const handleEditSchedule = (scheduleId: string) => {
    console.log('编辑排期:', scheduleId);
    // 模拟检测到排期冲突
    if (scheduleId === 'schedule-001') {
      setShowConflictModal(true);
    }
  };

  const handleViewSchedule = (scheduleId: string) => {
    console.log('查看排期详情:', scheduleId);
    // 这里应该打开详情弹窗或跳转到详情页面
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    setCurrentDeleteId(scheduleId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (currentDeleteId) {
      console.log('执行删除操作:', currentDeleteId);
      setShowDeleteModal(false);
      setCurrentDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCurrentDeleteId(null);
  };

  const handleAdjustSchedule = () => {
    setShowConflictModal(false);
  };

  const handleOverrideConflict = () => {
    setShowConflictModal(false);
    console.log('强制保存排期');
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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
                placeholder="搜索课程、教师..." 
                className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
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
                  src="https://s.coze.cn/image/mG38x0pG908/" 
                  alt="教师头像" 
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden md:block text-sm text-text-primary">李老师</span>
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
            to="/teacher-course-schedule" 
            className={`${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}
          >
            <i className="fas fa-calendar-alt w-5"></i>
            <span>课程排期</span>
          </Link>
          <Link 
            to="/student-match" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-users w-5"></i>
            <span>学生匹配</span>
          </Link>
          <Link 
            to="/teacher-eval-stats" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-star w-5"></i>
            <span>评价统计</span>
          </Link>
          <Link 
            to="/teacher-center" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-user-circle w-5"></i>
            <span>教师中心</span>
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
                <h2 className="text-2xl font-bold text-text-primary mb-2">课程排期管理</h2>
                <nav className="text-sm text-text-secondary">
                  <Link to="/home" className="hover:text-primary">首页</Link>
                  <span className="mx-2">/</span>
                  <Link to="/teacher-center" className="hover:text-primary">教师中心</Link>
                  <span className="mx-2">/</span>
                  <span className="text-text-primary">课程排期管理</span>
                </nav>
              </div>
              <button 
                onClick={handlePublishCourse}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center space-x-2"
              >
                <i className="fas fa-plus"></i>
                <span>发布课程</span>
              </button>
            </div>
          </div>

          {/* 工具栏区域 */}
          <div className="bg-white rounded-xl shadow-card p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="搜索课程名称..." 
                    value={courseSearchTerm}
                    onChange={handleCourseSearchChange}
                    className={`pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchFocus} w-full sm:w-64`}
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
                </div>
                <select 
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className={`px-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                >
                  <option value="">全部状态</option>
                  <option value="pending">待开始</option>
                  <option value="published">进行中</option>
                  <option value="ended">已结束</option>
                  <option value="cancelled">已取消</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-gray-100 text-text-primary rounded-lg hover:bg-gray-200">
                  <i className="fas fa-filter mr-2"></i>筛选
                </button>
                <button 
                  onClick={handleReset}
                  className="px-4 py-2 border border-border-light text-text-secondary rounded-lg hover:bg-gray-50"
                >
                  重置
                </button>
              </div>
            </div>
          </div>

          {/* 课程排期列表 */}
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-border-light">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">课程名称</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">上课时间</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">地点</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">容量</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">状态</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border-light">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-text-secondary">
                        <i className="fas fa-calendar-times text-4xl mb-4 opacity-50"></i>
                        <p>暂无课程排期数据</p>
                      </td>
                    </tr>
                  ) : (
                    currentItems.map(schedule => (
                      <tr key={schedule.id} className={styles.tableRow}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-text-primary">
                                <Link to={`/course-detail?courseId=${schedule.courseId}`} className="hover:text-primary">
                                  {schedule.courseName}
                                </Link>
                              </div>
                              <div className="text-sm text-text-secondary">{schedule.courseType}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                          <div>{formatDateTime(schedule.startTime)}</div>
                          <div className="text-text-secondary">至 {formatTime(schedule.endTime)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {schedule.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {schedule.currentEnrollment}/{schedule.maxCapacity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`${styles.statusBadge} ${styles[`status${schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}`]}`}>
                            {getStatusText(schedule.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleEditSchedule(schedule.id)}
                              className="text-primary hover:text-primary/80"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              onClick={() => handleViewSchedule(schedule.id)}
                              className="text-info hover:text-info/80"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button 
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              className="text-danger hover:text-danger/80"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* 分页区域 */}
            <div className="px-6 py-4 border-t border-border-light">
              <div className="flex items-center justify-between">
                <div className="text-sm text-text-secondary">
                  显示第 <span>{indexOfFirstItem + 1}</span> 到 <span>{Math.min(indexOfLastItem, filteredData.length)}</span> 条，共 <span>{filteredData.length}</span> 条记录
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-border-light rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-1 rounded text-sm ${
                          currentPage === index + 1 
                            ? 'bg-primary text-white' 
                            : 'border border-border-light hover:bg-gray-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-border-light rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 侧边栏遮罩 */}
      {isSidebarOpen && (
        <div 
          onClick={handleSidebarToggle}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        ></div>
      )}

      {/* 确认删除弹窗 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-danger/10 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-exclamation-triangle text-danger text-xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">确认删除</h3>
                </div>
                <p className="text-text-secondary mb-6">确定要删除这个课程排期吗？删除后将无法恢复。</p>
                <div className="flex justify-end space-x-3">
                  <button 
                    onClick={handleCancelDelete}
                    className="px-4 py-2 border border-border-light text-text-secondary rounded-lg hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 排期冲突提醒弹窗 */}
      {showConflictModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-exclamation-triangle text-warning text-xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">排期冲突</h3>
                </div>
                <p className="text-text-secondary mb-4">检测到以下时间冲突：</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-text-secondary">新排期：</span>
                      <span className="text-sm font-medium text-text-primary">数学思维训练 - 周六 14:00-16:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-text-secondary">已有排期：</span>
                      <span className="text-sm font-medium text-text-primary">英语阅读 - 周六 13:30-15:30</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button 
                    onClick={handleAdjustSchedule}
                    className="px-4 py-2 border border-border-light text-text-secondary rounded-lg hover:bg-gray-50"
                  >
                    调整时间
                  </button>
                  <button 
                    onClick={handleOverrideConflict}
                    className="px-4 py-2 bg-warning text-white rounded-lg hover:bg-warning/90"
                  >
                    强制保存
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

export default TeacherCourseSchedule;

