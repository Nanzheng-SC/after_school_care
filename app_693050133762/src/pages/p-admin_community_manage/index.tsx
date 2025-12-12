

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

interface Community {
  id: number;
  name: string;
  address: string;
  contactPhone: string;
  contactEmail?: string;
  facilities: string[];
  serviceArea?: string;
}

interface FormData {
  name: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
  facilities: string[];
  serviceArea: string;
}

const AdminCommunityManage: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([
    {
      id: 1,
      name: '阳光社区',
      address: '北京市朝阳区阳光路123号',
      contactPhone: '010-12345678',
      contactEmail: 'sunshine@community.com',
      facilities: ['教室', '操场', '图书馆', '电脑室'],
      serviceArea: '覆盖周边3个小区，提供优质的课后托管服务'
    },
    {
      id: 2,
      name: '绿洲社区',
      address: '北京市海淀区绿洲路456号',
      contactPhone: '010-87654321',
      contactEmail: 'oasis@community.com',
      facilities: ['教室', '音乐室', '美术室', '体育馆'],
      serviceArea: '专注艺术教育，拥有专业的艺术教室和设备'
    },
    {
      id: 3,
      name: '智慧社区',
      address: '北京市西城区智慧路789号',
      contactPhone: '010-56789012',
      contactEmail: 'smart@community.com',
      facilities: ['教室', '电脑室', '会议室', '图书馆'],
      serviceArea: '科技教育特色，配备先进的计算机设备'
    },
    {
      id: 4,
      name: '和谐社区',
      address: '北京市东城区和谐路321号',
      contactPhone: '010-23456789',
      contactEmail: 'harmony@community.com',
      facilities: ['教室', '操场', '音乐室', '美术室'],
      serviceArea: '综合性社区，提供多元化的课程选择'
    },
    {
      id: 5,
      name: '幸福社区',
      address: '北京市丰台区幸福路654号',
      contactPhone: '010-90123456',
      contactEmail: 'happiness@community.com',
      facilities: ['教室', '图书馆', '体育馆', '会议室'],
      serviceArea: '注重综合素质培养，设施齐全'
    }
  ]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentEditingCommunity, setCurrentEditingCommunity] = useState<Community | null>(null);
  const [currentDeletingCommunity, setCurrentDeletingCommunity] = useState<Community | null>(null);
  const [communitySearchTerm, setCommunitySearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    address: '',
    contactPhone: '',
    contactEmail: '',
    facilities: [],
    serviceArea: ''
  });

  const pageSize = 10;

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '社区管理 - 课智配';
    return () => { document.title = originalTitle; };
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

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCommunitySearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommunitySearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleOpenCommunityModal = (community: Community | null = null) => {
    setCurrentEditingCommunity(community);
    if (community) {
      setFormData({
        name: community.name,
        address: community.address,
        contactPhone: community.contactPhone,
        contactEmail: community.contactEmail || '',
        facilities: [...community.facilities],
        serviceArea: community.serviceArea || ''
      });
    } else {
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFacilityChange = (facility: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      facilities: checked 
        ? [...prev.facilities, facility]
        : prev.facilities.filter(f => f !== facility)
    }));
  };

  const handleSubmitCommunityForm = () => {
    if (currentEditingCommunity) {
      setCommunities(prev => prev.map(community => 
        community.id === currentEditingCommunity.id 
          ? { ...community, ...formData }
          : community
      ));
    } else {
      const newId = Math.max(...communities.map(c => c.id)) + 1;
      setCommunities(prev => [...prev, { id: newId, ...formData }]);
    }
    handleCloseCommunityModal();
  };

  const handleDeleteCommunity = (community: Community) => {
    setCurrentDeletingCommunity(community);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (currentDeletingCommunity) {
      setCommunities(prev => prev.filter(c => c.id !== currentDeletingCommunity.id));
    }
    setIsDeleteModalOpen(false);
    setCurrentDeletingCommunity(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentDeletingCommunity(null);
  };

  const handleViewCommunity = (community: Community) => {
    console.log('查看社区详情:', community);
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
                className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm"></i>
            </div>
          </div>
          
          {/* 右侧操作区 */}
          <div className="flex items-center space-x-4">
            {/* 消息中心 */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <i className="fas fa-bell text-text-secondary"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            
            {/* 用户头像 */}
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
                <img 
                  src="https://s.coze.cn/image/KWPucYPDI6o/" 
                  alt="管理员头像" 
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden md:block text-sm text-text-primary">管理员</span>
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
            to="/admin-dashboard" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-tachometer-alt w-5"></i>
            <span>后台首页</span>
          </Link>
          <Link 
            to="/admin-user-manage" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-users w-5"></i>
            <span>用户管理</span>
          </Link>
          <Link 
            to="/admin-community-manage" 
            className={`${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}
          >
            <i className="fas fa-building w-5"></i>
            <span>社区管理</span>
          </Link>
          <Link 
            to="/admin-course-manage" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-book-open w-5"></i>
            <span>课程管理</span>
          </Link>
          <Link 
            to="/admin-evaluation-manage" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-star w-5"></i>
            <span>评价管理</span>
          </Link>
          <Link 
            to="/admin-refund-manage" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-undo w-5"></i>
            <span>退款管理</span>
          </Link>
          <Link 
            to="/admin-system-config" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-cog w-5"></i>
            <span>系统配置</span>
          </Link>
          <Link 
            to="/admin-report" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
          >
            <i className="fas fa-chart-bar w-5"></i>
            <span>数据报表</span>
          </Link>
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className="lg:ml-64 pt-16 min-h-screen">
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">场地资源</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-border-light">
                    {currentPageCommunities.map(community => (
                      <tr key={community.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-text-primary">{community.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-text-secondary">{community.address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-text-secondary">{community.contactPhone}</div>
                          {community.contactEmail && (
                            <div className="text-sm text-text-secondary">{community.contactEmail}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {community.facilities.map(facility => (
                              <span key={facility} className="px-2 py-1 bg-gray-100 text-text-secondary text-xs rounded-full">
                                {facility}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleOpenCommunityModal(community)}
                              className="text-primary hover:text-primary/80"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              onClick={() => handleViewCommunity(community)}
                              className="text-info hover:text-info/80"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button 
                              onClick={() => handleDeleteCommunity(community)}
                              className="text-danger hover:text-danger/80"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 分页 */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-text-secondary">
                  显示 <span>{filteredCommunitiesCount > 0 ? startIndex : 0}</span> 到 <span>{endIndex}</span> 条，共 <span>{filteredCommunitiesCount}</span> 条记录
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-border-light rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <div className="flex space-x-1">
                    {generatePageNumbers()}
                  </div>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, getTotalPages()))}
                    disabled={currentPage * pageSize >= filteredCommunitiesCount}
                    className="px-3 py-1 border border-border-light rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

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
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-text-primary">社区名称 *</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleFormInputChange}
                      className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                      placeholder="请输入社区名称"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="contactPhone" className="block text-sm font-medium text-text-primary">联系电话 *</label>
                    <input 
                      type="tel" 
                      id="contactPhone" 
                      name="contactPhone" 
                      value={formData.contactPhone}
                      onChange={handleFormInputChange}
                      className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                      placeholder="请输入联系电话"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="address" className="block text-sm font-medium text-text-primary">详细地址 *</label>
                  <textarea 
                    id="address" 
                    name="address" 
                    rows={2}
                    value={formData.address}
                    onChange={handleFormInputChange}
                    className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                    placeholder="请输入详细地址"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-text-primary">联系邮箱</label>
                  <input 
                    type="email" 
                    id="contactEmail" 
                    name="contactEmail" 
                    value={formData.contactEmail}
                    onChange={handleFormInputChange}
                    className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                    placeholder="请输入联系邮箱"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-primary">场地资源</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availableFacilities.map(facility => (
                      <label key={facility} className="flex items-center space-x-2 p-3 border border-border-light rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input 
                          type="checkbox" 
                          value={facility}
                          checked={formData.facilities.includes(facility)}
                          onChange={(e) => handleFacilityChange(facility, e.target.checked)}
                          className="text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-text-primary">{facility}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="serviceArea" className="block text-sm font-medium text-text-primary">服务范围</label>
                  <textarea 
                    id="serviceArea" 
                    name="serviceArea" 
                    rows={3}
                    value={formData.serviceArea}
                    onChange={handleFormInputChange}
                    className={`w-full px-4 py-2 border border-border-light rounded-lg ${styles.formInputFocus}`}
                    placeholder="请描述社区的服务范围和特色"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-border-light">
                <button 
                  onClick={handleCloseCommunityModal}
                  className="px-6 py-2 border border-border-light text-text-secondary rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button 
                  onClick={handleSubmitCommunityForm}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认模态框 */}
      {isDeleteModalOpen && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 ${styles.modalBackdrop} z-50`}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className={`bg-white rounded-xl shadow-card-hover w-full max-w-md ${styles.modalEnter}`}>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-exclamation-triangle text-danger text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">确认删除</h3>
                <p className="text-text-secondary mb-6">
                  确定要删除社区 "<span>{currentDeletingCommunity?.name}</span>" 吗？此操作不可撤销。
                </p>
                
                <div className="flex items-center justify-center space-x-3">
                  <button 
                    onClick={handleCloseDeleteModal}
                    className="px-6 py-2 border border-border-light text-text-secondary rounded-lg hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleConfirmDelete}
                    className="px-6 py-2 bg-danger text-white rounded-lg hover:bg-danger/90"
                  >
                    删除
                  </button>
                </div>
              </div>
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

