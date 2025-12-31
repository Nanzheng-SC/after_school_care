

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';
import request from '../../utils/request';

// 子女信息类型定义（与后端Youth模型匹配）
interface Child {
  id: string;
  name: string;
  age?: string;
  health_note?: string;
  interest?: string;
  learning_style?: string;
}

// 课程详情类型定义
interface CourseDetail {
  course_id: string;
  name: string;
  description: string;
  type: string;
  age_range: string;
  schedule: string;
  location: string;
  capacity: string;
  current_enrollment: string;
  teacher_id: string;
  teacher_name: string;
  teacher_title: string;
  teacher_rating: number;
  teacher_description: string;
  course_objectives: string[];
  course_outline: string[];
}

const CourseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<string>('');
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  
  // 课程数据状态
  const [courseDetail, setCourseDetail] = useState<CourseDetail | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [childrenLoading, setChildrenLoading] = useState(false);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${courseDetail?.name || '课程详情'} - 课智配`;
    return () => { document.title = originalTitle; };  
  }, [courseDetail?.name]);

  // 获取子女信息
  const fetchChildren = async () => {
    try {
      setChildrenLoading(true);
      console.log('开始获取子女信息');
      // 从localStorage或登录状态获取家长ID或家庭ID
      const familyId = localStorage.getItem('familyId') || localStorage.getItem('parentId');
      if (!familyId) {
        console.error('家庭ID不存在，无法获取子女数据');
        setChildren([]);
        setChildrenLoading(false);
        return;
      }
      const response = await request.get('/api/youth', { params: { familyId } });
      const childrenData = response.data;
      
      // 转换后端数据结构以适应前端界面
      const formattedChildren: Child[] = childrenData.map((child: any) => ({
        id: child.youth_id || '',
        name: child.name || '未知姓名',
        age: child.age || '',
        health_note: child.health_note || '',
        interest: child.interest || '',
        learning_style: child.learning_style || ''
      }));
      
      console.log('获取到的子女信息:', formattedChildren);
      setChildren(formattedChildren);
      
      // 默认选择第一个子女
      if (formattedChildren.length > 0) {
        setSelectedChild(formattedChildren[0].id);
      }
    } catch (err) {
      console.error('获取子女信息失败:', err);
      setChildren([]);
      setSelectedChild('');
    } finally {
      setChildrenLoading(false);
    }
  };

  // 获取URL参数并加载课程详情
  useEffect(() => {
    const fetchCourseDetail = async () => {
      const courseId = searchParams.get('courseId');
      if (!courseId) return;
      
      try {
        console.log('开始获取课程详情，ID:', courseId);
        const response = await request.get(`/api/course/${courseId}`);
        const course = response.data;
        
        // 转换后端数据结构以适应前端界面
        const formattedCourseDetail: CourseDetail = {
          course_id: course.course_id || courseId,
          name: course.course_name || '未知课程',
          description: course.description || '暂无课程描述',
          type: course.type || '未知类型',
          age_range: course.age_range || '未知年龄',
          schedule: `${course.start_date || ''} ${course.start_time || ''}-${course.end_time || ''}` || '未知时间',
          location: course.location || '未知地点',
          capacity: course.capacity || '0',
          current_enrollment: course.current_enrollment || '0',
          teacher_id: course.teacher_id || '',
          teacher_name: course.teacher_name || '未知老师',
          teacher_title: '', // 后端没有提供老师职称
          teacher_rating: 0, // 后端没有提供老师评分
          teacher_description: '', // 后端没有提供老师简介
          course_objectives: [], // 后端没有提供课程目标
          course_outline: [] // 后端没有提供课程大纲
        };
        
        console.log('格式化后的课程详情:', formattedCourseDetail);
        setCourseDetail(formattedCourseDetail);
        
        // 更新页面标题
        document.title = `${formattedCourseDetail.name} - 课智配`;
      } catch (err) {
        console.error('获取课程详情失败:', err);
      
        // 使用默认值代替虚拟数据
        const defaultCourseDetail: CourseDetail = {
          course_id: courseId,
          name: '未知课程',
          description: '暂无课程描述',
          type: '未知类型',
          age_range: '未知年龄',
          schedule: '未知时间',
          location: '未知地点',
          capacity: '0',
          current_enrollment: '0',
          teacher_id: '',
          teacher_name: '未知老师',
          teacher_title: '',
          teacher_rating: 0,
          teacher_description: '暂无教师简介',
          course_objectives: [],
          course_outline: []
        };
      
        setCourseDetail(defaultCourseDetail);
      
        // 更新页面标题
        document.title = `${defaultCourseDetail.name} - 课智配`;
      }
    };
    
    fetchCourseDetail();
  }, [searchParams]);

  // 加载子女信息
  useEffect(() => {
    fetchChildren();
  }, []);

  // 侧边栏切换
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 分享弹窗切换
  const handleShareToggle = () => {
    setIsShareModalOpen(!isShareModalOpen);
  };

  // 教师详情查看
  const handleTeacherDetail = (teacherId: string) => {
    console.log('查看教师详情:', teacherId);
    // 在实际应用中，这里会打开教师详情侧边抽屉
  };

  // 报名按钮点击
  const handleEnroll = async () => {
    console.log('选择的子女:', selectedChild);
    
    if (!selectedChild || !courseDetail?.course_id) {
      alert('请选择子女并确保课程信息完整');
      return;
    }
    
    try {
      // 从localStorage获取家长ID
      const userInfoStr = localStorage.getItem('userInfo');
      const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};
      const parentId = userInfo.id || 'p1'; // 默认使用p1作为家长ID
      
      // 调用课程报名API
      await request.post(`/api/parent/${parentId}/enroll`, {
        youthId: selectedChild,
        courseId: courseDetail.course_id
      });
      
      alert('课程报名成功');
      // 可以选择跳转到我的课程页面
      navigate('/my-courses');
    } catch (error) {
      console.error('课程报名失败:', error);
      alert('课程报名失败，请稍后重试');
    }
  };

  // 分享选项点击
  const handleShareOption = (shareType: string) => {
    console.log('分享到:', shareType);
    alert(`已分享到${shareType}`);
    setIsShareModalOpen(false);
  };

  // 搜索功能
  const handleGlobalSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const searchTerm = globalSearchTerm.trim();
      if (searchTerm) {
        navigate(`/course-list?search=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  // 消息中心点击
  const handleMessageCenter = () => {
    console.log('打开消息中心');
    // 在实际应用中，这里会打开消息中心侧边抽屉
  };

  // 用户菜单点击
  const handleUserMenu = () => {
    console.log('打开用户菜单');
    // 在实际应用中，这里会显示下拉菜单
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
                value={globalSearchTerm}
                onChange={(e) => setGlobalSearchTerm(e.target.value)}
                onKeyDown={handleGlobalSearch}
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
                  src="https://s.coze.cn/image/U4q2swn6SzE/" 
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
            className={`${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}
          >
            <i className="fas fa-book-open w-5"></i>
            <span>课程中心</span>
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
            {/* 面包屑导航 */}
            <nav className="mb-4">
              <ol className="flex items-center space-x-2 text-sm text-text-secondary">
                <li><Link to="/home" className="hover:text-primary">首页</Link></li>
                <li><i className="fas fa-chevron-right text-xs"></i></li>
                <li><Link to="/course-list" className="hover:text-primary">课程中心</Link></li>
                <li><i className="fas fa-chevron-right text-xs"></i></li>
                <li className="text-text-primary">{courseDetail?.name || '课程详情'}</li>
              </ol>
            </nav>
            
            {/* 课程标题和分享 */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">{courseDetail?.name || '课程详情'}</h1>
                <div className="flex items-center space-x-4 text-sm text-text-secondary">
                  <span><i className="fas fa-clock mr-1"></i>{courseDetail?.schedule || '未知时间'}</span>
                  <span><i className="fas fa-map-marker-alt mr-1"></i>{courseDetail?.location || '未知地点'}</span>
                  <span><i className="fas fa-users mr-1"></i>{courseDetail?.current_enrollment || '0'}/{courseDetail?.capacity || '0'}人</span>
                </div>
              </div>
              <button 
                onClick={handleShareToggle}
                className="px-4 py-2 bg-gray-100 text-text-secondary rounded-lg hover:bg-gray-200 transition-colors"
              >
                <i className="fas fa-share-alt mr-2"></i>分享课程
              </button>
            </div>
          </div>

          {/* 课程基本信息区 */}
          <section className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 左侧课程信息 */}
              <div className="lg:col-span-2 space-y-6">
                {/* 课程图片 */}
                <div className="bg-white rounded-xl shadow-card overflow-hidden">
                  <img 
                    src="https://s.coze.cn/image/4O6ZM8N3IEs/" 
                    alt={`${courseDetail?.name || '课程'}图片`} 
                    className="w-full h-80 object-cover"
                  />
                </div>

                {/* 课程描述 */}
                <div className="bg-white rounded-xl shadow-card p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">课程介绍</h3>
                  <div className="space-y-4 text-text-secondary">
                    <p>{courseDetail?.description || '暂无课程描述'}</p>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-text-primary mb-2">教学目标：</h4>
                      <ul className="space-y-1 text-sm">
                        {courseDetail?.course_objectives?.map((objective, index) => (
                          <li key={index}>• {objective}</li>
                        )) || <li>• 暂无教学目标信息</li>}
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-text-primary mb-2">课程大纲：</h4>
                      <ul className="space-y-1 text-sm">
                        {courseDetail?.course_outline?.map((outline, index) => (
                          <li key={index}>• {outline}</li>
                        )) || <li>• 暂无课程大纲信息</li>}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 教师介绍 */}
                <div className="bg-white rounded-xl shadow-card p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">教师介绍</h3>
                  <div className="flex items-start space-x-4">
                    <img 
                      src="https://s.coze.cn/image/9hCvbk2pY-g/" 
                      alt={`${courseDetail?.teacher_name || '未知老师'}头像`} 
                      className={`w-16 h-16 rounded-full ${styles.teacherAvatar} cursor-pointer`}
                      onClick={() => handleTeacherDetail(courseDetail?.teacher_id || '')}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 
                          className="font-medium text-text-primary cursor-pointer hover:text-primary"
                          onClick={() => handleTeacherDetail(courseDetail?.teacher_id || '')}
                        >
                          {courseDetail?.teacher_name || '未知老师'}
                        </h4>
                        <span className="text-sm text-text-secondary">{courseDetail?.teacher_rating || 0}</span>
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">{courseDetail?.teacher_title || '教师'}</span>
                      </div>
                      <p className="text-sm text-text-secondary mb-3">
                        {courseDetail?.teacher_description || '暂无教师简介'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-gray-100 text-text-secondary text-xs rounded-full">数学思维</span>
                        <span className="px-2 py-1 bg-gray-100 text-text-secondary text-xs rounded-full">逻辑推理</span>
                        <span className="px-2 py-1 bg-gray-100 text-text-secondary text-xs rounded-full">趣味教学</span>
                      </div>
                    </div>
                  </div>
                </div>


              </div>

              {/* 右侧报名区域 */}
              <div className="space-y-6">
                {/* 课程信息卡片 */}
                <div className="bg-white rounded-xl shadow-card p-6">
                  <div className="space-y-4">
                    <div className="text-center">
                      <span className="text-3xl font-bold text-primary">¥80</span>
                      <span className="text-sm text-text-secondary">/课时</span>
                      {/* 价格信息：后端暂未提供，使用虚拟数据 */}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">课程类型</span>
                        <span className="text-sm text-text-primary">{courseDetail?.type || '未知类型'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">适合年龄</span>
                        <span className="text-sm text-text-primary">{courseDetail?.age_range || '未知年龄'}岁</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">课时时长</span>
                        <span className="text-sm text-text-primary">2小时</span>
                        {/* 课时时长：后端暂未提供，使用虚拟数据 */}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">上课地点</span>
                        <span className="text-sm text-text-primary">{courseDetail?.location || '未知地点'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">剩余名额</span>
                        <span className="text-sm text-warning font-medium">
                          {courseDetail ? `${parseInt(courseDetail.capacity) - parseInt(courseDetail.current_enrollment)}/${courseDetail.capacity}人` : '0/0人'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 子女选择 */}
                <div className="bg-white rounded-xl shadow-card p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">选择子女</h3>
                  {childrenLoading ? (
                    <div className="text-center py-4 text-sm text-text-secondary">加载子女信息中...</div>
                  ) : children.length === 0 ? (
                    <div className="text-center py-4 text-sm text-text-secondary">暂无子女信息</div>
                  ) : (
                    <div className="space-y-3">
                      {children.map((child) => {
                        // 判断子女是否适合该课程年龄
                        const isSuitable = courseDetail ? (
                          (() => {
                            if (!child.age) return false;
                            const ageRange = courseDetail.age_range;
                            if (!ageRange) return false;
                            
                            const [minAge, maxAge] = ageRange.split('-').map(Number);
                            const childAge = Number(child.age);
                            return !isNaN(childAge) && !isNaN(minAge) && !isNaN(maxAge) && childAge >= minAge && childAge <= maxAge;
                          })()
                        ) : false;
                        
                        return (
                          <label key={child.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                            <input 
                              type="radio" 
                              name="child" 
                              value={child.id} 
                              checked={selectedChild === child.id}
                              onChange={(e) => setSelectedChild(e.target.value)}
                              className="text-primary focus:ring-primary" 
                            />
                            <div className="flex items-center space-x-3 flex-1">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                {child.name.charAt(0)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-text-primary">{child.name}</div>
                                <div className="text-xs text-text-secondary">
                                  {child.age ? `${child.age}岁，${isSuitable ? '适合该课程' : '年龄不匹配'}` : '年龄未知'}
                                </div>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 报名按钮 */}
                <div className="bg-white rounded-xl shadow-card p-6">
                  <button 
                    onClick={handleEnroll}
                    className={`w-full py-3 bg-primary text-white font-medium rounded-lg ${styles.enrollButton}`}
                  >
                    <i className="fas fa-calendar-plus mr-2"></i>立即报名
                  </button>
                  
                  <div className="mt-4 text-center text-sm text-text-secondary">
                    <p>报名后可在"我的课程"中查看</p>
                    <p className="mt-1">支持课程开始前24小时退款</p>
                  </div>
                </div>

                {/* 课程提醒 */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-bell text-primary mt-1"></i>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-text-primary mb-1">课程提醒</h4>
                      <p className="text-xs text-text-secondary">
                        课程开始前30分钟，系统将通过短信和站内消息提醒您
                      </p>
                    </div>
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

      {/* 分享弹窗 */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">分享课程</h3>
                <button 
                  onClick={handleShareToggle}
                  className="p-1 rounded-lg hover:bg-gray-100"
                >
                  <i className="fas fa-times text-text-secondary"></i>
                </button>
              </div>
              
              <div className="space-y-4">
                <div 
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => handleShareOption('微信好友')}
                >
                  <i className="fab fa-weixin text-success text-xl"></i>
                  <span className="text-sm text-text-primary">微信好友</span>
                </div>
                
                <div 
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => handleShareOption('微信朋友圈')}
                >
                  <i className="fas fa-share-alt text-success text-xl"></i>
                  <span className="text-sm text-text-primary">微信朋友圈</span>
                </div>
                
                <div 
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => handleShareOption('QQ')}
                >
                  <i className="fab fa-qq text-info text-xl"></i>
                  <span className="text-sm text-text-primary">QQ</span>
                </div>
                
                <div 
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => handleShareOption('微博')}
                >
                  <i className="fab fa-weibo text-danger text-xl"></i>
                  <span className="text-sm text-text-primary">微博</span>
                </div>
                
                <div 
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => handleShareOption('复制链接')}
                >
                  <i className="fas fa-link text-text-secondary text-xl"></i>
                  <span className="text-sm text-text-primary">复制链接</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;

