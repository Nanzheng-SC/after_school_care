import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getTeacherById, getTeacherCourses } from '../../utils/api/teacherApi';
import { Teacher, Course, TeacherMatching } from '../../utils/api/teacherApi';
import request from '../../utils/request';
import { getTeacherMatchingsByTeacherId } from '../../utils/api/teacherApi';

interface PersonalInfo {
  name: string;
  phone: string;
  email: string;
  certification: string;
  teacher_id: string;
}

interface TeacherProfile {
  qualifications: string[];
  teaching_style: string[];
  subjects: string[];
  community: string;
  available_time: {
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

interface Evaluation {
  score: number;
  eval_time: string;
  replied: boolean;
}

interface MatchedChild {
  youthId: string;
  youthName: string;
  youthAge: number;
  parentName: string;
  matchScore: number;
  matchBasis: string;
  matchTime: string;
}

const TeacherCenter: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showTeacherProfileModal, setShowTeacherProfileModal] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  
  // 检查是否在教师中心主页面（非子路由）
  const isMainPage = location.pathname === '/teacher-center';
  
  // 加载状态
  const [isLoadingPersonalInfo, setIsLoadingPersonalInfo] = useState(true);
  const [isLoadingTeacherProfile, setIsLoadingTeacherProfile] = useState(true);
  const [isLoadingEvaluationStats, setIsLoadingEvaluationStats] = useState(true);
  const [isLoadingPendingTasks, setIsLoadingPendingTasks] = useState(true);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingPendingMatchings, setIsLoadingPendingMatchings] = useState(true);
  
  // 数据状态
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    phone: '',
    email: '',
    certification: '',
    teacher_id: ''
  });
  
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>({
    qualifications: [],
    teaching_style: [],
    subjects: [],
    community: '',
    available_time: {
      weekday: '',
      saturday: '',
      sunday: ''
    }
  });
  
  const [evaluationStats, setEvaluationStats] = useState<EvaluationStats>({
    averageRating: 0,
    totalEvaluations: 0,
    fiveStarPercentage: 0,
    monthlyNew: 0,
    ratingsDistribution: {
      fiveStar: 0,
      fourStar: 0,
      threeStar: 0,
      twoStar: 0,
      oneStar: 0
    }
  });
  
  const [pendingTasks, setPendingTasks] = useState({
    matches: 0,
    replies: 0,
    upcomingCourses: 0
  });
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [pendingMatchings, setPendingMatchings] = useState<MatchedChild[]>([]);
  
  // 侧栏导航
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const sidebarItems = [
    {
      id: 'dashboard',
      label: '仪表盘',
      icon: 'fas fa-tachometer-alt',
      description: '概览数据'
    },
    {
      id: 'my-courses',
      label: '我的课程',
      icon: 'fas fa-book',
      description: '课程管理'
    },
    {
      id: 'course-management',
      label: '课程管理',
      icon: 'fas fa-cogs',
      description: '新增编辑'
    }
  ];
  
  // 获取个人信息
  const fetchPersonalInfo = async () => {
    try {
      setIsLoadingPersonalInfo(true);
      // 模拟演示数据
      const demoData: PersonalInfo = {
        name: '张老师',
        phone: '138****8888',
        email: 'zhang.teacher@example.com',
        certification: '已认证',
        teacher_id: 'teacher-001'
      };
      setPersonalInfo(demoData);
    } catch (error) {
      console.error('获取个人信息失败:', error);
    } finally {
      setIsLoadingPersonalInfo(false);
    }
  };
  
  // 获取教师档案
  const fetchTeacherProfile = async () => {
    try {
      setIsLoadingTeacherProfile(true);
      // 模拟演示数据
      const demoData: TeacherProfile = {
        qualifications: ['小学教师资格证', '数学专业学士', '英语六级证书'],
        teaching_style: ['因材施教', '互动式教学', '游戏化学习'],
        subjects: ['数学', '英语', '语文'],
        community: '朝阳区教育局',
        available_time: {
          weekday: '15:00-18:00',
          saturday: '09:00-17:00',
          sunday: '休息'
        }
      };
      setTeacherProfile(demoData);
    } catch (error) {
      console.error('获取教师档案失败:', error);
    } finally {
      setIsLoadingTeacherProfile(false);
    }
  };
  
  // 获取评价统计
  const fetchEvaluationStats = async () => {
    try {
      setIsLoadingEvaluationStats(true);
      // 模拟演示数据
      const demoData: EvaluationStats = {
        averageRating: 4.8,
        totalEvaluations: 56,
        fiveStarPercentage: 82,
        monthlyNew: 8,
        ratingsDistribution: {
          fiveStar: 46,
          fourStar: 8,
          threeStar: 2,
          twoStar: 0,
          oneStar: 0
        }
      };
      setEvaluationStats(demoData);
    } catch (error) {
      console.error('获取评价统计失败:', error);
    } finally {
      setIsLoadingEvaluationStats(false);
    }
  };
  
  // 获取待处理事项
  const fetchPendingTasks = async () => {
    try {
      setIsLoadingPendingTasks(true);
      // 模拟演示数据
      const demoData = {
        matches: 3,
        replies: 2,
        upcomingCourses: 4
      };
      setPendingTasks(demoData);
    } catch (error) {
      console.error('获取待处理事项失败:', error);
    } finally {
      setIsLoadingPendingTasks(false);
    }
  };
  
  // 获取课程数据
  const fetchCourses = async () => {
    try {
      setIsLoadingCourses(true);
      const teacherId = 'teacher-001'; // 实际应用中从用户上下文获取
      // 模拟演示数据
      const demoData: Course[] = [
        {
          course_id: 'course-001',
          teacher_id: 'teacher-001',
          neighborhood_id: 'neighborhood-001',
          name: '数学基础强化班',
          type: '数学',
          age_range: '7-9岁',
          schedule: '1,3,5', // 周一三五
          location: '朝阳区第一小学'
        },
        {
          course_id: 'course-002',
          teacher_id: 'teacher-001',
          neighborhood_id: 'neighborhood-001',
          name: '英语口语提升班',
          type: '英语',
          age_range: '8-11岁',
          schedule: '2,4', // 周二四
          location: '朝阳区教育局'
        },
        {
          course_id: 'course-003',
          teacher_id: 'teacher-001',
          neighborhood_id: 'neighborhood-001',
          name: '语文阅读理解',
          type: '语文',
          age_range: '9-12岁',
          schedule: '6', // 周六
          location: '朝阳区图书馆'
        }
      ];
      setCourses(demoData);
    } catch (error) {
      console.error('获取课程数据失败:', error);
    } finally {
      setIsLoadingCourses(false);
    }
  };
  
  // 获取待匹配学生
  const fetchPendingMatchings = async () => {
    try {
      setIsLoadingPendingMatchings(true);
      const teacherId = 'teacher-001'; // 实际应用中从用户上下文获取
      const response = await getTeacherMatchingsByTeacherId(teacherId);
      if (response) {
        // 转换TeacherMatching数据为MatchedChild格式
        const matchedChildren: MatchedChild[] = response.map((matching: TeacherMatching) => ({
          youthId: matching.youth_id,
          youthName: `学生${matching.youth_id.slice(-4)}`, // 实际应用中应该从API获取真实姓名
          youthAge: 10, // 实际应用中应该从API获取真实年龄
          parentName: '家长姓名', // 实际应用中应该从API获取真实家长姓名
          matchScore: matching.match_score,
          matchBasis: matching.match_basis,
          matchTime: matching.match_time
        }));
        setPendingMatchings(matchedChildren);
      }
    } catch (error) {
      console.error('获取待匹配学生失败:', error);
    } finally {
      setIsLoadingPendingMatchings(false);
    }
  };
  
  // 解析排期函数
  const parseSchedule = (schedule: string): string[] => {
    if (!schedule) return [];
    
    const daysMap: { [key: string]: string } = {
      '1': '周一',
      '2': '周二',
      '3': '周三',
      '4': '周四',
      '5': '周五',
      '6': '周六',
      '7': '周日'
    };
    
    try {
      return schedule.split(',').map(day => daysMap[day.trim()] || day.trim());
    } catch {
      return [schedule];
    }
  };
  
  // 事件处理函数
  const handleOpenTeacherProfileModal = () => {
    setShowTeacherProfileModal(true);
  };
  
  const handlePendingMatchesClick = () => {
    setActiveTab('matches');
  };
  
  const handlePendingRepliesClick = () => {
    navigate('/teacher-center/evaluations');
  };
  
  const handleUpcomingCoursesClick = () => {
    setActiveTab('my-courses');
  };
  
  // 渲染主内容
  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            {/* 个人信息区 */}
            <section className="mb-8">
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-text-primary">个人信息</h3>
                </div>
                
                {isLoadingPersonalInfo ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4, 5].map((_, index) => (
                      <div key={index} className="flex items-center space-x-3 animate-pulse">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center"></div>
                        <div>
                          <p className="text-sm text-gray-400">加载中...</p>
                          <p className="font-medium text-gray-300">加载中...</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                        <i className="fas fa-hashtag text-secondary"></i>
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary">教师ID</p>
                        <p className="font-medium text-text-primary">{personalInfo.teacher_id}</p>
                      </div>
                    </div>
                  </div>
                )}
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
            
                {isLoadingTeacherProfile ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-2">专业资格</p>
                        <div className="flex flex-wrap gap-2">
                          {[1, 2].map((_, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-200 text-gray-200 text-xs font-medium rounded-full">
                              暂无数据
                            </span>
                          ))}
                        </div>
                      </div>
                  
                      <div>
                        <p className="text-sm text-gray-400 mb-2">教学风格</p>
                        <div className="flex flex-wrap gap-2">
                          {[1, 2].map((_, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-200 text-gray-200 text-xs font-medium rounded-full">
                              暂无数据
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-2">擅长科目</p>
                        <div className="flex flex-wrap gap-2">
                          {[1, 2, 3].map((_, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-200 text-gray-200 text-xs font-medium rounded-full">
                              暂无数据
                            </span>
                          ))}
                        </div>
                      </div>
                  
                      <div>
                        <p className="text-sm text-gray-400 mb-2">所属社区</p>
                        <p className="font-medium text-gray-300">暂无社区</p>
                      </div>
                    </div>
                
                    <div>
                      <p className="text-sm text-gray-400 mb-2">服务时间</p>
                      <div className="space-y-2">
                        {[1, 2, 3].map((_, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">暂无时间</span>
                            <span className="text-sm text-gray-300">暂无时间</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
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
                          {teacherProfile.qualifications.length === 0 && (
                            <span className="text-sm text-text-tertiary">暂无资格</span>
                          )}
                        </div>
                      </div>
                  
                      <div>
                        <p className="text-sm text-text-secondary mb-2">教学风格</p>
                        <div className="flex flex-wrap gap-2">
                          {teacherProfile.teaching_style.map((style, index) => (
                            <span key={index} className="px-3 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full">
                              {style}
                            </span>
                          ))}
                          {teacherProfile.teaching_style.length === 0 && (
                            <span className="text-sm text-text-tertiary">暂无风格</span>
                          )}
                        </div>
                      </div>
                    </div>
                
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-text-secondary mb-2">擅长科目</p>
                        <div className="flex flex-wrap gap-2">
                          {teacherProfile.subjects.map((subject, index) => (
                            <span key={index} className="px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                              {subject}
                            </span>
                          ))}
                          {teacherProfile.subjects.length === 0 && (
                            <span className="text-sm text-text-tertiary">暂无科目</span>
                          )}
                        </div>
                      </div>
                  
                      <div>
                        <p className="text-sm text-text-secondary mb-2">所属社区</p>
                        <p className="font-medium text-text-primary">{teacherProfile.community || '暂无社区'}</p>
                      </div>
                    </div>
                
                    <div>
                      <p className="text-sm text-text-secondary mb-2">服务时间</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-text-primary">周一至周五</span>
                          <span className="text-sm text-text-secondary">{teacherProfile.available_time.weekday}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-text-primary">周六</span>
                          <span className="text-sm text-text-secondary">{teacherProfile.available_time.saturday}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-text-primary">周日</span>
                          <span className="text-sm text-text-secondary">{teacherProfile.available_time.sunday}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* 评价统计概览 */}
            <section className="mb-8">
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-text-primary">评价统计</h3>
                  <button 
                    onClick={() => console.log('查看评价详情')}
                    className="px-4 py-2 border border-primary text-primary text-sm font-medium rounded-lg hover:bg-primary/5"
                  >
                    <i className="fas fa-chart-bar mr-2"></i>查看详情
                  </button>
                </div>
            
                {isLoadingEvaluationStats ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 animate-pulse">
                      {[1, 2, 3, 4].map((_, index) => (
                        <div key={index} className="text-center">
                          <div className="text-3xl font-bold text-gray-300 mb-2">加载中</div>
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <i className="fas fa-graduation-cap text-gray-200"></i>
                          </div>
                          <p className="text-sm text-gray-400">加载中...</p>
                        </div>
                      ))}
                    </div>
                  
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-pulse">
                      {[1, 2, 3, 4, 5].map((_, index) => (
                        <div key={index} className="text-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2"></div>
                          <div className="text-lg font-bold text-gray-300">加载中</div>
                          <div className="text-xs text-gray-400">--星</div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">{evaluationStats.averageRating}</div>
                        <div className="mb-1"></div>
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
                        <p className="text-sm text-text-secondary">本月评价数</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* 待处理事项 */}
            <section className="mb-8">
              <div className="bg-white rounded-xl shadow-card p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-6">待处理事项</h3>
            
                {isLoadingPendingTasks ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map((_, index) => (
                      <div key={index} className="border border-border-light rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center"></div>
                            <span className="font-medium text-gray-300">加载中</span>
                          </div>
                          <span className="px-2 py-1 bg-gray-200 text-gray-200 text-xs font-medium rounded-full">--</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">有--个新的--等待您的确认</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border border-border-light rounded-lg p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <i className="fas fa-user-friends text-primary text-sm"></i>
                          </div>
                          <span className="font-medium text-text-primary">学生匹配</span>
                        </div>
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">{pendingTasks.matches}</span>
                      </div>
                      <p className="text-sm text-text-secondary mb-3">有{pendingTasks.matches}位新学生匹配</p>
                      <button 
                        onClick={handlePendingMatchesClick}
                        className="w-full py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                      >
                        查看匹配
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
                )}
              </div>
            </section>

            {/* 课程排期 */}
            <section className="mb-8">
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-text-primary">我的课程排期</h3>
                  <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90">
                    <i className="fas fa-calendar-plus mr-2"></i>添加课程
                  </button>
                </div>
                
                {isLoadingCourses ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, index) => (
                      <div key={index} className="border border-border-light rounded-lg p-4 animate-pulse">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-400 mb-1">课程名称</p>
                            <p className="font-medium text-gray-300">加载中</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">科目</p>
                            <p className="font-medium text-gray-300">加载中</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">排期</p>
                            <p className="font-medium text-gray-300">加载中</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">时间</p>
                            <p className="font-medium text-gray-300">加载中</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : courses.length === 0 ? (
                  <div className="text-center py-12">
                    <i className="fas fa-calendar-times text-4xl text-gray-300 mb-4"></i>
                    <p className="text-text-secondary mb-2">暂无课程安排</p>
                    <p className="text-sm text-text-tertiary">请联系管理员添加课程</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div key={course.course_id} className="border border-border-light rounded-lg p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-text-secondary mb-1">课程名称</p>
                            <p className="font-medium text-text-primary">{course.name || '未命名课程'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-text-secondary mb-1">课程类型</p>
                            <p className="font-medium text-text-primary">{course.type || '未指定类型'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-text-secondary mb-1">排期</p>
                            <div className="flex flex-wrap gap-2">
                              {parseSchedule(course.schedule).map((day, index) => (
                                <span key={index} className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                                  {day}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-text-secondary mb-1">适合年龄</p>
                            <p className="font-medium text-text-primary">{course.age_range || '未指定'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        );
      case 'my-courses':
        return (
          <>
            {/* 我的课程 */}
            <section className="mb-8">
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-text-primary">我的课程</h3>
                  <button 
                    onClick={() => setActiveTab('course-management')}
                    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                  >
                    <i className="fas fa-plus mr-2"></i>新增课程
                  </button>
                </div>
                
                {isLoadingCourses ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, index) => (
                      <div key={index} className="border border-border-light rounded-lg p-4 animate-pulse">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-400 mb-1">课程名称</p>
                            <p className="font-medium text-gray-300">加载中</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">科目</p>
                            <p className="font-medium text-gray-300">加载中</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">排期</p>
                            <p className="font-medium text-gray-300">加载中</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">时间</p>
                            <p className="font-medium text-gray-300">加载中</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : courses.length === 0 ? (
                  <div className="text-center py-12">
                    <i className="fas fa-calendar-times text-4xl text-gray-300 mb-4"></i>
                    <p className="text-text-secondary mb-2">暂无课程安排</p>
                    <p className="text-sm text-text-tertiary">请联系管理员添加课程</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div key={course.course_id} className="border border-border-light rounded-lg p-4 hover:border-primary/30 hover:shadow-sm transition-all">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-text-secondary mb-1">课程名称</p>
                            <p className="font-medium text-text-primary">{course.name || '未命名课程'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-text-secondary mb-1">课程类型</p>
                            <p className="font-medium text-text-primary">{course.type || '未指定类型'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-text-secondary mb-1">排期</p>
                            <div className="flex flex-wrap gap-2">
                              {parseSchedule(course.schedule).map((day, index) => (
                                <span key={index} className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                                  {day}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-text-secondary mb-1">适合年龄</p>
                            <p className="font-medium text-text-primary">{course.age_range || '未指定'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        );
      case 'course-management':
        return (
          <>
            {/* 课程管理 */}
            <section className="mb-8">
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-text-primary">课程管理</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="border-2 border-dashed border-border-light rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="text-center">
                      <i className="fas fa-plus text-4xl text-text-tertiary mb-4"></i>
                      <h4 className="font-medium text-text-primary mb-2">创建新课程</h4>
                      <p className="text-sm text-text-secondary">添加新的课程内容</p>
                    </div>
                  </div>
                  
                  <div className="border border-border-light rounded-lg p-6 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-text-primary">数学基础班</h4>
                      <span className="px-2 py-1 bg-success/10 text-success text-xs font-medium rounded-full">进行中</span>
                    </div>
                    <p className="text-sm text-text-secondary mb-3">适合7-9岁学生的基础数学课程</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-tertiary">8名学生</span>
                      <button className="text-primary text-sm hover:text-primary/80">
                        编辑 <i className="fas fa-edit ml-1"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="border border-border-light rounded-lg p-6 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-text-primary">英语口语课</h4>
                      <span className="px-2 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full">已暂停</span>
                    </div>
                    <p className="text-sm text-text-secondary mb-3">适合10-12岁学生的英语口语训练</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-tertiary">5名学生</span>
                      <button className="text-primary text-sm hover:text-primary/80">
                        编辑 <i className="fas fa-edit ml-1"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        );
      default:
        return (
          <>
            {/* 默认内容 - 仪表盘 */}
            <section className="mb-8">
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-text-primary">欢迎来到教师中心</h3>
                </div>
                
                <div className="text-center py-12">
                  <i className="fas fa-chalkboard-teacher text-4xl text-primary mb-4"></i>
                  <p className="text-text-secondary mb-2">请选择左侧菜单中的功能</p>
                  <p className="text-sm text-text-tertiary">管理您的课程和学生</p>
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  // 初始化数据加载
  useEffect(() => {
    fetchPersonalInfo();
    fetchTeacherProfile();
    fetchEvaluationStats();
    fetchPendingTasks();
    fetchCourses();
    fetchPendingMatchings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* 侧栏导航 */}
          <div className="w-64 bg-white rounded-xl shadow-card h-fit">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-chalkboard-teacher text-primary text-xl"></i>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">教师中心</h2>
                  <p className="text-sm text-text-secondary">智能匹配辅导</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary text-white'
                        : 'text-text-secondary hover:bg-gray-100'
                    }`}
                  >
                    <i className={`${item.icon} text-lg`}></i>
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className={`text-xs ${activeTab === item.id ? 'text-primary-200' : 'text-text-tertiary'}`}>
                        {item.description}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    // 清除本地存储或登录状态
                    localStorage.removeItem('teacher_token');
                    // 跳转到登录页面
                    navigate('/');
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-text-secondary hover:bg-red-50 hover:text-red-500"
                >
                  <i className="fas fa-sign-out-alt text-lg"></i>
                  <div>
                    <div className="font-medium">退出登录</div>
                    <div className="text-xs text-text-tertiary">安全退出系统</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
          
          {/* 主内容区 */}
          <div className="flex-1">
            {renderMainContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCenter;