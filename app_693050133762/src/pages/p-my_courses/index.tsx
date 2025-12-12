

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface CourseData {
  id: string;
  name: string;
  teacher: string;
  teacherId: string;
  time: string;
  location: string;
  childName: string;
  status: 'paid' | 'completed' | 'cancelled' | 'refunding';
  evaluationStatus: 'pending' | 'completed' | 'not-applicable';
  amount: number;
}

const MyCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [currentCancelCourseId, setCurrentCancelCourseId] = useState<string | null>(null);
  const [childFilter, setChildFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [filteredCourses, setFilteredCourses] = useState<CourseData[]>([]);

  // 模拟课程数据
  const coursesData: CourseData[] = [
    {
      id: 'course1',
      name: '数学思维训练',
      teacher: '李老师',
      teacherId: 'teacher1',
      time: '2024-01-20 14:00-16:00',
      location: '阳光社区',
      childName: '张明',
      status: 'paid',
      evaluationStatus: 'pending',
      amount: 80
    },
    {
      id: 'course2',
      name: '创意绘画启蒙',
      teacher: '王老师',
      teacherId: 'teacher2',
      time: '2024-01-21 10:00-11:30',
      location: '绿洲社区',
      childName: '张红',
      status: 'completed',
      evaluationStatus: 'completed',
      amount: 60
    },
    {
      id: 'course3',
      name: 'Scratch编程入门',
      teacher: '陈老师',
      teacherId: 'teacher3',
      time: '2024-01-22 18:30-20:00',
      location: '智慧社区',
      childName: '张明',
      status: 'paid',
      evaluationStatus: 'pending',
      amount: 100
    },
    {
      id: 'course4',
      name: '英语口语提升',
      teacher: '刘老师',
      teacherId: 'teacher4',
      time: '2024-01-19 16:00-17:30',
      location: '阳光社区',
      childName: '张红',
      status: 'cancelled',
      evaluationStatus: 'not-applicable',
      amount: 90
    },
    {
      id: 'course5',
      name: '书法基础班',
      teacher: '赵老师',
      teacherId: 'teacher5',
      time: '2024-01-18 15:00-16:30',
      location: '绿洲社区',
      childName: '张明',
      status: 'refunding',
      evaluationStatus: 'not-applicable',
      amount: 70
    }
  ];

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '我的课程 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  // 初始化过滤后的课程列表
  useEffect(() => {
    setFilteredCourses([...coursesData]);
  }, []);

  // 侧边栏切换
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 筛选功能
  const handleFilter = () => {
    const filtered = coursesData.filter(course => {
      const childMatch = !childFilter || course.childName.toLowerCase().includes(childFilter);
      const statusMatch = !statusFilter || course.status === statusFilter;
      return childMatch && statusMatch;
    });
    setFilteredCourses(filtered);
  };

  // 重置筛选
  const handleReset = () => {
    setChildFilter('');
    setStatusFilter('');
    setTimeFilter('');
    setFilteredCourses([...coursesData]);
  };

  // 取消报名确认
  const handleCancelCourse = (courseId: string) => {
    setCurrentCancelCourseId(courseId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (currentCancelCourseId) {
      console.log('取消课程:', currentCancelCourseId);
      setShowCancelModal(false);
      setCurrentCancelCourseId(null);
      // 在实际应用中，这里会调用API取消课程并重新获取列表
    }
  };

  const handleCancelCancel = () => {
    setShowCancelModal(false);
    setCurrentCancelCourseId(null);
  };

  // 事件处理函数
  const handleCourseNameClick = (courseId: string) => {
    navigate(`/course-detail?courseId=${courseId}`);
  };

  const handleTeacherClick = (teacherId: string) => {
    console.log('查看教师详情:', teacherId);
  };

  const handleSubmitEvaluation = (courseId: string) => {
    console.log('打开评价提交页面:', courseId);
  };

  const handleApplyRefund = (courseId: string) => {
    console.log('打开退款申请页面:', courseId);
  };

  const handleViewDetail = (courseId: string) => {
    navigate(`/course-detail?courseId=${courseId}`);
  };

  // 状态样式和文本函数
  const getStatusClass = (status: string) => {
    const statusClasses = {
      'paid': styles.statusPaid,
      'completed': styles.statusCompleted,
      'cancelled': styles.statusCancelled,
      'refunding': styles.statusRefunding
    };
    return statusClasses[status as keyof typeof statusClasses] || '';
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      'paid': '已支付',
      'completed': '已完成',
      'cancelled': '已取消',
      'refunding': '退款中'
    };
    return statusTexts[status as keyof typeof statusTexts] || status;
  };

  const getEvaluationClass = (status: string) => {
    const evaluationClasses = {
      'pending': styles.evaluationPending,
      'completed': styles.evaluationCompleted
    };
    return evaluationClasses[status as keyof typeof evaluationClasses] || 'bg-gray-100 text-text-secondary';
  };

  const getEvaluationText = (status: string) => {
    const evaluationTexts = {
      'pending': '待评价',
      'completed': '已评价',
      'not-applicable': '不适用'
    };
    return evaluationTexts[status as keyof typeof evaluationTexts] || status;
  };

  const generateActionButtons = (course: CourseData) => {
    const buttons = [];
    
    if (course.status === 'paid') {
      buttons.push(
        <button 
          key="cancel"
          className="text-danger hover:text-danger/80" 
          onClick={() => handleCancelCourse(course.id)}
          title="取消报名"
        >
          <i className="fas fa-times-circle"></i>
        </button>
      );
    }
    
    if (course.status === 'completed' && course.evaluationStatus === 'pending') {
      buttons.push(
        <button 
          key="evaluate"
          className="text-warning hover:text-warning/80" 
          onClick={() => handleSubmitEvaluation(course.id)}
          title="提交评价"
        >
          <i className="fas fa-star"></i>
        </button>
      );
    }
    
    if (course.status === 'paid') {
      buttons.push(
        <button 
          key="refund"
          className="text-info hover:text-info/80" 
          onClick={() => handleApplyRefund(course.id)}
          title="申请退款"
        >
          <i className="fas fa-undo"></i>
        </button>
      );
    }
    
    buttons.push(
      <button 
        key="detail"
        className="text-primary hover:text-primary/80" 
        onClick={() => handleViewDetail(course.id)}
        title="查看详情"
      >
        <i className="fas fa-eye"></i>
      </button>
    );
    
    return buttons;
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border-light h-16 z-50">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo区域 */}
          <div className="flex items-center space-x-4">
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={handleSidebarToggle}
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
                  src="https://s.coze.cn/image/gAUt03YRXfo/" 
                  alt="用户头像" 
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden md:block text-sm text-text-primary">张家长</span>
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
            to="/home" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
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
            className={`${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">我的课程</h2>
                <p className="text-text-secondary">管理您已报名的课程</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-secondary">总计课程</p>
                <p className="text-2xl font-bold text-text-primary">5</p>
              </div>
            </div>
          </div>

          {/* 工具栏区域 */}
          <div className="bg-white rounded-xl shadow-card p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {/* 按子女筛选 */}
                <div className="flex items-center space-x-2">
                  <label htmlFor="filter-child" className="text-sm font-medium text-text-primary">子女：</label>
                  <select 
                    id="filter-child" 
                    value={childFilter}
                    onChange={(e) => setChildFilter(e.target.value)}
                    className={`px-3 py-2 border border-border-light rounded-lg ${styles.searchFocus} text-sm`}
                  >
                    <option value="">全部子女</option>
                    <option value="zhang-ming">张明</option>
                    <option value="zhang-hong">张红</option>
                  </select>
                </div>
                
                {/* 按课程状态筛选 */}
                <div className="flex items-center space-x-2">
                  <label htmlFor="filter-status" className="text-sm font-medium text-text-primary">状态：</label>
                  <select 
                    id="filter-status" 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`px-3 py-2 border border-border-light rounded-lg ${styles.searchFocus} text-sm`}
                  >
                    <option value="">全部状态</option>
                    <option value="paid">已支付</option>
                    <option value="completed">已完成</option>
                    <option value="cancelled">已取消</option>
                    <option value="refunding">退款中</option>
                  </select>
                </div>
                
                {/* 按时间范围筛选 */}
                <div className="flex items-center space-x-2">
                  <label htmlFor="filter-time" className="text-sm font-medium text-text-primary">时间：</label>
                  <select 
                    id="filter-time" 
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className={`px-3 py-2 border border-border-light rounded-lg ${styles.searchFocus} text-sm`}
                  >
                    <option value="">全部时间</option>
                    <option value="week">最近一周</option>
                    <option value="month">最近一个月</option>
                    <option value="quarter">最近三个月</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button 
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                  onClick={handleFilter}
                >
                  <i className="fas fa-filter mr-2"></i>筛选
                </button>
                <button 
                  className="px-4 py-2 border border-border-light text-text-secondary text-sm font-medium rounded-lg hover:bg-gray-50"
                  onClick={handleReset}
                >
                  <i className="fas fa-undo mr-2"></i>重置
                </button>
              </div>
            </div>
          </div>

          {/* 课程列表 */}
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-border-light">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">课程名称</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">上课时间</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">教师</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">地点</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">子女姓名</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">报名状态</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">评价状态</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border-light">
                  {filteredCourses.map(course => (
                    <tr key={course.id} className={styles.tableHover}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          className="text-primary hover:text-primary/80 font-medium text-left"
                          onClick={() => handleCourseNameClick(course.id)}
                        >
                          {course.name}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {course.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          className="text-primary hover:text-primary/80 text-sm"
                          onClick={() => handleTeacherClick(course.teacherId)}
                        >
                          {course.teacher}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {course.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {course.childName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`${styles.statusBadge} ${getStatusClass(course.status)}`}>
                          {getStatusText(course.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`${styles.statusBadge} ${getEvaluationClass(course.evaluationStatus)}`}>
                          {getEvaluationText(course.evaluationStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {generateActionButtons(course)}
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
                  显示第 <span>1</span> - <span>10</span> 条，共 <span>25</span> 条记录
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border border-border-light rounded text-sm text-text-secondary hover:bg-gray-50 disabled:opacity-50" disabled>
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button className="px-3 py-1 bg-primary text-white rounded text-sm">1</button>
                  <button className="px-3 py-1 border border-border-light rounded text-sm text-text-secondary hover:bg-gray-50">2</button>
                  <button className="px-3 py-1 border border-border-light rounded text-sm text-text-secondary hover:bg-gray-50">3</button>
                  <span className="px-2 text-text-secondary">...</span>
                  <button className="px-3 py-1 border border-border-light rounded text-sm text-text-secondary hover:bg-gray-50">5</button>
                  <button className="px-3 py-1 border border-border-light rounded text-sm text-text-secondary hover:bg-gray-50">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={handleSidebarToggle}></div>
      )}

      {/* 取消报名确认弹窗 */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-exclamation-triangle text-danger text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">确认取消报名</h3>
              <p className="text-text-secondary mb-6">取消后将无法恢复，确定要取消这门课程吗？</p>
              <div className="flex space-x-3">
                <button 
                  className="flex-1 px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90"
                  onClick={handleConfirmCancel}
                >
                  确认取消
                </button>
                <button 
                  className="flex-1 px-4 py-2 border border-border-light text-text-secondary rounded-lg hover:bg-gray-50"
                  onClick={handleCancelCancel}
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;

