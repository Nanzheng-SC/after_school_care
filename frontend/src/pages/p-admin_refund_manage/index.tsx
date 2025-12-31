import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

interface RefundData {
  id: string;
  order_id: string;
  course_name: string;
  applicant: string;
  apply_time: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  course_id: string;
  applicant_id: string;
  course_time: string;
  teacher_name: string;
  location: string;
  review_comment?: string;
  review_time?: string;
}

const AdminRefundManage: React.FC = () => {
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

  const [mockRefundData, setMockRefundData] = useState<RefundData[]>([
    {
      id: 'REF001',
      order_id: 'ORD20240115001',
      course_name: '数学思维训练',
      applicant: '张家长',
      apply_time: '2024-01-15 14:30:25',
      amount: 80.00,
      reason: '时间冲突，无法参加课程',
      status: 'pending',
      course_id: 'C001',
      applicant_id: 'P001',
      course_time: '每周三 16:00-17:30',
      teacher_name: '李老师',
      location: '教室A'
    },
    {
      id: 'REF002',
      order_id: 'ORD20240116002',
      course_name: '英语口语练习',
      applicant: '王家长',
      apply_time: '2024-01-16 09:15:10',
      amount: 120.00,
      reason: '孩子身体不适，需要在家休息',
      status: 'approved',
      course_id: 'C002',
      applicant_id: 'P002',
      course_time: '每周五 14:00-15:30',
      teacher_name: '王老师',
      location: '教室B',
      review_comment: '已通过退款申请',
      review_time: '2024-01-16 10:30:00'
    },
    {
      id: 'REF003',
      order_id: 'ORD20240117003',
      course_name: '科学实验课',
      applicant: '刘家长',
      apply_time: '2024-01-17 16:45:30',
      amount: 95.00,
      reason: '课程时间与学校安排冲突',
      status: 'rejected',
      course_id: 'C003',
      applicant_id: 'P003',
      course_time: '每周二 15:30-17:00',
      teacher_name: '张老师',
      location: '实验室',
      review_comment: '课程开始前已多次提醒，请提前安排时间',
      review_time: '2024-01-17 18:00:00'
    }
  ]);

  const [filteredData, setFilteredData] = useState<RefundData[]>([]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    const filtered = mockRefundData.filter(refund => {
      const matchesSearch = refund.course_name.toLowerCase().includes(searchInput.toLowerCase()) ||
                          refund.applicant.toLowerCase().includes(searchInput.toLowerCase()) ||
                          refund.order_id.toLowerCase().includes(searchInput.toLowerCase());
      
      const matchesStatus = statusFilter === '' || refund.status === statusFilter;
      
      let matchesTime = true;
      if (timeFilter !== '') {
        const applyDate = new Date(refund.apply_time);
        const now = new Date();
        
        switch (timeFilter) {
          case 'today':
            matchesTime = applyDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesTime = applyDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesTime = applyDate >= monthAgo;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesTime;
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchInput, statusFilter, timeFilter, mockRefundData]);

  const openReviewModal = (refundId: string) => {
    setCurrentRefundId(refundId);
    setIsReviewModalOpen(true);
    setReviewResult('approved');
    setReviewComment('');
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setCurrentRefundId(null);
    setReviewComment('');
  };

  const confirmReview = () => {
    if (currentRefundId) {
      const updatedData = mockRefundData.map(refund => {
        if (refund.id === currentRefundId) {
          return {
            ...refund,
            status: reviewResult as 'pending' | 'approved' | 'rejected',
            review_comment: reviewComment,
            review_time: new Date().toLocaleString('zh-CN')
          };
        }
        return refund;
      });

      setMockRefundData(updatedData);
      console.log('审核结果:', reviewResult, '退款ID:', currentRefundId, '备注:', reviewComment);
      closeReviewModal();
      alert('审核完成');
    }
  };

  const openDetailDrawer = (refund: RefundData) => {
    setSelectedRefund(refund);
    setIsDetailDrawerOpen(true);
  };

  const closeDetailDrawer = () => {
    setIsDetailDrawerOpen(false);
    setSelectedRefund(null);
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 rounded text-sm ${
            currentPage === i
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }
    
    return pages;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { text: '待审核', className: 'bg-yellow-100 text-yellow-800' },
      approved: { text: '已通过', className: 'bg-green-100 text-green-800' },
      rejected: { text: '已拒绝', className: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className={styles.container}>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-border-light">
          <div className="p-6 border-b border-border-light">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-text-primary">退款管理</h1>
              <Link to="/admin" className="text-primary hover:text-primary/80 font-medium">
                <i className="fas fa-arrow-left mr-2"></i>
                返回管理首页
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="搜索课程名称、申请人或订单号"
                  className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchFocus} placeholder-text-secondary`}
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-3 py-2 border border-border-light rounded-lg ${styles.searchFocus} text-text-primary`}
              >
                <option value="">全部状态</option>
                <option value="pending">待审核</option>
                <option value="approved">已通过</option>
                <option value="rejected">已拒绝</option>
              </select>

              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className={`px-3 py-2 border border-border-light rounded-lg ${styles.searchFocus} text-text-primary`}
              >
                <option value="">全部时间</option>
                <option value="today">今天</option>
                <option value="week">最近一周</option>
                <option value="month">最近一月</option>
              </select>

              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium">
                <i className="fas fa-download mr-2"></i>
                导出数据
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">订单信息</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">课程信息</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">申请人</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">申请时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">退款金额</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border-light">
                {getCurrentPageData().map((refund) => (
                  <tr key={refund.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-text-primary">{refund.order_id}</div>
                        <div className="text-sm text-text-secondary">ID: {refund.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-text-primary">{refund.course_name}</div>
                        <div className="text-sm text-text-secondary">{refund.teacher_name} • {refund.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-primary">{refund.applicant}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-primary">{refund.apply_time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-text-primary">¥{refund.amount.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(refund.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => openDetailDrawer(refund)}
                        className="text-primary hover:text-primary/80"
                      >
                        查看
                      </button>
                      {refund.status === 'pending' && (
                        <button
                          onClick={() => openReviewModal(refund.id)}
                          className="text-primary hover:text-primary/80"
                        >
                          审核
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <i className="fas fa-inbox text-4xl text-text-secondary mb-4"></i>
                <p className="text-text-secondary">暂无退款申请数据</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-border-light">
              <div className="flex items-center justify-between">
                <div className="text-sm text-text-secondary">
                  显示 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} 条，共 {filteredData.length} 条
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
          )}
        </div>
      </div>

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

              <div className="p-6 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-text-secondary mb-2">基本信息</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-text-secondary">退款ID：</span>
                        <span className="text-sm text-text-primary ml-2">{selectedRefund.id}</span>
                      </div>
                      <div>
                        <span className="text-sm text-text-secondary">订单号：</span>
                        <span className="text-sm text-text-primary ml-2">{selectedRefund.order_id}</span>
                      </div>
                      <div>
                        <span className="text-sm text-text-secondary">申请人：</span>
                        <span className="text-sm text-text-primary ml-2">{selectedRefund.applicant}</span>
                      </div>
                      <div>
                        <span className="text-sm text-text-secondary">申请时间：</span>
                        <span className="text-sm text-text-primary ml-2">{selectedRefund.apply_time}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-text-secondary mb-2">课程信息</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-text-secondary">课程名称：</span>
                        <span className="text-sm text-text-primary ml-2">{selectedRefund.course_name}</span>
                      </div>
                      <div>
                        <span className="text-sm text-text-secondary">上课时间：</span>
                        <span className="text-sm text-text-primary ml-2">{selectedRefund.course_time}</span>
                      </div>
                      <div>
                        <span className="text-sm text-text-secondary">授课老师：</span>
                        <span className="text-sm text-text-primary ml-2">{selectedRefund.teacher_name}</span>
                      </div>
                      <div>
                        <span className="text-sm text-text-secondary">上课地点：</span>
                        <span className="text-sm text-text-primary ml-2">{selectedRefund.location}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-text-secondary mb-2">退款信息</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-text-secondary">退款金额：</span>
                        <span className="text-sm font-medium text-text-primary ml-2">¥{selectedRefund.amount.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-sm text-text-secondary">退款原因：</span>
                        <span className="text-sm text-text-primary ml-2">{selectedRefund.reason}</span>
                      </div>
                      <div>
                        <span className="text-sm text-text-secondary">审核状态：</span>
                        <div className="ml-2 mt-1">
                          {getStatusBadge(selectedRefund.status)}
                        </div>
                      </div>
                      {selectedRefund.review_comment && (
                        <div>
                          <span className="text-sm text-text-secondary">审核备注：</span>
                          <span className="text-sm text-text-primary ml-2">{selectedRefund.review_comment}</span>
                        </div>
                      )}
                      {selectedRefund.review_time && (
                        <div>
                          <span className="text-sm text-text-secondary">审核时间：</span>
                          <span className="text-sm text-text-primary ml-2">{selectedRefund.review_time}</span>
                        </div>
                      )}
                    </div>
                  </div>
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