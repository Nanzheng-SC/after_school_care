

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface Course {
  id: string;
  name: string;
  teacher: string;
  teacherId: string;
  type: string;
  age: string;
  time: string;
  location: string;
  capacity: string;
  status: 'pending' | 'published' | 'offline';
}

interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

const AdminCourseManage: React.FC = () => {
  const navigate = useNavigate();
  
  // 模拟课程数据
  const [mockCourses] = useState<Course[]>([
    {
      id: 'course001',
      name: '数学思维训练',
      teacher: '李老师',
      teacherId: 'teacher001',
      type: '学科类',
      age: '7-10岁',
      time: '2024-01-20 14:00-16:00',
      location: '阳光社区',
      capacity: '8/12',
      status: 'pending'
    },
    {
      id: 'course002',
      name: '创意绘画启蒙',
      teacher: '王老师',
      teacherId: 'teacher002',
      type: '艺术类',
      age: '4-6岁',
      time: '2024-01-21 10:00-11:30',
      location: '绿洲社区',
      capacity: '5/10',
      status: 'published'
    },
    {
      id: 'course003',
      name: 'Scratch编程入门',
      teacher: '陈老师',
      teacherId: 'teacher003',
      type: '科技类',
      age: '11-14岁',
      time: '2024-01-22 18:30-20:00',
      location: '智慧社区',
      capacity: '3/8',
      status: 'published'
    },
    {
      id: 'course004',
      name: '英语口语提升',
      teacher: '张老师',
      teacherId: 'teacher004',
      type: '学科类',
      age: '11-14岁',
      time: '2024-01-23 16:00-17:30',
      location: '阳光社区',
      capacity: '12/15',
      status: 'offline'
    },
    {
      id: 'course005',
      name: '篮球基础训练',
      teacher: '刘老师',
      teacherId: 'teacher005',
      type: '体育类',
      age: '11-14岁',
      time: '2024-01-24 15:00-16:30',
      location: '绿洲社区',
      capacity: '6/12',
      status: 'pending'
    },
    {
      id: 'course006',
      name: '书法入门',
      teacher: '赵老师',
      teacherId: 'teacher006',
      type: '艺术类',
      age: '7-10岁',
      time: '2024-01-25 14:00-15:30',
      location: '智慧社区',
      capacity: '4/8',
      status: 'published'
    }
  ]);

  // 状态管理
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [currentSort, setCurrentSort] = useState<SortConfig>({ field: '', direction: 'asc' });
  const [currentCourseId, setCurrentCourseId] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [courseToOffline, setCourseToOffline] = useState('');
  const [reviewResult, setReviewResult] = useState('approve');
  const [rejectReason, setRejectReason] = useState('');

  // 搜索和筛选状态
  const [courseSearch, setCourseSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '课程管理 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  // 初始化和筛选逻辑
  useEffect(() => {
    applyFilters();
  }, [mockCourses, currentSort, courseSearch, statusFilter, typeFilter, ageFilter]);

  const applyFilters = () => {
    let filtered = mockCourses.filter(course => {
      const matchesSearch = course.name.toLowerCase().includes(courseSearch.toLowerCase()) || 
                          course.teacher.toLowerCase().includes(courseSearch.toLowerCase());
      const matchesStatus = !statusFilter || course.status === statusFilter;
      const matchesType = !typeFilter || course.type === typeFilter;
      const matchesAge = !ageFilter || course.age === ageFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesAge;
    });

    // 排序
    if (currentSort.field) {
      filtered.sort((a, b) => {
        let aValue = a[currentSort.field as keyof Course];
        let bValue = b[currentSort.field as keyof Course];
        
        if (currentSort.field === 'time') {
          aValue = new Date(a.time);
          bValue = new Date(b.time);
        }
        
        if (aValue < bValue) return currentSort.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return currentSort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredCourses(filtered);
    setCurrentPage(1);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSort = (field: string) => {
    const direction = currentSort.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc';
    setCurrentSort({ field, direction });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleReset = () => {
    setCourseSearch('');
    setStatusFilter('');
    setTypeFilter('');
    setAgeFilter('');
  };

  const reviewCourse = (courseId: string) => {
    setCurrentCourseId(courseId);
    setShowReviewModal(true);
    setReviewResult('approve');
    setRejectReason('');
  };

  const editCourse = (courseId: string) => {
    navigate(`/course-publish?courseId=${courseId}`);
  };

  const offlineCourse = (courseId: string, courseName: string) => {
    setCurrentCourseId(courseId);
    setCourseToOffline(courseName);
    setShowOfflineModal(true);
  };

  const viewCourseDetail = (courseId: string) => {
    navigate(`/course-detail?courseId=${courseId}`);
  };

  const viewTeacherDetail = (teacherId: string) => {
    alert(`查看教师详情: ${teacherId}`);
  };

  const confirmReview = () => {
    // 模拟审核操作
    const updatedCourses = mockCourses.map(course => {
      if (course.id === currentCourseId) {
        return {
          ...course,
          status: reviewResult === 'approve' ? 'published' : 'offline'
        };
      }
      return course;
    });

    // 更新本地状态（实际应用中会调用API）
    // 这里我们无法直接修改mockCourses，所以需要重新获取数据或使用状态管理
    console.log('审核结果:', reviewResult, '原因:', rejectReason);
    setShowReviewModal(false);
    alert('审核完成');
  };

  const confirmOffline = () => {
    // 模拟下架操作
    const updatedCourses = mockCourses.map(course => {
      if (course.id === currentCourseId) {
        return { ...course, status: 'offline' };
      }
      return course;
    });

    console.log('课程已下架:', currentCourseId);
    setShowOfflineModal(false);
    alert('课程已下架');
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      '学科类': 'bg-primary/10 text-primary',
      '兴趣类': 'bg-secondary/10 text-secondary',
      '体育类': 'bg-success/10 text-success',
      '艺术类': 'bg-warning/10 text-warning',
      '科技类': 'bg-info/10 text-info'
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      'pending': '待审核',
      'published': '已发布',
      'offline': '已下架'
    };
    return texts[status] || status;
  };

  const getActionButtons = (course: Course) => {
    const buttons = [];
    
    if (course.status === 'pending') {
      buttons.push(
        <button 
          key="review"
          onClick={() => reviewCourse(course.id)} 
          className="text-primary hover:text-primary/80"
        >
          审核
        </button>
      );
    }
    
    buttons.push(
      <button 
        key="edit"
        onClick={() => editCourse(course.id)} 
        className="text-secondary hover:text-secondary/80"
      >
        编辑
      </button>
    );
    
    if (course.status === 'published') {
      buttons.push(
        <button 
          key="offline"
          onClick={() => offlineCourse(course.id, course.name)} 
          className="text-danger hover:text-danger/80"
        >
          下架
        </button>
      );
    }
    
    buttons.push(
      <button 
        key="detail"
        onClick={() => viewCourseDetail(course.id)} 
        className="text-info hover:text-info/80"
      >
        详情
      </button>
    );
    
    return buttons;
  };

  const renderPagination = () => {
    const totalItems = filteredCourses.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 border rounded text-sm ${
              i === currentPage 
                ? 'bg-primary text-white border-primary' 
                : 'border-border-light text-text-secondary hover:bg-gray-50'
            }`}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push(
          <span key={`ellipsis-${i}`} className="px-2 text-text-secondary">
            ...
          </span>
        );
      }
    }

    return pages;
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);
  const totalItems = filteredCourses.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = totalItems > 0 ? startIndex + 1 : 0;
  const endItem = Math.min(endIndex, totalItems);

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border-light h-16 z-50">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo区域 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleSidebar}
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
                  src="https://s.coze.cn/image/pauc4pB2CvY/" 
                  alt="管理员头像" 
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden md:block text-sm text-text-primary">管理员</span>
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
            to="/admin-dashboard" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-tachometer-alt w-5"></i>
            <span>数据概览</span>
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
            className={`${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">课程管理</h2>
                <nav className="text-sm text-text-secondary">
                  <Link to="/admin-dashboard" className="hover:text-primary">首页</Link>
                  <span className="mx-2">/</span>
                  <span>课程管理</span>
                </nav>
              </div>
            </div>
          </div>

          {/* 工具栏区域 */}
          <div className="bg-white rounded-xl shadow-card p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* 搜索框 */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <input 
                    type="text" 
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    placeholder="搜索课程名称或教师姓名..." 
                    className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm"></i>
                </div>
                
                {/* 筛选条件 */}
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`px-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                >
                  <option value="">全部状态</option>
                  <option value="pending">待审核</option>
                  <option value="published">已发布</option>
                  <option value="offline">已下架</option>
                </select>
                
                <select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className={`px-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                >
                  <option value="">全部类型</option>
                  <option value="学科类">学科类</option>
                  <option value="兴趣类">兴趣类</option>
                  <option value="体育类">体育类</option>
                  <option value="艺术类">艺术类</option>
                  <option value="科技类">科技类</option>
                </select>
                
                <select 
                  value={ageFilter}
                  onChange={(e) => setAgeFilter(e.target.value)}
                  className={`px-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                >
                  <option value="">全部年龄</option>
                  <option value="4-6">4-6岁</option>
                  <option value="7-10">7-10岁</option>
                  <option value="11-14">11-14岁</option>
                  <option value="15-18">15-18岁</option>
                </select>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex space-x-3">
                <button 
                  onClick={applyFilters}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                >
                  <i className="fas fa-filter mr-2"></i>筛选
                </button>
                <button 
                  onClick={handleReset}
                  className="px-4 py-2 border border-border-light text-text-secondary text-sm font-medium rounded-lg hover:bg-gray-50"
                >
                  <i className="fas fa-undo mr-2"></i>重置
                </button>
              </div>
            </div>
          </div>

          {/* 课程列表 */}
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            {/* 表格头部 */}
            <div className="px-6 py-4 border-b border-border-light">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">课程列表</h3>
                <div className="text-sm text-text-secondary">
                  共 <span>{totalItems}</span> 条记录
                </div>
              </div>
            </div>
            
            {/* 表格内容 */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('name')}
                    >
                      课程名称 <i className="fas fa-sort ml-1"></i>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('teacher')}
                    >
                      教师 <i className="fas fa-sort ml-1"></i>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('type')}
                    >
                      类型 <i className="fas fa-sort ml-1"></i>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('age')}
                    >
                      适合年龄 <i className="fas fa-sort ml-1"></i>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('time')}
                    >
                      上课时间 <i className="fas fa-sort ml-1"></i>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      地点
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      容量
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('status')}
                    >
                      状态 <i className="fas fa-sort ml-1"></i>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border-light">
                  {currentCourses.map(course => (
                    <tr key={course.id} className={styles.tableRow}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => viewCourseDetail(course.id)}
                          className="text-primary hover:text-primary/80 font-medium"
                        >
                          {course.name}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => viewTeacherDetail(course.teacherId)}
                          className="text-text-primary hover:text-primary"
                        >
                          {course.teacher}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(course.type)}`}>
                          {course.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                        {course.age}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                        {course.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                        {course.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                        {course.capacity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[`status${course.status.charAt(0).toUpperCase() + course.status.slice(1)}`]}`}>
                          {getStatusText(course.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {getActionButtons(course)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* 分页区域 */}
            <div className="px-6 py-4 border-t border-border-light">
              <div className="flex items-center justify-between">
                <div className="text-sm text-text-secondary">
                  显示第 <span>{startItem}</span> - <span>{endItem}</span> 条，共 <span>{totalItems}</span> 条
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-3 py-1 border border-border-light rounded text-sm text-text-secondary hover:bg-gray-50 disabled:opacity-50"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <div className="flex space-x-1">
                    {renderPagination()}
                  </div>
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1 border border-border-light rounded text-sm text-text-secondary hover:bg-gray-50 disabled:opacity-50"
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
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* 审核确认弹窗 */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalBackdrop}></div>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className={`bg-white rounded-xl shadow-xl max-w-md w-full ${styles.modalEnter}`}>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">课程审核</h3>
                <p className="text-text-secondary mb-6">请选择审核结果：</p>
                
                <div className="space-y-3 mb-6">
                  <label className="flex items-center space-x-3">
                    <input 
                      type="radio" 
                      name="review-result" 
                      value="approve" 
                      checked={reviewResult === 'approve'}
                      onChange={(e) => setReviewResult(e.target.value)}
                      className="text-primary focus:ring-primary" 
                    />
                    <span className="text-text-primary">通过审核</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input 
                      type="radio" 
                      name="review-result" 
                      value="reject" 
                      checked={reviewResult === 'reject'}
                      onChange={(e) => setReviewResult(e.target.value)}
                      className="text-danger focus:ring-danger"
                    />
                    <span className="text-text-primary">驳回申请</span>
                  </label>
                </div>
                
                {reviewResult === 'reject' && (
                  <div className="mb-6">
                    <label htmlFor="reject-reason" className="block text-sm font-medium text-text-primary mb-2">驳回原因：</label>
                    <textarea 
                      id="reject-reason"
                      rows={3}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className={`w-full px-3 py-2 border border-border-light rounded-lg ${styles.searchFocus} resize-none`}
                      placeholder="请输入驳回原因..."
                    />
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <button 
                    onClick={confirmReview}
                    className="flex-1 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                  >
                    确认
                  </button>
                  <button 
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 border border-border-light text-text-secondary text-sm font-medium rounded-lg hover:bg-gray-50"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 下架确认弹窗 */}
      {showOfflineModal && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalBackdrop}></div>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className={`bg-white rounded-xl shadow-xl max-w-md w-full ${styles.modalEnter}`}>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-danger/10 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-exclamation-triangle text-danger text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">确认下架</h3>
                    <p className="text-sm text-text-secondary">此操作不可撤销</p>
                  </div>
                </div>
                
                <p className="text-text-secondary mb-6">
                  确定要下架课程"<span className="font-medium text-text-primary">{courseToOffline}</span>"吗？下架后学生将无法报名该课程。
                </p>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={confirmOffline}
                    className="flex-1 px-4 py-2 bg-danger text-white text-sm font-medium rounded-lg hover:bg-danger/90"
                  >
                    确认下架
                  </button>
                  <button 
                    onClick={() => setShowOfflineModal(false)}
                    className="px-4 py-2 border border-border-light text-text-secondary text-sm font-medium rounded-lg hover:bg-gray-50"
                  >
                    取消
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

export default AdminCourseManage;

