import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import request from '../../utils/request';
import AdminLayout from '../../components/AdminLayout';

interface Teacher {
  teacher_id: string;
  neighborhood_id: string;
  name: string;
  certificate: string;
  specialty: string;
  teaching_style: string;
  available_time: string;
  avg_score: string;
}

interface Youth {
  youth_id: string;
  family_id: string;
  name: string;
  age: number;
  health_note: string;
  interest: string;
  learning_style: string;
}

interface Parent {
  parent_id: string;
  family_id: string;
  name: string;
  phone: string;
  payment_account: string;
  register_time: string;
  account_status: string;
}

interface User {
  id: string;
  username: string;
  phone: string;
  type: 'parent' | 'teacher' | 'admin' | 'student';
  register_time: string;
  status: 'active' | 'disabled';
}

type SortField = 'id' | 'username' | 'phone' | 'type' | 'register_time' | 'status';
type SortOrder = 'asc' | 'desc';

const AdminUserManage: React.FC = () => {
  // 状态管理
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [sortField, setSortField] = useState<SortField | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [userSearch, setUserSearch] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedYouth, setSelectedYouth] = useState<Youth | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Youth>({
    youth_id: '',
    family_id: '',
    name: '',
    age: 0,
    health_note: '',
    interest: '',
    learning_style: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '用户管理 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  // 从API获取数据
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 获取教师数据
        const teachersResponse = await request.get<Teacher[]>('/api/admin/teachers');
        const teachers = teachersResponse.data;

        // 获取学生数据
        const youthResponse = await request.get<Youth[]>('/api/admin/youth');
        const youth = youthResponse.data;

        // 获取家长数据
        const parentsResponse = await request.get<Parent[]>('/api/admin/parents');
        const parents = parentsResponse.data;

        // 合并所有用户数据
        const combinedUsers: User[] = [
          ...teachers.map(teacher => ({
            id: teacher.teacher_id,
            username: teacher.name,
            phone: '',
            type: 'teacher' as const,
            register_time: '',
            status: 'active' as const
          })),
          ...youth.map(student => ({
            id: student.youth_id,
            username: student.name,
            phone: '',
            type: 'student' as const,
            register_time: '',
            status: 'active' as const
          })),
          ...parents.map(parent => ({
            id: parent.parent_id,
            username: parent.name,
            phone: parent.phone,
            type: 'parent' as const,
            register_time: parent.register_time,
            status: parent.account_status === 'active' ? 'active' as const : 'disabled' as const
          }))
        ];

        setAllUsers(combinedUsers);
        setFilteredUsers(combinedUsers);
      } catch (error) {
        console.error('获取用户数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 过滤和排序逻辑
  useEffect(() => {
    let filtered = allUsers;

    // 搜索过滤
    if (userSearch) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.phone.includes(userSearch)
      );
    }

    // 类型过滤
    if (userTypeFilter) {
      filtered = filtered.filter(user => user.type === userTypeFilter);
    }

    // 状态过滤
    if (userStatusFilter) {
      filtered = filtered.filter(user => user.status === userStatusFilter);
    }

    // 排序
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (sortField === 'register_time') {
          aValue = new Date(aValue).getTime() as unknown as string;
          bValue = new Date(bValue).getTime() as unknown as string;
        }

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // 重置到第一页
  }, [allUsers, userSearch, userTypeFilter, userStatusFilter, sortField, sortOrder]);

  // 排序处理
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // 查看用户详情
  const handleViewUser = async (user: User) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);

    try {
      if (user.type === 'student') {
        const response = await request.get<Youth>(`/api/admin/youth/${user.id}`);
        setSelectedYouth(response.data);
      }
    } catch (error) {
      console.error('获取用户详情失败:', error);
    }
  };

  // 编辑用户
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    if (user.type === 'student' && selectedYouth) {
      setEditFormData(selectedYouth);
    }
    setIsEditing(true);
  };

  // 保存编辑
  const handleSaveEdit = async () => {
    if (!selectedYouth) return;

    try {
      await request.put(`/api/admin/youth/${selectedYouth.youth_id}`, editFormData);
      // 刷新数据
      const response = await request.get<Youth[]>('/api/admin/youth');
      const youth = response.data;
      const updatedYouth = youth.find(s => s.youth_id === selectedYouth.youth_id);
      if (updatedYouth) {
        setSelectedYouth(updatedYouth);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  // 获取用户类型样式
  const getUserTypeStyle = (type: string) => {
    switch (type) {
      case 'parent': return styles.typeParent;
      case 'teacher': return styles.typeTeacher;
      case 'admin': return styles.typeAdmin;
      case 'student': return styles.typeStudent;
      default: return '';
    }
  };

  // 获取用户类型文本
  const getUserTypeText = (type: string) => {
    switch (type) {
      case 'parent': return '家长';
      case 'teacher': return '教师';
      case 'admin': return '管理员';
      case 'student': return '学生';
      default: return type;
    }
  };

  // 获取状态样式
  const getStatusStyle = (status: string) => {
    return status === 'active' ? styles.statusActive : styles.statusDisabled;
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    return status === 'active' ? '启用' : '禁用';
  };

  // 获取排序图标
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
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
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
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="搜索用户名或手机号..."
                className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
            </div>
          </div>

          {/* 过滤器和操作 */}
          <div className="flex flex-wrap gap-4">
            <select 
              value={userTypeFilter} 
              onChange={(e) => setUserTypeFilter(e.target.value)}
              className="px-4 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">所有类型</option>
              <option value="parent">家长</option>
              <option value="teacher">教师</option>
              <option value="student">学生</option>
              <option value="admin">管理员</option>
            </select>

            <select 
              value={userStatusFilter} 
              onChange={(e) => setUserStatusFilter(e.target.value)}
              className="px-4 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">所有状态</option>
              <option value="active">启用</option>
              <option value="disabled">禁用</option>
            </select>
          </div>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border-light">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">用户列表</h3>
            <span className="text-sm text-text-secondary">
              共 {filteredUsers.length} 个用户
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-light">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>ID</span>
                      <i className={getSortIcon('id')}></i>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('username')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>用户名</span>
                      <i className={getSortIcon('username')}></i>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('phone')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>手机号</span>
                      <i className={getSortIcon('phone')}></i>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>类型</span>
                      <i className={getSortIcon('type')}></i>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('register_time')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>注册时间</span>
                      <i className={getSortIcon('register_time')}></i>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>状态</span>
                      <i className={getSortIcon('status')}></i>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {pageUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {user.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserTypeStyle(user.type)}`}>
                        {getUserTypeText(user.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {user.register_time || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(user.status)}`}>
                        {getStatusText(user.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-primary hover:text-primary-dark mr-3"
                      >
                        查看
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-secondary hover:text-secondary-dark"
                      >
                        编辑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border-light">
            <div className="flex items-center justify-between">
              <div className="text-sm text-text-secondary">
                显示 {startIndex + 1} 到 {Math.min(endIndex, filteredUsers.length)} 条，共 {filteredUsers.length} 条
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-border-light rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  上一页
                </button>
                
                {generatePageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded-md ${
                      currentPage === page 
                        ? 'bg-primary text-white border-primary' 
                        : 'border-border-light hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-border-light rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  下一页
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

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
                className="text-text-secondary hover:text-text-primary"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {selectedUser && (
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-text-secondary mb-2">基本信息</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-text-secondary">ID：</span>
                      <span className="text-sm text-text-primary">{selectedUser.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-text-secondary">用户名：</span>
                      <span className="text-sm text-text-primary">{selectedUser.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-text-secondary">类型：</span>
                      <span className={`text-sm px-2 py-1 rounded-full ${getUserTypeStyle(selectedUser.type)}`}>
                        {getUserTypeText(selectedUser.type)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-text-secondary">状态：</span>
                      <span className={`text-sm px-2 py-1 rounded-full ${getStatusStyle(selectedUser.status)}`}>
                        {getStatusText(selectedUser.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedYouth && (
                  <div>
                    <h4 className="text-sm font-medium text-text-secondary mb-2">详细信息</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-text-secondary">年龄：</span>
                        <span className="text-sm text-text-primary">{selectedYouth.age}岁</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-text-secondary">健康状况：</span>
                        <span className="text-sm text-text-primary">{selectedYouth.health_note || '无'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-text-secondary">兴趣爱好：</span>
                        <span className="text-sm text-text-primary">{selectedYouth.interest || '无'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-text-secondary">学习方式：</span>
                        <span className="text-sm text-text-primary">{selectedYouth.learning_style || '无'}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-border-light">
                  <button
                    onClick={() => handleEditUser(selectedUser)}
                    className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    编辑用户
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 编辑模态框 */}
      {isEditing && selectedYouth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsEditing(false)}
          ></div>
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-border-light">
              <h3 className="text-lg font-semibold text-text-primary">编辑用户</h3>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-text-secondary hover:text-text-primary"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">姓名</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">年龄</label>
                <input
                  type="number"
                  value={editFormData.age}
                  onChange={(e) => setEditFormData({...editFormData, age: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">健康状况</label>
                <input
                  type="text"
                  value={editFormData.health_note}
                  onChange={(e) => setEditFormData({...editFormData, health_note: e.target.value})}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">兴趣爱好</label>
                <input
                  type="text"
                  value={editFormData.interest}
                  onChange={(e) => setEditFormData({...editFormData, interest: e.target.value})}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">学习方式</label>
                <input
                  type="text"
                  value={editFormData.learning_style}
                  onChange={(e) => setEditFormData({...editFormData, learning_style: e.target.value})}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t border-border-light">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManage;