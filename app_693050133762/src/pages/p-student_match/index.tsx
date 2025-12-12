

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface Student {
  id: string;
  name: string;
  age: number;
  description: string;
  parentName: string;
  avatar: string;
  matchPercentage: number;
  matchReasons: string[];
  matchSummary: string;
}

const StudentMatchPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedReasons, setExpandedReasons] = useState<Record<string, boolean>>({});
  const [globalSearchValue, setGlobalSearchValue] = useState('');

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '学生匹配 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  // 模拟学生数据
  const students: Student[] = [
    {
      id: 'student1',
      name: '小明',
      age: 7,
      description: '数学思维活跃',
      parentName: '张女士',
      avatar: 'https://s.coze.cn/image/VNdsDLHxWls/',
      matchPercentage: 92,
      matchSummary: '兴趣匹配度高，学习风格契合',
      matchReasons: [
        '• 数学兴趣匹配度：95%',
        '• 逻辑思维学习风格：90%',
        '• 年龄适配度：88%'
      ]
    },
    {
      id: 'student2',
      name: '小红',
      age: 8,
      description: '学习认真',
      parentName: '李女士',
      avatar: 'https://s.coze.cn/image/iZdQUdIv3o4/',
      matchPercentage: 85,
      matchSummary: '学习风格匹配度高',
      matchReasons: [
        '• 数学兴趣匹配度：82%',
        '• 逻辑思维学习风格：90%',
        '• 年龄适配度：83%'
      ]
    },
    {
      id: 'student3',
      name: '小华',
      age: 7,
      description: '好奇心强',
      parentName: '王先生',
      avatar: 'https://s.coze.cn/image/Q_eskmct0vQ/',
      matchPercentage: 78,
      matchSummary: '综合匹配度良好',
      matchReasons: [
        '• 数学兴趣匹配度：75%',
        '• 逻辑思维学习风格：80%',
        '• 年龄适配度：82%'
      ]
    },
    {
      id: 'student4',
      name: '小芳',
      age: 9,
      description: '基础扎实',
      parentName: '陈女士',
      avatar: 'https://s.coze.cn/image/1kpq4nf-h8U/',
      matchPercentage: 72,
      matchSummary: '基础匹配度',
      matchReasons: [
        '• 数学兴趣匹配度：68%',
        '• 逻辑思维学习风格：75%',
        '• 年龄适配度：78%'
      ]
    },
    {
      id: 'student5',
      name: '小强',
      age: 8,
      description: '活泼好动',
      parentName: '刘先生',
      avatar: 'https://s.coze.cn/image/AJxPvJk-aaw/',
      matchPercentage: 65,
      matchSummary: '基础匹配度',
      matchReasons: [
        '• 数学兴趣匹配度：60%',
        '• 逻辑思维学习风格：70%',
        '• 年龄适配度：68%'
      ]
    }
  ];

  const topStudent = students[0];

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleToggleMatchReason = (studentId: string) => {
    setExpandedReasons(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleViewStudentDetail = (studentId: string) => {
    navigate(`/teen-info-manage?studentId=${studentId}`);
  };

  const handleGlobalSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const searchTerm = globalSearchValue.trim();
      if (searchTerm) {
        console.log('搜索:', searchTerm);
        // 这里可以实现搜索功能
      }
    }
  };

  const getProgressWidth = (percentage: number) => {
    return `${percentage}%`;
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
                placeholder="搜索学生、家长..." 
                value={globalSearchValue}
                onChange={(e) => setGlobalSearchValue(e.target.value)}
                onKeyPress={handleGlobalSearchKeyPress}
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
                  src="https://s.coze.cn/image/0-nn2y2rOGA/" 
                  alt="教师头像" 
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
            className={`${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}
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
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">学生匹配</h2>
                <nav className="text-sm text-text-secondary">
                  <span>首页</span>
                  <i className="fas fa-chevron-right mx-2"></i>
                  <span className="text-primary">学生匹配</span>
                </nav>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-secondary">匹配总数</p>
                <p className="text-2xl font-bold text-text-primary">8</p>
              </div>
            </div>
          </div>

          {/* 匹配概览区 */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">最佳匹配推荐</h3>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <img 
                    src="https://s.coze.cn/image/FwnfVoefSIE/" 
                    alt="小明头像" 
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold text-text-primary">小明</h4>
                    <p className="text-sm text-text-secondary">7岁，数学思维活跃</p>
                    <p className="text-sm text-text-secondary">家长：张女士</p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary">匹配度</span>
                    <span className="text-lg font-bold text-primary">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={styles.matchProgress} style={{ width: '92%' }}></div>
                  </div>
                </div>
                <button 
                  onClick={() => handleViewStudentDetail('student1')}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                >
                  查看详情
                </button>
              </div>
            </div>
          </section>

          {/* 匹配列表区 */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="p-6 border-b border-border-light">
                <h3 className="text-lg font-semibold text-text-primary">匹配学生列表</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">学生姓名</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">匹配度</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">匹配依据</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">家长姓名</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-border-light">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={student.avatar}
                              alt={`${student.name}头像`}
                              className="w-10 h-10 rounded-full cursor-pointer"
                              onClick={() => handleViewStudentDetail(student.id)}
                            />
                            <span 
                              className="font-medium text-text-primary cursor-pointer hover:text-primary"
                              onClick={() => handleViewStudentDetail(student.id)}
                            >
                              {student.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className={styles.matchProgress} 
                                style={{ width: getProgressWidth(student.matchPercentage) }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-primary">{student.matchPercentage}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-text-secondary">{student.matchSummary}</span>
                            <button 
                              className="text-primary hover:text-primary/80 text-sm"
                              onClick={() => handleToggleMatchReason(student.id)}
                            >
                              <i className={`fas ${expandedReasons[student.id] ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                            </button>
                          </div>
                          <div className={`${styles.expandContent} ${expandedReasons[student.id] ? styles.expanded : ''} mt-2 ml-4`}>
                            <div className="text-sm text-text-secondary space-y-1">
                              {student.matchReasons.map((reason, index) => (
                                <div key={index}>{reason}</div>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{student.parentName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            className="text-primary hover:text-primary/80"
                            onClick={() => handleViewStudentDetail(student.id)}
                          >
                            查看详情
                          </button>
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
                    显示第 1-5 条，共 8 条记录
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-sm border border-border-light rounded hover:bg-gray-50 disabled:opacity-50" disabled>
                      上一页
                    </button>
                    <button className="px-3 py-1 text-sm bg-primary text-white rounded">1</button>
                    <button className="px-3 py-1 text-sm border border-border-light rounded hover:bg-gray-50">2</button>
                    <button className="px-3 py-1 text-sm border border-border-light rounded hover:bg-gray-50">
                      下一页
                    </button>
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

export default StudentMatchPage;

