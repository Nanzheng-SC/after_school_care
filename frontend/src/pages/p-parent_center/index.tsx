

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './styles.module.css';
import { getParentYouths, getNeighborhoods, getCourses } from '../../utils/api/parentApi'; // 导入家长API
import { getYouthMatchingTeachers } from '../../utils/api/youthApi'; // 导入学生匹配老师API
import { createEvaluation } from '../../utils/api/evaluationApi'; // 导入评价API


interface PersonalInfo {
  fullName: string;
  phone: string;
  email: string;
}

interface FamilyInfo {
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
}

// 子女信息接口
interface Child {
  id: string;
  name: string;
  age: number;
  healthNote: string;
  interests: string[];
  learningStyle: string;
}

// 老师信息接口
interface Teacher {
  teacher_id: string;
  name: string;
  specialty: string;
  teachingExperience: string;
  avg_score: number;
  teaching_style?: string;
  available_time?: string;
  certificate?: string;
  avatar?: string;
  introduction?: string;
}

// 评价接口
interface Evaluation {
  teacherId: string;
  courseId?: string;
  rating: number;
  content: string;
  youthId?: string;
}

// 社区接口
interface Neighborhood {
  neighborhood_id: string;
  name: string;
  district: string;
  contact: string;
  address: string;
  facility: string;
  service_scope: string;
}

// 课程接口
interface Course {
  course_id: string;
  teacher_id: string;
  neighborhood_id: string;
  name: string;
  type: string;
  age_range: string;
  schedule: string;
  teacher_name?: string;
  location?: string;
}

