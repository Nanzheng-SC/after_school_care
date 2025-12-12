

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

interface EvaluationData {
  id: number;
  evaluator: string;
  course: string;
  rating: number;
  content: string;
  time: string;
  replied: boolean;
  reply: string;
}

const TeacherEvalStatsPage: React.FC = () => {
  // 模拟评价数据
  const [evaluationsData] = useState<EvaluationData[]>([
    {
      id: 1,
      evaluator: '张家长',
      course: '数学思维训练',
      rating: 5,
      content: '李老师教学非常认真负责，孩子很喜欢上他的课，数学成绩有明显提升。',
      time: '2024-01-15 16:30',
      replied: true,
      reply: '感谢您的认可，我会继续努力为孩子们提供优质的教学服务。'
    },
    {
      id: 2,
      evaluator: '王家长',
      course: '创意绘画启蒙',
      rating: 4,
      content: '老师很有耐心，课堂氛围很好，孩子每次都很期待上课。',
      time: '2024-01-14 15:45',
      replied: true,
      reply: '谢谢家长的肯定，看到孩子们开心地学习是我最大的动力。'
    },
    {
      id: 3,
      evaluator: '刘家长',
      course: 'Scratch编程入门',
      rating: 5,
      content: '老师专业知识很扎实，教学方法新颖，孩子对编程产生了浓厚兴趣。',
      time: '2024-01-13 19:20',
      replied: false,
      reply: ''
    },
    {
      id: 4,
      evaluator: '陈家长',
      course: '数学思维训练',
      rating: 5,
      content: '课程内容很丰富，老师很会引导孩子思考，强烈推荐！',
      time: '2024-01-12 14:15',
      replied: true,
      reply: '感谢您的推荐，我会继续保持教学质量。'
    },
    {
      id: 5,
      evaluator: '杨家长',
      course: '创意绘画启蒙',
      rating: 3,
      content: '整体还不错，希望能增加一些互动环节。',
      time: '2024-01-11 16:00',
      replied: true,
      reply: '感谢您的建议，我会在后续课程中增加更多互动环节。'
    },
    {
      id: 6,
      evaluator: '黄家长',
      course: 'Scratch编程入门',
      rating: 5,
      content: '老师很有耐心，对孩子的问题都能及时解答。',
      time: '2024-01-10 18:30',
      replied: false,
      reply: ''
    },
    {
      id: 7,
      evaluator: '周家长',
      course: '数学思维训练',
      rating: 4,
      content: '课程质量很高，孩子收获很大。',
      time: '2024-01-09 15:20',
      replied: true,
      reply: '谢谢家长的认可，我会继续努力。'
    },
    {
      id: 8,
      evaluator: '吴家长',
      course: '创意绘画启蒙',
      rating: 5,
      content: '老师很有爱心，孩子特别喜欢她的课。',
      time: '2024-01-08 14:45',
      replied: true,
      reply: '能得到孩子的喜欢是我最开心的事情。'
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState<EvaluationData[]>(evaluationsData);
  const [ratingFilter, setRatingFilter] = useState('');
  const [replyFilter, setReplyFilter] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [currentEvaluationId, setCurrentEvaluationId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const pageSize = 10;

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '评价统计 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  // 应用筛选
  const applyFilters = () => {
    let filtered = evaluationsData.filter(evalItem => {
      const matchesRating = !ratingFilter || evalItem.rating === Number(ratingFilter);
      const matchesReply = !replyFilter || 
        (replyFilter === 'replied' && evalItem.replied) || 
        (replyFilter === 'pending' && !evalItem.replied);
      
      return matchesRating && matchesReply;
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  // 监听筛选条件变化
  useEffect(() => {
    applyFilters();
  }, [ratingFilter, replyFilter]);

  // 生成星级
  const generateStars = (rating: number) => {
    return Array.from({length: 5}, (_, i) => (
      <i key={i} className={i < rating ? 'fas fa-star' : 'far fa-star'}></i>
    ));
  };

  // 计算分页
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(currentPage * pageSize, filteredData.length);
  const currentPageData = filteredData.slice(startIndex, endIndex);

  // 处理分页点击
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // 打开回复弹窗
  const openReplyModal = (evaluationId: number) => {
    setCurrentEvaluationId(evaluationId);
    const evaluation = evaluationsData.find(e => e.id === evaluationId);
    if (evaluation) {
      setReplyContent(evaluation.reply);
    }
    setIsReplyModalOpen(true);
  };

  // 关闭回复弹窗
  const closeReplyModal = () => {
    setIsReplyModalOpen(false);
    setReplyContent('');
    setCurrentEvaluationId(null);
  };

  // 提交回复
  const submitReply = () => {
    if (currentEvaluationId && replyContent.trim()) {
      // 在实际应用中，这里会调用API提交回复
      alert('回复提交成功！');
      closeReplyModal();
    } else {
      alert('请输入回复内容');
    }
  };

  // 切换侧边栏
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border-light h-16 z-50">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo区域 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleSidebar}
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
                  src="https://s.coze.cn/image/1AbBPpun0js/" 
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
            className={`${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}
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
                <h2 className="text-2xl font-bold text-text-primary mb-2">评价统计</h2>
                <nav className="text-sm text-text-secondary">
                  <Link to="/home" className="hover:text-primary">首页</Link>
                  <span className="mx-2">/</span>
                  <Link to="/teacher-center" className="hover:text-primary">教师中心</Link>
                  <span className="mx-2">/</span>
                  <span className="text-text-primary">评价统计</span>
                </nav>
              </div>
            </div>
          </div>

          {/* 统计概览区 */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-xl p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">平均评分</p>
                    <p className="text-3xl font-bold text-text-primary">4.8</p>
                    <div className="flex items-center mt-2">
                      <div className="flex text-warning text-sm">
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                      </div>
                      <span className="text-xs text-text-secondary ml-2">(4.8/5.0)</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-star text-primary text-xl"></i>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">总评价数</p>
                    <p className="text-3xl font-bold text-text-primary">156</p>
                    <p className="text-xs text-success mt-1">
                      <i className="fas fa-arrow-up mr-1"></i>+12 本月
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-comments text-success text-xl"></i>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">回复率</p>
                    <p className="text-3xl font-bold text-text-primary">92%</p>
                    <p className="text-xs text-text-secondary mt-1">
                      <i className="fas fa-check mr-1"></i>及时回复
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-reply text-info text-xl"></i>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">五星好评率</p>
                    <p className="text-3xl font-bold text-text-primary">85%</p>
                    <p className="text-xs text-warning mt-1">
                      <i className="fas fa-trophy mr-1"></i>表现优秀
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-trophy text-warning text-xl"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* 星级分布 */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">星级评价分布</h3>
              <div className="space-y-4">
                {[
                  { stars: 5, count: 133, percentage: 85 },
                  { stars: 4, count: 19, percentage: 12 },
                  { stars: 3, count: 3, percentage: 2 },
                  { stars: 2, count: 1, percentage: 1 },
                  { stars: 1, count: 0, percentage: 0 }
                ].map(({ stars, count, percentage }) => (
                  <div key={stars} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex text-warning text-sm">
                        {generateStars(stars)}
                      </div>
                      <span className="text-sm text-text-primary">{stars}星</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${percentage > 0 && stars >= 4 ? styles.progressBar : 'bg-danger'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-text-primary">{count} ({percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 评价列表区 */}
          <section className="mb-8">
            <div className="bg-white rounded-xl shadow-card">
              <div className="p-6 border-b border-border-light">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-primary">详细评价</h3>
                  <div className="flex items-center space-x-3">
                    <select 
                      value={ratingFilter}
                      onChange={(e) => setRatingFilter(e.target.value)}
                      className="px-3 py-2 border border-border-light rounded-lg text-sm"
                    >
                      <option value="">全部评分</option>
                      <option value="5">五星</option>
                      <option value="4">四星</option>
                      <option value="3">三星</option>
                      <option value="2">二星</option>
                      <option value="1">一星</option>
                    </select>
                    <select 
                      value={replyFilter}
                      onChange={(e) => setReplyFilter(e.target.value)}
                      className="px-3 py-2 border border-border-light rounded-lg text-sm"
                    >
                      <option value="">回复状态</option>
                      <option value="replied">已回复</option>
                      <option value="pending">待回复</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">评价者</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">评价时间</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">评分</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">评价内容</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">回复状态</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentPageData.map(evalItem => (
                      <tr key={evalItem.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-text-primary">{evalItem.evaluator}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {evalItem.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex text-warning text-sm">
                              {generateStars(evalItem.rating)}
                            </div>
                            <span className="ml-2 text-sm text-text-secondary">{evalItem.rating}星</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-text-primary max-w-xs truncate" title={evalItem.content}>
                            {evalItem.content}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${evalItem.replied ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                            {evalItem.replied ? '已回复' : '待回复'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => openReplyModal(evalItem.id)}
                            disabled={evalItem.replied}
                            className={`text-primary hover:text-primary/80 ${evalItem.replied ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {evalItem.replied ? '已回复' : '回复'}
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
                    显示第 <span>{filteredData.length > 0 ? startIndex + 1 : 0}</span> - <span>{endIndex}</span> 条，共 <span>{filteredData.length}</span> 条记录
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handlePageClick(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="px-3 py-1 border border-border-light rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                      <i className="fas fa-chevron-left mr-1"></i>上一页
                    </button>
                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                        if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageClick(pageNum)}
                              className={`px-3 py-1 border rounded text-sm ${
                                pageNum === currentPage 
                                  ? 'bg-primary text-white border-primary' 
                                  : 'border-border-light hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                          return <span key={`ellipsis-${pageNum}`} className="px-2 text-text-secondary">...</span>;
                        }
                        return null;
                      })}
                    </div>
                    <button 
                      onClick={() => handlePageClick(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="px-3 py-1 border border-border-light rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                      下一页<i className="fas fa-chevron-right ml-1"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 回复评价弹窗 */}
      {isReplyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-border-light">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-primary">回复评价</h3>
                  <button onClick={closeReplyModal} className="text-text-secondary hover:text-text-primary">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-text-primary">评价内容：</span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    {currentEvaluationId ? evaluationsData.find(e => e.id === currentEvaluationId)?.content : ''}
                  </p>
                </div>
                <div className="mb-4">
                  <label htmlFor="reply-content" className="block text-sm font-medium text-text-primary mb-2">您的回复：</label>
                  <textarea 
                    id="reply-content"
                    rows={4}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full px-3 py-2 border border-border-light rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="请输入您的回复内容..."
                  />
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={closeReplyModal}
                    className="flex-1 px-4 py-2 border border-border-light rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button 
                    onClick={submitReply}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90"
                  >
                    提交回复
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 侧边栏遮罩 */}
      {isSidebarOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        ></div>
      )}
    </div>
  );
};

export default TeacherEvalStatsPage;

