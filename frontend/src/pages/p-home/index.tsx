import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import Header from '../../components/Header'; // 导入共享Header组件

// 定义用户信息接口
interface UserInfo {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

// 定义子女信息接口
interface Child {
  id: string;
  name: string;
  age: number;
  healthNote: string;
  interests: string[];
  learningStyle: string;
}

// 定义教师信息接口
interface Teacher {
  id: string;
  name: string;
  subject: string;
  experience: string;
  rating: number;
  avatar: string;
  teachingStyle: string;
  description: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [globalSearchValue, setGlobalSearchValue] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo>({name: ''});
  const [children, setChildren] = useState<Child[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(true);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(true);
  
  // 侧栏导航
  const [activeTab, setActiveTab] = useState('home');
  
  const sidebarItems = [
    {
      id: 'home',
      label: '首页',
      icon: 'fas fa-home',
      description: '主页'
    },
    {
      id: 'course-list',
      label: '课程中心',
      icon: 'fas fa-book-open',
      description: '浏览课程'
    },
    {
      id: 'my-courses',
      label: '我的课程',
      icon: 'fas fa-user-graduate',
      description: '已报课程'
    },
    {
      id: 'match-result',
      label: '匹配结果',
      icon: 'fas fa-magic',
      description: '匹配信息'
    }
  ];

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
    document.title = '课智配 - 智能匹配课后托管服务';
    return () => { document.title = originalTitle; };
  }, []);

