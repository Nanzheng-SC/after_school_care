import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import styles from './styles.module.css';
import request from '../../utils/request';

interface Community {
  neighborhood_id: string;
  name: string;
  address: string;
  contact: string;
  facility: string;
  service_scope?: string;
  district?: string;
}

interface FormData {
  name: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
  facilities: string[];
  serviceArea: string;
  district?: string;
}

const AdminCommunityManage: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentEditingCommunity, setCurrentEditingCommunity] = useState<Community | null>(null);
  const [currentDeletingCommunity, setCurrentDeletingCommunity] = useState<Community | null>(null);
  const [communitySearchTerm, setCommunitySearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    contactPhone: '',
    contactEmail: '',
    facilities: [],
    serviceArea: ''
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '社区管理 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  // 从API获取社区数据
  useEffect(() => {
    const fetchCommunities = async () => {
      setIsLoading(true);
      try {
        console.log('开始获取社区数据...');
        const response = await request.get<Community[]>('/api/admin/neighborhood');
        console.log('获取社区数据成功，响应数据:', response.data);
        
        // 确保数据是数组类型
        if (Array.isArray(response.data)) {
          setCommunities(response.data);
          console.log('社区数据已更新到状态，共', response.data.length, '条记录');
        } else {
          console.error('获取的社区数据不是数组类型:', response.data);
          setCommunities([]);
        }
      } catch (error) {
        console.error('获取社区数据失败:', error);
        setCommunities([]);
      } finally {
        setIsLoading(false);
        console.log('社区数据获取完成');
      }
    };

    fetchCommunities();
  }, []);

  const getFilteredCommunities = (): Community[] => {
    return communities.filter(community => 
      community.name.toLowerCase().includes(communitySearchTerm.toLowerCase())
    );
  };

  const getCurrentPageCommunities = (): Community[] => {
    const filteredCommunities = getFilteredCommunities();
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredCommunities.slice(startIndex, endIndex);
  };

  const getTotalPages = (): number => {
    return Math.ceil(getFilteredCommunities().length / pageSize);
  };

  const handleCommunitySearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommunitySearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleOpenCommunityModal = (community: Community | null = null) => {
    if (community) {
      setCurrentEditingCommunity(community);
      setFormData({
        name: community.name,
        address: community.address,
        contactPhone: community.contact,
        contactEmail: '',
        facilities: community.facility ? community.facility.split(',').map(f => f.trim()) : [],
        serviceArea: community.service_scope || '',
        district: community.district
      });
    } else {
      setCurrentEditingCommunity(null);
      setFormData({
        name: '',
        address: '',
        contactPhone: '',
        contactEmail: '',
        facilities: [],
        serviceArea: ''
      });
    }
    setIsCommunityModalOpen(true);
  };

  const handleCloseCommunityModal = () => {
    setIsCommunityModalOpen(false);
    setCurrentEditingCommunity(null);
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFacilityChange = (facility: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      facilities: checked 
        ? [...prev.facilities, facility]
        : prev.facilities.filter(f => f !== facility)
    }));
  };

  const handleSubmitCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        facilities: formData.facilities.join(',')
      };

      if (currentEditingCommunity) {
        await request.put(`/api/admin/neighborhood/${currentEditingCommunity.neighborhood_id}`, submitData);
      } else {
        await request.post('/api/admin/neighborhood', submitData);
      }

      // 重新获取数据
      const response = await request.get<Community[]>('/api/admin/neighborhood');
      setCommunities(response.data);

      handleCloseCommunityModal();
    } catch (error) {
      console.error('保存社区数据失败:', error);
    }
  };

  const handleDeleteCommunity = (community: Community) => {
    setCurrentDeletingCommunity(community);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCommunity = async () => {
    if (!currentDeletingCommunity) return;

    try {
      await request.delete(`/api/admin/neighborhood/${currentDeletingCommunity.neighborhood_id}`);
      
      // 重新获取数据
      const response = await request.get<Community[]>('/api/admin/neighborhood');
      setCommunities(response.data);

      setIsDeleteModalOpen(false);
      setCurrentDeletingCommunity(null);
    } catch (error) {
      console.error('删除社区失败:', error);
    }
  };

  const handleViewCommunity = (community: Community) => {
    // 这里可以实现查看社区详情的逻辑
    console.log('查看社区详情:', community);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const generatePageNumbers = () => {
    const totalPages = getTotalPages();
    const pageNumbers = [];
    
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pageNumbers.push(
          <button
            key={i}
            className={`px-3 py-1 border rounded ${i === currentPage ? 'bg-primary text-white border-primary' : 'border-border-light hover:bg-gray-50'}`}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pageNumbers.push(
          <span key={`ellipsis-${i}`} className="px-2 text-text-secondary">
            ...
          </span>
        );
      }
    }
    
    return pageNumbers;
  };

  const currentPageCommunities = getCurrentPageCommunities();
  const filteredCommunitiesCount = getFilteredCommunities().length;
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, filteredCommunitiesCount);

  const availableFacilities = ['教室', '操场', '图书馆', '电脑室', '音乐室', '美术室', '体育馆', '会议室'];

  return (
    <div className="p-6">
      {/* 页面头部 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">社区管理</h2>
            <nav className="text-sm text-text-secondary">
              <span>后台管理</span>
              <i className="fas fa-chevron-right mx-2"></i>
              <span className="text-primary">社区管理</span>
            </nav>
          </div>
          <button 
            onClick={() => handleOpenCommunityModal()}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center space-x-2"
          >
            <i className="fas fa-plus"></i>
            <span>添加社区</span>
          </button>
        </div>
      </div>

      {/* 社区列表 */}
      <section className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">社区列表</h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="搜索社区名称..." 
                  value={communitySearchTerm}
                  onChange={handleCommunitySearchChange}
                  className={`pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchFocus} w-64`}
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm"></i>
              </div>
            </div>
          </div>

          {/* 社区表格 */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-border-light">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">社区名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">地址</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">联系方式</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">设施</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-3 text-text-secondary">加载中...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentPageCommunities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-text-secondary">
                      暂无社区数据
                    </td>
                  </tr>
                ) : (
                  currentPageCommunities.map((community) => (
                    <tr key={community.neighborhood_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-text-primary">
                        {community.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {community.address}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {community.contact}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        <div className="flex flex-wrap gap-1">
                          {community.facility?.split(',').slice(0, 2).map((facility, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              {facility.trim()}
                            </span>
                          ))}
                          {community.facility?.split(',').length > 2 && (
                            <span className="text-xs text-text-secondary">...</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewCommunity(community)}
                            className="text-primary hover:text-primary-dark"
                          >
                            查看
                          </button>
                          <button
                            onClick={() => handleOpenCommunityModal(community)}
                            className="text-secondary hover:text-secondary-dark"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDeleteCommunity(community)}
                            className="text-red-600 hover:text-red-700"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          {filteredCommunitiesCount > pageSize && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-text-secondary">
                显示 {startIndex} - {endIndex} 条，共 {filteredCommunitiesCount} 条
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-border-light rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                
                {generatePageNumbers()}
                
                <button
                  onClick={() => setCurrentPage(Math.min(getTotalPages(), currentPage + 1))}
                  disabled={currentPage * pageSize >= filteredCommunitiesCount}
                  className="px-3 py-1 border border-border-light rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 社区编辑/添加模态框 */}
      {isCommunityModalOpen && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 ${styles.modalBackdrop} z-50`}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className={`bg-white rounded-xl shadow-card-hover w-full max-w-2xl ${styles.modalEnter}`}>
              <div className="flex items-center justify-between p-6 border-b border-border-light">
                <h3 className="text-lg font-semibold text-text-primary">
                  {currentEditingCommunity ? '编辑社区' : '添加社区'}
                </h3>
                <button 
                  onClick={handleCloseCommunityModal}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <i className="fas fa-times text-text-secondary"></i>
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">社区名称 *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormInputChange}
                      required
                      className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">地址 *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleFormInputChange}
                      required
                      className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">联系电话 *</label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleFormInputChange}
                      required
                      className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">联系邮箱</label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleFormInputChange}
                      className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">设施配置</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availableFacilities.map((facility) => (
                      <label key={facility} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.facilities.includes(facility)}
                          onChange={(e) => handleFacilityChange(facility, e.target.checked)}
                          className="rounded border-border-light text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-text-primary">{facility}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">服务范围</label>
                  <textarea
                    name="serviceArea"
                    value={formData.serviceArea}
                    onChange={handleFormInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="描述社区的服务范围和特色..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 p-6 border-t border-border-light">
                <button
                  onClick={handleCloseCommunityModal}
                  className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmitCommunity}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  {currentEditingCommunity ? '更新' : '添加'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认模态框 */}
      {isDeleteModalOpen && currentDeletingCommunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">确认删除</h3>
                <p className="text-sm text-text-secondary">此操作不可恢复</p>
              </div>
            </div>
            
            <p className="text-text-secondary mb-6">
              您确定要删除社区 "<span className="font-medium">{currentDeletingCommunity.name}</span>" 吗？
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmDeleteCommunity}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 侧边栏遮罩 */}
      {isSidebarOpen && (
        <div 
          onClick={handleSidebarToggle}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        />
      )}
    </div>
  );
};

export default AdminCommunityManage;