

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';
import request from '../../utils/request'; // 导入API请求工具

interface OrderInfo {
  courseName: string;
  courseTime: string;
  paidAmount: string;
  refundAmount: string;
}

interface RefundFormData {
  reason: string;
  otherReason: string;
  note: string;
}

const RefundApplyPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({
    courseName: '数学思维训练',
    courseTime: '2024-01-20 14:00-16:00',
    paidAmount: '¥80.00',
    refundAmount: '¥80.00'
  });

  const [formData, setFormData] = useState<RefundFormData>({
    reason: '',
    otherReason: '',
    note: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '申请退款 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  // 根据URL参数加载订单数据
  useEffect(() => {
    const enrollmentId = searchParams.get('enrollmentId');
    
    const fetchOrderInfo = async () => {
      if (enrollmentId) {
        try {
          const response = await request.get(`/api/enrollment/${enrollmentId}`);
          const enrollmentData = response.data;
          const formattedOrder: OrderInfo = {
            courseName: enrollmentData.course_name || '未知课程',
            courseTime: `${enrollmentData.start_date || ''} ${enrollmentData.start_time || ''}-${enrollmentData.end_time || ''}`,
            paidAmount: `¥${enrollmentData.amount || 0}.00`,
            refundAmount: `¥${enrollmentData.amount || 0}.00`
          };
          setOrderInfo(formattedOrder);
          console.log('获取到真实订单数据:', formattedOrder);
        } catch (error) {
          console.error('获取订单数据失败:', error);
          // 失败时使用默认模拟数据
        }
      }
    };

    fetchOrderInfo();
  }, [searchParams]);

  // 检查表单有效性
  const isFormValid = (): boolean => {
    if (!formData.reason) return false;
    if (formData.reason === 'other' && !formData.otherReason.trim()) return false;
    return true;
  };

  // 处理退款原因选择
  const handleReasonChange = (reason: string) => {
    setFormData(prev => ({
      ...prev,
      reason,
      otherReason: reason === 'other' ? prev.otherReason : ''
    }));
  };

  // 处理文本输入
  const handleTextChange = (field: keyof RefundFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 关闭弹窗
  const handleCloseModal = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // 处理遮罩点击
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    // 仅当是表单提交事件时才调用preventDefault
    if ('preventDefault' in e) {
      e.preventDefault();
    }
    
    if (!isFormValid() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 收集表单数据
      const submissionData = {
        enrollment_id: searchParams.get('enrollmentId') || 'enrollment1',
        reason: formData.reason,
        other_reason: formData.otherReason,
        note: formData.note,
        amount: parseFloat(orderInfo.refundAmount.replace('¥', ''))
      };

      // 真实退款API调用
      const refundResponse = await request.post('/api/refund', submissionData);
      console.log('退款申请提交成功:', refundResponse);

      // 显示成功提示
      alert('退款申请已提交，我们将在24小时内审核处理，请耐心等待。');

      // 跳转到我的课程页
      navigate('/my-courses');
    } catch (error) {
      console.error('提交退款申请失败:', error);
      alert('提交失败，请稍后重试。');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理ESC键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleCloseModal]);

  return (
    <div className={styles.pageWrapper}>
      {/* 模态弹窗遮罩 */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${styles.modalBackdrop}`}
        onClick={handleBackdropClick}
      >
        {/* 退款申请弹窗 */}
        <div className={`bg-white rounded-xl shadow-modal w-full max-w-md mx-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${styles.modalContent}`}>
          {/* 弹窗头部 */}
          <div className="flex items-center justify-between p-6 border-b border-border-light">
            <h2 className="text-xl font-bold text-text-primary">申请退款</h2>
            <button 
              onClick={handleCloseModal}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-times text-text-secondary"></i>
            </button>
          </div>
          
          {/* 弹窗内容 */}
          <div className="p-6">
            {/* 订单信息区 */}
            <div className="mb-6 p-4 bg-bg-light rounded-lg">
              <h3 className="font-semibold text-text-primary mb-3">订单信息</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">课程名称：</span>
                  <span className="text-text-primary font-medium">{orderInfo.courseName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">上课时间：</span>
                  <span className="text-text-primary">{orderInfo.courseTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">已支付金额：</span>
                  <span className="text-text-primary font-medium">{orderInfo.paidAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">申请退款金额：</span>
                  <span className="text-danger font-bold">{orderInfo.refundAmount}</span>
                </div>
              </div>
            </div>
            
            {/* 退款原因选择 */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">退款原因 *</label>
                <div className="space-y-3">
                  {[
                    { id: 'time-conflict', icon: 'fas fa-clock', label: '时间冲突' },
                    { id: 'schedule-change', icon: 'fas fa-calendar-times', label: '课程时间调整' },
                    { id: 'content-not-suitable', icon: 'fas fa-exclamation-triangle', label: '课程内容不适合' },
                    { id: 'teacher-issue', icon: 'fas fa-user-tie', label: '教师问题' },
                    { id: 'other', icon: 'fas fa-comment', label: '其他原因' }
                  ].map((reason) => (
                    <div key={reason.id} className="relative">
                      <input 
                        type="radio" 
                        id={`reason-${reason.id}`}
                        name="refund-reason" 
                        value={reason.id}
                        checked={formData.reason === reason.id}
                        onChange={(e) => handleReasonChange(e.target.value)}
                        className={`${styles.radioCustom} sr-only`}
                        required
                      />
                      <label 
                        htmlFor={`reason-${reason.id}`}
                        className={`${styles.radioLabel} flex items-center p-3 border border-border-light rounded-lg cursor-pointer`}
                      >
                        <i className={`${reason.icon} text-primary mr-3`}></i>
                        <span>{reason.label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 其他原因输入框 */}
              {formData.reason === 'other' && (
                <div className="space-y-2">
                  <label htmlFor="other-reason" className="block text-sm font-medium text-text-primary">详细说明 *</label>
                  <textarea 
                    id="other-reason" 
                    name="other-reason"
                    rows={3}
                    placeholder="请详细描述退款原因..."
                    value={formData.otherReason}
                    onChange={(e) => handleTextChange('otherReason', e.target.value)}
                    className={`w-full px-4 py-3 border border-border-light rounded-lg resize-none ${styles.formInputFocus}`}
                    maxLength={200}
                    required
                  />
                  <div className="text-right">
                    <span className="text-xs text-text-secondary">{formData.otherReason.length}/200</span>
                  </div>
                </div>
              )}
              
              {/* 退款说明（可选） */}
              <div className="space-y-2">
                <label htmlFor="refund-note" className="block text-sm font-medium text-text-primary">补充说明（可选）</label>
                <textarea 
                  id="refund-note" 
                  name="refund-note"
                  rows={2}
                  placeholder="如有其他需要说明的情况，请在此填写..."
                  value={formData.note}
                  onChange={(e) => handleTextChange('note', e.target.value)}
                  className={`w-full px-4 py-3 border border-border-light rounded-lg resize-none ${styles.formInputFocus}`}
                  maxLength={100}
                />
                <div className="text-right">
                  <span className="text-xs text-text-secondary">{formData.note.length}/100</span>
                </div>
              </div>
            </form>
          </div>
          
          {/* 弹窗底部 */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border-light bg-bg-light rounded-b-xl">
            <button 
              onClick={handleCloseModal}
              className="px-6 py-2 border border-border-light text-text-secondary rounded-lg hover:bg-white transition-colors"
            >
              取消
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  提交中...
                </>
              ) : (
                '提交申请'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundApplyPage;

