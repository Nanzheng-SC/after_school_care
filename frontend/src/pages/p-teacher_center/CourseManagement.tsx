import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { getTeacherCourses } from '../../utils/api/teacherApi';

interface Course {
  course_id: string;
  teacher_id: string;
  neighborhood_id: string;
  name: string;
  type: string;
  age_range: string;
  schedule: string;
  location?: string; // 新增location属性
}

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Get teacher ID from localStorage
  const getTeacherId = (): string => {
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        return userInfo.teacher_id || userInfo.id || 'T001';
      } catch (error) {
        console.error('解析用户信息失败:', error);
        return 'T001';
      }
    }
    return 'T001';
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const teacherId = getTeacherId();
        const teacherCourses = await getTeacherCourses(teacherId);
        setCourses(teacherCourses);
        console.log('获取到的课程数据:', teacherCourses);
      } catch (error) {
        console.error('获取课程失败:', error);
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const parseSchedule = (scheduleStr: string) => {
    return scheduleStr?.split(',').map(day => day.trim()).filter(Boolean) || [];
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 页面头部 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">课程管理</h2>
        <nav className="text-sm text-text-secondary">
          <span>首页</span>
          <i className="fas fa-chevron-right mx-2"></i>
          <span>教师中心</span>
          <i className="fas fa-chevron-right mx-2"></i>
          <span className="text-primary">课程管理</span>
        </nav>
      </div>

      {/* 搜索框 */}
      <div className="mb-6">
        <div className="relative w-full max-w-md">
          <input 
            type="text" 
            placeholder="搜索课程名称或类型..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
          />
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm"></i>
        </div>
      </div>

      {/* 课程列表 */}
      <section>
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">我的课程</h3>
            <button 
              onClick={() => console.log('添加课程')}
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
            >
              <i className="fas fa-plus mr-2"></i>添加课程
            </button>
          </div>
          
          {isLoading ? (
            <div className="animate-pulse">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="mb-4 p-4 border border-border-light rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
                    <div className="w-1/6 h-3 bg-gray-200 rounded"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="h-6 w-16 bg-gray-200 rounded-full"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-book-open text-5xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 text-lg">暂无课程数据</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <div key={course.course_id} className="border border-border-light rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg font-semibold text-text-primary">{course.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${course.type === '托管' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                      {course.type}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm text-text-secondary">
                    <div className="flex items-center">
                      <i className="fas fa-child mr-2 text-text-tertiary"></i>
                      <span>适用年龄: {course.age_range}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-map-marker-alt mr-2 text-text-tertiary"></i>
                      <span>社区: {course.location || course.neighborhood_id}</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-hashtag mr-2 text-text-tertiary"></i>
                      <span>课程ID: {course.course_id}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-text-tertiary mb-2">课程时间:</p>
                    <div className="flex flex-wrap gap-2">
                      {parseSchedule(course.schedule).map((day, index) => (
                        <span key={index} className="px-3 py-1 bg-info/10 text-info text-xs font-medium rounded-full">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button 
                      onClick={() => console.log('编辑课程', course.course_id)}
                      className="px-3 py-1 border border-primary text-primary text-sm rounded-lg hover:bg-primary/5"
                    >
                      <i className="fas fa-edit mr-1"></i>编辑
                    </button>
                    <button 
                      onClick={() => console.log('删除课程', course.course_id)}
                      className="px-3 py-1 border border-danger text-danger text-sm rounded-lg hover:bg-danger/5"
                    >
                      <i className="fas fa-trash mr-1"></i>删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CourseManagement;
