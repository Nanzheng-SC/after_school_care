import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { getParentYouths } from '../../utils/api/parentApi'; // 导入家长API

interface Child {
  id: string;
  name: string;
  age: number;
  healthNote: string;
  interests: string[];
  learningStyle: string;
}

const ChildrenManage: React.FC = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // 获取子女数据
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setIsLoading(true);
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
        setIsLoading(false);
      }
    };
    
    fetchChildren();
  }, [navigate]);
  
  // 编辑子女信息
  const handleEditChild = (child: Child) => {
    setSelectedChild(child);
    setIsEditModalOpen(true);
  };
  
  // 保存编辑后的子女信息
  const handleSaveChild = () => {
    // TODO: 实现保存编辑后的子女信息逻辑
    console.log('保存子女信息:', selectedChild);
    setIsEditModalOpen(false);
  };
  
  // 返回上一页面
  const handleBack = () => {
    navigate('/parent-center');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-text-primary">子女管理</h1>
          <button 
            onClick={handleBack}
            className="px-4 py-2 border border-gray-300 text-text-primary text-sm font-medium rounded-lg hover:bg-gray-100"
          >
            <i className="fas fa-arrow-left mr-2"></i>返回
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : children.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          onClick={() => handleEditChild(child)}
                          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                        >
                          <i className="fas fa-edit mr-2"></i>编辑子女信息
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
        
        {/* 编辑子女信息模态框 */}
        {isEditModalOpen && selectedChild && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-text-primary">编辑子女信息</h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">姓名</label>
                    <input 
                      type="text" 
                      value={selectedChild.name} 
                      onChange={(e) => setSelectedChild({...selectedChild, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">年龄</label>
                    <input 
                      type="number" 
                      value={selectedChild.age} 
                      onChange={(e) => setSelectedChild({...selectedChild, age: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">健康状况</label>
                    <textarea 
                      value={selectedChild.healthNote} 
                      onChange={(e) => setSelectedChild({...selectedChild, healthNote: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">学习风格</label>
                    <input 
                      type="text" 
                      value={selectedChild.learningStyle} 
                      onChange={(e) => setSelectedChild({...selectedChild, learningStyle: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">兴趣爱好</label>
                    <input 
                      type="text" 
                      value={selectedChild.interests.join(', ')} 
                      onChange={(e) => setSelectedChild({...selectedChild, interests: e.target.value.split(', ')})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <p className="text-xs text-text-tertiary mt-1">用逗号分隔多个兴趣爱好</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-text-primary text-sm font-medium rounded-lg hover:bg-gray-100"
                >
                  取消
                </button>
                <button 
                  onClick={handleSaveChild}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildrenManage;