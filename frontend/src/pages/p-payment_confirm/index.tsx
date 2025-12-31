

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';
import request from '../../utils/request'; // 导入API请求工具

interface CourseData {
  name: string;
  teacher: string;
  teacherRating: number;
  date: string;
  time: string;
  location: string;
  price: number;
  image: string;
}

interface StudentData {
  name: string;
  ageGroup: string;
  grade: string;
}

const PaymentConfirmPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('wechat');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [courseData, setCourseData] = useState<CourseData>({
    name: '数学思维训练',
    teacher: '李老师',
    teacherRating: 4.9,
    date: '2024年1月20日',
    time: '周六 14:00-16:00',
    location: '阳光社区活动中心',
    price: 80.00,
    image: 'https://s.coze.cn/image/eXeFreVrN2Q/'
  });
  const [studentData, setStudentData] = useState<StudentData>({
    name: '张小华',
    ageGroup: '7-10岁',
    grade: '小学三年级'
  });

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '支付确认 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  // 根据URL参数加载数据
  useEffect(() => {
    const courseId = searchParams.get('courseId');
    const studentId = searchParams.get('studentId');

    // 从API获取课程数据
    const fetchCourseData = async () => {
      if (courseId) {
        try {
          const response = await request.get(`/api/course/${courseId}`);
          const courseResponse = response.data;
          const formattedCourse: CourseData = {
            name: courseResponse.course_name || '未知课程',
            teacher: courseResponse.teacher_name || '未知教师',
            teacherRating: courseResponse.teacher_rating || 0,
            date: courseResponse.start_date || '',
            time: `${courseResponse.start_time || ''}-${courseResponse.end_time || ''}`,
            location: courseResponse.location || '',
            price: courseResponse.price || 0,
            image: courseResponse.image_url || 'https://s.coze.cn/image/eXeFreVrN2Q/'
          };
          setCourseData(formattedCourse);
          console.log('获取到真实课程数据:', formattedCourse);
        } catch (error) {
          console.error('获取课程数据失败:', error);
          // 失败时使用默认模拟数据
        }
      }
    };

    // 从API获取学员数据
    const fetchStudentData = async () => {
      if (studentId) {
        try {
          const response = await request.get(`/api/youth/${studentId}`);
          const studentResponse = response.data;
          // 计算年龄组
          const calculateAgeGroup = (age: number): string => {
            if (age >= 4 && age <= 6) return '4-6岁';
            if (age >= 7 && age <= 10) return '7-10岁';
            return `${age}岁`;
          };
          
          const formattedStudent: StudentData = {
            name: studentResponse.name || '未知学员',
            ageGroup: calculateAgeGroup(studentResponse.age || 0),
            grade: '' // 后端数据可能没有年级信息
          };
          setStudentData(formattedStudent);
          console.log('获取到真实学员数据:', formattedStudent);
        } catch (error) {
          console.error('获取学员数据失败:', error);
          // 失败时使用默认模拟数据
        }
      }
    };

    fetchCourseData();
    fetchStudentData();
  }, [searchParams]);

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      } else if (e.key === 'Enter' && !isProcessingPayment) {
        handleConfirmPayment();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isProcessingPayment]);

  const handleCloseModal = () => {
    navigate(-1);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const handleConfirmPayment = async () => {
    if (isProcessingPayment) return;

    setIsProcessingPayment(true);

    try {
      const courseId = searchParams.get('courseId');
      const studentId = searchParams.get('studentId');
      
      // 调用支付API
      const paymentResponse = await request.post('/api/payment', {
        course_id: courseId,
        youth_id: studentId,
        payment_method: selectedPaymentMethod,
        amount: courseData.price
      });
      
      console.log('支付成功:', paymentResponse);
      alert('支付成功！');
      navigate('/my-courses');
    } catch (error) {
      console.error('支付失败:', error);
      alert('支付失败，请稍后重试');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const paymentMethods = [
    {
      id: 'wechat',
      name: '微信支付',
      description: '推荐使用微信支付',
      icon: 'fab fa-weixin',
      bgColor: 'bg-success'
    },
    {
      id: 'alipay',
      name: '支付宝',
      description: '安全便捷的支付方式',
      icon: 'fab fa-alipay',
      bgColor: 'bg-info'
    },
    {
      id: 'bank',
      name: '银行卡支付',
      description: '支持各大银行借记卡',
      icon: 'fas fa-credit-card',
      bgColor: 'bg-primary'
    },
    {
      id: 'offline',
      name: '线下支付',
      description: '到社区服务中心现场缴费',
      icon: 'fas fa-handshake',
      bgColor: 'bg-warning'
    }
  ];

  return (
    <div className={styles.pageWrapper}>
      {/* 模态弹窗遮罩 */}
      <div 
        className={`fixed inset-0 ${styles.modalBackdrop} z-50 flex items-center justify-center p-4`}
        onClick={handleBackdropClick}
      >
        {/* 支付确认弹窗 */}
        <div className={`bg-white rounded-xl shadow-modal w-full max-w-2xl ${styles.modalEnter}`}>
          {/* 弹窗头部 */}
          <div className="flex items-center justify-between p-6 border-b border-border-light">
            <h2 className="text-xl font-bold text-text-primary">确认订单</h2>
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
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-text-primary mb-4">订单信息</h3>
              
              {/* 课程信息 */}
              <div className="bg-bg-light rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-4">
                  <img 
                    src={courseData.image}
                    alt="数学思维训练课程" 
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-text-primary mb-2">{courseData.name}</h4>
                    <div className="space-y-1 text-sm text-text-secondary">
                      <div className="flex items-center">
                        <i className="fas fa-user-tie w-4 mr-2"></i>
                        <span>{courseData.teacher}</span>
                        <div className="flex items-center ml-3">
                          <i className="fas fa-star text-warning text-xs mr-1"></i>
                          <span>{courseData.teacherRating}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-clock w-4 mr-2"></i>
                        <span>{courseData.date} {courseData.time}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-map-marker-alt w-4 mr-2"></i>
                        <span>{courseData.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 学员信息 */}
              <div className="bg-bg-light rounded-lg p-4 mb-4">
                <h5 className="font-medium text-text-primary mb-3">学员信息</h5>
                <div className="flex items-center space-x-3">
                  <img 
                    src="https://s.coze.cn/image/h8FaJn3QilU/" 
                    alt="学员头像" 
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
                  />
                  <div>
                    <p className="font-medium text-text-primary">{studentData.name}</p>
                    <p className="text-sm text-text-secondary">{studentData.ageGroup} · {studentData.grade}</p>
                  </div>
                </div>
              </div>
              
              {/* 费用明细 */}
              <div className="bg-bg-light rounded-lg p-4">
                <h5 className="font-medium text-text-primary mb-3">费用明细</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">课程费用</span>
                    <span className="text-text-primary">¥{courseData.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">服务费</span>
                    <span className="text-text-primary">¥0.00</span>
                  </div>
                  <div className="border-t border-border-light pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-text-primary">总计</span>
                      <span className="text-xl font-bold text-primary">¥{courseData.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 支付方式选择 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-text-primary mb-4">选择支付方式</h3>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label 
                    key={method.id}
                    className={`${styles.paymentOption} block p-4 border border-border-light rounded-lg cursor-pointer ${
                      selectedPaymentMethod === method.id ? styles.selected : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input 
                          type="radio" 
                          name="payment-method" 
                          value={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={() => handlePaymentMethodChange(method.id)}
                          className={styles.radioCustom}
                        />
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${method.bgColor} rounded-lg flex items-center justify-center`}>
                            <i className={`${method.icon} text-white text-lg`}></i>
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">{method.name}</p>
                            <p className="text-sm text-text-secondary">{method.description}</p>
                          </div>
                        </div>
                      </div>
                      <i className={`fas fa-check text-primary text-lg ${
                        selectedPaymentMethod === method.id ? '' : 'hidden'
                      }`}></i>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            {/* 底部操作按钮 */}
            <div className="flex items-center justify-between pt-6 border-t border-border-light">
              <div className="text-right">
                <p className="text-sm text-text-secondary">应付金额</p>
                <p className="text-xl font-bold text-primary">¥{courseData.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleCloseModal}
                  className="px-6 py-3 border border-border-light text-text-secondary rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleConfirmPayment}
                  disabled={isProcessingPayment}
                  className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingPayment ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      处理中...
                    </>
                  ) : (
                    '确认支付'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmPage;

