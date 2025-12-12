

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

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
}

const CourseCalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseEvent | null>(null);
  const [isWeekView, setIsWeekView] = useState(false);

  const calendarEvents: CourseEvent[] = [
    {
      id: 'course1',
      title: '数学思维训练',
      teacher: '李老师',
      location: '阳光社区',
      startTime: '14:00',
      endTime: '16:00',
      date: '2024-01-15',
      capacity: '8/12',
      type: '学科类',
      ageGroup: '7-10岁',
      price: '¥80',
      rating: 4.9
    },
    {
      id: 'course2',
      title: '创意绘画启蒙',
      teacher: '王老师',
      location: '绿洲社区',
      startTime: '16:30',
      endTime: '18:00',
      date: '2024-01-15',
      capacity: '5/10',
      type: '艺术类',
      ageGroup: '4-6岁',
      price: '¥60',
      rating: 4.8
    },
    {
      id: 'course3',
      title: 'Scratch编程入门',
      teacher: '陈老师',
      location: '智慧社区',
      startTime: '18:30',
      endTime: '20:00',
      date: '2024-01-12',
      capacity: '3/8',
      type: '科技类',
      ageGroup: '11-14岁',
      price: '¥100',
      rating: 4.7
    },
    {
      id: 'course4',
      title: '英语口语训练',
      teacher: '张老师',
      location: '阳光社区',
      startTime: '10:00',
      endTime: '11:30',
      date: '2024-01-20',
      capacity: '6/15',
      type: '学科类',
      ageGroup: '7-10岁',
      price: '¥90',
      rating: 4.6
    },
    {
      id: 'course5',
      title: '书法基础',
      teacher: '刘老师',
      location: '绿洲社区',
      startTime: '14:00',
      endTime: '15:30',
      date: '2024-01-20',
      capacity: '4/12',
      type: '艺术类',
      ageGroup: '11-14岁',
      price: '¥70',
      rating: 4.5
    }
  ];

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '课程日历 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  const getEventsForDay = (day: number, month: number, year: number): CourseEvent[] => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarEvents.filter(event => event.date === dateStr);
  };

  const renderCalendar = () => {
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
    return calendarEvents.filter(event => event.date === todayStr);
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
              {todayCourses.map((course, index) => (
                <div key={course.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-12 h-12 ${index === 0 ? 'bg-primary/10' : 'bg-warning/10'} rounded-lg flex items-center justify-center`}>
                    <i className={`fas fa-book ${index === 0 ? 'text-primary' : 'text-warning'}`}></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary">{course.title}</h4>
                    <p className="text-sm text-text-secondary">{course.teacher} · {course.location}</p>
                    <p className="text-xs text-text-secondary mt-1">{course.startTime} - {course.endTime}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 ${index === 0 ? 'bg-success/10 text-success' : 'bg-info/10 text-info'} text-xs font-medium rounded-full`}>
                      {index === 0 ? '进行中' : '待开始'}
                    </span>
                  </div>
                </div>
              ))}
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

