import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './styles.module.css';
import request from '../../utils/request';

interface Evaluation {
  evaluation_id: string;
  parent_id: string;
  parent_name: string;
  teacher_id: string;
  teacher_name: string;
  course_id: string;
  course_name: string;
  eval_time: string;
  eval_type: string;
  score: number;
  content: string;
}

interface BackendEvaluationResponse {
  data: Evaluation[];
}

const AdminEvaluationManage: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentEvaluationId, setCurrentEvaluationId] = useState<string | null>(null);
  
  // 弹窗状态
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showEvaluationDrawer, setShowEvaluationDrawer] = useState(false);
  
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
  
  // 评价数据状态
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取评价数据
  useEffect(() => {
    const fetchEvaluations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('开始获取评价数据...');
        const response = await request.get<BackendEvaluationResponse>('/api/admin/evaluations');
        console.log('获取评价数据成功，响应数据:', response.data);
        if (Array.isArray(response.data)) {
          setEvaluations(response.data);
        } else {
          console.error('获取的评价数据不是数组类型:', response.data);
          setEvaluations([]);
        }
      } catch (error) {
        console.error('获取评价数据失败:', error);
        setError('获取评价数据失败，请稍后重试');
        setEvaluations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvaluations();
  }, []);

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

  // 筛选评价
  const handleFilter = () => {
    console.log('筛选条件:', { 
      status: filterStatus, 
      rating: filterRating, 
      time: filterTime, 
      userType: filterUserType, 
      keyword: searchKeyword 
    });
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
  const reviewEvaluation = (evaluationId: string) => {
    setCurrentEvaluationId(evaluationId);
    setShowReviewModal(true);
  };

  // 更新评价状态
  const handleUpdateEvaluationStatus = (status: 'approved' | 'rejected') => {
    if (currentEvaluationId) {
      console.log('更新评价状态:', currentEvaluationId, status);
      setShowReviewModal(false);
    }
  };

  // 查看评价详情
  const handleViewEvaluationDetails = (evaluationId: string) => {
    setCurrentEvaluationId(evaluationId);
    setShowEvaluationDrawer(true);
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
    return evaluations.find(e => e.evaluation_id === currentEvaluationId);
  };

  return (
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
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">评价时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">评价类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border-light">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mr-3"></div>
                      <span className="text-text-secondary">加载中...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-danger">
                    {error}
                  </td>
                </tr>
              ) : currentEvaluations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-text-secondary">
                    暂无评价数据
                  </td>
                </tr>
              ) : (
                currentEvaluations.map(evaluation => (
                  <tr key={evaluation.evaluation_id} className={styles.tableRow}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{evaluation.evaluation_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href="#" 
                        className="text-primary hover:text-primary/80 text-sm"
                        onClick={() => console.log('查看用户详情:', evaluation.parent_id)}
                      >
                        {evaluation.parent_name} ({evaluation.parent_id})
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href="#" 
                        className="text-primary hover:text-primary/80 text-sm"
                        onClick={() => console.log('查看教师详情:', evaluation.teacher_id)}
                      >
                        {evaluation.teacher_name} ({evaluation.teacher_id})
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-text-primary">{evaluation.course_name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-text-primary font-medium">{evaluation.score}分</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {new Date(evaluation.eval_time).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{evaluation.eval_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewEvaluationDetails(evaluation.evaluation_id)}
                          className="text-info hover:text-info/80"
                        >
                          查看
                        </button>
                        <button 
                          onClick={() => reviewEvaluation(evaluation.evaluation_id)}
                          className="text-primary hover:text-primary/80"
                        >
                          审核
                        </button>
                        <button 
                          onClick={() => {
                            setCurrentEvaluationId(evaluation.evaluation_id);
                            setShowReplyModal(true);
                          }}
                          className="text-success hover:text-success/80"
                        >
                          回复
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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

      {/* 审核确认弹窗 */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalBackdrop}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">审核评价</h3>
                <div className="mb-4">
                  <p className="text-sm text-text-secondary mb-2">评价基本信息：</p>
                  <p className="text-sm text-text-primary bg-gray-50 p-3 rounded-lg">
                    评价ID：{getCurrentEvaluation()?.evaluation_id}<br/>
                    评价者：{getCurrentEvaluation()?.parent_name} ({getCurrentEvaluation()?.parent_id})<br/>
                    教师：{getCurrentEvaluation()?.teacher_name} ({getCurrentEvaluation()?.teacher_id})<br/>
                    评分：{getCurrentEvaluation()?.score}分
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
                      评分筛选：
                    </label>
                    <select 
                      id="export-rating"
                      value={exportRating}
                      onChange={(e) => setExportRating(e.target.value)}
                      className="w-full px-3 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="">全部评分</option>
                      <option value="5">5星</option>
                      <option value="4">4星及以上</option>
                      <option value="3">3星及以上</option>
                      <option value="2">2星及以上</option>
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
                      <option value="">全部状态</option>
                      <option value="approved">已通过</option>
                      <option value="pending">待审核</option>
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
                          <span className="text-text-secondary">评价ID：</span>
                          <span className="text-text-primary">{getCurrentEvaluation()?.evaluation_id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">评价者：</span>
                          <span className="text-text-primary">{getCurrentEvaluation()?.parent_name} ({getCurrentEvaluation()?.parent_id})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">教师：</span>
                          <span className="text-text-primary">{getCurrentEvaluation()?.teacher_name} ({getCurrentEvaluation()?.teacher_id})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">课程：</span>
                          <span className="text-text-primary">{getCurrentEvaluation()?.course_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">评分：</span>
                          <div className="flex items-center">
                            <span className="text-text-primary">{getCurrentEvaluation()?.score}分</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">评价时间：</span>
                          <span className="text-text-primary">{new Date(getCurrentEvaluation()?.eval_time || '').toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">评价类型：</span>
                          <span className="text-text-primary">{getCurrentEvaluation()?.eval_type}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-text-primary mb-2">评价内容</h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-text-primary whitespace-pre-wrap">{getCurrentEvaluation()?.content}</p>
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