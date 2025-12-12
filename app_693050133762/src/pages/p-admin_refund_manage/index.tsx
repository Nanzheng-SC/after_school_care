

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface RefundData {
  id: string;
  orderId: string;
  courseName: string;
  applicant: string;
  applyTime: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  courseId: string;
  applicantId: string;
  courseTime: string;
  teacherName: string;
  location: string;
  reviewComment?: string;
  reviewTime?: string;
}

const AdminRefundManage: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [currentRefundId, setCurrentRefundId] = useState<string | null>(null);
  const [reviewResult, setReviewResult] = useState('approved');
  const [reviewComment, setReviewComment] = useState('');
  const [selectedRefund, setSelectedRefund] = useState<RefundData | null>(null);

  // 模拟数据
  const [mockRefundData, setMockRefundData] = useState<RefundData[]>([
    {
      id: 'REF001',
      orderId: 'ORD20240115001',
      courseName: '数学思维训练',
      applicant: '张家长',
      applyTime: '2024-01-15 14:30:25',
      amount: 80.00,
      reason: '时间冲突，无法参加课程',
      status: 'pending',
      courseId: 'COURSE001',
      applicantId: 'PARENT001',
      courseTime: '2024-01-20 14:00-16:00',
      teacherName: '李老师',
      location: '阳光社区'
    },
    {
      id: 'REF002',
      orderId: 'ORD20240115002',
      courseName: '创意绘画启蒙',
      applicant: '王家长',
      applyTime: '2024-01-15 10:15:30',
      amount: 60.00,
      reason: '课程内容不适合孩子',
      status: 'approved',
      courseId: 'COURSE002',
      applicantId: 'PARENT002',
      courseTime: '2024-01-18 10:00-11:30',
      teacherName: '王老师',
      location: '绿洲社区'
    },
    {
      id: 'REF003',
      orderId: 'ORD20240114001',
      courseName: 'Scratch编程入门',
      applicant: '刘家长',
      applyTime: '2024-01-14 16:45:12',
      amount: 100.00,
      reason: '孩子兴趣转移',
      status: 'rejected',
      courseId: 'COURSE003',
      applicantId: 'PARENT003',
      courseTime: '2024-01-22 18:30-20:00',
      teacherName: '陈老师',
      location: '智慧社区'
    },
    {
      id: 'REF004',
      orderId: 'ORD20240114002',
      courseName: '英语口语训练',
      applicant: '赵家长',
      applyTime: '2024-01-14 09:20:45',
      amount: 90.00,
      reason: '家庭原因需要调整',
      status: 'pending',
      courseId: 'COURSE004',
      applicantId: 'PARENT004',
      courseTime: '2024-01-19 15:00-16:30',
      teacherName: '张老师',
      location: '和谐社区'
    },
    {
      id: 'REF005',
      orderId: 'ORD20240113001',
      courseName: '书法基础班',
      applicant: '孙家长',
      applyTime: '2024-01-13 11:30:20',
      amount: 70.00,
      reason: '课程时间不合适',
      status: 'approved',
      courseId: 'COURSE005',
      applicantId: 'PARENT005',
      courseTime: '2024-01-21 16:00-17:30',
      teacherName: '刘老师',
      location: '文化社区'
    }
  ]);

  const [filteredData, setFilteredData] = useState<RefundData[]>([...mockRefundData]);
  const pageSize = 10;

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '退款管理 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  // 筛选退款申请
  const filterRefunds = () => {
    const filtered = mockRefundData.filter(refund => {
      // 搜索筛选
      const matchesSearch = !searchInput || 
        refund.orderId.toLowerCase().includes(searchInput.toLowerCase()) ||
        refund.applicant.toLowerCase().includes(searchInput.toLowerCase());

      // 状态筛选
      const matchesStatus = !statusFilter || refund.status === statusFilter;

      // 时间筛选
      const matchesTime = !timeFilter || checkTimeFilter(refund.applyTime, timeFilter);

      return matchesSearch && matchesStatus && matchesTime;
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  // 时间筛选检查
  const checkTimeFilter = (timeString: string, filter: string): boolean => {
    const applyTime = new Date(timeString);
    const now = new Date();

    switch (filter) {
      case 'today':
        return applyTime.toDateString() === now.toDateString();
      case 'week':
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return applyTime >= oneWeekAgo;
      case 'month':
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return applyTime >= oneMonthAgo;
      default:
        return true;
    }
  };

  // 重置筛选
  const resetFilters = () => {
    setSearchInput('');
    setStatusFilter('');
    setTimeFilter('');
    setFilteredData([...mockRefundData]);
    setCurrentPage(1);
  };

  // 获取状态文本
  const getStatusText = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'pending': '待审核',
      'approved': '已通过',
      'rejected': '已驳回'
    };
    return statusMap[status] || status;
  };

  // 侧边栏切换
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 打开审核弹窗
  const openReviewModal = (refundId: string) => {
    setCurrentRefundId(refundId);
    setReviewResult('approved');
    setReviewComment('');
    setIsReviewModalOpen(true);
  };

  // 关闭审核弹窗
  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setCurrentRefundId(null);
  };

  // 确认审核
  const confirmReview = () => {
    if (!currentRefundId) return;

    // 更新本地数据
    setMockRefundData(prevData => 
      prevData.map(refund => {
        if (refund.id === currentRefundId) {
          return {
            ...refund,
            status: reviewResult as 'approved' | 'rejected',
            reviewComment,
            reviewTime: new Date().toLocaleString()
          };
        }
        return refund;
      })
    );

    // 重新筛选
    filterRefunds();
    closeReviewModal();

    // 显示成功提示
    alert('审核完成！');
  };

  // 打开详情抽屉
  const openDetailDrawer = (refundId: string) => {
    const refund = mockRefundData.find(r => r.id === refundId);
    if (!refund) return;

    setSelectedRefund(refund);
    setIsDetailDrawerOpen(true);
  };

  // 关闭详情抽屉
  const closeDetailDrawer = () => {
    setIsDetailDrawerOpen(false);
    setSelectedRefund(null);
  };

  // 分页处理
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, filteredData.length);
  const currentPageData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 生成页码
  const generatePageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(
          <button
            key={i}
            className={`px-3 py-1 border rounded text-sm ${
              i === currentPage 
                ? 'bg-primary text-white border-primary' 
                : 'border-border-light hover:bg-gray-50'
            }`}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push(
          <span key={`ellipsis-${i}`} className="px-2 text-sm text-text-secondary">
            ...
          </span>
        );
      }
    }
    return pages;
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
                  src="https://s.coze.cn/image/QkJXf6Gb6xQ/" 
                  alt="管理员头像" 
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden md:block text-sm text-text-primary">管理员</span>
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
            to="/admin-dashboard" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-tachometer-alt w-5"></i>
            <span>数据概览</span>
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
          <Link 
            to="/admin-evaluation-manage" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-star w-5"></i>
            <span>评价管理</span>
          </Link>
          <Link 
            to="/admin-refund-manage" 
            className={`${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}
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
                <h2 className="text-2xl font-bold text-text-primary mb-2">退款管理</h2>
                <nav className="text-sm text-text-secondary">
                  <span>首页</span>
                  <i className="fas fa-chevron-right mx-2"></i>
                  <span>退款管理</span>
                </nav>
              </div>
            </div>
          </div>

          {/* 工具栏区域 */}
          <div className="bg-white rounded-xl shadow-card p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* 搜索框 */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <input 
                    type="text" 
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="搜索订单号或家长姓名..." 
                    className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm"></i>
                </div>
                
                {/* 筛选条件 */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`px-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                  >
                    <option value="">全部状态</option>
                    <option value="pending">待审核</option>
                    <option value="approved">已通过</option>
                    <option value="rejected">已驳回</option>
                  </select>
                  
                  <select 
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className={`px-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                  >
                    <option value="">全部时间</option>
                    <option value="today">今天</option>
                    <option value="week">最近一周</option>
                    <option value="month">最近一月</option>
                  </select>
                  
                  <button 
                    onClick={filterRefunds}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
                  >
                    <i className="fas fa-filter mr-2"></i>筛选
                  </button>
                  
                  <button 
                    onClick={resetFilters}
                    className="px-6 py-2 border border-border-light text-text-secondary rounded-lg hover:bg-gray-50 font-medium"
                  >
                    重置
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 退款申请列表 */}
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-border-light">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">退款ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">订单号</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">课程名称</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">申请人</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">申请时间</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">退款金额</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">退款原因</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">状态</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border-light">
                  {currentPageData.map(refund => (
                    <tr key={refund.id} className={styles.tableRowHover}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{refund.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{refund.orderId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link 
                          to={`/course-detail?courseId=${refund.courseId}`}
                          className="text-sm text-primary hover:text-primary/80 font-medium"
                        >
                          {refund.courseName}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => alert(`查看家长详情: ${refund.applicantId}`)}
                          className="text-sm text-primary hover:text-primary/80 font-medium"
                        >
                          {refund.applicant}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{refund.applyTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">¥{refund.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-text-secondary max-w-xs truncate" title={refund.reason}>{refund.reason}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[`status${refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}`]}`}>
                          {getStatusText(refund.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {refund.status === 'pending' && (
                          <button 
                            onClick={() => openReviewModal(refund.id)}
                            className="text-primary hover:text-primary/80"
                          >
                            审核
                          </button>
                        )}
                        <button 
                          onClick={() => openDetailDrawer(refund.id)}
                          className="text-text-secondary hover:text-text-primary"
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
                  显示第 <span>{filteredData.length > 0 ? startIndex : 0}</span> - <span>{endIndex}</span> 条，共 <span>{filteredData.length}</span> 条记录
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
                    {generatePageNumbers()}
                  </div>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1 border border-border-light rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 侧边栏遮罩 */}
      {isSidebarOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        ></div>
      )}

      {/* 审核确认弹窗 */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalBackdrop} onClick={closeReviewModal}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className={`bg-white rounded-xl shadow-xl max-w-md w-full ${styles.modalEnter}`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">审核退款申请</h3>
                  <button onClick={closeReviewModal} className="text-text-secondary hover:text-text-primary">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-text-secondary mb-4">请选择审核结果：</p>
                  
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="review-result" 
                        value="approved" 
                        checked={reviewResult === 'approved'}
                        onChange={(e) => setReviewResult(e.target.value)}
                        className="text-primary focus:ring-primary" 
                      />
                      <span className="text-sm text-text-primary">通过退款</span>
                    </label>
                    
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="review-result" 
                        value="rejected" 
                        checked={reviewResult === 'rejected'}
                        onChange={(e) => setReviewResult(e.target.value)}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-text-primary">驳回退款</span>
                    </label>
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="review-comment" className="block text-sm font-medium text-text-primary mb-2">审核备注（可选）</label>
                    <textarea 
                      id="review-comment"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={3} 
                      className={`w-full px-3 py-2 border border-border-light rounded-lg ${styles.searchFocus} resize-none`}
                      placeholder="请输入审核备注..."
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={confirmReview}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
                  >
                    确认审核
                  </button>
                  <button 
                    onClick={closeReviewModal}
                    className="px-4 py-2 border border-border-light text-text-secondary rounded-lg hover:bg-gray-50 font-medium"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 退款详情抽屉 */}
      {isDetailDrawerOpen && selectedRefund && (
        <div className="fixed inset-y-0 right-0 z-50">
          <div className={styles.modalBackdrop} onClick={closeDetailDrawer}></div>
          <div className="relative flex h-full">
            <div className={`bg-white shadow-xl w-full max-w-md transform transition-transform duration-300 ${isDetailDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="flex items-center justify-between p-6 border-b border-border-light">
                <h3 className="text-lg font-semibold text-text-primary">退款详情</h3>
                <button onClick={closeDetailDrawer} className="text-text-secondary hover:text-text-primary">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto h-full">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-3">退款基本信息</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">退款ID:</span>
                        <span className="text-text-primary">{selectedRefund.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">订单号:</span>
                        <span className="text-text-primary">{selectedRefund.orderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">申请时间:</span>
                        <span className="text-text-primary">{selectedRefund.applyTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">退款金额:</span>
                        <span className="text-lg font-semibold text-primary">¥{selectedRefund.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">当前状态:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[`status${selectedRefund.status.charAt(0).toUpperCase() + selectedRefund.status.slice(1)}`]}`}>
                          {getStatusText(selectedRefund.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-3">课程信息</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">课程名称:</span>
                        <span className="text-text-primary">{selectedRefund.courseName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">上课时间:</span>
                        <span className="text-text-primary">{selectedRefund.courseTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">教师:</span>
                        <span className="text-text-primary">{selectedRefund.teacherName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">上课地点:</span>
                        <span className="text-text-primary">{selectedRefund.location}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-3">申请人信息</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">申请人:</span>
                        <span className="text-text-primary">{selectedRefund.applicant}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">退款原因:</span>
                        <span className="text-text-primary">{selectedRefund.reason}</span>
                      </div>
                    </div>
                  </div>

                  {selectedRefund.status !== 'pending' && (
                    <div>
                      <h4 className="text-sm font-medium text-text-primary mb-3">审核信息</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-text-secondary">审核结果:</span>
                          <span className="text-text-primary">{getStatusText(selectedRefund.status)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">审核时间:</span>
                          <span className="text-text-primary">{selectedRefund.reviewTime || 'N/A'}</span>
                        </div>
                        {selectedRefund.reviewComment && (
                          <div>
                            <span className="text-text-secondary">审核备注:</span>
                            <p className="text-text-primary mt-1">{selectedRefund.reviewComment}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRefundManage;

