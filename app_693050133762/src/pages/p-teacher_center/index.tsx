

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface PersonalInfo {
  name: string;
  phone: string;
  email: string;
  certification: string;
}

interface TeacherProfile {
  qualifications: string[];
  teachingStyle: string[];
  subjects: string[];
  community: string;
  serviceTime: {
    weekday: string;
    saturday: string;
    sunday: string;
  };
}

interface EvaluationStats {
  averageRating: number;
  totalEvaluations: number;
  fiveStarPercentage: number;
  monthlyNew: number;
  ratingsDistribution: {
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
  };
}

const TeacherCenter: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);
  const [showTeacherProfileModal, setShowTeacherProfileModal] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '李建华',
    phone: '138****5678',
    email: 'li***@example.com',
    certification: '已认证'
  });

  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>({
    qualifications: ['小学数学教师资格证', '奥数教练员'],
    teachingStyle: ['互动式教学', '启发式引导'],
    subjects: ['数学', '思维训练', '奥数'],
    community: '阳光社区',
    serviceTime: {
      weekday: '16:00-20:00',
      saturday: '09:00-18:00',
      sunday: '10:00-16:00'
    }
  });

  const [evaluationStats] = useState<EvaluationStats>({
    averageRating: 4.9,
    totalEvaluations: 156,
    fiveStarPercentage: 95,
    monthlyNew: 12,
    ratingsDistribution: {
      fiveStar: 148,
      fourStar: 6,
      threeStar: 2,
      twoStar: 0,
      oneStar: 0
    }
  });

  const [pendingTasks] = useState({
    matches: 3,
    replies: 2,
    upcomingCourses: 2
  });

  // 编辑表单状态
  const [editPersonalInfoForm, setEditPersonalInfoForm] = useState({
    name: personalInfo.name,
    phone: '13812345678',
    email: 'lijianhua@example.com'
  });

  const [editTeacherProfileForm, setEditTeacherProfileForm] = useState({
    qualifications: teacherProfile.qualifications.join(','),
    teachingStyle: teacherProfile.teachingStyle.join(','),
    subjects: teacherProfile.subjects.join(','),
    community: teacherProfile.community,
    weekdayStart: '16:00',
    weekdayEnd: '20:00',
    saturdayStart: '09:00',
    saturdayEnd: '18:00',
    sundayStart: '10:00',
    sundayEnd: '16:00'
  });

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '教师中心 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleGlobalSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const searchTerm = globalSearchTerm.trim();
      if (searchTerm) {
        console.log('搜索:', searchTerm);
        // 这里应该实现搜索功能
      }
    }
  };

  const handleOpenPersonalInfoModal = () => {
    setEditPersonalInfoForm({
      name: personalInfo.name,
      phone: '13812345678',
      email: 'lijianhua@example.com'
    });
    setShowPersonalInfoModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleClosePersonalInfoModal = () => {
    setShowPersonalInfoModal(false);
    document.body.style.overflow = 'auto';
  };

  const handleSavePersonalInfo = () => {
    console.log('保存个人信息:', editPersonalInfoForm);
    
    setPersonalInfo({
      ...personalInfo,
      name: editPersonalInfoForm.name,
      phone: editPersonalInfoForm.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
      email: editPersonalInfoForm.email.replace(/(.).*@/, '$1***@')
    });

    handleClosePersonalInfoModal();
    alert('个人信息保存成功！');
  };

  const handleOpenTeacherProfileModal = () => {
    setEditTeacherProfileForm({
      qualifications: teacherProfile.qualifications.join(','),
      teachingStyle: teacherProfile.teachingStyle.join(','),
      subjects: teacherProfile.subjects.join(','),
      community: teacherProfile.community,
      weekdayStart: '16:00',
      weekdayEnd: '20:00',
      saturdayStart: '09:00',
      saturdayEnd: '18:00',
      sundayStart: '10:00',
      sundayEnd: '16:00'
    });
    setShowTeacherProfileModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseTeacherProfileModal = () => {
    setShowTeacherProfileModal(false);
    document.body.style.overflow = 'auto';
  };

  const handleSaveTeacherProfile = () => {
    console.log('保存教师档案:', editTeacherProfileForm);
    
    setTeacherProfile({
      ...teacherProfile,
      qualifications: editTeacherProfileForm.qualifications.split(',').map(item => item.trim()),
      teachingStyle: editTeacherProfileForm.teachingStyle.split(',').map(item => item.trim()),
      subjects: editTeacherProfileForm.subjects.split(',').map(item => item.trim()),
      community: editTeacherProfileForm.community,
      serviceTime: {
        weekday: `${editTeacherProfileForm.weekdayStart}-${editTeacherProfileForm.weekdayEnd}`,
        saturday: `${editTeacherProfileForm.saturdayStart}-${editTeacherProfileForm.saturdayEnd}`,
        sunday: `${editTeacherProfileForm.sundayStart}-${editTeacherProfileForm.sundayEnd}`
      }
    });

    handleCloseTeacherProfileModal();
    alert('教师档案保存成功！');
  };

  const handleMessageCenterClick = () => {
    console.log('打开消息中心');
    alert('消息中心功能');
  };

  const handlePendingMatchesClick = () => {
    navigate('/student-match');
  };

  const handlePendingRepliesClick = () => {
    navigate('/teacher-eval-stats');
  };

  const handleUpcomingCoursesClick = () => {
    navigate('/teacher-course-schedule');
  };

  const handleModalOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      if (showPersonalInfoModal) {
        handleClosePersonalInfoModal();
      }
      if (showTeacherProfileModal) {
        handleCloseTeacherProfileModal();
      }
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
                placeholder="搜索课程、学生..." 
                value={globalSearchTerm}
                onChange={(e) => setGlobalSearchTerm(e.target.value)}
                onKeyPress={handleGlobalSearchKeyPress}
                className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm"></i>
            </div>
          </div>
          
          {/* 右侧操作区 */}
          <div className="flex items-center space-x-4">
            {/* 消息中心 */}
            <button 
              onClick={handleMessageCenterClick}
              className="relative p-2 rounded-lg hover:bg-gray-100"
            >
              <i className="fas fa-bell text-text-secondary"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            
            {/* 退出登录 */}
            <button 
              onClick={() => {
                if (confirm('确定要退出登录吗？')) {
                  navigate('/login-register');
                }
              }}
              className="p-2 rounded-lg hover:bg-gray-100"
              title="退出登录"
            >
              <i className="fas fa-sign-out-alt text-text-secondary"></i>
            </button>
            
            {/* 用户头像 */}
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
                <img 
                  src="https://s.coze.cn/image/ophzPOKcYOA/" 
                  alt="李老师头像" 
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
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
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
            className={`${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}
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
            <h2 className="text-2xl font-bold text-text-primary mb-2">教师中心</h2>
            <nav className="text-sm text-text-secondary">
              <span>首页</span>
              <i className="fas fa-chevron-right mx-2"></i>
              <span className="text-primary">教师中心</span>
            </nav>
          </div>

          {/* 个人信息区 */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">个人信息</h3>
                <button 
                  onClick={handleOpenPersonalInfoModal}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                >
                  <i className="fas fa-edit mr-2"></i>编辑
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-user text-primary"></i>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">姓名</p>
                    <p className="font-medium text-text-primary">{personalInfo.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-phone text-info"></i>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">手机号</p>
                    <p className="font-medium text-text-primary">{personalInfo.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-envelope text-warning"></i>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">邮箱</p>
                    <p className="font-medium text-text-primary">{personalInfo.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-id-card text-success"></i>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">教师资格证</p>
                    <p className="font-medium text-text-primary">{personalInfo.certification}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 教师档案区 */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">教师档案</h3>
                <button 
                  onClick={handleOpenTeacherProfileModal}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                >
                  <i className="fas fa-edit mr-2"></i>编辑
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-text-secondary mb-2">专业资格</p>
                    <div className="flex flex-wrap gap-2">
                      {teacherProfile.qualifications.map((qualification, index) => (
                        <span key={index} className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          {qualification}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-text-secondary mb-2">教学风格</p>
                    <div className="flex flex-wrap gap-2">
                      {teacherProfile.teachingStyle.map((style, index) => (
                        <span key={index} className="px-3 py-1 bg-info/10 text-info text-xs font-medium rounded-full">
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-text-secondary mb-2">擅长科目</p>
                    <div className="flex flex-wrap gap-2">
                      {teacherProfile.subjects.map((subject, index) => (
                        <span key={index} className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-text-secondary mb-2">所属社区</p>
                    <p className="font-medium text-text-primary">{teacherProfile.community}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-text-secondary mb-2">服务时间</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-primary">周一至周五</span>
                      <span className="text-sm text-text-secondary">{teacherProfile.serviceTime.weekday}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-primary">周六</span>
                      <span className="text-sm text-text-secondary">{teacherProfile.serviceTime.saturday}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-primary">周日</span>
                      <span className="text-sm text-text-secondary">{teacherProfile.serviceTime.sunday}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 评价统计概览 */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">评价统计</h3>
                <Link 
                  to="/teacher-eval-stats"
                  className="px-4 py-2 border border-primary text-primary text-sm font-medium rounded-lg hover:bg-primary/5"
                >
                  <i className="fas fa-chart-bar mr-2"></i>查看详情
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{evaluationStats.averageRating}</div>
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <i className="fas fa-star text-warning"></i>
                    <i className="fas fa-star text-warning"></i>
                    <i className="fas fa-star text-warning"></i>
                    <i className="fas fa-star text-warning"></i>
                    <i className="fas fa-star text-warning"></i>
                  </div>
                  <p className="text-sm text-text-secondary">平均评分</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-success mb-2">{evaluationStats.totalEvaluations}</div>
                  <p className="text-sm text-text-secondary">总评价数</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-warning mb-2">{evaluationStats.fiveStarPercentage}%</div>
                  <p className="text-sm text-text-secondary">5星评价占比</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-info mb-2">{evaluationStats.monthlyNew}</div>
                  <p className="text-sm text-text-secondary">本月新增</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-star text-warning text-sm"></i>
                  </div>
                  <div className="text-lg font-bold text-text-primary">{evaluationStats.ratingsDistribution.fiveStar}</div>
                  <div className="text-xs text-text-secondary">5星</div>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-star text-success text-sm"></i>
                  </div>
                  <div className="text-lg font-bold text-text-primary">{evaluationStats.ratingsDistribution.fourStar}</div>
                  <div className="text-xs text-text-secondary">4星</div>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-star text-info text-sm"></i>
                  </div>
                  <div className="text-lg font-bold text-text-primary">{evaluationStats.ratingsDistribution.threeStar}</div>
                  <div className="text-xs text-text-secondary">3星</div>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-star text-secondary text-sm"></i>
                  </div>
                  <div className="text-lg font-bold text-text-primary">{evaluationStats.ratingsDistribution.twoStar}</div>
                  <div className="text-xs text-text-secondary">2星</div>
                </div>
                
                <div className="text-center">
                  <div className="w-8 h-8 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-star text-danger text-sm"></i>
                  </div>
                  <div className="text-lg font-bold text-text-primary">{evaluationStats.ratingsDistribution.oneStar}</div>
                  <div className="text-xs text-text-secondary">1星</div>
                </div>
              </div>
            </div>
          </section>

          {/* 待处理事项 */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-6">待处理事项</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border border-border-light rounded-lg p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <i className="fas fa-user-plus text-primary text-sm"></i>
                      </div>
                      <span className="font-medium text-text-primary">待确认匹配</span>
                    </div>
                    <span className="px-2 py-1 bg-danger/10 text-danger text-xs font-medium rounded-full">{pendingTasks.matches}</span>
                  </div>
                  <p className="text-sm text-text-secondary mb-3">有{pendingTasks.matches}个新的学生匹配等待您的确认</p>
                  <button 
                    onClick={handlePendingMatchesClick}
                    className="w-full py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                  >
                    查看详情
                  </button>
                </div>
                
                <div className="border border-border-light rounded-lg p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                        <i className="fas fa-comment text-success text-sm"></i>
                      </div>
                      <span className="font-medium text-text-primary">待回复评价</span>
                    </div>
                    <span className="px-2 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full">{pendingTasks.replies}</span>
                  </div>
                  <p className="text-sm text-text-secondary mb-3">有{pendingTasks.replies}条新评价需要回复</p>
                  <button 
                    onClick={handlePendingRepliesClick}
                    className="w-full py-2 bg-success text-white text-sm font-medium rounded-lg hover:bg-success/90"
                  >
                    立即回复
                  </button>
                </div>
                
                <div className="border border-border-light rounded-lg p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center">
                        <i className="fas fa-calendar-check text-info text-sm"></i>
                      </div>
                      <span className="font-medium text-text-primary">今日课程</span>
                    </div>
                    <span className="px-2 py-1 bg-info/10 text-info text-xs font-medium rounded-full">{pendingTasks.upcomingCourses}</span>
                  </div>
                  <p className="text-sm text-text-secondary mb-3">今天有{pendingTasks.upcomingCourses}节课需要准备</p>
                  <button 
                    onClick={handleUpcomingCoursesClick}
                    className="w-full py-2 bg-info text-white text-sm font-medium rounded-lg hover:bg-info/90"
                  >
                    查看课程
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 侧边栏遮罩 */}
      {isSidebarOpen && (
        <div 
          onClick={handleSidebarToggle}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        ></div>
      )}

      {/* 编辑个人信息弹窗 */}
      {showPersonalInfoModal && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalOverlay}></div>
          <div 
            className="relative flex items-center justify-center min-h-screen p-4"
            onClick={handleModalOverlayClick}
          >
            <div className={`bg-white rounded-xl shadow-xl max-w-md w-full ${styles.modalEnter}`}>
              <div className="flex items-center justify-between p-6 border-b border-border-light">
                <h3 className="text-lg font-semibold text-text-primary">编辑个人信息</h3>
                <button 
                  onClick={handleClosePersonalInfoModal}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <i className="fas fa-times text-text-secondary"></i>
                </button>
              </div>
              <div className="p-6">
                <form className="space-y-4">
                  <div>
                    <label htmlFor="edit-name" className="block text-sm font-medium text-text-primary mb-2">姓名</label>
                    <input 
                      type="text" 
                      id="edit-name" 
                      value={editPersonalInfoForm.name}
                      onChange={(e) => setEditPersonalInfoForm({...editPersonalInfoForm, name: e.target.value})}
                      className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-phone" className="block text-sm font-medium text-text-primary mb-2">手机号</label>
                    <input 
                      type="tel" 
                      id="edit-phone" 
                      value={editPersonalInfoForm.phone}
                      onChange={(e) => setEditPersonalInfoForm({...editPersonalInfoForm, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-email" className="block text-sm font-medium text-text-primary mb-2">邮箱</label>
                    <input 
                      type="email" 
                      id="edit-email" 
                      value={editPersonalInfoForm.email}
                      onChange={(e) => setEditPersonalInfoForm({...editPersonalInfoForm, email: e.target.value})}
                      className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </form>
              </div>
              <div className="flex space-x-3 p-6 border-t border-border-light">
                <button 
                  onClick={handleClosePersonalInfoModal}
                  className="flex-1 py-2 border border-border-light text-text-secondary text-sm font-medium rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button 
                  onClick={handleSavePersonalInfo}
                  className="flex-1 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 编辑教师档案弹窗 */}
      {showTeacherProfileModal && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalOverlay}></div>
          <div 
            className="relative flex items-center justify-center min-h-screen p-4"
            onClick={handleModalOverlayClick}
          >
            <div className={`bg-white rounded-xl shadow-xl max-w-2xl w-full ${styles.modalEnter}`}>
              <div className="flex items-center justify-between p-6 border-b border-border-light">
                <h3 className="text-lg font-semibold text-text-primary">编辑教师档案</h3>
                <button 
                  onClick={handleCloseTeacherProfileModal}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <i className="fas fa-times text-text-secondary"></i>
                </button>
              </div>
              <div className="p-6">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="edit-qualifications" className="block text-sm font-medium text-text-primary mb-2">专业资格</label>
                      <textarea 
                        id="edit-qualifications" 
                        rows={3}
                        value={editTeacherProfileForm.qualifications}
                        onChange={(e) => setEditTeacherProfileForm({...editTeacherProfileForm, qualifications: e.target.value})}
                        className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" 
                        placeholder="请输入专业资格，用逗号分隔"
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="edit-subjects" className="block text-sm font-medium text-text-primary mb-2">擅长科目</label>
                      <textarea 
                        id="edit-subjects" 
                        rows={3}
                        value={editTeacherProfileForm.subjects}
                        onChange={(e) => setEditTeacherProfileForm({...editTeacherProfileForm, subjects: e.target.value})}
                        className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" 
                        placeholder="请输入擅长科目，用逗号分隔"
                      ></textarea>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="edit-teaching-style" className="block text-sm font-medium text-text-primary mb-2">教学风格</label>
                      <textarea 
                        id="edit-teaching-style" 
                        rows={3}
                        value={editTeacherProfileForm.teachingStyle}
                        onChange={(e) => setEditTeacherProfileForm({...editTeacherProfileForm, teachingStyle: e.target.value})}
                        className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" 
                        placeholder="请输入教学风格，用逗号分隔"
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="edit-community" className="block text-sm font-medium text-text-primary mb-2">所属社区</label>
                      <select 
                        id="edit-community" 
                        value={editTeacherProfileForm.community}
                        onChange={(e) => setEditTeacherProfileForm({...editTeacherProfileForm, community: e.target.value})}
                        className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="阳光社区">阳光社区</option>
                        <option value="绿洲社区">绿洲社区</option>
                        <option value="智慧社区">智慧社区</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-3">服务时间</label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4">
                        <span className="w-20 text-sm text-text-secondary">周一至周五</span>
                        <input 
                          type="time" 
                          value={editTeacherProfileForm.weekdayStart}
                          onChange={(e) => setEditTeacherProfileForm({...editTeacherProfileForm, weekdayStart: e.target.value})}
                          className="w-24 px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:border-primary"
                        />
                        <span className="text-text-secondary">-</span>
                        <input 
                          type="time" 
                          value={editTeacherProfileForm.weekdayEnd}
                          onChange={(e) => setEditTeacherProfileForm({...editTeacherProfileForm, weekdayEnd: e.target.value})}
                          className="w-24 px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="w-20 text-sm text-text-secondary">周六</span>
                        <input 
                          type="time" 
                          value={editTeacherProfileForm.saturdayStart}
                          onChange={(e) => setEditTeacherProfileForm({...editTeacherProfileForm, saturdayStart: e.target.value})}
                          className="w-24 px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:border-primary"
                        />
                        <span className="text-text-secondary">-</span>
                        <input 
                          type="time" 
                          value={editTeacherProfileForm.saturdayEnd}
                          onChange={(e) => setEditTeacherProfileForm({...editTeacherProfileForm, saturdayEnd: e.target.value})}
                          className="w-24 px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="w-20 text-sm text-text-secondary">周日</span>
                        <input 
                          type="time" 
                          value={editTeacherProfileForm.sundayStart}
                          onChange={(e) => setEditTeacherProfileForm({...editTeacherProfileForm, sundayStart: e.target.value})}
                          className="w-24 px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:border-primary"
                        />
                        <span className="text-text-secondary">-</span>
                        <input 
                          type="time" 
                          value={editTeacherProfileForm.sundayEnd}
                          onChange={(e) => setEditTeacherProfileForm({...editTeacherProfileForm, sundayEnd: e.target.value})}
                          className="w-24 px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="flex space-x-3 p-6 border-t border-border-light">
                <button 
                  onClick={handleCloseTeacherProfileModal}
                  className="flex-1 py-2 border border-border-light text-text-secondary text-sm font-medium rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button 
                  onClick={handleSaveTeacherProfile}
                  className="flex-1 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCenter;

