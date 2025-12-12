

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface Evaluation {
  id: string;
  evaluator: string;
  evaluatorId: string;
  teacher: string;
  teacherId: string;
  course: string;
  courseId: string;
  rating: number;
  content: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
}

const AdminEvaluationManage: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentEvaluationId, setCurrentEvaluationId] = useState<string | null>(null);
  
  // 弹窗状态
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showEvaluationDrawer, setShowEvaluationDrawer] = useState(false);
  const [showSidebarOverlay, setShowSidebarOverlay] = useState(false);
  
  // 表单状态
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRating, setFilterRating] = useState('');
  const [filterTime, setFilterTime] = useState('');
  const [filterUserType, setFilterUserType] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [exportTimeRange, setExportTimeRange] = useState('week');
  const [exportRating, setExportRating] = useState('');
  const [exportStatus, setExportStatus] = useState('');
  
  // 模拟评价数据
  const [evaluations, setEvaluations] = useState<Evaluation[]>([
    {
      id: 'E001',
      evaluator: '张家长',
      evaluatorId: 'P001',
      teacher: '李老师',
      teacherId: 'T001',
      course: '数学思维训练',
      courseId: 'C001',
      rating: 5,
      content: '老师教学非常认真，孩子很喜欢，收获很大！',
      time: '2024-01-15 14:30',
      status: 'pending'
    },
    {
      id: 'E002',
      evaluator: '王家长',
      evaluatorId: 'P002',
      teacher: '王老师',
      teacherId: 'T002',
      course: '创意绘画启蒙',
      courseId: 'C002',
      rating: 4,
      content: '课程内容很有趣，老师很有耐心，孩子很开心。',
      time: '2024-01-15 10:15',
      status: 'approved'
    },
    {
      id: 'E003',
      evaluator: '刘家长',
      evaluatorId: 'P003',
      teacher: '陈老师',
      teacherId: 'T003',
      course: 'Scratch编程入门',
      courseId: 'C003',
      rating: 2,
      content: '课程难度有点大，孩子跟不上进度，希望能调整一下。',
      time: '2024-01-14 16:45',
      status: 'pending'
    },
    {
      id: 'E004',
      evaluator: '赵家长',
      evaluatorId: 'P004',
      teacher: '李老师',
      teacherId: 'T001',
      course: '英语启蒙',
      courseId: 'C004',
      rating: 5,
      content: '老师发音标准，教学方法很好，孩子进步明显。',
      time: '2024-01-14 09:20',
      status: 'approved'
    },
    {
      id: 'E005',
      evaluator: '孙家长',
      evaluatorId: 'P005',
      teacher: '王老师',
      teacherId: 'T002',
      course: '书法入门',
      courseId: 'C005',
      rating: 3,
      content: '课程还可以，希望能增加一些互动环节。',
      time: '2024-01-13 15:30',
      status: 'rejected'
    }
  ]);

  const pageSize = 10;

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '评价管理 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  // 处理点击页面其他地方关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const userMenu = document.querySelector('#user-menu');
      if (userMenu && !userMenu.contains(target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // 侧边栏切换
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setShowSidebarOverlay(!showSidebarOverlay);
  };

  // 用户菜单切换
  const handleUserMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  // 退出登录
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/login-register');
  };

  // 生成星级评分
  const generateStarRating = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i 
        key={i}
        className={`fas fa-star text-xs ${i < rating ? 'text-warning' : 'text-gray-300'} ${styles.starRating}`}
      />
    ));
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': '待审核',
      'approved': '已通过',
      'rejected': '已驳回'
    };
    return statusMap[status] || status;
  };

  // 筛选评价
  const handleFilter = () => {
    console.log('筛选条件:', { 
      status: filterStatus, 
      rating: filterRating, 
      time: filterTime, 
      userType: filterUserType, 
      keyword: searchKeyword 
    });
    // 这里可以添加实际的筛选逻辑
  };

  // 重置筛选
  const handleReset = () => {
    setFilterStatus('');
    setFilterRating('');
    setFilterTime('');
    setFilterUserType('');
    setSearchKeyword('');
  };

  // 审核评价
  const handleReviewEvaluation = (evaluationId: string, content: string) => {
    setCurrentEvaluationId(evaluationId);
    setShowReviewModal(true);
  };

  // 更新评价状态
  const handleUpdateEvaluationStatus = (status: 'approved' | 'rejected') => {
    if (currentEvaluationId) {
      setEvaluations(prevEvaluations => 
        prevEvaluations.map(evaluation => 
          evaluation.id === currentEvaluationId 
            ? { ...evaluation, status }
            : evaluation
        )
      );
      setShowReviewModal(false);
    }
  };

  // 查看评价详情
  const handleViewEvaluationDetails = (evaluationId: string) => {
    setCurrentEvaluationId(evaluationId);
    setShowEvaluationDrawer(true);
  };

  // 回复评价
  const handleReplyToEvaluation = (evaluationId: string) => {
    setCurrentEvaluationId(evaluationId);
    setShowReplyModal(true);
  };

  // 提交回复
  const handleSubmitReply = () => {
    if (replyContent.trim() && currentEvaluationId) {
      console.log('提交回复:', { 
        evaluationId: currentEvaluationId, 
        content: replyContent 
      });
      setShowReplyModal(false);
      setReplyContent('');
    }
  };

  // 导出评价
  const handleExportEvaluations = () => {
    setShowExportModal(true);
  };

  // 确认导出
  const handleConfirmExport = () => {
    console.log('导出评价:', { 
      timeRange: exportTimeRange, 
      rating: exportRating, 
      status: exportStatus 
    });
    setShowExportModal(false);
    alert('评价数据导出成功！');
  };

  // 分页处理
  const totalCount = evaluations.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);
  const currentEvaluations = evaluations.slice(
    (currentPage - 1) * pageSize, 
    currentPage * pageSize
  );

  // 生成分页按钮
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbers = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
    const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`px-3 py-1 text-sm rounded ${
            i === currentPage 
              ? 'bg-primary text-white' 
              : 'border border-border-light hover:bg-gray-50'
          }`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  // 获取当前评价详情
  const getCurrentEvaluation = () => {
    return evaluations.find(e => e.id === currentEvaluationId);
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
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <i className="fas fa-bell text-text-secondary"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            
            {/* 用户头像 */}
            <div id="user-menu" className="relative">
              <button 
                onClick={handleUserMenuToggle}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
              >
                <img 
                  src="https://s.coze.cn/image/yqPKRMaWIuI/" 
                  alt="管理员头像" 
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden md:block text-sm text-text-primary">管理员</span>
                <i className="fas fa-chevron-down text-xs text-text-secondary"></i>
              </button>
              {/* 下拉菜单 */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                  <a 
                    href="#" 
                    className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100"
                  >
                    个人资料
                  </a>
                  <a 
                    href="#" 
                    className="block px-4 py-2 text-sm text-text-primary hover:bg-gray-100"
                  >
                    账户设置
                  </a>
                  <div className="border-t border-gray-100 my-1"></div>
                  <a 
                    href="#" 
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-danger hover:bg-gray-100"
                  >
                    退出登录
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 左侧菜单 */}
      <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-border-light z-40 transform lg:transform-none transition-width 0.3s ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <nav className="p-4 space-y-2">
          <Link 
            to="/admin-dashboard" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-tachometer-alt w-5"></i>
            <span>后台首页</span>
          </Link>
          <Link 
            to="/admin-user-manage" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-users w-5"></i>
            <span>用户管理</span>
          </Link>
          <Link 
            to="/admin-community-manage" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-building w-5"></i>
            <span>社区管理</span>
          </Link>
          <Link 
            to="/admin-course-manage" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-book-open w-5"></i>
            <span>课程管理</span>
          </Link>
          <a 
            href="#" 
            className={`${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}
          >
            <i className="fas fa-star w-5"></i>
            <span>评价管理</span>
          </a>
          <Link 
            to="/admin-refund-manage" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-undo w-5"></i>
            <span>退款管理</span>
          </Link>
          <Link 
            to="/admin-system-config" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-cog w-5"></i>
            <span>系统配置</span>
          </Link>
          <Link 
            to="/admin-report" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-chart-bar w-5"></i>
            <span>数据报表</span>
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
                <h2 className="text-2xl font-bold text-text-primary mb-2">评价管理</h2>
                <nav className="text-sm text-text-secondary">
                  <Link to="/admin-dashboard" className="hover:text-primary">后台首页</Link>
                  <span className="mx-2">/</span>
                  <span className="text-text-primary">评价管理</span>
                </nav>
              </div>
              <button 
                onClick={handleExportEvaluations}
                className="px-4 py-2 bg-success text-white text-sm font-medium rounded-lg hover:bg-success/90"
              >
                <i className="fas fa-download mr-2"></i>导出评价
              </button>
            </div>
          </div>

          {/* 工具栏区域 */}
          <div className="bg-white rounded-xl shadow-card p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* 搜索框 */}
              <div className="flex-1 lg:max-w-md">
                <div className="relative">
                  <input 
                    type="text" 
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="搜索评价内容关键词..." 
                    className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm"></i>
                </div>
              </div>
              
              {/* 筛选条件 */}
              <div className="flex flex-wrap items-center gap-4">
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">全部状态</option>
                  <option value="pending">待审核</option>
                  <option value="approved">已通过</option>
                  <option value="rejected">已驳回</option>
                </select>
                
                <select 
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="px-3 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">全部评分</option>
                  <option value="5">5星</option>
                  <option value="4">4星</option>
                  <option value="3">3星</option>
                  <option value="2">2星</option>
                  <option value="1">1星</option>
                </select>
                
                <select 
                  value={filterTime}
                  onChange={(e) => setFilterTime(e.target.value)}
                  className="px-3 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">全部时间</option>
                  <option value="today">今天</option>
                  <option value="week">本周</option>
                  <option value="month">本月</option>
                  <option value="quarter">本季度</option>
                </select>
                
                <select 
                  value={filterUserType}
                  onChange={(e) => setFilterUserType(e.target.value)}
                  className="px-3 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">全部评价者</option>
                  <option value="parent">家长</option>
                </select>
                
                <button 
                  onClick={handleFilter}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                >
                  <i className="fas fa-filter mr-2"></i>筛选
                </button>
                
                <button 
                  onClick={handleReset}
                  className="px-4 py-2 border border-border-light text-text-secondary text-sm font-medium rounded-lg hover:bg-gray-50"
                >
                  重置
                </button>
              </div>
            </div>
          </div>

          {/* 评价列表 */}
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-border-light">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">评价ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">评价者</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">教师</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">课程</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">评分</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">评价内容</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">评价时间</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">状态</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border-light">
                  {currentEvaluations.map(evaluation => (
                    <tr key={evaluation.id} className={styles.tableRow}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{evaluation.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a 
                          href="#" 
                          className="text-primary hover:text-primary/80 text-sm"
                          onClick={() => console.log('查看用户详情:', evaluation.evaluatorId)}
                        >
                          {evaluation.evaluator}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a 
                          href="#" 
                          className="text-primary hover:text-primary/80 text-sm"
                          onClick={() => console.log('查看教师详情:', evaluation.teacherId)}
                        >
                          {evaluation.teacher}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a 
                          href="#" 
                          className="text-primary hover:text-primary/80 text-sm"
                          onClick={() => console.log('查看课程详情:', evaluation.courseId)}
                        >
                          {evaluation.course}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {generateStarRating(evaluation.rating)}
                          <span className="ml-1 text-sm text-text-secondary">{evaluation.rating}星</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-text-primary line-clamp-2 max-w-xs">{evaluation.content}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{evaluation.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[`status${evaluation.status.charAt(0).toUpperCase() + evaluation.status.slice(1)}`]}`}>
                          {getStatusText(evaluation.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {evaluation.status === 'pending' && (
                          <button 
                            onClick={() => handleReviewEvaluation(evaluation.id, evaluation.content)}
                            className="text-primary hover:text-primary/80"
                          >
                            审核
                          </button>
                        )}
                        <button 
                          onClick={() => handleViewEvaluationDetails(evaluation.id)}
                          className="text-info hover:text-info/80"
                        >
                          查看详情
                        </button>
                        <button 
                          onClick={() => handleReplyToEvaluation(evaluation.id)}
                          className="text-warning hover:text-warning/80"
                        >
                          回复
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* 分页区域 */}
            <div className="px-6 py-4 border-t border-border-light flex items-center justify-between">
              <div className="text-sm text-text-secondary">
                显示第 <span>{startIndex}</span> 到 <span>{endIndex}</span> 条，共 <span>{totalCount}</span> 条记录
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-border-light rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <div className="flex space-x-1">
                  {renderPageNumbers()}
                </div>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-border-light rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 侧边栏遮罩 */}
      {showSidebarOverlay && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={handleSidebarToggle}
        />
      )}

      {/* 审核确认弹窗 */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalBackdrop}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">审核评价</h3>
                <div className="mb-4">
                  <p className="text-sm text-text-secondary mb-2">评价内容：</p>
                  <p className="text-sm text-text-primary bg-gray-50 p-3 rounded-lg">
                    {getCurrentEvaluation()?.content}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleUpdateEvaluationStatus('approved')}
                    className="flex-1 px-4 py-2 bg-success text-white text-sm font-medium rounded-lg hover:bg-success/90"
                  >
                    审核通过
                  </button>
                  <button 
                    onClick={() => handleUpdateEvaluationStatus('rejected')}
                    className="flex-1 px-4 py-2 bg-danger text-white text-sm font-medium rounded-lg hover:bg-danger/90"
                  >
                    驳回
                  </button>
                  <button 
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 border border-border-light text-text-secondary text-sm font-medium rounded-lg hover:bg-gray-50"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 回复弹窗 */}
      {showReplyModal && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalBackdrop}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">回复评价</h3>
                <div className="mb-4">
                  <label htmlFor="reply-content" className="block text-sm font-medium text-text-primary mb-2">
                    回复内容：
                  </label>
                  <textarea 
                    id="reply-content"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={4} 
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:border-primary"
                    placeholder="请输入回复内容..."
                  />
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={handleSubmitReply}
                    className="flex-1 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                  >
                    提交回复
                  </button>
                  <button 
                    onClick={() => {
                      setShowReplyModal(false);
                      setReplyContent('');
                    }}
                    className="px-4 py-2 border border-border-light text-text-secondary text-sm font-medium rounded-lg hover:bg-gray-50"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 导出筛选弹窗 */}
      {showExportModal && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalBackdrop}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">导出评价</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="export-time-range" className="block text-sm font-medium text-text-primary mb-2">
                      时间范围：
                    </label>
                    <select 
                      id="export-time-range"
                      value={exportTimeRange}
                      onChange={(e) => setExportTimeRange(e.target.value)}
                      className="w-full px-3 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="week">本周</option>
                      <option value="month">本月</option>
                      <option value="quarter">本季度</option>
                      <option value="custom">自定义</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="export-rating" className="block text-sm font-medium text-text-primary mb-2">
                      评价等级：
                    </label>
                    <select 
                      id="export-rating"
                      value={exportRating}
                      onChange={(e) => setExportRating(e.target.value)}
                      className="w-full px-3 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="">全部</option>
                      <option value="5">5星</option>
                      <option value="4">4星</option>
                      <option value="3">3星</option>
                      <option value="2">2星</option>
                      <option value="1">1星</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="export-status" className="block text-sm font-medium text-text-primary mb-2">
                      评价状态：
                    </label>
                    <select 
                      id="export-status"
                      value={exportStatus}
                      onChange={(e) => setExportStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="">全部</option>
                      <option value="pending">待审核</option>
                      <option value="approved">已通过</option>
                      <option value="rejected">已驳回</option>
                    </select>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <button 
                    onClick={handleConfirmExport}
                    className="flex-1 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                  >
                    确认导出
                  </button>
                  <button 
                    onClick={() => setShowExportModal(false)}
                    className="px-4 py-2 border border-border-light text-text-secondary text-sm font-medium rounded-lg hover:bg-gray-50"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 评价详情抽屉 */}
      {showEvaluationDrawer && (
        <div className="fixed inset-y-0 right-0 z-50">
          <div className={styles.drawerOverlay} onClick={() => setShowEvaluationDrawer(false)}></div>
          <div className="relative flex h-full max-w-md w-full">
            <div className={`${styles.drawerEnter} ${styles.drawerEnterActive} flex-1 flex flex-col bg-white shadow-xl`}>
              <div className="px-6 py-4 border-b border-border-light">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-primary">评价详情</h3>
                  <button 
                    onClick={() => setShowEvaluationDrawer(false)}
                    className="p-1 rounded-lg hover:bg-gray-100"
                  >
                    <i className="fas fa-times text-text-secondary"></i>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {getCurrentEvaluation() && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-text-primary mb-2">评价基本信息</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-text-secondary">评价者：</span>
                          <span className="text-text-primary">{getCurrentEvaluation()?.evaluator}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">教师：</span>
                          <span className="text-text-primary">{getCurrentEvaluation()?.teacher}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">课程：</span>
                          <span className="text-text-primary">{getCurrentEvaluation()?.course}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">评分：</span>
                          <div className="flex items-center">
                            {generateStarRating(getCurrentEvaluation()?.rating || 0)}
                            <span className="ml-1">{getCurrentEvaluation()?.rating}星</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">评价时间：</span>
                          <span className="text-text-primary">{getCurrentEvaluation()?.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">状态：</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            getCurrentEvaluation() 
                              ? styles[`status${getCurrentEvaluation()!.status.charAt(0).toUpperCase() + getCurrentEvaluation()!.status.slice(1)}`] 
                              : ''
                          }`}>
                            {getStatusText(getCurrentEvaluation()?.status || '')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-text-primary mb-2">评价内容</h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-text-primary">{getCurrentEvaluation()?.content}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-text-primary mb-2">回复记录</h4>
                      <div className="space-y-3">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-medium text-text-primary">管理员回复</span>
                            <span className="text-xs text-text-secondary">2024-01-15 16:00</span>
                          </div>
                          <p className="text-sm text-text-secondary">感谢您的评价，我们会持续改进教学质量。</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvaluationManage;

