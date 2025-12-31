

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import request from '../../utils/request';
import Header from '../../components/Header';

// 后端匹配数据接口
interface MatchData {
  teacher_id: number;
  teacher_name: string;
  teacher_avatar: string;
  teacher_title: string;
  match_score: number;
  interest_match: number;
  style_match: number;
  teacher_rating: number;
  review_count: string;
  interest_reason: string;
  style_reason: string;
  expertise_reason: string;
}

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
  const [matchTeachers, setMatchTeachers] = useState<MatchTeacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<MatchTeacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);



  // 获取匹配结果数据
  const fetchMatchResults = useCallback(async () => {
    try {
      // 调用真实API获取匹配结果
      const response = await request.get('/api/matches');
      const data = response.data;
      
      // 转换后端数据为前端格式
      const formattedTeachers: MatchTeacher[] = (data.matches || []).map((match: MatchData) => ({
        id: match.teacher_id || 0,
        name: match.teacher_name || '未知教师',
        avatar: match.teacher_avatar || 'https://via.placeholder.com/150',
        title: match.teacher_title || '教师',
        matchRate: match.match_score || 0,
        interestMatch: match.interest_match || 0,
        learningStyleMatch: match.style_match || 0,
        rating: match.teacher_rating || 0,
        reviewCount: match.review_count || '0',
        reasons: {
          interest: match.interest_reason || '兴趣匹配',
          learningStyle: match.style_reason || '学习风格匹配',
          expertise: match.expertise_reason || '专业匹配'
        }
      }));
      
      setMatchTeachers(formattedTeachers);
    } catch (error) {
      console.error('获取匹配结果失败:', error);
      // API请求失败时使用空数组
      setMatchTeachers([]);
    }
  }, [setMatchTeachers]);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '智能匹配结果 - 课智配';
    
    // 页面加载时获取匹配结果
    fetchMatchResults();
    
    return () => { document.title = originalTitle; };
  }, [fetchMatchResults]);

  // 搜索过滤逻辑
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTeachers(matchTeachers);
      return;
    }
    
    const searchLower = searchTerm.toLowerCase().trim();
    const filtered = matchTeachers.filter(teacher => 
      teacher.name.toLowerCase().includes(searchLower) ||
      teacher.title.toLowerCase().includes(searchLower) ||
      teacher.reasons.interest.toLowerCase().includes(searchLower)
    );
    
    setFilteredTeachers(filtered);
  }, [matchTeachers, searchTerm]);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleRefreshMatches = async () => {
    setIsRefreshing(true);
    try {
      // 调用真实API获取重新匹配结果
      await fetchMatchResults();
      alert('重新匹配完成！');
    } catch (error) {
      console.error('重新匹配失败:', error);
      alert('重新匹配失败，请稍后重试');
    } finally {
      setIsRefreshing(false);
    }
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

  // 获取本地存储的用户信息
  const [userName, setUserName] = useState<string>('张家长');
  const [userAvatar, setUserAvatar] = useState<string>('https://s.coze.cn/image/OUgZ3szV3ss/');

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsedInfo = JSON.parse(userInfo);
        if (parsedInfo.name) setUserName(parsedInfo.name);
        if (parsedInfo.avatar) setUserAvatar(parsedInfo.avatar);
      } catch (error) {
        console.error('解析用户信息失败:', error);
      }
    }
  }, []);

  // 直接显示分数
  const renderScore = (rating: number) => {
    return `${rating.toFixed(1)}`;
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 - 使用共享Header组件 */}
      <Header 
        userRole="parent" 
        userName={userName} 
        userAvatar={userAvatar}
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
                    {filteredTeachers.map((teacher) => (
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
                            <span className="text-sm text-text-primary font-medium">{renderScore(teacher.rating)}</span>
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

