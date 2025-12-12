

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

interface User {
  id: string;
  username: string;
  phone: string;
  type: 'parent' | 'teacher' | 'admin';
  registerTime: string;
  status: 'active' | 'disabled';
}

type SortField = 'id' | 'username' | 'phone' | 'type' | 'registerTime' | 'status';
type SortOrder = 'asc' | 'desc';

const AdminUserManage: React.FC = () => {
  // 模拟用户数据
  const mockUsers: User[] = [
    {
      id: 'U001',
      username: '张家长',
      phone: '138****8888',
      type: 'parent',
      registerTime: '2024-01-10 14:30',
      status: 'active'
    },
    {
      id: 'U002',
      username: '李老师',
      phone: '139****9999',
      type: 'teacher',
      registerTime: '2024-01-09 10:15',
      status: 'active'
    },
    {
      id: 'U003',
      username: '王家长',
      phone: '136****6666',
      type: 'parent',
      registerTime: '2024-01-08 16:45',
      status: 'disabled'
    },
    {
      id: 'U004',
      username: '陈老师',
      phone: '137****7777',
      type: 'teacher',
      registerTime: '2024-01-07 09:20',
      status: 'active'
    },
    {
      id: 'U005',
      username: '刘家长',
      phone: '135****5555',
      type: 'parent',
      registerTime: '2024-01-06 11:30',
      status: 'active'
    },
    {
      id: 'U006',
      username: '周老师',
      phone: '134****4444',
      type: 'teacher',
      registerTime: '2024-01-05 15:10',
      status: 'active'
    },
    {
      id: 'U007',
      username: '吴家长',
      phone: '133****3333',
      type: 'parent',
      registerTime: '2024-01-04 12:25',
      status: 'active'
    },
    {
      id: 'U008',
      username: '郑老师',
      phone: '132****2222',
      type: 'teacher',
      registerTime: '2024-01-03 14:50',
      status: 'disabled'
    }
  ];

  // 状态管理
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([...mockUsers]);
  const [sortField, setSortField] = useState<SortField>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [userSearch, setUserSearch] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '用户管理 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  // 筛选和搜索逻辑
  const applyFilters = (searchTerm: string) => {
    let filtered = mockUsers.filter(user => {
      const matchesSearch = !searchTerm || 
        user.username.toLowerCase().includes(searchTerm) ||
        user.phone.toLowerCase().includes(searchTerm);
      
      const matchesType = !userTypeFilter || user.type === userTypeFilter;
      const matchesStatus = !userStatusFilter || user.status === userStatusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });

    // 应用排序
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (sortField === 'registerTime') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  // 处理搜索输入
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setUserSearch(e.target.value);
    applyFilters(searchTerm);
  };

  // 处理筛选
  const handleFilter = () => {
    applyFilters(userSearch.toLowerCase());
  };

  // 处理重置
  const handleReset = () => {
    setUserSearch('');
    setUserTypeFilter('');
    setUserStatusFilter('');
    setFilteredUsers([...mockUsers]);
    setCurrentPage(1);
  };

  // 处理排序
  const handleSort = (field: SortField) => {
    const newSortOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newSortOrder);
    applyFilters(userSearch.toLowerCase());
  };

  // 处理页面大小改变
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // 处理页码点击
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // 切换用户状态
  const toggleUserStatus = (userId: string) => {
    // 在实际项目中，这里应该调用API
    const updatedUsers = mockUsers.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'disabled' : 'active' }
        : user
    );
    
    // 更新本地数据并重新应用筛选
    const searchTerm = userSearch.toLowerCase();
    let filtered = updatedUsers.filter(user => {
      const matchesSearch = !searchTerm || 
        user.username.toLowerCase().includes(searchTerm) ||
        user.phone.toLowerCase().includes(searchTerm);
      
      const matchesType = !userTypeFilter || user.type === userTypeFilter;
      const matchesStatus = !userStatusFilter || user.status === userStatusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });

    setFilteredUsers(filtered);
  };

  // 查看用户详情
  const viewUserDetail = (userId: string) => {
    const user = mockUsers.find(user => user.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsDrawerOpen(true);
    }
  };

  // 辅助函数
  const getUserTypeClass = (type: string) => {
    switch (type) {
      case 'parent': return styles.typeParent;
      case 'teacher': return styles.typeTeacher;
      case 'admin': return styles.typeAdmin;
      default: return '';
    }
  };

  const getUserTypeName = (type: string) => {
    switch (type) {
      case 'parent': return '家长';
      case 'teacher': return '教师';
      case 'admin': return '管理员';
      default: return type;
    }
  };

  const getStatusClass = (status: string) => {
    return status === 'active' ? styles.statusActive : styles.statusDisabled;
  };

  const getStatusName = (status: string) => {
    return status === 'active' ? '启用' : '禁用';
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return 'fas fa-sort text-xs';
    return sortOrder === 'asc' ? 'fas fa-sort-up text-xs' : 'fas fa-sort-down text-xs';
  };

  // 分页计算
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageUsers = filteredUsers.slice(startIndex, endIndex);

  // 生成页码
  const generatePageNumbers = () => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border-light h-16 z-50">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo区域 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
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
                  src="https://s.coze.cn/image/tmvZOz1SHLw/" 
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
            <span>控制台</span>
          </Link>
          <Link 
            to="/admin-user-manage" 
            className={`${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}
          >
            <i className="fas fa-users w-5"></i>
            <span>用户管理</span>
          </Link>
          <Link 
            to="/admin-community-manage" 
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-50 hover:text-text-primary"
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
                <h2 className="text-2xl font-bold text-text-primary mb-2">用户管理</h2>
                <nav className="text-sm text-text-secondary">
                  <Link to="/admin-dashboard" className="hover:text-primary">控制台</Link>
                  <span className="mx-2">/</span>
                  <span>用户管理</span>
                </nav>
              </div>
            </div>
          </div>

          {/* 工具栏区域 */}
          <div className="bg-white rounded-xl shadow-card p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* 搜索框 */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input 
                    type="text" 
                    value={userSearch}
                    onChange={handleSearchInput}
                    placeholder="搜索用户名或手机号..." 
                    className={`w-full pl-10 pr-4 py-2 border border-border-light rounded-lg ${styles.searchFocus}`}
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm"></i>
                </div>
              </div>
              
              {/* 筛选条件 */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <label htmlFor="user-type-filter" className="text-sm text-text-secondary">用户类型：</label>
                  <select 
                    id="user-type-filter" 
                    value={userTypeFilter}
                    onChange={(e) => setUserTypeFilter(e.target.value)}
                    className="px-3 py-2 border border-border-light rounded-lg text-sm"
                  >
                    <option value="">全部</option>
                    <option value="parent">家长</option>
                    <option value="teacher">教师</option>
                    <option value="admin">管理员</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label htmlFor="user-status-filter" className="text-sm text-text-secondary">账户状态：</label>
                  <select 
                    id="user-status-filter" 
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-border-light rounded-lg text-sm"
                  >
                    <option value="">全部</option>
                    <option value="active">启用</option>
                    <option value="disabled">禁用</option>
                  </select>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={handleFilter}
                    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                  >
                    <i className="fas fa-filter mr-1"></i>筛选
                  </button>
                  <button 
                    onClick={handleReset}
                    className="px-4 py-2 border border-border-light text-text-secondary text-sm font-medium rounded-lg hover:bg-gray-50"
                  >
                    <i className="fas fa-undo mr-1"></i>重置
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 内容展示区域 */}
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            {/* 表格头部 */}
            <div className="px-6 py-4 border-b border-border-light">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">用户列表</h3>
                <div className="text-sm text-text-secondary">
                  共 <span className="font-medium text-text-primary">{filteredUsers.length}</span> 个用户
                </div>
              </div>
            </div>
            
            {/* 表格 */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      <button 
                        onClick={() => handleSort('id')}
                        className="flex items-center space-x-1 hover:text-primary"
                      >
                        <span>用户ID</span>
                        <i className={getSortIcon('id')}></i>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      <button 
                        onClick={() => handleSort('username')}
                        className="flex items-center space-x-1 hover:text-primary"
                      >
                        <span>用户名</span>
                        <i className={getSortIcon('username')}></i>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      <button 
                        onClick={() => handleSort('phone')}
                        className="flex items-center space-x-1 hover:text-primary"
                      >
                        <span>手机号</span>
                        <i className={getSortIcon('phone')}></i>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      <button 
                        onClick={() => handleSort('type')}
                        className="flex items-center space-x-1 hover:text-primary"
                      >
                        <span>用户类型</span>
                        <i className={getSortIcon('type')}></i>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      <button 
                        onClick={() => handleSort('registerTime')}
                        className="flex items-center space-x-1 hover:text-primary"
                      >
                        <span>注册时间</span>
                        <i className={getSortIcon('registerTime')}></i>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      <button 
                        onClick={() => handleSort('status')}
                        className="flex items-center space-x-1 hover:text-primary"
                      >
                        <span>账户状态</span>
                        <i className={getSortIcon('status')}></i>
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pageUsers.map(user => (
                    <tr key={user.id} className={styles.tableHover}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{user.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUserTypeClass(user.type)}`}>
                          {getUserTypeName(user.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{user.registerTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(user.status)}`}>
                          {getStatusName(user.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button 
                          onClick={() => toggleUserStatus(user.id)}
                          className="text-primary hover:text-primary/80"
                        >
                          {user.status === 'active' ? '禁用' : '启用'}
                        </button>
                        <button 
                          onClick={() => viewUserDetail(user.id)}
                          className="text-info hover:text-info/80"
                        >
                          查看详情
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* 分页区域 */}
            <div className="px-6 py-4 border-t border-border-light">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-text-secondary">
                  <span>每页显示</span>
                  <select 
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="px-2 py-1 border border-border-light rounded text-sm"
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  <span>条，共 <span>{filteredUsers.length}</span> 条</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-border-light rounded text-sm text-text-secondary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="fas fa-chevron-left mr-1"></i>上一页
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {generatePageNumbers().map(page => (
                      <button 
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-1 border border-border-light rounded text-sm ${
                          page === currentPage 
                            ? 'bg-primary text-white border-primary' 
                            : 'text-text-secondary hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1 border border-border-light rounded text-sm text-text-secondary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一页<i className="fas fa-chevron-right ml-1"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 用户详情抽屉 */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsDrawerOpen(false)}
          ></div>
          <div className={`absolute right-0 top-0 bottom-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex items-center justify-between p-6 border-b border-border-light">
              <h3 className="text-lg font-semibold text-text-primary">用户详情</h3>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <i className="fas fa-times text-text-secondary"></i>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {selectedUser && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-2">基本信息</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">用户ID：</span>
                        <span className="text-text-primary">{selectedUser.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">用户名：</span>
                        <span className="text-text-primary">{selectedUser.username}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">手机号：</span>
                        <span className="text-text-primary">{selectedUser.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">用户类型：</span>
                        <span className="text-text-primary">{getUserTypeName(selectedUser.type)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">注册时间：</span>
                        <span className="text-text-primary">{selectedUser.registerTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">账户状态：</span>
                        <span className="text-text-primary">{getStatusName(selectedUser.status)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border-light">
                    <h4 className="text-sm font-medium text-text-primary mb-2">操作记录</h4>
                    <div className="space-y-2 text-sm text-text-secondary">
                      <div className="flex justify-between">
                        <span>最近登录：</span>
                        <span>2024-01-15 10:30</span>
                      </div>
                      <div className="flex justify-between">
                        <span>最后操作：</span>
                        <span>查看课程详情</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 侧边栏遮罩 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminUserManage;

