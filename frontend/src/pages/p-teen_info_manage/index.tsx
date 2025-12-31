

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import request from '../../utils/request';
import Header from '../../components/Header'; // 导入共享Header组件

interface Child {
  id: number;
  name: string;
  age: number;
  health: string;
  interests: string[];
  learningStyle: string;
}

const ChildInfoManagePage: React.FC = () => {
  // 状态管理
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [childrenData, setChildrenData] = useState<Child[]>([]);
  const [userInfo, setUserInfo] = useState<{name: string; parent_id?: string; family_id?: string}>({name: ''});
  
  // CRUD相关状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentChild, setCurrentChild] = useState<Child | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // 表单数据状态
  const [formData, setFormData] = useState({
    name: '',
    age: 0,
    health: '',
    interests: '',
    learningStyle: ''
  });

  // 获取用户信息
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error('解析用户信息失败:', error);
      }
    }
  }, []);

  // 获取子女信息
  useEffect(() => {
    const fetchChildrenData = async () => {
      try {
        // 使用真实API获取子女信息
        // 从localStorage获取用户信息
        const userInfoStr = localStorage.getItem('userInfo');
        if (!userInfoStr) {
          console.error('用户信息不存在，无法获取子女数据');
          setChildrenData([]);
          return;
        }
        
        const userInfo = JSON.parse(userInfoStr);
        const parentId = userInfo.parent_id || userInfo.id;
        
        if (!parentId) {
          console.error('家长ID不存在，无法获取子女数据');
          setChildrenData([]);
          return;
        }
        
        // 优先使用家长子女API
        const response = await request.get(`/api/parent/${parentId}/youths`);
        const childrenData = response.data;
        
        // 定义后端子女数据接口
        interface BackendYouth {
          youth_id: string;
          name: string;
          age: number;
          health_note: string;
          interest: string;
          learning_style: string;
        }
        
        // 将后端数据转换为前端所需格式
        const formattedData = childrenData.map((child: BackendYouth) => ({
          id: Number(child.youth_id),
          name: child.name,
          age: child.age || '',
          health: child.health_note || '',
          interests: child.interest ? child.interest.split(',') : [],
          learningStyle: child.learning_style || ''
        }));
        
        setChildrenData(formattedData);
        console.log('使用真实API获取的子女数据:', formattedData);
      } catch (error) {
        console.error('获取子女信息失败，使用备用API:', error);
        try {
          // 使用备用API获取子女信息
          // 从用户信息中获取家庭ID
          const userInfoStr = localStorage.getItem('userInfo');
          if (!userInfoStr) {
            console.error('用户信息不存在，无法获取子女数据');
            setChildrenData([]);
            return;
          }
          const userInfo = JSON.parse(userInfoStr);
          const familyId = userInfo.family_id;
          
          if (!familyId) {
            console.error('家庭ID不存在，无法获取子女数据');
            setChildrenData([]);
            return;
          }
          const response = await request.get('/api/youth', { params: { family_id: familyId } });
          const childrenData = response.data;
          
          // 定义后端子女数据接口
          interface BackendYouth {
            youth_id: string;
            name: string;
            age: number;
            health_note: string;
            interest: string;
            learning_style: string;
          }
          
          // 将后端数据转换为前端所需格式
          const formattedData = childrenData.map((child: BackendYouth) => ({
            id: Number(child.youth_id),
            name: child.name,
            age: child.age || '',
            health: child.health_note || '',
            interests: child.interest ? child.interest.split(',') : [],
            learningStyle: child.learning_style || ''
          }));
          
          setChildrenData(formattedData);
          console.log('使用备用API获取的子女数据:', formattedData);
        } catch (fallbackError) {
          console.error('获取子女信息失败:', fallbackError);
          setChildrenData([]);
        }
      }
    };
    fetchChildrenData();
  }, []);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '子女信息管理 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);



  // 切换侧边栏
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 打开添加模态框
  const openAddModal = () => {
    setIsEditing(false);
    setFormData({
      name: '',
      age: 0,
      health: '',
      interests: '',
      learningStyle: ''
    });
    setIsModalOpen(true);
  };

  // 打开编辑模态框
  const openEditModal = (child: Child) => {
    setIsEditing(true);
    setCurrentChild(child);
    setFormData({
      name: child.name,
      age: child.age,
      health: child.health,
      interests: child.interests.join(','),
      learningStyle: child.learningStyle
    });
    setIsModalOpen(true);
  };

  // 关闭模态框
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentChild(null);
  };

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理表单提交
  const handleSubmit = async () => {
    if (!formData.name || formData.age <= 0) {
      alert('请填写正确的姓名和年龄');
      return;
    }

    setIsLoading(true);
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      if (!userInfoStr) {
        throw new Error('用户信息不存在');
      }
      const userInfo = JSON.parse(userInfoStr);
      const parentId = userInfo.parent_id || userInfo.id;

      if (!parentId) {
        throw new Error('家长ID不存在');
      }

      // 准备提交数据
      const submitData = {
        name: formData.name,
        age: Number(formData.age),
        health_note: formData.health,
        interest: formData.interests,
        learning_style: formData.learningStyle
      };

      if (isEditing && currentChild) {
        // 更新子女信息
        await request.put(`/api/parent/${parentId}/youths/${currentChild.id}`, submitData);
      } else {
        // 添加新子女
        await request.post(`/api/parent/${parentId}/youths`, submitData);
      }

      // 重新获取子女数据
      const response = await request.get(`/api/parent/${parentId}/youths`);
      const formattedData = response.data.map((child: any) => ({
        id: Number(child.youth_id),
        name: child.name,
        age: child.age || '',
        health: child.health_note || '',
        interests: child.interest ? child.interest.split(',') : [],
        learningStyle: child.learning_style || ''
      }));
      setChildrenData(formattedData);

      // 关闭模态框
      closeModal();
      alert(isEditing ? '子女信息更新成功' : '子女信息添加成功');
    } catch (error) {
      console.error('提交表单失败:', error);
      alert(isEditing ? '子女信息更新失败' : '子女信息添加失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 删除子女信息
  const handleDelete = async (childId: number) => {
    if (!window.confirm('确定要删除这个子女的信息吗？')) {
      return;
    }

    setIsLoading(true);
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      if (!userInfoStr) {
        throw new Error('用户信息不存在');
      }
      const userInfo = JSON.parse(userInfoStr);
      const parentId = userInfo.parent_id || userInfo.id;

      if (!parentId) {
        throw new Error('家长ID不存在');
      }

      // 删除子女信息
      await request.delete(`/api/parent/${parentId}/youths/${childId}`);

      // 重新获取子女数据
      const response = await request.get(`/api/parent/${parentId}/youths`);
      const formattedData = response.data.map((child: any) => ({
        id: Number(child.youth_id),
        name: child.name,
        age: child.age || '',
        health: child.health_note || '',
        interests: child.interest ? child.interest.split(',') : [],
        learningStyle: child.learning_style || ''
      }));
      setChildrenData(formattedData);

      alert('子女信息删除成功');
    } catch (error) {
      console.error('删除子女信息失败:', error);
      alert('子女信息删除失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 - 使用共享Header组件 */}
      <Header 
        userRole="parent" 
        userName={userInfo.name || '家长'} 
        userAvatar="https://s.coze.cn/image/SOvJmAnV3oE/" 
        onSidebarToggle={toggleSidebar} 
      />

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
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
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
            className={`${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}
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
          <div className="mb-8">
            <div className="">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">子女信息管理</h2>
                <nav className="text-sm text-text-secondary">
                  <Link to="/home" className="hover:text-primary">首页</Link>
                  <span className="mx-2">/</span>
                  <Link to="/parent-center" className="hover:text-primary">家长中心</Link>
                  <span className="mx-2">/</span>
                  <span className="text-text-primary">子女信息管理</span>
                </nav>
              </div>
            </div>
          </div>

          {/* 子女列表区 */}
          <section className="bg-white rounded-xl shadow-card">
            <div className="p-6">
              {/* 添加按钮 */}
              <div className="mb-6 flex justify-end">
                <button 
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  onClick={openAddModal}
                >
                  <i className="fas fa-plus mr-2"></i>添加子女
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-light">
                      <th className="text-left py-3 px-4 font-semibold text-text-primary">姓名</th>
                      <th className="text-left py-3 px-4 font-semibold text-text-primary">年龄</th>
                      <th className="text-left py-3 px-4 font-semibold text-text-primary">健康状况</th>
                      <th className="text-left py-3 px-4 font-semibold text-text-primary">兴趣爱好</th>
                      <th className="text-left py-3 px-4 font-semibold text-text-primary">学习风格</th>
                      <th className="text-left py-3 px-4 font-semibold text-text-primary">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {childrenData.map(child => (
                      <tr key={child.id} className={`border-b border-border-light ${styles.tableRowHover}`}>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-primary font-medium text-sm">{child.name.charAt(0)}</span>
                            </div>
                            <span className="font-medium text-text-primary">{child.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-text-primary">{child.age}</td>
                        <td className="py-4 px-4 text-text-primary">{child.health}</td>
                        <td className="py-4 px-4 text-text-secondary">{child.interests.join('、')}</td>
                        <td className="py-4 px-4 text-text-primary">{child.learningStyle}</td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button 
                              className="text-primary hover:text-primary/80 px-3 py-1 rounded-lg text-sm font-medium"
                              onClick={() => openEditModal(child)}
                            >
                              <i className="fas fa-edit mr-1"></i>编辑
                            </button>
                            <button 
                              className="text-danger hover:text-danger/80 px-3 py-1 rounded-lg text-sm font-medium"
                              onClick={() => handleDelete(child.id)}
                            >
                              <i className="fas fa-trash mr-1"></i>删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 添加/编辑子女模态框 */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-text-primary">
                    {isEditing ? '编辑子女信息' : '添加子女信息'}
                  </h3>
                  <button 
                    className="text-text-secondary hover:text-text-primary" 
                    onClick={closeModal}
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">姓名</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      placeholder="请输入姓名"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">年龄</label>
                    <input 
                      type="number" 
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      placeholder="请输入年龄"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">健康状况</label>
                    <textarea 
                      name="health"
                      value={formData.health}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      placeholder="请输入健康状况"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">兴趣爱好</label>
                    <input 
                      type="text" 
                      name="interests"
                      value={formData.interests}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      placeholder="请输入兴趣爱好，多个用逗号分隔"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">学习风格</label>
                    <textarea 
                      name="learningStyle"
                      value={formData.learningStyle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      placeholder="请输入学习风格"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button 
                    className="px-4 py-2 border border-border-light rounded-lg font-medium text-text-primary hover:bg-gray-50"
                    onClick={closeModal}
                  >
                    取消
                  </button>
                  <button 
                    className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        提交中...
                      </div>
                    ) : (
                      isEditing ? '保存修改' : '添加子女'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 侧边栏遮罩 */}
      {isSidebarOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        ></div>
      )}
    </div>
  );
};

export default ChildInfoManagePage;

