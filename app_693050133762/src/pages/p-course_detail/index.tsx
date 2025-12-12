

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

const CourseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState('child1');
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '数学思维训练 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  // 获取URL参数
  useEffect(() => {
    const courseId = searchParams.get('courseId');
    if (courseId) {
      console.log('加载课程ID:', courseId);
      // 在实际应用中，这里会调用API获取课程数据
    }
  }, [searchParams]);

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
  const handleEnroll = () => {
    console.log('选择的子女:', selectedChild);
    navigate(`/payment-confirm?courseId=course1&childId=${selectedChild}`);
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
                onKeyPress={handleGlobalSearch}
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
            to="/my-courses" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-user-graduate w-5"></i>
            <span>我的课程</span>
          </Link>
          <Link 
            to="/match-result" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-magic w-5"></i>
            <span>匹配结果</span>
          </Link>
          <Link 
            to="/course-calendar" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-calendar-alt w-5"></i>
            <span>课程日历</span>
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
                <li className="text-text-primary">数学思维训练</li>
              </ol>
            </nav>
            
            {/* 课程标题和分享 */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">数学思维训练</h1>
                <div className="flex items-center space-x-4 text-sm text-text-secondary">
                  <span><i className="fas fa-clock mr-1"></i>每周六 14:00-16:00</span>
                  <span><i className="fas fa-map-marker-alt mr-1"></i>阳光社区活动中心</span>
                  <span><i className="fas fa-users mr-1"></i>8/12人</span>
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
                    alt="数学思维训练课程" 
                    className="w-full h-80 object-cover"
                  />
                </div>

                {/* 课程描述 */}
                <div className="bg-white rounded-xl shadow-card p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">课程介绍</h3>
                  <div className="space-y-4 text-text-secondary">
                    <p>本课程专为7-10岁儿童设计，通过趣味游戏和互动练习，培养孩子的数学思维能力和逻辑推理能力。课程采用启发式教学方法，让孩子在轻松愉快的氛围中学习数学。</p>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-text-primary mb-2">教学目标：</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• 培养数学思维和逻辑推理能力</li>
                        <li>• 提高解决问题的能力</li>
                        <li>• 建立数学学习的兴趣</li>
                        <li>• 掌握基础的数学概念</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-text-primary mb-2">课程大纲：</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• 第1-2周：数字认知与基础运算</li>
                        <li>• 第3-4周：几何图形与空间想象</li>
                        <li>• 第5-6周：逻辑推理与问题解决</li>
                        <li>• 第7-8周：综合应用与思维训练</li>
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
                      alt="李老师头像" 
                      className={`w-16 h-16 rounded-full ${styles.teacherAvatar} cursor-pointer`}
                      onClick={() => handleTeacherDetail('teacher1')}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 
                          className="font-medium text-text-primary cursor-pointer hover:text-primary"
                          onClick={() => handleTeacherDetail('teacher1')}
                        >
                          李老师
                        </h4>
                        <div className="flex items-center space-x-1">
                          <i className={`fas fa-star ${styles.starRating} text-sm`}></i>
                          <span className="text-sm text-text-secondary">4.9</span>
                        </div>
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">高级教师</span>
                      </div>
                      <p className="text-sm text-text-secondary mb-3">
                        10年小学数学教学经验，擅长启发式教学，曾获市级优秀教师称号。专注于儿童数学思维培养，教学风格生动有趣，深受学生和家长喜爱。
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-gray-100 text-text-secondary text-xs rounded-full">数学思维</span>
                        <span className="px-2 py-1 bg-gray-100 text-text-secondary text-xs rounded-full">逻辑推理</span>
                        <span className="px-2 py-1 bg-gray-100 text-text-secondary text-xs rounded-full">趣味教学</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 课程评价 */}
                <div className="bg-white rounded-xl shadow-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">课程评价</h3>
                    <Link 
                      to="/admin-evaluation-manage?courseId=course1" 
                      className="text-primary hover:text-primary/80 text-sm"
                    >
                      查看更多评价
                    </Link>
                  </div>
                  
                  {/* 评价统计 */}
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-text-primary">4.9</div>
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <i className={`fas fa-star ${styles.starRating} text-sm`}></i>
                        <i className={`fas fa-star ${styles.starRating} text-sm`}></i>
                        <i className={`fas fa-star ${styles.starRating} text-sm`}></i>
                        <i className={`fas fa-star ${styles.starRating} text-sm`}></i>
                        <i className={`fas fa-star ${styles.starRating} text-sm`}></i>
                      </div>
                      <div className="text-sm text-text-secondary">共126条评价</div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-text-secondary w-8">5星</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className={`bg-yellow-400 h-2 rounded-full`} style={{width: '85%'}}></div>
                        </div>
                        <span className="text-sm text-text-secondary">85%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-text-secondary w-8">4星</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className={`bg-yellow-400 h-2 rounded-full`} style={{width: '12%'}}></div>
                        </div>
                        <span className="text-sm text-text-secondary">12%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-text-secondary w-8">3星</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className={`bg-yellow-400 h-2 rounded-full`} style={{width: '3%'}}></div>
                        </div>
                        <span className="text-sm text-text-secondary">3%</span>
                      </div>
                    </div>
                  </div>

                  {/* 评价列表 */}
                  <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-start space-x-3">
                        <img 
                          src="https://s.coze.cn/image/5TXM3Pp7hVA/" 
                          alt="评价者头像" 
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-text-primary">王家长</span>
                            <div className="flex items-center space-x-1">
                              <i className={`fas fa-star ${styles.starRating} text-xs`}></i>
                              <span className="text-xs text-text-secondary">5.0</span>
                            </div>
                            <span className="text-xs text-text-secondary">2024-01-15</span>
                          </div>
                          <p className="text-sm text-text-secondary">李老师教学很有耐心，孩子很喜欢上她的课。数学思维有明显提升，推荐！</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-start space-x-3">
                        <img 
                          src="https://s.coze.cn/image/9N_eBuhkU6w/" 
                          alt="评价者头像" 
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-text-primary">刘家长</span>
                            <div className="flex items-center space-x-1">
                              <i className={`fas fa-star ${styles.starRating} text-xs`}></i>
                              <span className="text-xs text-text-secondary">4.8</span>
                            </div>
                            <span className="text-xs text-text-secondary">2024-01-12</span>
                          </div>
                          <p className="text-sm text-text-secondary">课程内容很丰富，老师很专业。孩子对数学的兴趣明显提高了。</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-start space-x-3">
                        <img 
                          src="https://s.coze.cn/image/ht0p6IvSNts/" 
                          alt="评价者头像" 
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-text-primary">张家长</span>
                            <div className="flex items-center space-x-1">
                              <i className={`fas fa-star ${styles.starRating} text-xs`}></i>
                              <span className="text-xs text-text-secondary">5.0</span>
                            </div>
                            <span className="text-xs text-text-secondary">2024-01-10</span>
                          </div>
                          <p className="text-sm text-text-secondary">非常好的课程，老师很负责任，孩子收获很大。</p>
                        </div>
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
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">课程类型</span>
                        <span className="text-sm text-text-primary">学科类</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">适合年龄</span>
                        <span className="text-sm text-text-primary">7-10岁</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">课时时长</span>
                        <span className="text-sm text-text-primary">2小时</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">上课地点</span>
                        <span className="text-sm text-text-primary">阳光社区</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">剩余名额</span>
                        <span className="text-sm text-warning font-medium">4/12人</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 子女选择 */}
                <div className="bg-white rounded-xl shadow-card p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">选择子女</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input 
                        type="radio" 
                        name="child" 
                        value="child1" 
                        checked={selectedChild === 'child1'}
                        onChange={(e) => setSelectedChild(e.target.value)}
                        className="text-primary focus:ring-primary" 
                      />
                      <div className="flex items-center space-x-3 flex-1">
                        <img 
                          src="https://s.coze.cn/image/jWZUugtXliM/" 
                          alt="小明头像" 
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="text-sm font-medium text-text-primary">小明</div>
                          <div className="text-xs text-text-secondary">8岁，适合该课程</div>
                        </div>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input 
                        type="radio" 
                        name="child" 
                        value="child2" 
                        checked={selectedChild === 'child2'}
                        onChange={(e) => setSelectedChild(e.target.value)}
                        className="text-primary focus:ring-primary"
                      />
                      <div className="flex items-center space-x-3 flex-1">
                        <img 
                          src="https://s.coze.cn/image/Td3nD0d70SA/" 
                          alt="小红头像" 
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="text-sm font-medium text-text-primary">小红</div>
                          <div className="text-xs text-text-secondary">6岁，年龄偏小</div>
                        </div>
                      </div>
                    </label>
                  </div>
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

