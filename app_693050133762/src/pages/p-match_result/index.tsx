

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface MatchTeacher {
  id: number;
  name: string;
  avatar: string;
  title: string;
  matchRate: number;
  interestMatch: number;
  learningStyleMatch: number;
  rating: number;
  reviewCount: string;
  reasons: {
    interest: string;
    learningStyle: string;
    expertise: string;
  };
}

const MatchResultPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedReasons, setExpandedReasons] = useState<Record<number, boolean>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const matchTeachers: MatchTeacher[] = [
    {
      id: 1,
      name: '李老师',
      avatar: 'https://s.coze.cn/image/7xV2y6Hso5I/',
      title: '数学思维专家',
      matchRate: 92,
      interestMatch: 95,
      learningStyleMatch: 88,
      rating: 4.9,
      reviewCount: '4.9',
      reasons: {
        interest: '数学、逻辑思维、游戏化学习',
        learningStyle: '视觉型学习者，喜欢互动教学',
        expertise: '小学数学思维训练，5年教学经验'
      }
    },
    {
      id: 2,
      name: '王老师',
      avatar: 'https://s.coze.cn/image/31MOh5PbAo0/',
      title: '创意美术教师',
      matchRate: 88,
      interestMatch: 92,
      learningStyleMatch: 84,
      rating: 4.8,
      reviewCount: '4.8',
      reasons: {
        interest: '绘画、手工制作、创意表达',
        learningStyle: '动手型学习者，喜欢自由创作',
        expertise: '儿童美术启蒙，擅长激发创造力'
      }
    },
    {
      id: 3,
      name: '陈老师',
      avatar: 'https://s.coze.cn/image/wnmhCEo1k4Y/',
      title: '编程启蒙教师',
      matchRate: 85,
      interestMatch: 88,
      learningStyleMatch: 82,
      rating: 4.7,
      reviewCount: '4.7',
      reasons: {
        interest: '科技、游戏、逻辑思维',
        learningStyle: '分析型学习者，喜欢解决问题',
        expertise: 'Scratch编程教学，4年教学经验'
      }
    },
    {
      id: 4,
      name: '刘老师',
      avatar: 'https://s.coze.cn/image/SrtByOaq2iA/',
      title: '英语启蒙教师',
      matchRate: 82,
      interestMatch: 80,
      learningStyleMatch: 84,
      rating: 4.6,
      reviewCount: '4.6',
      reasons: {
        interest: '音乐、故事、互动游戏',
        learningStyle: '听觉型学习者，喜欢韵律和节奏',
        expertise: '儿童英语启蒙，擅长TPR教学法'
      }
    },
    {
      id: 5,
      name: '赵老师',
      avatar: 'https://s.coze.cn/image/xb55y8EnTkU/',
      title: '书法艺术教师',
      matchRate: 78,
      interestMatch: 75,
      learningStyleMatch: 81,
      rating: 4.5,
      reviewCount: '4.5',
      reasons: {
        interest: '传统文化、手工、专注力训练',
        learningStyle: '耐心型学习者，喜欢细致工作',
        expertise: '少儿书法教学，6年教学经验'
      }
    }
  ];

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '智能匹配结果 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleRefreshMatches = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      alert('重新匹配完成！');
    }, 2000);
  };

  const handleExpandReason = (teacherId: number) => {
    setExpandedReasons(prev => ({
      ...prev,
      [teacherId]: !prev[teacherId]
    }));
  };

  const handleViewTeacherProfile = (teacherId: number) => {
    console.log(`查看教师${teacherId}详情 - 需要实现教师详情侧边抽屉`);
  };

  const handleViewCourses = (teacherId: number) => {
    navigate(`/course-list?teacherId=teacher${teacherId}`);
  };

  const handleContactTeacher = (teacherId: number) => {
    console.log(`联系教师${teacherId} - 需要实现联系功能`);
    alert(`联系教师${teacherId}功能正在开发中`);
  };

  const handleMessageCenter = () => {
    console.log('打开消息中心 - 需要实现消息中心侧边抽屉');
  };

  const handleUserMenu = () => {
    console.log('打开用户菜单 - 需要实现用户下拉菜单');
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-xs"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-xs"></i>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-xs"></i>);
    }
    
    return stars;
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
            <button 
              onClick={handleMessageCenter}
              className="relative p-2 rounded-lg hover:bg-gray-100"
            >
              <i className="fas fa-bell text-text-secondary"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            
            {/* 用户头像 */}
            <div className="relative">
              <button 
                onClick={handleUserMenu}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
              >
                <img 
                  src="https://s.coze.cn/image/ku1m3Yizfhw/" 
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
            className={`${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}
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
                <h2 className="text-2xl font-bold text-text-primary mb-2">智能匹配结果</h2>
                <nav className="text-sm text-text-secondary">
                  <Link to="/home" className="hover:text-primary">首页</Link>
                  <span className="mx-2">/</span>
                  <span className="text-text-primary">匹配结果</span>
                </nav>
              </div>
              <button 
                onClick={handleRefreshMatches}
                disabled={isRefreshing}
                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {isRefreshing ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>匹配中...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sync-alt mr-2"></i>重新匹配
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 匹配概览区 */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">匹配概览</h3>
                <div className="text-sm text-text-secondary">
                  <i className="fas fa-clock mr-1"></i>
                  最后更新：2024-01-15 14:30
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">8</div>
                  <div className="text-sm text-text-secondary">匹配教师总数</div>
                </div>
                <div className="text-center p-4 bg-success/5 rounded-lg">
                  <div className="text-3xl font-bold text-success mb-2">5</div>
                  <div className="text-sm text-text-secondary">高匹配度(≥85%)</div>
                </div>
                <div className="text-center p-4 bg-warning/5 rounded-lg">
                  <div className="text-3xl font-bold text-warning mb-2">12</div>
                  <div className="text-sm text-text-secondary">推荐课程数</div>
                </div>
              </div>
            </div>
          </section>

          {/* 匹配列表区 */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="p-6 border-b border-border-light">
                <h3 className="text-lg font-semibold text-text-primary">匹配教师列表</h3>
                <p className="text-sm text-text-secondary mt-1">基于您子女的兴趣偏好和学习风格智能匹配</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">教师姓名</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">匹配度</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">匹配依据</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">教师评分</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-border-light">
                    {matchTeachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={teacher.avatar}
                              alt={`${teacher.name}头像`}
                              className="w-10 h-10 rounded-full mr-3 cursor-pointer"
                              onClick={() => handleViewTeacherProfile(teacher.id)}
                            />
                            <div>
                              <div 
                                className="text-sm font-medium text-text-primary cursor-pointer hover:text-primary"
                                onClick={() => handleViewTeacherProfile(teacher.id)}
                              >
                                {teacher.name}
                              </div>
                              <div className="text-sm text-text-secondary">{teacher.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className={styles.matchProgress} 
                                style={{ width: `${teacher.matchRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-text-primary">{teacher.matchRate}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-text-secondary">
                            兴趣匹配度 {teacher.interestMatch}% | 学习风格匹配度 {teacher.learningStyleMatch}%
                            <button 
                              className="text-primary hover:text-primary/80 ml-2"
                              onClick={() => handleExpandReason(teacher.id)}
                            >
                              <i className={`fas ${expandedReasons[teacher.id] ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                            </button>
                          </div>
                          <div 
                            className={`${styles.expandableContent} ${expandedReasons[teacher.id] ? styles.expanded : ''} mt-2 text-sm text-text-secondary`}
                          >
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="space-y-2">
                                <div><strong>兴趣匹配：</strong>{teacher.reasons.interest}</div>
                                <div><strong>学习风格：</strong>{teacher.reasons.learningStyle}</div>
                                <div><strong>教师专长：</strong>{teacher.reasons.expertise}</div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1">
                            <div className="flex text-warning">
                              {renderStars(teacher.rating)}
                            </div>
                            <span className="text-sm text-text-secondary">{teacher.reviewCount}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            className="text-primary hover:text-primary/80 mr-3"
                            onClick={() => handleViewCourses(teacher.id)}
                          >
                            查看课程
                          </button>
                          <button 
                            className="text-success hover:text-success/80"
                            onClick={() => handleContactTeacher(teacher.id)}
                          >
                            联系
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 匹配说明 */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">匹配算法说明</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-2">60%</div>
                  <div className="text-sm text-text-secondary">教师评分权重</div>
                </div>
                <div className="text-center p-4 bg-success/5 rounded-lg">
                  <div className="text-2xl font-bold text-success mb-2">30%</div>
                  <div className="text-sm text-text-secondary">兴趣匹配权重</div>
                </div>
                <div className="text-center p-4 bg-warning/5 rounded-lg">
                  <div className="text-2xl font-bold text-warning mb-2">10%</div>
                  <div className="text-sm text-text-secondary">学习风格权重</div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-info/5 rounded-lg">
                <div className="flex items-start space-x-3">
                  <i className="fas fa-info-circle text-info mt-1"></i>
                  <div className="text-sm text-text-secondary">
                    <p>匹配度评分基于您子女的兴趣偏好、学习风格与教师的专业特长、教学风格进行智能计算。</p>
                    <p className="mt-1">建议优先选择匹配度≥85%的教师，这些教师更符合您子女的个性化需求。</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 侧边栏遮罩 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={handleSidebarToggle}
        ></div>
      )}
    </div>
  );
};

export default MatchResultPage;