  // 获取子女数据
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setIsLoadingChildren(true);
        // 模拟从API获取子女数据
        const childrenData: Child[] = [
          {
            id: '1',
            name: '小明',
            age: 10,
            healthNote: '健康状况良好，无特殊病史',
            interests: ['数学', '科学', '绘画', '游泳'],
            learningStyle: '视觉学习型，善于理解和分析'
          },
          {
            id: '2',
            name: '小红',
            age: 8,
            healthNote: '对某些食物过敏',
            interests: ['音乐', '舞蹈', '语言', '阅读'],
            learningStyle: '听觉学习型，擅长记忆和表达'
          }
        ];
        setChildren(childrenData);
      } catch (error) {
        console.error('获取子女数据失败:', error);
        alert('获取子女数据失败');
      } finally {
        setIsLoadingChildren(false);
      }
    };

    fetchChildren();
  }, []);

  // 获取教师数据
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setIsLoadingTeachers(true);
        // 模拟从API获取教师数据
        const teachersData: Teacher[] = [
          {
            id: '1',
            name: '张老师',
            subject: '数学',
            experience: '8年教学经验',
            rating: 4.9,
            avatar: 'https://s.coze.cn/image/OUgZ3szV3ss/',
            teachingStyle: '耐心细致，注重基础和解题技巧',
            description: '毕业于师范大学数学系，曾获得市级优秀教师称号，擅长培养学生的数学思维'
          },
          {
            id: '2',
            name: '李老师',
            subject: '语文',
            experience: '10年教学经验',
            rating: 4.8,
            avatar: 'https://s.coze.cn/image/OUgZ3szV3ss/',
            teachingStyle: '生动有趣，注重阅读理解和写作能力',
            description: '语言文学硕士，具有丰富的儿童阅读指导经验，能够激发学生的阅读兴趣'
          },
          {
            id: '3',
            name: '王老师',
            subject: '英语',
            experience: '6年教学经验',
            rating: 4.7,
            avatar: 'https://s.coze.cn/image/OUgZ3szV3ss/',
            teachingStyle: '互动性强，注重口语练习',
            description: '海外留学背景，口语流利，能够为学生创造真实的英语学习环境'
          },
          {
            id: '4',
            name: '刘老师',
            subject: '科学',
            experience: '5年教学经验',
            rating: 4.6,
            avatar: 'https://s.coze.cn/image/OUgZ3szV3ss/',
            teachingStyle: '实验为主，培养科学思维',
            description: '自然科学专业毕业，擅长通过实验和观察培养学生的科学探索精神'
          },
          {
            id: '5',
            name: '陈老师',
            subject: '艺术',
            experience: '7年教学经验',
            rating: 4.9,
            avatar: 'https://s.coze.cn/image/OUgZ3szV3ss/',
            teachingStyle: '创意启发，注重个性化发展',
            description: '艺术学院毕业，具有丰富的儿童艺术教育经验，能够启发学生的创造力'
          },
          {
            id: '6',
            name: '赵老师',
            subject: '体育',
            experience: '9年教学经验',
            rating: 4.8,
            avatar: 'https://s.coze.cn/image/OUgZ3szV3ss/',
            teachingStyle: '寓教于乐，培养运动兴趣',
            description: '体育教育专业毕业，曾是专业运动员，擅长通过游戏和运动培养学生的体能和团队精神'
          }
        ];
        setTeachers(teachersData);
      } catch (error) {
        console.error('获取教师数据失败:', error);
        alert('获取教师数据失败');
      } finally {
        setIsLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleUserMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleDocumentClick = () => {
    setIsUserDropdownOpen(false);
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const handleQuickFindTeacher = () => {
    navigate('/match-result');
  };

  const handleQuickViewCourses = () => {
    navigate('/course-list');
  };

  const handleQuickMyCourses = () => {
    navigate('/my-courses');
  };

  const handleGlobalSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const searchTerm = globalSearchValue.trim();
      if (searchTerm) {
        navigate(`/course-list?search=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  const handleUserLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('确定要退出登录吗？')) {
      navigate('/login-register');
    }
  };

  const handleViewTeacherDetail = (teacherId: string) => {
    navigate(`/teacher-detail/${teacherId}`);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 - 使用共享Header组件 */}
      <Header 
        userRole="parent" 
        userName={userInfo.name || '家长'} 
        userAvatar="https://s.coze.cn/image/OUgZ3szV3ss/" 
        onSidebarToggle={handleSidebarToggle} 
      />

      {/* 左侧菜单 */}
      <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-border-light ${styles.sidebarTransition} z-40 transform lg:transform-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                navigate(`/${item.id}`);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
              }`}
            >
              <i className={`${item.icon} w-5`}></i>
              <div className="flex-1 text-left">
                <div>{item.label}</div>
                <div className="text-xs text-text-tertiary">{item.description}</div>
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* 页面头部 */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">欢迎回来，{userInfo.name || '家长'}</h1>
              <p className="text-text-secondary">为您的孩子找到最适合的课后托管课程</p>
            </div>
            <button 
              onClick={handleUserLogout}
              className="px-4 py-2 border border-gray-300 text-text-primary text-sm font-medium rounded-lg hover:bg-gray-100"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>退出登录
            </button>
          </div>

          {/* 家长信息展示区 */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-6">家长信息</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-user text-primary text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary">{userInfo.name || '家长'}</h4>
                    <p className="text-sm text-text-secondary">姓名</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-phone text-success text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary">{userInfo.phone || '138****5678'}</h4>
                    <p className="text-sm text-text-secondary">联系电话</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-envelope text-info text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary">{userInfo.email || 'parent***@example.com'}</h4>
                    <p className="text-sm text-text-secondary">邮箱地址</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-home text-warning text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary">{userInfo.address || '北京市朝阳区'}</h4>
                    <p className="text-sm text-text-secondary">家庭住址</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 子女信息展示区 - 应用children-manage风格 */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">子女信息</h3>
                <button 
                  onClick={() => navigate('/parent-center/children-manage')}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                >
                  <i className="fas fa-edit mr-2"></i>编辑子女信息
                </button>
              </div>
              
              {isLoadingChildren ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : children.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {children.map((child) => (
                    <div key={child.id} className="border border-border-light rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                          <i className="fas fa-child text-primary text-2xl"></i>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-medium text-text-primary">{child.name}</h3>
                            <span className="px-3 py-1 bg-info/10 text-info text-sm font-medium rounded-full">{child.age}岁</span>
                          </div>
                          
                          {child.healthNote && (
                            <div className="mb-3">
                              <p className="text-sm text-text-secondary">
                                <i className="fas fa-heart text-danger mr-2"></i>
                                健康状况：{child.healthNote}
                              </p>
                            </div>
                          )}
                          
                          {child.learningStyle && (
                            <div className="mb-3">
                              <p className="text-sm text-text-secondary">
                                <i className="fas fa-brain text-warning mr-2"></i>
                                学习风格：{child.learningStyle}
                              </p>
                            </div>
                          )}
                          
                          {child.interests && child.interests.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm text-text-secondary mb-2">
                                <i className="fas fa-star text-warning mr-2"></i>
                                兴趣爱好：
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {child.interests.map((interest, index) => (
                                  <span 
                                    key={index} 
                                    className="px-3 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full"
                                  >
                                    {interest}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <i className="fas fa-child text-4xl text-gray-300 mb-4"></i>
                  <p className="text-text-secondary">暂无子女信息</p>
                  <p className="text-sm text-text-tertiary">请联系管理员添加子女信息</p>
                </div>
              )}
            </div>
          </section>

          {/* 快捷入口区 */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-text-primary mb-6">快捷入口</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button 
                onClick={handleQuickFindTeacher}
                className={`bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover ${styles.cardHover} text-left transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-search text-primary text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary text-lg">智能匹配</h3>
                    <p className="text-base text-text-secondary">为孩子找老师</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={handleQuickViewCourses}
                className={`bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover ${styles.cardHover} text-left transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-success/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-book text-success text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary text-lg">浏览课程</h3>
                    <p className="text-base text-text-secondary">丰富课程选择</p>
                  </div>
                </div>
              </button>
              
              <button 
                onClick={handleQuickMyCourses}
                className={`bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover ${styles.cardHover} text-left transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-warning/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-calendar-check text-warning text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary text-lg">我的课程</h3>
                    <p className="text-base text-text-secondary">管理已报名课程</p>
                  </div>
                </div>
              </button>
            </div>
          </section>

          {/* 教师展示区 - 新增模块 */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">教师推荐</h3>
                <button 
                  onClick={() => navigate('/teacher-list')}
                  className="px-4 py-2 border border-primary text-primary text-sm font-medium rounded-lg hover:bg-primary/10"
                >
                  <i className="fas fa-list mr-2"></i>查看全部教师
                </button>
              </div>
              
              {isLoadingTeachers ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : teachers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teachers.slice(0, 6).map((teacher) => (
                    <div 
                      key={teacher.id} 
                      className="border border-border-light rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleViewTeacherDetail(teacher.id)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden">
                          <img 
                            src={teacher.avatar} 
                            alt={teacher.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium text-text-primary">{teacher.name}</h3>
                            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">{teacher.subject}</span>
                          </div>
                          
                          <div className="mb-3 flex items-center">
                            <div className="flex items-center text-yellow-400 mr-2">
                              {[...Array(5)].map((_, i) => (
                                <i 
                                  key={i} 
                                  className={`fas fa-star ${i < Math.floor(teacher.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                ></i>
                              ))}
                            </div>
                            <span className="text-sm text-text-secondary">{teacher.rating.toFixed(1)}</span>
                          </div>
                          
                          <p className="text-sm text-text-secondary mb-3">{teacher.experience}</p>
                          
                          <div className="mb-3">
                            <p className="text-sm text-text-secondary">
                              <i className="fas fa-chalkboard-teacher text-primary mr-2"></i>
                              教学风格：{teacher.teachingStyle}
                            </p>
                          </div>
                          
                          <p className="text-sm text-text-secondary line-clamp-2">{teacher.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <i className="fas fa-user-graduate text-4xl text-gray-300 mb-4"></i>
                  <p className="text-text-secondary">暂无教师信息</p>
                  <p className="text-sm text-text-tertiary">请稍后再试或联系管理员</p>
                </div>
              )}
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
    </div>
  );
};

export default HomePage;