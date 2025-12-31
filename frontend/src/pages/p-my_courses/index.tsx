

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import request from '../../utils/request';
import Header from '../../components/Header'; // 导入共享Header组件

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
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState<CourseData[]>([]);
  const [coursesData, setCoursesData] = useState<CourseData[]>([]);
  const [childrenData, setChildrenData] = useState<string[]>([]); // 存储子女姓名列表
  const [userInfo, setUserInfo] = useState<{name: string}>({name: ''});

  // 获取用户信息
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error('解析用户信息失败:', error);
      }
    }
  }, []);



  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '我的课程 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  // 获取课程数据
  const fetchCourses = useCallback(async () => {
    try {
      // 从localStorage获取用户信息
      const userInfoStr = localStorage.getItem('userInfo');
      if (!userInfoStr) {
        console.error('用户信息不存在，无法获取家长数据');
        return;
      }
      
      const userInfo = JSON.parse(userInfoStr);
      console.log('用户信息:', userInfo);
      // 获取家长ID
      const parentId = userInfo.parent_id || userInfo.id || userInfo.account;
      
      console.log('家长ID:', parentId);
      
      if (!parentId) {
        console.error('家长ID不存在，无法获取子女课程数据');
        return;
      }
      
      // 1. 获取家长的子女信息
      console.log('开始获取家长的子女信息:', `/api/parent/${parentId}/youths`);
      const childrenResponse = await request.get(`/api/parent/${parentId}/youths`);
      console.log('子女信息响应:', childrenResponse);
      const children = Array.isArray(childrenResponse.data) ? childrenResponse.data : [];
      console.log('子女信息:', children);
      
      // 2. 获取所有课程数据
      console.log('开始获取所有课程数据:', '/api/course');
      const coursesResponse = await request.get('/api/course');
      console.log('课程数据响应:', coursesResponse);
      const allCourses = Array.isArray(coursesResponse.data) ? coursesResponse.data : [];
      console.log('所有课程数据:', allCourses);
      
      // 检查是否获取到数据
      if (children.length === 0) {
        console.warn('未获取到子女信息');
      }
      if (allCourses.length === 0) {
        console.warn('未获取到课程信息');
      }
      
      // 3. 模拟生成子女的课程报名数据
      // 实际项目中应该调用专门的报名记录API接口
      const formattedCourses: CourseData[] = [];
      
      // 为每个子女分配一些课程
      console.log('开始为每个子女分配课程');
      children.forEach((child: any, childIndex: number) => {
        console.log('处理子女:', child);
        // 为每个子女随机分配2-3门课程
        const coursesPerChild = Math.floor(Math.random() * 2) + 2;
        
        // 从所有课程中随机选择课程
        const shuffledCourses = [...allCourses].sort(() => 0.5 - Math.random());
        const assignedCourses = shuffledCourses.slice(0, coursesPerChild);
        
        // 生成报名数据
        assignedCourses.forEach((course: any, courseIndex: number) => {
          console.log('分配课程给子女:', course);
          // 随机生成课程状态
          const statuses: Array<'paid' | 'completed' | 'cancelled'> = ['paid', 'completed', 'cancelled'];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          
          // 随机生成评价状态
          let evaluationStatus: 'pending' | 'completed' | 'not-applicable' = 'not-applicable';
          if (randomStatus === 'completed') {
            evaluationStatus = Math.random() > 0.5 ? 'completed' : 'pending';
          }
          
          formattedCourses.push({
            id: course.course_id || course.id || `course_${childIndex}_${courseIndex}`,
            name: course.name || course.course_name || '未知课程',
            teacher: course.teacher || course.teacher_name || '未知教师',
            teacherId: course.teacher_id || `teacher_${Math.floor(Math.random() * 100)}`,
            time: `${course.schedule || ''} ${course.start_time || '09:00'}-${course.end_time || '10:00'}`,
            location: course.location || '未知地点',
            childName: child.youth_name || child.name || '未知子女',
            status: randomStatus,
            evaluationStatus: evaluationStatus,
            amount: Math.floor(Math.random() * 1000) + 500 // 随机生成价格
          });
        });
      });
      
      console.log('生成的课程数据:', formattedCourses);
      setCoursesData(formattedCourses);
      
      // 提取唯一的子女姓名用于筛选
      const uniqueChildren = Array.from(new Set(formattedCourses.map(course => course.childName)));
      console.log('唯一的子女姓名:', uniqueChildren);
      setChildrenData(uniqueChildren);
    } catch (error) {
      console.error('获取课程数据失败:', error);
      // API请求失败时使用空数组
      setCoursesData([]);
      setChildrenData([]);
    }
  }, [setCoursesData, setChildrenData]);

  // 初始化数据
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // 更新过滤列表
  useEffect(() => {
    setFilteredCourses([...coursesData]);
  }, [coursesData]);

  // 侧边栏切换
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 筛选功能
  const handleFilter = () => {
    const filtered = coursesData.filter(course => {
      const childMatch = !childFilter || course.childName.toLowerCase().includes(childFilter);
      const statusMatch = !statusFilter || course.status === statusFilter;
      const searchMatch = !searchTerm || 
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        course.teacher.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 时间筛选逻辑
      let timeMatch = true;
      if (timeFilter) {
        const courseDate = new Date(course.time.split(' ')[0]);
        const now = new Date();
        const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
        const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
        
        switch (timeFilter) {
        case 'week':
          timeMatch = courseDate >= oneWeekAgo;
          break;
        case 'month':
          timeMatch = courseDate >= oneMonthAgo;
          break;
        case 'quarter':
          timeMatch = courseDate >= threeMonthsAgo;
          break;
        default:
          timeMatch = true;
        }
      }
      
      return childMatch && statusMatch && searchMatch && timeMatch;
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
      <Header 
        userRole="parent" 
        userName={userInfo.name || '家长'} 
        userAvatar="https://s.coze.cn/image/OUgZ3szV3ss/" 
        onSidebarToggle={handleSidebarToggle}
      />

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
            to="/parent-center/teen-info-manage" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-child w-5"></i>
            <span>孩子管理</span>
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
                <p className="text-2xl font-bold text-text-primary">{coursesData.length}</p>
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
                    {childrenData.map((child, index) => (
                      <option key={index} value={child.toLowerCase()}>{child}</option>
                    ))}
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
                  显示第 <span>1</span> - <span>{filteredCourses.length}</span> 条，共 <span>{filteredCourses.length}</span> 条记录
                </div>
                <div className="flex items-center space-x-2">
                  {/* 简化分页，只显示一页 */}
                  <button className="px-3 py-1 border border-border-light rounded text-sm text-text-secondary hover:bg-gray-50 disabled:opacity-50" disabled>
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button className="px-3 py-1 bg-primary text-white rounded text-sm">1</button>
                  <button className="px-3 py-1 border border-border-light rounded text-sm text-text-secondary hover:bg-gray-50 disabled">
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