const ParentCenter: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [isPersonalEditMode, setIsPersonalEditMode] = useState(false);
  const [isFamilyEditMode, setIsFamilyEditMode] = useState(false);
  
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [isNeighborhoodModalOpen, setIsNeighborhoodModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [isLoadingNeighborhoods, setIsLoadingNeighborhoods] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isMatchingTeachersModalOpen, setIsMatchingTeachersModalOpen] = useState(false);
  const [matchingTeachers, setMatchingTeachers] = useState<Teacher[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  
  // 教师详情模态框状态
  const [isTeacherDetailModalOpen, setIsTeacherDetailModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  
  // 评价表单状态
  const [evaluationForm, setEvaluationForm] = useState<Evaluation>({
    teacherId: '',
    courseId: '',
    rating: 5,
    content: '',
    youthId: ''
  });
  
  // 表单数据
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    phone: '',
    email: ''
  });
  
  const [familyInfo, setFamilyInfo] = useState<FamilyInfo>({
    address: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '家长中心 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  // 监听selectedChild变化，确保只有当selectedChild有值时才打开模态框
  useEffect(() => {
    if (selectedChild && isMatchingTeachersModalOpen) {
      console.log('selectedChild已更新且模态框已打开，状态有效');
    } else if (!selectedChild && isMatchingTeachersModalOpen) {
      console.log('selectedChild为空但模态框已打开，关闭模态框');
      setIsMatchingTeachersModalOpen(false);
    }
  }, [selectedChild, isMatchingTeachersModalOpen]);



  // 获取家长信息
  useEffect(() => {
    const fetchParentInfo = async () => {
      // 从localStorage获取用户信息
      const userInfoStr = localStorage.getItem('userInfo');
      if (!userInfoStr) {
        console.error('用户信息不存在，无法获取家长数据');
        return;
      }
      
      const userInfo = JSON.parse(userInfoStr);
      // 获取家长ID
      const parentId = userInfo.parent_id || userInfo.id || userInfo.account;
      
      if (!parentId) {
        console.error('家长ID不存在，无法获取子女数据');
        return;
      }
      
      // 从API获取子女数据
      const childrenResponse = await getParentYouths(parentId);
      const childrenData: Child[] = (childrenResponse || []).map((child: any) => ({
        id: child.youth_id || '',
        name: child.name || '',
        age: child.age || 0,
        healthNote: child.health_note || '',
        interests: child.interest ? child.interest.split(',') : [],
        learningStyle: child.learning_style || ''
      }));
      setChildren(childrenData);
      
      // 获取社区数据
      setIsLoadingNeighborhoods(true);
      const neighborhoodsResponse = await getNeighborhoods(parentId);
      setNeighborhoods(neighborhoodsResponse || []);
      setIsLoadingNeighborhoods(false);
      
      // 获取课程数据
      setIsLoadingCourses(true);
      const coursesResponse = await getCourses(parentId);
      setCourses(coursesResponse || []);
      setIsLoadingCourses(false);
    };
    
    fetchParentInfo().catch(error => {
      console.error('获取家长信息失败:', error);
      alert('获取家长信息失败');
    });
  }, [navigate]);



  // 个人信息编辑
  const handlePersonalEdit = () => {
    setIsPersonalEditMode(true);
  };

  const handlePersonalCancel = () => {
    setIsPersonalEditMode(false);
  };

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('个人信息保存成功', personalInfo);
    setIsPersonalEditMode(false);
  };

  // 家庭信息编辑
  const handleFamilyEdit = () => {
    setIsFamilyEditMode(true);
  };

  const handleFamilyCancel = () => {
    setIsFamilyEditMode(false);
  };

  const handleFamilySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('家庭信息保存成功', familyInfo);
    setIsFamilyEditMode(false);
  };



  // 查看匹配老师
  const handleViewMatchingTeachers = async (child: Child) => {
    // 确保先设置selectedChild，再打开模态框
    setSelectedChild(child);
    
    // 使用setTimeout确保selectedChild状态更新完成后再打开模态框
    setTimeout(async () => {
      setIsMatchingTeachersModalOpen(true);
      setIsLoadingTeachers(true);
      
      // 调用实际API获取匹配老师数据
      const response = await getYouthMatchingTeachers(child.id);
      
      // 将后端数据转换为前端需要的格式
      const teachersData: Teacher[] = (response || []).map((teacher: any) => ({
        teacher_id: teacher.teacher_id || teacher.id || '',
        name: teacher.teacher_name || teacher.name || '',
        specialty: teacher.specialty || teacher.subject || teacher.course || '',
        teachingExperience: teacher.teaching_experience || teacher.experience || '',
        avg_score: typeof teacher.avg_score === 'number' ? teacher.avg_score : 
          typeof teacher.rating === 'number' ? teacher.rating : 0,
        avatar: teacher.avatar,
        introduction: teacher.introduction || teacher.bio,
        teaching_style: teacher.teaching_style || teacher.teachingStyle,
        available_time: teacher.available_time || teacher.availableTime,
        certificate: teacher.certificate
      }));
      
      setMatchingTeachers(teachersData);
      setIsLoadingTeachers(false);
    }, 0);
  };

  const handleMatchingTeachersClose = () => {
    setIsMatchingTeachersModalOpen(false);
    setSelectedChild(null);
    setMatchingTeachers([]);
  };

  // 社区和课程相关功能
  const handleOpenNeighborhoodModal = () => {
    setIsNeighborhoodModalOpen(true);
  };

  const handleNeighborhoodModalClose = () => {
    setIsNeighborhoodModalOpen(false);
  };

  const handleOpenCourseModal = () => {
    setIsCourseModalOpen(true);
  };

  const handleCourseModalClose = () => {
    setIsCourseModalOpen(false);
  };

  // 教师详情功能
  const handleViewTeacherDetail = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsTeacherDetailModalOpen(true);
  };

  const handleTeacherDetailModalClose = () => {
    setIsTeacherDetailModalOpen(false);
    setSelectedTeacher(null);
  };

  // 评价相关功能
  const handleOpenEvaluationModal = (teacher: Teacher, youthId: string) => {
    setEvaluationForm({
      ...evaluationForm,
      teacherId: teacher.teacher_id,
      youthId: youthId
    });
    setIsEvaluationModalOpen(true);
  };

  const handleEvaluationModalClose = () => {
    setIsEvaluationModalOpen(false);
    setEvaluationForm({
      teacherId: '',
      courseId: '',
      rating: 5,
      content: '',
      youthId: ''
    });
  };

  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 从localStorage获取当前登录用户信息
    const userInfoStr = localStorage.getItem('userInfo');
    if (!userInfoStr) {
      alert('用户信息不存在，请重新登录');
      return;
    }
    
    const userInfo = JSON.parse(userInfoStr);
    // 获取当前登录用户的实际家长ID
    const parentId = userInfo.parent_id || userInfo.id || userInfo.account;
    
    if (!parentId) {
      alert('家长ID不存在，无法提交评价');
      return;
    }
    
    // 准备评价数据
    const evaluationData = {
      parent_id: parentId,
      teacher_id: evaluationForm.teacherId,
      course_id: evaluationForm.courseId || '',
      eval_type: '教师评价',
      score: evaluationForm.rating,
      content: evaluationForm.content,
      replied: false
    };
    
    // 调用API提交评价
    await createEvaluation(evaluationData);
    
    alert('评价提交成功');
    handleEvaluationModalClose();
  };

  const handleEvaluationFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEvaluationForm({
      ...evaluationForm,
      [name]: name === 'rating' ? parseInt(value) : value
    });
  };





  // 侧栏导航项
  const sidebarItems = [
    {
      id: 'dashboard',
      icon: 'fas fa-tachometer-alt',
      label: '个人资料',
      description: '查看和管理个人资料'
    },
    {
      id: 'children',
      icon: 'fas fa-child',
      label: '子女管理',
      description: '查看和管理子女信息'
    },
    {
      id: 'courses',
      icon: 'fas fa-book',
      label: '课程信息',
      description: '查看相关课程信息'
    },
    {
      id: 'neighborhoods',
      icon: 'fas fa-map-marked-alt',
      label: '社区信息',
      description: '查看周边社区信息'
    }
  ];

  // 当前活跃的侧栏标签
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // 加载状态
  const [isLoadingChildren, setIsLoadingChildren] = useState(true);

  // 获取子女数据
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setIsLoadingChildren(true);
        // 从localStorage获取用户信息
        const userInfoStr = localStorage.getItem('userInfo');
        if (!userInfoStr) {
          console.error('用户信息不存在，无法获取子女数据');
          navigate('/login'); // 如果没有用户信息，跳转到登录页面
          return;
        }
        
        const userInfo = JSON.parse(userInfoStr);
        // 获取家长ID
        const parentId = userInfo.parent_id || userInfo.id || userInfo.account;
        
        if (!parentId) {
          console.error('家长ID不存在，无法获取子女数据');
          navigate('/login'); // 如果没有家长ID，跳转到登录页面
          return;
        }
        
        // 从API获取子女数据
        const childrenResponse = await getParentYouths(parentId);
        const childrenData: Child[] = (childrenResponse || []).map((child: any) => ({
          id: child.youth_id || '',
          name: child.name || '',
          age: child.age || 0,
          healthNote: child.health_note || '',
          interests: child.interest ? child.interest.split(',') : [],
          learningStyle: child.learning_style || ''
        }));
        setChildren(childrenData);
      } catch (error) {
        console.error('获取子女数据失败:', error);
        alert('获取子女数据失败');
      } finally {
        setIsLoadingChildren(false);
      }
    };
    
    fetchChildren();
  }, [navigate]);

  // 渲染主内容区
  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            {/* 个人信息区 */}
            <section className="mb-8">
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-text-primary">个人信息</h3>
                  {!isPersonalEditMode && (
                    <button 
                      onClick={handlePersonalEdit}
                      className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                    >
                      <i className="fas fa-edit mr-2"></i>编辑
                    </button>
                  )}
                </div>
                
                {!isPersonalEditMode && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <i className="fas fa-user text-primary text-xl"></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-text-primary">{personalInfo.fullName}</h4>
                          <p className="text-sm text-text-secondary">家长姓名</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                          <i className="fas fa-phone text-success text-xl"></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-text-primary">{personalInfo.phone || ''}</h4>
                          <p className="text-sm text-text-secondary">联系电话</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                          <i className="fas fa-envelope text-info text-xl"></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-text-primary">{personalInfo.email ? personalInfo.email.replace(/^(.{2})[^@]*(@.+)$/, '$1***$2') : ''}</h4>
                          <p className="text-sm text-text-secondary">邮箱地址</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {isPersonalEditMode && (
                  <form onSubmit={handlePersonalSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="full-name" className="block text-sm font-medium text-text-primary mb-2">姓名</label>
                        <input 
                          type="text" 
                          id="full-name" 
                          value={personalInfo.fullName}
                          onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                          className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">联系电话</label>
                        <input 
                          type="tel" 
                          id="phone" 
                          value={personalInfo.phone}
                          onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                          className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">邮箱地址</label>
                        <input 
                          type="email" 
                          id="email" 
                          value={personalInfo.email}
                          onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                          className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end space-x-3 pt-4">
                      <button 
                        type="button" 
                        onClick={handlePersonalCancel}
                        className="px-4 py-2 border border-border-light rounded-lg hover:bg-gray-50"
                      >
                        取消
                      </button>
                      <button 
                        type="submit" 
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                      >
                        保存
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </section>

            {/* 家庭信息区 */}
            <section className="mb-8">
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-text-primary">家庭信息</h3>
                  {!isFamilyEditMode && (
                    <button 
                      onClick={handleFamilyEdit}
                      className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                    >
                      <i className="fas fa-edit mr-2"></i>编辑
                    </button>
                  )}
                </div>
                
                {!isFamilyEditMode && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                          <i className="fas fa-home text-warning text-xl"></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-text-primary">{familyInfo.address || '未设置'}</h4>
                          <p className="text-sm text-text-secondary">家庭住址</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-danger/10 rounded-lg flex items-center justify-center">
                          <i className="fas fa-address-book text-danger text-xl"></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-text-primary">{familyInfo.emergencyContact || '未设置'}</h4>
                          <p className="text-sm text-text-secondary">紧急联系人</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                          <i className="fas fa-phone text-success text-xl"></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-text-primary">{familyInfo.emergencyPhone || '未设置'}</h4>
                          <p className="text-sm text-text-secondary">紧急联系电话</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {isFamilyEditMode && (
                  <form onSubmit={handleFamilySubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-text-primary mb-2">家庭住址</label>
                        <input 
                          type="text" 
                          id="address" 
                          value={familyInfo.address}
                          onChange={(e) => setFamilyInfo({...familyInfo, address: e.target.value})}
                          className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                        />
                      </div>
                      <div>
                        <label htmlFor="emergencyContact" className="block text-sm font-medium text-text-primary mb-2">紧急联系人</label>
                        <input 
                          type="text" 
                          id="emergencyContact" 
                          value={familyInfo.emergencyContact}
                          onChange={(e) => setFamilyInfo({...familyInfo, emergencyContact: e.target.value})}
                          className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="emergencyPhone" className="block text-sm font-medium text-text-primary mb-2">紧急联系电话</label>
                        <input 
                          type="tel" 
                          id="emergencyPhone" 
                          value={familyInfo.emergencyPhone}
                          onChange={(e) => setFamilyInfo({...familyInfo, emergencyPhone: e.target.value})}
                          className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end space-x-3 pt-4">
                      <button 
                        type="button" 
                        onClick={handleFamilyCancel}
                        className="px-4 py-2 border border-border-light rounded-lg hover:bg-gray-50"
                      >
                        取消
                      </button>
                      <button 
                        type="submit" 
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                      >
                        保存
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </section>
          </div>
        );
      case 'children':
        return (
          <div>
            {/* 子女信息区 */}
            <section className="mb-8">
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-text-primary">子女信息</h3>
                  <button 
                    onClick={() => navigate('/parent-center/children-manage')}
                    className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                  >
                    <i className="fas fa-edit mr-2"></i>编辑子女信息
                  </button>
                </div>
                
                {isLoadingChildren ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : children.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {children.map((child) => (
                      <div key={child.id} className="border border-border-light rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                            <i className="fas fa-child text-primary text-2xl"></i>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-lg font-medium text-text-primary">{child.name}</h3>
                              <span className="px-3 py-1 bg-info/10 text-info text-sm font-medium rounded-full">{child.age}岁</span>
                            </div>
                            
                            {child.healthNote && (
                              <div className="mb-3">
                                <p className="text-sm text-text-secondary">
                                  <i className="fas fa-heart text-danger mr-2"></i>
                                  健康状况：{child.healthNote}
                                </p>
                              </div>
                            )}
                            
                            {child.learningStyle && (
                              <div className="mb-3">
                                <p className="text-sm text-text-secondary">
                                  <i className="fas fa-brain text-warning mr-2"></i>
                                  学习风格：{child.learningStyle}
                                </p>
                              </div>
                            )}
                            
                            {child.interests && child.interests.length > 0 && (
                              <div className="mb-4">
                                <p className="text-sm text-text-secondary mb-2">
                                  <i className="fas fa-star text-warning mr-2"></i>
                                  兴趣爱好：
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {child.interests.map((interest, index) => (
                                    <span 
                                      key={index} 
                                      className="px-3 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full"
                                    >
                                      {interest}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="flex justify-end">
                              <button 
                                onClick={() => handleViewMatchingTeachers(child)}
                                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                              >
                                查看匹配老师
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <i className="fas fa-child text-4xl text-gray-300 mb-4"></i>
                    <p className="text-text-secondary mb-2">暂无子女信息</p>
                    <p className="text-sm text-text-tertiary">请联系管理员添加子女信息</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        );
      case 'courses':
        return (
          <div>
            {/* 课程信息区 */}
            <section className="mb-8">
              <div className="bg-white rounded-xl shadow-card p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-6">课程信息</h3>
                
                {isLoadingCourses ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : courses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <div key={course.course_id} className="border border-border-light rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                            <i className="fas fa-book text-primary text-2xl"></i>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-text-primary mb-2">{course.name}</h3>
                            
                            <div className="space-y-2">
                              <p className="text-sm text-text-secondary">
                                <i className="fas fa-tag text-info mr-2"></i>
                                类型：{course.type}
                              </p>
                              
                              <p className="text-sm text-text-secondary">
                                <i className="fas fa-users text-warning mr-2"></i>
                                适龄：{course.age_range}
                              </p>
                              
                              <p className="text-sm text-text-secondary">
                                <i className="fas fa-calendar text-success mr-2"></i>
                                时间：{course.schedule}
                              </p>
                              
                              {course.teacher_name && (
                                <p className="text-sm text-text-secondary">
                                  <i className="fas fa-chalkboard-teacher text-primary mr-2"></i>
                                  老师：{course.teacher_name}
                                </p>
                              )}
                              
                              {course.location && (
                                <p className="text-sm text-text-secondary">
                                  <i className="fas fa-map-marker-alt text-danger mr-2"></i>
                                  地点：{course.location}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <i className="fas fa-book text-4xl text-gray-300 mb-4"></i>
                    <p className="text-text-secondary mb-2">暂无课程信息</p>
                    <p className="text-sm text-text-tertiary">请联系管理员添加课程信息</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        );
      case 'neighborhoods':
        return (
          <div>
            {/* 社区信息区 */}
            <section className="mb-8">
              <div className="bg-white rounded-xl shadow-card p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-6">社区信息</h3>
                
                {isLoadingNeighborhoods ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : neighborhoods.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {neighborhoods.map((neighborhood) => (
                      <div key={neighborhood.neighborhood_id} className="border border-border-light rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                            <i className="fas fa-map-marked-alt text-primary text-2xl"></i>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-text-primary mb-2">{neighborhood.name}</h3>
                            
                            <div className="space-y-2">
                              <p className="text-sm text-text-secondary">
                                <i className="fas fa-map-pin text-danger mr-2"></i>
                                区域：{neighborhood.district}
                              </p>
                              
                              <p className="text-sm text-text-secondary">
                                <i className="fas fa-phone text-success mr-2"></i>
                                联系方式：{neighborhood.contact}
                              </p>
                              
                              <p className="text-sm text-text-secondary">
                                <i className="fas fa-building text-info mr-2"></i>
                                设施：{neighborhood.facility}
                              </p>
                              
                              <p className="text-sm text-text-secondary">
                                <i className="fas fa-handshake text-warning mr-2"></i>
                                服务范围：{neighborhood.service_scope}
                              </p>
                              
                              <p className="text-sm text-text-secondary">
                                <i className="fas fa-map-marker-alt text-primary mr-2"></i>
                                地址：{neighborhood.address}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <i className="fas fa-map-marked-alt text-4xl text-gray-300 mb-4"></i>
                    <p className="text-text-secondary mb-2">暂无社区信息</p>
                    <p className="text-sm text-text-tertiary">请联系管理员添加社区信息</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* 侧栏导航 */}
          <div className="w-64 bg-white rounded-xl shadow-card h-fit">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-user-friends text-primary text-xl"></i>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">家长中心</h2>
                  <p className="text-sm text-text-secondary">智能匹配托管服务</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary text-white'
                        : 'text-text-secondary hover:bg-gray-100'
                    }`}
                  >
                    <i className={`${item.icon} text-lg`}></i>
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className={`text-xs ${activeTab === item.id ? 'text-primary-200' : 'text-text-tertiary'}`}>
                        {item.description}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    // 清除本地存储或登录状态
                    localStorage.removeItem('userInfo');
                    // 跳转到登录页面
                    navigate('/');
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors text-text-secondary hover:bg-red-50 hover:text-red-500"
                >
                  <i className="fas fa-sign-out-alt text-lg"></i>
                  <div>
                    <div className="font-medium">退出登录</div>
                    <div className="text-xs text-text-tertiary">安全退出系统</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
          
          {/* 主内容区 */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-text-primary mb-2">家长中心</h1>
              <p className="text-text-secondary">管理您的个人信息和子女信息</p>
            </div>
            {renderMainContent()}
          </div>
        </div>
      </div>

      {/* 评价提交弹窗 */}
      {isEvaluationModalOpen && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalOverlay} onClick={handleEvaluationModalClose}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className={`${styles.modalContent} bg-white rounded-xl shadow-xl max-w-md w-full`} onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-text-primary">提交评价</h3>
                  <button 
                    onClick={handleEvaluationModalClose}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
                
                <form onSubmit={handleSubmitEvaluation} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">评价星级</label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star}
                          type="button"
                          onClick={() => setEvaluationForm({...evaluationForm, rating: star})}
                          className="text-2xl"
                        >
                          <i className={`fas fa-star ${evaluationForm.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-text-primary mb-2">评价内容</label>
                    <textarea 
                      id="content"
                      name="content"
                      rows={4}
                      value={evaluationForm.content}
                      onChange={handleEvaluationFormChange}
                      placeholder="请输入您对老师的评价"
                      className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <button 
                      type="button" 
                      onClick={handleEvaluationModalClose}
                      className="px-4 py-2 border border-border-light rounded-lg hover:bg-gray-50"
                    >
                      取消
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                      提交评价
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 社区信息查看弹窗 */}
      {isNeighborhoodModalOpen && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalOverlay} onClick={handleNeighborhoodModalClose}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className={`${styles.modalContent} bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-text-primary">社区信息</h3>
                  <button 
                    onClick={handleNeighborhoodModalClose}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
                
                {isLoadingNeighborhoods ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : neighborhoods.length > 0 ? (
                  <div className="space-y-4">
                    {neighborhoods.map((neighborhood) => (
                      <div key={neighborhood.neighborhood_id} className="p-4 border border-border-light rounded-lg">
                        <div className="flex items-start space-x-4 mb-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                            <i className="fas fa-map-marker-alt text-primary text-lg"></i>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-text-primary">{neighborhood.name}</h4>
                              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">{neighborhood.district}</span>
                            </div>
                            <p className="text-sm text-text-secondary mt-1">{neighborhood.address}</p>
                            <p className="text-sm text-text-secondary mt-2">联系人：{neighborhood.contact}</p>
                            {neighborhood.facility && (
                              <div className="mt-2">
                                <p className="text-sm text-text-primary font-medium">设施：</p>
                                <p className="text-sm text-text-secondary">{neighborhood.facility}</p>
                              </div>
                            )}
                            {neighborhood.service_scope && (
                              <div className="mt-2">
                                <p className="text-sm text-text-primary font-medium">服务范围：</p>
                                <p className="text-sm text-text-secondary">{neighborhood.service_scope}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
                    <p className="text-text-secondary">暂无社区信息</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 教师详情模态框 */}
      {isTeacherDetailModalOpen && selectedTeacher && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalOverlay} onClick={handleTeacherDetailModalClose}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className={`${styles.modalContent} bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-text-primary">教师详情</h3>
                  <button 
                    onClick={handleTeacherDetailModalClose}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
                
                <div className="flex items-center space-x-6 mb-6">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                    {selectedTeacher.avatar ? (
                      <img src={selectedTeacher.avatar} alt={selectedTeacher.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <i className="fas fa-chalkboard-teacher text-primary text-3xl"></i>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-2xl font-bold text-text-primary">{selectedTeacher.name}</h4>
                      <span className="px-3 py-1 bg-primary/10 text-primary font-medium rounded text-lg">{typeof selectedTeacher.avg_score === 'number' ? selectedTeacher.avg_score.toFixed(1) : '0.0'}</span>
                    </div>
                    <p className="text-sm text-text-secondary mb-1">{selectedTeacher.specialty} · {selectedTeacher.teachingExperience}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {selectedTeacher.introduction && (
                    <div>
                      <h5 className="text-base font-semibold text-text-primary mb-2">教师简介</h5>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-text-primary">{selectedTeacher.introduction}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedTeacher.teaching_style && (
                    <div>
                      <h5 className="text-base font-semibold text-text-primary mb-2">教学风格</h5>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-text-primary">{selectedTeacher.teaching_style}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedTeacher.available_time && (
                    <div>
                      <h5 className="text-base font-semibold text-text-primary mb-2">可用时间</h5>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-text-primary">{selectedTeacher.available_time}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedTeacher.certificate && (
                    <div>
                      <h5 className="text-base font-semibold text-text-primary mb-2">资质证书</h5>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-text-primary">{selectedTeacher.certificate}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 课程信息查看弹窗 */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalOverlay} onClick={handleCourseModalClose}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className={`${styles.modalContent} bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-text-primary">课程信息</h3>
                  <button 
                    onClick={handleCourseModalClose}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
                
                {isLoadingCourses ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : courses.length > 0 ? (
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div key={course.course_id} className="p-4 border border-border-light rounded-lg">
                        <div className="flex items-start space-x-4 mb-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                            <i className="fas fa-book-open text-primary text-lg"></i>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-text-primary">{course.name}</h4>
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 bg-gray-100 text-text-secondary text-xs rounded-full">ID: {course.course_id}</span>
                                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">{course.type}</span>
                              </div>
                            </div>
                            <p className="text-sm text-text-secondary mt-1">年龄范围：{course.age_range}</p>
                            <p className="text-sm text-text-secondary mt-2">教师：{course.teacher_name || '未知老师'}</p>
                            <p className="text-sm text-text-secondary mt-1">地点：{course.location || '未知地点'}</p>
                            {course.schedule && (
                              <div className="mt-2">
                                <p className="text-sm text-text-primary font-medium">课程安排：</p>
                                <p className="text-sm text-text-secondary">{course.schedule}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
                    <p className="text-text-secondary">暂无课程信息</p>
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

export default ParentCenter;

