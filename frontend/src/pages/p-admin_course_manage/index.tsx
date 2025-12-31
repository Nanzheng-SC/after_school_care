import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './styles.module.css';
import request from '../../utils/request';

interface Course {
  course_id: string;
  name: string;
  teacher: string;
  teacher_id: string;
  type: string;
  age_range: string;
  schedule: string;
  neighborhood: string;
  neighborhood_id: string;
  capacity: string;
  status: 'pending' | 'published' | 'offline';
}

interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

const AdminCourseManage: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [currentSort, setCurrentSort] = useState<SortConfig>({ field: '', direction: 'asc' });
  const [currentCourseId, setCurrentCourseId] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [courseToOffline, setCourseToOffline] = useState('');
  const [reviewResult, setReviewResult] = useState('approve');
  const [rejectReason, setRejectReason] = useState('');
  const [_loading, setLoading] = useState(true);
  const [_error, setError] = useState('');

  // 从API获取课程数据
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        console.log('开始获取管理员课程数据...');
        
        // 调用获取所有课程的API
        const coursesResponse = await request.get('/api/course');
        const coursesData = coursesResponse.data || [];
        
        // 调用获取所有教师的API
        const teachersResponse = await request.get('/api/admin/teachers');
        const teachersData = teachersResponse.data || [];
        
        // 调用获取所有社区的API
        const neighborhoodsResponse = await request.get('/api/admin/neighborhood');
        const neighborhoodsData = neighborhoodsResponse.data || [];
        
        console.log('课程数据:', coursesData);
        console.log('教师数据:', teachersData);
        console.log('社区数据:', neighborhoodsData);
        
        // 创建教师和社区的映射表
        const teachersMap = new Map(teachersData.map((teacher: any) => [teacher.teacher_id, teacher.name]));
        const neighborhoodsMap = new Map(neighborhoodsData.map((neighborhood: any) => [neighborhood.neighborhood_id, neighborhood.name]));
        
        // 转换后端数据结构以适应前端界面
        const formattedCourses = coursesData.map((course: any) => ({
          course_id: course.course_id || `C${Date.now()}`,
          name: course.name || '未知课程',
          teacher: teachersMap.get(course.teacher_id) || '未知老师',
          teacher_id: course.teacher_id || '',
          type: course.type || '未知类型',
          age_range: course.age_range || '未知年龄',
          schedule: course.schedule || '未知时间',
          neighborhood: neighborhoodsMap.get(course.neighborhood_id) || '未知社区',
          neighborhood_id: course.neighborhood_id || '',
          capacity: '0/0', // 后端模型中没有capacity字段，暂时使用默认值
          status: course.status || 'pending'
        }));
        
        console.log('格式化后的课程数据:', formattedCourses);
        setCourses(formattedCourses);
        
      } catch (err) {
        console.error('获取课程数据失败:', err);
        setError('获取课程数据失败，请稍后重试');
        
        // 后端无数据时使用SQL数据转换的虚拟数据（保持与后端数据结构一致）
        const mockCourses: Course[] = [
          {
            course_id: 'C001',
            name: '数学启蒙',
            teacher: '王老师',
            teacher_id: 'T001',
            type: '学科类',
            age_range: '9-12',
            schedule: '周一,周三',
            neighborhood: '社区A',
            neighborhood_id: 'N001',
            capacity: '0/0',
            status: 'published'
          },
          {
            course_id: 'C002',
            name: '英语口语',
            teacher: '李老师',
            teacher_id: 'T002',
            type: '学科类',
            age_range: '9-12',
            schedule: '周二,周四',
            neighborhood: '社区B',
            neighborhood_id: 'N002',
            capacity: '0/0',
            status: 'published'
          },
          {
            course_id: 'C003',
            name: '音乐欣赏',
            teacher: '张老师',
            teacher_id: 'T003',
            type: '兴趣类',
            age_range: '9-12',
            schedule: '周一,周四',
            neighborhood: '社区C',
            neighborhood_id: 'N003',
            capacity: '0/0',
            status: 'published'
          },
          {
            course_id: 'C004',
            name: '舞蹈基础',
            teacher: '赵老师',
            teacher_id: 'T004',
            type: '兴趣类',
            age_range: '9-12',
            schedule: '周三,周五',
            neighborhood: '社区D',
            neighborhood_id: 'N004',
            capacity: '0/0',
            status: 'published'
          },
          {
            course_id: 'C005',
            name: '编程入门',
            teacher: '孙老师',
            teacher_id: 'T005',
            type: '学科类',
            age_range: '10-12',
            schedule: '周二,周五',
            neighborhood: '社区E',
            neighborhood_id: 'N005',
            capacity: '0/0',
            status: 'published'
          },
          {
            course_id: 'C006',
            name: '科学实验',
            teacher: '周老师',
            teacher_id: 'T006',
            type: '兴趣类',
            age_range: '9-12',
            schedule: '周一,周三',
            neighborhood: '社区F',
            neighborhood_id: 'N006',
            capacity: '0/0',
            status: 'published'
          },
          {
            course_id: 'C007',
            name: '绘画创作',
            teacher: '吴老师',
            teacher_id: 'T007',
            type: '兴趣类',
            age_range: '9-12',
            schedule: '周二,周四',
            neighborhood: '社区G',
            neighborhood_id: 'N007',
            capacity: '0/0',
            status: 'published'
          },
          {
            course_id: 'C008',
            name: '国际象棋',
            teacher: '郑老师',
            teacher_id: 'T008',
            type: '兴趣类',
            age_range: '9-12',
            schedule: '周三,周五',
            neighborhood: '社区H',
            neighborhood_id: 'N008',
            capacity: '0/0',
            status: 'published'
          },
          {
            course_id: 'C009',
            name: '足球训练',
            teacher: '冯老师',
            teacher_id: 'T009',
            type: '兴趣类',
            age_range: '9-12',
            schedule: '周一,周四',
            neighborhood: '社区I',
            neighborhood_id: 'N009',
            capacity: '0/0',
            status: 'published'
          },
          {
            course_id: 'C010',
            name: '英语阅读',
            teacher: '陈老师',
            teacher_id: 'T010',
            type: '学科类',
            age_range: '9-12',
            schedule: '周二,周五',
            neighborhood: '社区J',
            neighborhood_id: 'N010',
            capacity: '0/0',
            status: 'published'
          }
        ];
        console.log('使用虚拟课程数据:', mockCourses);
        setCourses(mockCourses);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // 搜索和筛选状态
  const [courseSearch, setCourseSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '课程管理 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  // 初始化和筛选逻辑
  useEffect(() => {
    applyFilters();
  }, [courses, currentSort, courseSearch, statusFilter, typeFilter, ageFilter]);

  const applyFilters = () => {
    const filtered = courses.filter(course => {
      const matchesSearch = course.name.toLowerCase().includes(courseSearch.toLowerCase()) || 
                          course.teacher.toLowerCase().includes(courseSearch.toLowerCase());
      const matchesStatus = !statusFilter || course.status === statusFilter;
      const matchesType = !typeFilter || course.type === typeFilter;
      const matchesAge = !ageFilter || course.age_range === ageFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesAge;
    });

    // 排序
    if (currentSort.field) {
      filtered.sort((a, b) => {
        let aValue: string | Date = a[currentSort.field as keyof Course];
        let bValue: string | Date = b[currentSort.field as keyof Course];
        
        if (currentSort.field === 'schedule') {
          aValue = new Date(a.schedule);
          bValue = new Date(b.schedule);
        }
        
        if (aValue < bValue) return currentSort.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return currentSort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredCourses(filtered);
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    const direction = currentSort.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc';
    setCurrentSort({ field, direction });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleReset = () => {
    setCourseSearch('');
    setStatusFilter('');
    setTypeFilter('');
    setAgeFilter('');
  };

  const reviewCourse = (courseId: string) => {
    setCurrentCourseId(courseId);
    setShowReviewModal(true);
    setReviewResult('approve');
    setRejectReason('');
  };

  const editCourse = (courseId: string) => {
    navigate(`/course-publish?courseId=${courseId}`);
  };

  const offlineCourse = (courseId: string, courseName: string) => {
    setCurrentCourseId(courseId);
    setCourseToOffline(courseName);
    setShowOfflineModal(true);
  };

  const viewCourseDetail = (courseId: string) => {
    navigate(`/course-detail?courseId=${courseId}`);
  };

  const viewTeacherDetail = (teacherId: string) => {
    alert(`查看教师详情: ${teacherId}`);
  };

  const confirmReview = () => {
    // 模拟审核操作
    const updatedCourses = courses.map(course => {
      if (course.course_id === currentCourseId) {
        return {
          ...course,
          status: (reviewResult === 'approve' ? 'published' : 'offline') as 'pending' | 'published' | 'offline'
        };
      }
      return course;
    });

    // 更新本地状态（实际应用中会调用API）
    setCourses(updatedCourses);
    console.log('审核结果:', reviewResult, '原因:', rejectReason);
    setShowReviewModal(false);
    alert('审核完成');
  };

  const confirmOffline = async () => {
    try {
      setLoading(true);
      // 调用后端DELETE API删除课程
      await request.delete(`/api/admin/course/${currentCourseId}`);
      
      // 更新本地状态
      const updatedCourses = courses.filter(course => course.course_id !== currentCourseId);
      setCourses(updatedCourses);
      
      // 立即刷新筛选结果
      const updatedFilteredCourses = updatedCourses.filter(course => {
        const matchesSearch = course.name.toLowerCase().includes(courseSearch.toLowerCase()) || 
                            course.teacher.toLowerCase().includes(courseSearch.toLowerCase());
        const matchesStatus = !statusFilter || course.status === statusFilter;
        const matchesType = !typeFilter || course.type === typeFilter;
        const matchesAge = !ageFilter || course.age_range === ageFilter;
        
        return matchesSearch && matchesStatus && matchesType && matchesAge;
      });
      
      // 应用排序
      if (currentSort.field) {
        updatedFilteredCourses.sort((a, b) => {
          let aValue: string | Date = a[currentSort.field as keyof Course];
          let bValue: string | Date = b[currentSort.field as keyof Course];
          
          if (currentSort.field === 'schedule') {
            aValue = new Date(a.schedule);
            bValue = new Date(b.schedule);
          }
          
          if (aValue < bValue) return currentSort.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return currentSort.direction === 'asc' ? 1 : -1;
          return 0;
        });
      }
      
      setFilteredCourses(updatedFilteredCourses);
      console.log('课程已删除:', currentCourseId);
      setShowOfflineModal(false);
      alert('课程已删除');
    } catch (error) {
      console.error('课程删除失败:', error);
      alert('课程删除失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      'pending': '待审核',
      'published': '已发布',
      'offline': '已下架'
    };
    return texts[status] || status;
  };

  const getActionButtons = (course: Course) => {
    const buttons = [];
    
    if (course.status === 'pending') {
      buttons.push(
        <button 
          key="review"
          onClick={() => reviewCourse(course.course_id)} 
          className="text-primary hover:text-primary/80"
        >
          审核
        </button>
      );
    }
    
    buttons.push(
      <button 
        key="edit"
        onClick={() => editCourse(course.course_id)} 
        className="text-secondary hover:text-secondary/80"
      >
        编辑
      </button>
    );
    
    if (course.status === 'published') {
      buttons.push(
        <button 
          key="offline"
          onClick={() => offlineCourse(course.course_id, course.name)} 
          className="text-danger hover:text-danger/80"
        >
          下架
        </button>
      );
    }
    
    buttons.push(
      <button 
        key="detail"
        onClick={() => viewCourseDetail(course.course_id)} 
        className="text-info hover:text-info/80"
      >
        详情
      </button>
    );
    
    return buttons;
  };

  const renderPagination = () => {
    const totalItems = filteredCourses.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 border rounded text-sm ${
              i === currentPage 
                ? 'bg-primary text-white border-primary' 
                : 'border-border-light text-text-secondary hover:bg-gray-50'
            }`}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push(
          <span key={`ellipsis-${i}`} className="px-2 text-text-secondary">
            ...
          </span>
        );
      }
    }

    return pages;
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);
  const totalItems = filteredCourses.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = totalItems > 0 ? startIndex + 1 : 0;
  const endItem = Math.min(endIndex, totalItems);

  return (
    <div className="p-6">
      {/* 页面头部 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">课程管理</h2>
            <nav className="text-sm text-text-secondary">
              <Link to="/admin-dashboard" className="hover:text-primary">首页</Link>
              <span className="mx-2">/</span>
              <span>课程管理</span>
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
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                placeholder="搜索课程名称或教师姓名..." 
                className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm"></i>
            </div>
            
            {/* 筛选条件 */}
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
            >
              <option value="">全部状态</option>
              <option value="pending">待审核</option>
              <option value="published">已发布</option>
              <option value="offline">已下架</option>
            </select>
            
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={`px-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
            >
              <option value="">全部类型</option>
              <option value="学科类">学科类</option>
              <option value="兴趣类">兴趣类</option>
              <option value="体育类">体育类</option>
              <option value="艺术类">艺术类</option>
              <option value="科技类">科技类</option>
            </select>
            
            <select 
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
              className={`px-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
            >
              <option value="">全部年龄</option>
              <option value="4-6">4-6岁</option>
              <option value="7-10">7-10岁</option>
              <option value="11-14">11-14岁</option>
              <option value="15-18">15-18岁</option>
            </select>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex space-x-3">
            <button 
              onClick={() => navigate('/course-publish')}
              className="px-4 py-2 bg-success text-white text-sm font-medium rounded-lg hover:bg-success/90"
            >
              <i className="fas fa-plus mr-2"></i>添加课程
            </button>
            <button 
              onClick={applyFilters}
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
            >
              <i className="fas fa-filter mr-2"></i>筛选
            </button>
            <button 
              onClick={handleReset}
              className="px-4 py-2 border border-border-light text-text-secondary text-sm font-medium rounded-lg hover:bg-gray-50"
            >
              <i className="fas fa-undo mr-2"></i>重置
            </button>
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
              共 <span>{totalItems}</span> 条记录
            </div>
          </div>
        </div>
        
        {/* 表格内容 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
                >
                  课程ID
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  课程名称 <i className="fas fa-sort ml-1"></i>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('teacher')}
                >
                  教师 <i className="fas fa-sort ml-1"></i>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('type')}
                >
                  类型 <i className="fas fa-sort ml-1"></i>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('age')}
                >
                  适合年龄 <i className="fas fa-sort ml-1"></i>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('time')}
                >
                  上课时间 <i className="fas fa-sort ml-1"></i>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  地点
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  容量
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  状态 <i className="fas fa-sort ml-1"></i>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border-light">
              {currentCourses.map(course => (
                <tr key={course.course_id} className={styles.tableRow}>
                  <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                    {course.course_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => viewCourseDetail(course.course_id)}
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      {course.name}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => viewTeacherDetail(course.teacher_id)}
                      className="text-text-primary hover:text-primary"
                    >
                      {course.teacher}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(course.type)}`}>
                      {course.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                    {course.age_range}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                    {course.schedule}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                    {course.neighborhood_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                    {course.capacity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[`status${course.status.charAt(0).toUpperCase() + course.status.slice(1)}`]}`}>
                      {getStatusText(course.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {getActionButtons(course)}
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
              显示第 <span>{startItem}</span> - <span>{endItem}</span> 条，共 <span>{totalItems}</span> 条
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-1 border border-border-light rounded text-sm text-text-secondary hover:bg-gray-50 disabled:opacity-50"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <div className="flex space-x-1">
                {renderPagination()}
              </div>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 border border-border-light rounded text-sm text-text-secondary hover:bg-gray-50 disabled:opacity-50"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 审核确认弹窗 */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalBackdrop}></div>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className={`bg-white rounded-xl shadow-xl max-w-md w-full ${styles.modalEnter}`}>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">课程审核</h3>
                <p className="text-text-secondary mb-6">请选择审核结果：</p>
              
                <div className="space-y-3 mb-6">
                  <label className="flex items-center space-x-3">
                    <input 
                      type="radio" 
                      name="review-result" 
                      value="approve" 
                      checked={reviewResult === 'approve'}
                      onChange={(e) => setReviewResult(e.target.value)}
                      className="text-primary focus:ring-primary" 
                    />
                    <span className="text-text-primary">通过审核</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input 
                      type="radio" 
                      name="review-result" 
                      value="reject" 
                      checked={reviewResult === 'reject'}
                      onChange={(e) => setReviewResult(e.target.value)}
                      className="text-danger focus:ring-danger"
                    />
                    <span className="text-text-primary">驳回申请</span>
                  </label>
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={confirmReview}
                    className="flex-1 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                  >
                    确认
                  </button>
                  <button 
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 px-4 py-2 border border-border-light text-text-secondary text-sm font-medium rounded-lg hover:bg-gray-50"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 下架确认弹窗 */}
      {showOfflineModal && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalBackdrop}></div>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className={`bg-white rounded-xl shadow-xl max-w-md w-full ${styles.modalEnter}`}>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-danger/10 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-exclamation-triangle text-danger text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">确认下架</h3>
                    <p className="text-sm text-text-secondary">此操作不可撤销</p>
                  </div>
                </div>
                
                <p className="text-text-secondary mb-6">
                  确定要下架课程"<span className="font-medium text-text-primary">{courseToOffline}</span>"吗？下架后学生将无法报名该课程。
                </p>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={confirmOffline}
                    className="flex-1 px-4 py-2 bg-danger text-white text-sm font-medium rounded-lg hover:bg-danger/90"
                  >
                    确认下架
                  </button>
                  <button 
                    onClick={() => setShowOfflineModal(false)}
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
    </div>
  );
};

export default AdminCourseManage;