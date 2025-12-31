

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import request from '../../utils/request';

interface CourseEvent {
  id: string;
  title: string;
  teacher: string;
  location: string;
  startTime: string;
  endTime: string;
  date: string;
  capacity: string;
  type: string;
  ageGroup: string;
  price: string;
  rating: number;
  childName?: string; // 新增：子女姓名
}

// 子女接口
interface Child {
  id: string;
  name: string;
}

const CourseCalendarPage: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseEvent | null>(null);
  const [isWeekView, setIsWeekView] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CourseEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<CourseEvent[]>([]);
  const [userInfo, setUserInfo] = useState<{name: string}>({name: ''});
  const [children, setChildren] = useState<Child[]>([]);
  const [childFilter, setChildFilter] = useState<string>(''); // 子女筛选

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



  useEffect(() => {
    const originalTitle = document.title;
    document.title = '课程日历 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  // 获取课程数据和子女信息
  const fetchData = async () => {
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
      const formattedEvents: CourseEvent[] = [];
      
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
          
          // 随机生成课程日期（最近30天内）
          const today = new Date();
          const randomDate = new Date(today);
          randomDate.setDate(today.getDate() - Math.floor(Math.random() * 30));
          const dateStr = randomDate.toISOString().split('T')[0];
          
          formattedEvents.push({
            id: course.course_id || course.id || `course_${childIndex}_${courseIndex}`,
            title: course.name || course.course_name || '未知课程',
            teacher: course.teacher || course.teacher_name || '未知教师',
            location: course.location || '未知地点',
            startTime: course.start_time || '09:00',
            endTime: course.end_time || '10:00',
            date: dateStr,
            capacity: course.capacity ? `${Math.floor(Math.random() * course.capacity)}/${course.capacity}` : '0/10',
            type: course.type || '综合类',
            ageGroup: course.age_range || '4-14岁',
            price: course.price ? `¥${course.price}` : '¥0',
            rating: course.rating || (Math.random() * 1.5 + 3.5).toFixed(1),
            childName: child.youth_name || child.name || '未知子女'
          });
        });
      });
      
      console.log('生成的日历事件数据:', formattedEvents);
      setCalendarEvents(formattedEvents);
      
      // 提取唯一的子女姓名用于筛选
      const uniqueChildren = Array.from(new Set(formattedEvents.map(event => event.childName)));
      console.log('唯一的子女姓名:', uniqueChildren);
      setChildren(uniqueChildren.map((name, index) => ({ id: `child_${index}`, name: name || '未知子女' })));
    } catch (error) {
      console.error('获取课程数据失败:', error);
      // API请求失败时使用空数组
      setCalendarEvents([]);
      setChildren([]);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchData();
  }, []);

  // 根据搜索词和子女过滤课程
  useEffect(() => {
    let filtered = [...calendarEvents];
    
    // 子女过滤
    if (childFilter) {
      filtered = filtered.filter(event => event.childName?.toLowerCase().includes(childFilter.toLowerCase()));
    }
    
    // 搜索词过滤
    if (searchTerm.trim()) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(event => {
        return (
          event.title.toLowerCase().includes(lowerCaseSearch) ||
          event.teacher.toLowerCase().includes(lowerCaseSearch) ||
          event.location.toLowerCase().includes(lowerCaseSearch) ||
          event.type.toLowerCase().includes(lowerCaseSearch)
        );
      });
    }

    setFilteredEvents(filtered);
  }, [calendarEvents, searchTerm, childFilter]);

  const getEventsForDay = (day: number, month: number, year: number): CourseEvent[] => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredEvents.length > 0 ? filteredEvents.filter(event => event.date === dateStr) : calendarEvents.filter(event => event.date === dateStr);
  };

  const renderMonthView = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    
    const calendarDays = [];
    
    // 上个月的天数
    for (let i = firstDay; i > 0; i--) {
      calendarDays.push(
        <div key={`prev-${prevMonthDays - i + 1}`} className={`${styles.calendarDay} p-2 text-gray-400`}>
          <div className="text-sm font-medium mb-1">{prevMonthDays - i + 1}</div>
        </div>
      );
    }
    
    // 当月的天数
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
      const events = getEventsForDay(i, currentMonth, currentYear);
      const hasEvents = events.length > 0;
      
      calendarDays.push(
        <div 
          key={`current-${i}`} 
          className={`${styles.calendarDay} p-2 ${isToday ? styles.today : ''} ${hasEvents ? styles.hasEvents : ''}`}
        >
          <div className="text-sm font-medium mb-1">{i}</div>
          {events.map(event => (
            <div 
              key={event.id}
              className={styles.eventCard}
              onClick={() => handleCourseClick(event)}
            >
              <div className="text-xs text-primary font-medium">{event.startTime}</div>
              <div className="text-xs text-text-primary truncate">{event.title}</div>
              {event.childName && (
                <div className="text-xs text-text-secondary truncate">{event.childName}</div>
              )}
            </div>
          ))}
        </div>
      );
    }
    
    // 下个月的天数
    const totalDays = firstDay + daysInMonth;
    const nextMonthDays = 42 - totalDays;
    for (let i = 1; i <= nextMonthDays; i++) {
      calendarDays.push(
        <div key={`next-${i}`} className={`${styles.calendarDay} p-2 text-gray-400`}>
          <div className="text-sm font-medium mb-1">{i}</div>
        </div>
      );
    }
    
    return calendarDays;
  };

  // 渲染周视图
  const renderWeekView = () => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentDate = now.getDate();
    
    // 计算本周的第一天（周一）
    const firstDayOfWeek = new Date(now);
    firstDayOfWeek.setDate(currentDate - currentDay + (currentDay === 0 ? -6 : 1));
    
    const weekDays = [];
    const daysOfWeek = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    
    // 生成本周的7天
    for (let i = 0; i < 7; i++) {
      const day = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + i);
      
      const dayDate = day.getDate();
      const dayMonth = day.getMonth();
      const dayYear = day.getFullYear();
      
      const isToday = day.toDateString() === now.toDateString();
      const events = getEventsForDay(dayDate, dayMonth, dayYear);
      const hasEvents = events.length > 0;
      
      weekDays.push(
        <div 
          key={`week-${i}`} 
          className={`${styles.calendarDay} p-2 ${isToday ? styles.today : ''} ${hasEvents ? styles.hasEvents : ''}`}
        >
          <div className="text-sm font-medium mb-1">{daysOfWeek[i]}</div>
          <div className="text-xs text-text-secondary mb-2">{dayMonth + 1}月{dayDate}日</div>
          {events.map(event => (
            <div 
              key={event.id}
              className={styles.eventCard}
              onClick={() => handleCourseClick(event)}
            >
              <div className="text-xs text-primary font-medium">{event.startTime}</div>
              <div className="text-xs text-text-primary truncate">{event.title}</div>
              {event.childName && (
                <div className="text-xs text-text-secondary truncate">{event.childName}</div>
              )}
            </div>
          ))}
        </div>
      );
    }
    
    return weekDays;
  };

  const renderCalendar = () => {
    if (isWeekView) {
      return renderWeekView();
    } else {
      return renderMonthView();
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarOverlayClick = () => {
    setIsSidebarOpen(false);
  };

  const handleCourseClick = (course: CourseEvent) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleModalBackdropClick = () => {
    handleCloseModal();
  };

  const handleWeekViewToggle = () => {
    setIsWeekView(!isWeekView);
  };

  const handleEnrollClick = () => {
    alert('跳转到支付确认页面');
    handleCloseModal();
  };

  const getCurrentMonthName = () => {
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    return `${currentYear}年${monthNames[currentMonth]}`;
  };

  const getTodayDateString = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      weekday: 'long' 
    };
    return today.toLocaleDateString('zh-CN', options);
  };

  const getTodayCourses = () => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const eventsToUse = filteredEvents.length > 0 ? filteredEvents : calendarEvents;
    return eventsToUse.filter(event => event.date === todayStr);
  };

  const todayCourses = getTodayCourses();

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  src="https://s.coze.cn/image/UaKnF8CuQ-c/" 
                  alt="用户头像" 
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden md:block text-sm text-text-primary">{userInfo.name || '家长'}</span>
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
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
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
            className={`${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}
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
                <h2 className="text-2xl font-bold text-text-primary mb-2">课程日历</h2>
                <nav className="text-sm text-text-secondary">
                  <Link to="/home" className="hover:text-primary">首页</Link>
                  <span className="mx-2">/</span>
                  <span className="text-text-primary">课程日历</span>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                {/* 子女过滤下拉菜单 */}
                <div className="relative">
                  <select 
                    value={childFilter}
                    onChange={(e) => setChildFilter(e.target.value)}
                    className="px-4 py-2 border border-border-light text-text-secondary text-sm font-medium rounded-lg hover:bg-gray-50 appearance-none pr-10"
                  >
                    <option value="">所有子女</option>
                    {children.map(child => (
                      <option key={child.id} value={child.name}>{child.name}</option>
                    ))}
                  </select>
                  <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-xs pointer-events-none"></i>
                </div>
                <button 
                  onClick={handleToday}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                >
                  <i className="fas fa-calendar-day mr-2"></i>今天
                </button>
                <button 
                  onClick={handleWeekViewToggle}
                  className="px-4 py-2 border border-border-light text-text-secondary text-sm font-medium rounded-lg hover:bg-gray-50"
                >
                  <i className="fas fa-calendar-week mr-2"></i>周视图
                </button>
              </div>
            </div>
          </div>

          {/* 日历控件 */}
          <section className="bg-white rounded-xl shadow-card p-6 mb-8">
            {/* 日历头部 */}
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={handlePrevMonth}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <i className="fas fa-chevron-left text-text-secondary"></i>
              </button>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-text-primary">{getCurrentMonthName()}</h3>
                <p className="text-sm text-text-secondary">点击日期查看课程安排</p>
              </div>
              <button 
                onClick={handleNextMonth}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <i className="fas fa-chevron-right text-text-secondary"></i>
              </button>
            </div>

            {/* 日历网格 */}
            <div className="grid grid-cols-7 gap-1">
              {/* 星期标题 */}
              <div className="text-center py-3 text-sm font-medium text-text-secondary bg-gray-50 rounded-lg">日</div>
              <div className="text-center py-3 text-sm font-medium text-text-secondary bg-gray-50 rounded-lg">一</div>
              <div className="text-center py-3 text-sm font-medium text-text-secondary bg-gray-50 rounded-lg">二</div>
              <div className="text-center py-3 text-sm font-medium text-text-secondary bg-gray-50 rounded-lg">三</div>
              <div className="text-center py-3 text-sm font-medium text-text-secondary bg-gray-50 rounded-lg">四</div>
              <div className="text-center py-3 text-sm font-medium text-text-secondary bg-gray-50 rounded-lg">五</div>
              <div className="text-center py-3 text-sm font-medium text-text-secondary bg-gray-50 rounded-lg">六</div>

              {/* 日历天数 */}
              {renderCalendar()}
            </div>
          </section>

          {/* 今日课程概览 */}
          <section className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">今日课程</h3>
              <span className="text-sm text-text-secondary">{getTodayDateString()}</span>
            </div>
            
            <div className="space-y-4">
              {todayCourses.map((course) => {
                // 计算课程状态
                const now = new Date();
                const todayStr = now.toISOString().split('T')[0];
                const courseStartDateTime = new Date(`${todayStr}T${course.startTime}`);
                const courseEndDateTime = new Date(`${todayStr}T${course.endTime}`);
                
                let status = '待开始';
                let statusClass = 'bg-info/10 text-info';
                let iconClass = 'bg-warning/10 text-warning';
                
                if (now >= courseStartDateTime && now <= courseEndDateTime) {
                  status = '进行中';
                  statusClass = 'bg-success/10 text-success';
                  iconClass = 'bg-primary/10 text-primary';
                } else if (now > courseEndDateTime) {
                  status = '已结束';
                  statusClass = 'bg-gray-200 text-text-secondary';
                  iconClass = 'bg-gray-100 text-text-secondary';
                }
                
                return (
                  <div key={course.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`w-12 h-12 ${iconClass} rounded-lg flex items-center justify-center`}>
                      <i className="fas fa-book"></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-text-primary">{course.title}</h4>
                      <p className="text-sm text-text-secondary">{course.teacher} · {course.location}</p>
                      {course.childName && (
                        <p className="text-xs text-text-secondary">{course.childName}</p>
                      )}
                      <p className="text-xs text-text-secondary mt-1">{course.startTime} - {course.endTime}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 ${statusClass} text-xs font-medium rounded-full`}>
                        {status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      {/* 课程详情模态弹窗 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className={styles.modalBackdrop}
            onClick={handleModalBackdropClick}
          ></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className={`bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto ${styles.modalEnter} ${isModalOpen ? styles.modalEnterActive : ''}`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">课程详情</h3>
                  <button 
                    onClick={handleCloseModal}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <i className="fas fa-times text-text-secondary"></i>
                  </button>
                </div>
                
                {selectedCourse && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">{selectedCourse.type}</span>
                      <span className="px-3 py-1 bg-gray-100 text-text-secondary text-xs font-medium rounded-full">{selectedCourse.ageGroup}</span>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-text-primary mb-2">{selectedCourse.title}</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <i className="fas fa-user text-text-secondary text-sm"></i>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">{selectedCourse.teacher}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <i className="fas fa-star text-warning text-xs"></i>
                            <span className="text-xs text-text-secondary">{selectedCourse.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <i className="fas fa-clock text-text-secondary w-4"></i>
                        <span className="text-sm text-text-secondary">{selectedCourse.startTime} - {selectedCourse.endTime}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <i className="fas fa-map-marker-alt text-text-secondary w-4"></i>
                        <span className="text-sm text-text-secondary">{selectedCourse.location}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <i className="fas fa-users text-text-secondary w-4"></i>
                        <span className="text-sm text-text-secondary">已预约 {selectedCourse.capacity}</span>
                      </div>
                    
                      {selectedCourse.childName && (
                        <div className="flex items-center space-x-3">
                          <i className="fas fa-user-graduate text-text-secondary w-4"></i>
                          <span className="text-sm text-text-secondary">子女：{selectedCourse.childName}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-3 border-t border-border-light">
                        <span className="text-lg font-bold text-primary">{selectedCourse.price}</span>
                        <button 
                          onClick={handleEnrollClick}
                          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                        >
                          立即报名
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 侧边栏遮罩 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={handleSidebarOverlayClick}
        ></div>
      )}
    </div>
  );
};

export default CourseCalendarPage;

