

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { getParentCourses } from '../../utils/api/courseApi';
import Header from '../../components/Header'; // 导入共享Header组件

interface PersonalInfo {
  fullName: string;
}

interface Course {
  course_id: string;
  name: string;
  teacherId: string; // 对应数据库teacher_id
  teacher: string;
  rating: number;
  type: string;
  ageGroup: string; // 对应数据库age_range
  time: string;
  location: string;
  capacity: string;
  neighborhoodId: string; // 对应数据库neighborhood_id
  matching_degree?: number; // 匹配度（百分比）
}

interface FilterOptions {
  courseTypes: string[];
  ageGroups: string[];
  communities: string[];
}

const CourseListPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 页面状态
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  // 筛选下拉菜单状态
  const [showCourseTypeDropdown, setShowCourseTypeDropdown] = useState(false);
  const [showAgeGroupDropdown, setShowAgeGroupDropdown] = useState(false);
  const [showCommunityDropdown, setShowCommunityDropdown] = useState(false);
  
  // 筛选选项状态 - 默认不选择任何筛选条件
  const [selectedFilters, setSelectedFilters] = useState<FilterOptions>({
    courseTypes: [],
    ageGroups: [],
    communities: []
  });

  // 用户信息状态
  const [personalInfo, _setPersonalInfo] = useState<PersonalInfo>({
    fullName: ''
  });
  
  // 课程数据状态
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 从API获取课程数据
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        console.log('开始获取课程数据...');
        
        // 从localStorage获取家长ID（假设已登录并存储）
        const userInfoStr = localStorage.getItem('userInfo');
        const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};
        const parentId = userInfo.id || 'p1'; // 默认使用p1作为家长ID
        
        // 使用新的getParentCourses函数获取包含匹配度的课程列表
        const data = await getParentCourses(parentId);
        
        console.log('原始API响应:', data);
        
        // 确保data是数组
        const coursesArray = Array.isArray(data) ? data : [];
        
        // 转换后端数据结构以适应前端界面
        const formattedCourses = coursesArray.map((course: any) => ({
          course_id: course.course_id || course.id || '未知ID',
          name: course.name || course.course_name || '未知课程',
          teacherId: course.teacher_id || course.teacherId || '',
          teacher: course.teacher || course.teacher_name || '未知老师',
          rating: course.rating || course.teacher_rating || 0,
          type: course.type || '未知类型',
          ageGroup: course.age_range || course.ageGroup || '未知年龄',
          time: `${course.schedule || ''} ${course.start_time || ''}-${course.end_time || ''}` || '未知时间',
          location: course.location || '未知地点',
          capacity: course.capacity || '0',
          neighborhoodId: course.neighborhood_id || course.neighborhoodId || '',
          matching_degree: course.matching_degree || 0 // 匹配度字段
        }));
        console.log('格式化后的课程数据:', formattedCourses);
        setCourses(formattedCourses);
      } catch (err) {
        console.error('获取课程数据失败:', err);
        setError('获取课程数据失败，请稍后重试');
        // 后端无数据或请求失败时使用空数组
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '课程中心 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  // 筛选和搜索逻辑
  const filteredCourses = React.useMemo(() => {
    let filtered = [...courses];
    
    // 如果没有数据，返回空数组
    if (filtered.length === 0) return [];

    // 应用搜索
    if (courseSearchTerm) {
      filtered = filtered.filter(course => 
        course.name.toLowerCase().includes(courseSearchTerm.toLowerCase())
      );
    }
    
    // 应用全局搜索（搜索课程名称和教师姓名）
    if (globalSearchTerm) {
      filtered = filtered.filter(course => 
        course.name.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
        course.teacher.toLowerCase().includes(globalSearchTerm.toLowerCase())
      );
    }

    // 应用筛选
    filtered = filtered.filter(course => {
      const matchesType = selectedFilters.courseTypes.length === 0 || 
                        (course.type === '学科类' && selectedFilters.courseTypes.includes('subject')) ||
                        (course.type === '兴趣类' && selectedFilters.courseTypes.includes('interest')) ||
                        (course.type === '体育类' && selectedFilters.courseTypes.includes('sports')) ||
                        (course.type === '艺术类' && selectedFilters.courseTypes.includes('art')) ||
                        (course.type === '科技类' && selectedFilters.courseTypes.includes('tech'));
      
      const matchesAge = selectedFilters.ageGroups.length === 0 || selectedFilters.ageGroups.includes(course.ageGroup);
      
      // 社区匹配根据后端neighborhood_id进行映射
      const matchesCommunity = selectedFilters.communities.length === 0 || 
                              (course.neighborhoodId === 'n1' && selectedFilters.communities.includes('sunny')) ||
                              (course.neighborhoodId === 'n2' && selectedFilters.communities.includes('oasis')) ||
                              (course.neighborhoodId === 'n3' && selectedFilters.communities.includes('wisdom')) ||
                              (course.neighborhoodId === 'n4' && selectedFilters.communities.includes('garden'));

      return matchesType && matchesAge && matchesCommunity;
    });

    // 应用排序
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue = a[sortField as keyof Course];
        let bValue = b[sortField as keyof Course];

        if (sortField === 'time') {
          aValue = new Date((aValue as string).split(' ')[0]).getTime();
          bValue = new Date((bValue as string).split(' ')[0]).getTime();
        }

        if (sortDirection === 'asc') {
          return aValue === undefined ? 1 : (bValue === undefined ? -1 : (aValue > bValue ? 1 : -1));
        } else {
          return aValue === undefined ? 1 : (bValue === undefined ? -1 : (aValue < bValue ? 1 : -1));
        }
      });
    } else {
      // 默认按匹配度降序排列
      filtered.sort((a, b) => (b.matching_degree || 0) - (a.matching_degree || 0));
    }

    return filtered;
  }, [courseSearchTerm, globalSearchTerm, selectedFilters, sortField, sortDirection]);

  // 分页逻辑
  const totalPages = Math.ceil(filteredCourses.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageCourses = filteredCourses.slice(startIndex, endIndex);

  // 事件处理函数
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleOverlayClick = () => {
    setIsSidebarOpen(false);
  };

  const handleCourseTypeFilterToggle = () => {
    setShowCourseTypeDropdown(!showCourseTypeDropdown);
    setShowAgeGroupDropdown(false);
    setShowCommunityDropdown(false);
  };

  const handleAgeGroupFilterToggle = () => {
    setShowAgeGroupDropdown(!showAgeGroupDropdown);
    setShowCourseTypeDropdown(false);
    setShowCommunityDropdown(false);
  };

  const handleCommunityFilterToggle = () => {
    setShowCommunityDropdown(!showCommunityDropdown);
    setShowCourseTypeDropdown(false);
    setShowAgeGroupDropdown(false);
  };

  const handleCourseTypeChange = (value: string, checked: boolean) => {
    setSelectedFilters(prev => ({
      ...prev,
      courseTypes: checked 
        ? [...prev.courseTypes, value]
        : prev.courseTypes.filter(type => type !== value)
    }));
  };

  const handleAgeGroupChange = (value: string, checked: boolean) => {
    setSelectedFilters(prev => ({
      ...prev,
      ageGroups: checked 
        ? [...prev.ageGroups, value]
        : prev.ageGroups.filter(age => age !== value)
    }));
  };

  const handleCommunityChange = (value: string, checked: boolean) => {
    setSelectedFilters(prev => ({
      ...prev,
      communities: checked 
        ? [...prev.communities, value]
        : prev.communities.filter(community => community !== value)
    }));
  };

  const handleFilterApply = () => {
    setCurrentPage(1);
    setShowCourseTypeDropdown(false);
    setShowAgeGroupDropdown(false);
    setShowCommunityDropdown(false);
  };

  const handleFilterReset = () => {
    setCourseSearchTerm('');
    setSelectedFilters({
      courseTypes: [],
      ageGroups: [],
      communities: []
    });
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCourseDetailClick = (courseId: string) => {
    navigate(`/course-detail?courseId=${courseId}`);
  };

  // 用户菜单处理
  const handleUserMenuToggle = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleUserLogout = () => {
    // 清除localStorage中的用户信息
    localStorage.removeItem('userInfo');
    // 跳转到登录页面
    navigate('/login-register');
  };

  const handleEnrollClick = (courseId: string) => {
    console.log('打开支付确认弹窗，课程ID:', courseId);
    alert('跳转到支付确认页面');
  };

  const handleGlobalSearch = (value: string) => {
    setGlobalSearchTerm(value);
    // 这里可以实现全局搜索逻辑
  };

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('#course-type-filter') && !target.closest('#course-type-dropdown')) {
        setShowCourseTypeDropdown(false);
      }
      if (!target.closest('#age-group-filter') && !target.closest('#age-group-dropdown')) {
        setShowAgeGroupDropdown(false);
      }
      if (!target.closest('#community-filter') && !target.closest('#community-dropdown')) {
        setShowCommunityDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // 获取类型颜色样式
  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      '学科类': 'bg-primary/10 text-primary',
      '兴趣类': 'bg-secondary/10 text-secondary',
      '体育类': 'bg-success/10 text-success',
      '艺术类': 'bg-warning/10 text-warning',
      '科技类': 'bg-info/10 text-info'
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  // 生成页码
  const renderPageNumbers = () => {
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
            onClick={() => handlePageChange(i)}
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
      {/* 顶部导航栏 - 使用共享Header组件 */}
      <Header 
        userRole="parent" 
        userName={personalInfo?.fullName || '家长'} 
        userAvatar="https://s.coze.cn/image/OUgZ3szV3ss/" 
        onSidebarToggle={handleSidebarToggle}
      />

      {/* 左侧菜单 */}
      <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-border-light z-40 transform lg:transform-none transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
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
            to="/parent-center/teen-info-manage" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-child w-5"></i>
            <span>孩子管理</span>
          </Link>
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-6">
          {/* 页面头部 */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">课程中心</h2>
                <nav className="text-sm text-text-secondary">
                  <span>首页</span>
                  <i className="fas fa-chevron-right mx-2"></i>
                  <span className="text-primary">课程中心</span>
                </nav>
              </div>
              <div className="text-sm text-text-secondary">
                共找到 <span className="font-semibold text-text-primary">{filteredCourses.length}</span> 门课程
              </div>
            </div>
          </div>

          {/* 筛选工具栏 */}
          <div className="bg-white rounded-xl shadow-card p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* 搜索框 */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="搜索课程名称..." 
                    value={courseSearchTerm}
                    onChange={(e) => setCourseSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm"></i>
                </div>
              </div>

              {/* 筛选条件 */}
              <div className="flex flex-wrap items-center gap-4">
                {/* 课程类型 */}
                <div className="relative">
                  <button 
                    id="course-type-filter"
                    onClick={handleCourseTypeFilterToggle}
                    className="flex items-center space-x-2 px-4 py-2 border border-border-light rounded-lg text-sm hover:bg-gray-50"
                  >
                    <span>课程类型</span>
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                  <div 
                    id="course-type-dropdown"
                    className={`${styles.filterDropdown} ${showCourseTypeDropdown ? styles.show : ''} absolute top-full left-0 mt-1 w-48 bg-white border border-border-light rounded-lg shadow-lg z-10`}
                  >
                    <div className="p-2">
                      <label className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.courseTypes.includes('subject')}
                          onChange={(e) => handleCourseTypeChange('subject', e.target.checked)}
                        />
                        <span className="text-sm">学科类</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.courseTypes.includes('interest')}
                          onChange={(e) => handleCourseTypeChange('interest', e.target.checked)}
                        />
                        <span className="text-sm">兴趣类</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.courseTypes.includes('sports')}
                          onChange={(e) => handleCourseTypeChange('sports', e.target.checked)}
                        />
                        <span className="text-sm">体育类</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.courseTypes.includes('art')}
                          onChange={(e) => handleCourseTypeChange('art', e.target.checked)}
                        />
                        <span className="text-sm">艺术类</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.courseTypes.includes('tech')}
                          onChange={(e) => handleCourseTypeChange('tech', e.target.checked)}
                        />
                        <span className="text-sm">科技类</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 适合年龄段 */}
                <div className="relative">
                  <button 
                    id="age-group-filter"
                    onClick={handleAgeGroupFilterToggle}
                    className="flex items-center space-x-2 px-4 py-2 border border-border-light rounded-lg text-sm hover:bg-gray-50"
                  >
                    <span>适合年龄</span>
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                  <div 
                    id="age-group-dropdown"
                    className={`${styles.filterDropdown} ${showAgeGroupDropdown ? styles.show : ''} absolute top-full left-0 mt-1 w-48 bg-white border border-border-light rounded-lg shadow-lg z-10`}
                  >
                    <div className="p-2">
                      <label className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.ageGroups.includes('4-6')}
                          onChange={(e) => handleAgeGroupChange('4-6', e.target.checked)}
                        />
                        <span className="text-sm">4-6岁</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.ageGroups.includes('7-10')}
                          onChange={(e) => handleAgeGroupChange('7-10', e.target.checked)}
                        />
                        <span className="text-sm">7-10岁</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.ageGroups.includes('11-14')}
                          onChange={(e) => handleAgeGroupChange('11-14', e.target.checked)}
                        />
                        <span className="text-sm">11-14岁</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.ageGroups.includes('15-18')}
                          onChange={(e) => handleAgeGroupChange('15-18', e.target.checked)}
                        />
                        <span className="text-sm">15-18岁</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 社区位置 */}
                <div className="relative">
                  <button 
                    id="community-filter"
                    onClick={handleCommunityFilterToggle}
                    className="flex items-center space-x-2 px-4 py-2 border border-border-light rounded-lg text-sm hover:bg-gray-50"
                  >
                    <span>社区位置</span>
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                  <div 
                    id="community-dropdown"
                    className={`${styles.filterDropdown} ${showCommunityDropdown ? styles.show : ''} absolute top-full left-0 mt-1 w-48 bg-white border border-border-light rounded-lg shadow-lg z-10`}
                  >
                    <div className="p-2">
                      <label className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.communities.includes('sunny')}
                          onChange={(e) => handleCommunityChange('sunny', e.target.checked)}
                        />
                        <span className="text-sm">阳光社区</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.communities.includes('oasis')}
                          onChange={(e) => handleCommunityChange('oasis', e.target.checked)}
                        />
                        <span className="text-sm">绿洲社区</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.communities.includes('wisdom')}
                          onChange={(e) => handleCommunityChange('wisdom', e.target.checked)}
                        />
                        <span className="text-sm">智慧社区</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.communities.includes('garden')}
                          onChange={(e) => handleCommunityChange('garden', e.target.checked)}
                        />
                        <span className="text-sm">花园社区</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex space-x-3">
                  <button 
                    onClick={handleFilterApply}
                    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                  >
                    筛选
                  </button>
                  <button 
                    onClick={handleFilterReset}
                    className="px-4 py-2 border border-border-light text-text-secondary text-sm font-medium rounded-lg hover:bg-gray-50"
                  >
                    重置
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 课程列表 */}
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            {/* 表格头部 */}
            <div className="px-6 py-4 border-b border-border-light">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">课程列表</h3>
                <div className="text-sm text-text-secondary">
                  显示第 <span className="font-semibold">{Math.min(startIndex + 1, filteredCourses.length)}-{Math.min(endIndex, filteredCourses.length)}</span> 条，共 <span className="font-semibold">{filteredCourses.length}</span> 条
                </div>
              </div>
            </div>

            {/* 表格内容 */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      课程ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      <button 
                        className={`${styles.sortable} flex items-center space-x-1 ${sortField === 'name' ? styles.sortActive : ''}`}
                        onClick={() => handleSort('name')}
                      >
                        <span>课程名称</span>
                        <i className={`fas ${sortField === 'name' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'} ${styles.sortIcon}`}></i>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      <button 
                        className={`${styles.sortable} flex items-center space-x-1 ${sortField === 'teacher' ? styles.sortActive : ''}`}
                        onClick={() => handleSort('teacher')}
                      >
                        <span>教师</span>
                        <i className={`fas ${sortField === 'teacher' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'} ${styles.sortIcon}`}></i>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      <button 
                        className={`${styles.sortable} flex items-center space-x-1 ${sortField === 'type' ? styles.sortActive : ''}`}
                        onClick={() => handleSort('type')}
                      >
                        <span>类型</span>
                        <i className={`fas ${sortField === 'type' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'} ${styles.sortIcon}`}></i>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      <button 
                        className={`${styles.sortable} flex items-center space-x-1 ${sortField === 'ageGroup' ? styles.sortActive : ''}`}
                        onClick={() => handleSort('ageGroup')}
                      >
                        <span>适合年龄</span>
                        <i className={`fas ${sortField === 'ageGroup' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'} ${styles.sortIcon}`}></i>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      <button 
                        className={`${styles.sortable} flex items-center space-x-1 ${sortField === 'time' ? styles.sortActive : ''}`}
                        onClick={() => handleSort('time')}
                      >
                        <span>上课时间</span>
                        <i className={`fas ${sortField === 'time' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'} ${styles.sortIcon}`}></i>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">地点</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">容量</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      <button 
                        className={`${styles.sortable} flex items-center space-x-1 ${sortField === 'matching_degree' ? styles.sortActive : ''}`}
                        onClick={() => handleSort('matching_degree')}
                      >
                        <span>匹配度</span>
                        <i className={`fas ${sortField === 'matching_degree' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'} ${styles.sortIcon}`}></i>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border-light">
                  {/* 加载状态 */}
                  {loading && (
                    <tr>
                      <td colSpan={8} className="px-6 py-10 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                          <span className="text-text-secondary">加载中...</span>
                        </div>
                      </td>
                    </tr>
                  )}
                  
                  {/* 错误状态 */}
                  {!loading && error && (
                    <tr>
                      <td colSpan={8} className="px-6 py-10 text-center">
                        <div className="text-danger">{error}</div>
                      </td>
                    </tr>
                  )}
                  
                  {/* 数据为空 */}
                  {!loading && !error && currentPageCourses.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-10 text-center">
                        <div className="text-text-secondary">暂无课程数据</div>
                      </td>
                    </tr>
                  )}
                  
                  {/* 课程列表 */}
                  {!loading && !error && currentPageCourses.map((course) => (
                    <tr key={course.course_id} className={styles.tableRow}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {course.course_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          className="text-primary hover:text-primary/80 font-medium"
                          onClick={() => handleCourseDetailClick(course.course_id)}
                        >
                          {course.name}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-text-primary">{course.teacher}</span>
                          <span className="text-xs text-text-secondary">{course.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(course.type)}`}>
                          {course.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{course.ageGroup}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{course.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{course.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{course.capacity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-success h-2 rounded-full" 
                              style={{ width: `${course.matching_degree || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-text-primary font-medium">
                            {course.matching_degree || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button 
                          className="text-primary hover:text-primary/80"
                          onClick={() => handleCourseDetailClick(course.course_id)}
                        >
                          查看详情
                        </button>
                        <button 
                          className="text-success hover:text-success/80"
                          onClick={() => handleEnrollClick(course.course_id)}
                        >
                          报名
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 分页 */}
            <div className="px-6 py-4 border-t border-border-light">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-text-secondary">每页显示</span>
                  <select 
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                    className="border border-border-light rounded px-2 py-1 text-sm"
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  <span className="text-sm text-text-secondary">条</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-border-light rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <div className="flex space-x-1">
                    {renderPageNumbers()}
                  </div>
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
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
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={handleOverlayClick}
        ></div>
      )}
    </div>
  );
};

export default CourseListPage;

