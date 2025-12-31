import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import request from '../../utils/request';

interface SystemSettingsProps {
  // Add any props if needed
}

interface PersonalInfo {
  name: string;
  phone: string;
  email: string;
}

interface AccountSettings {
  password?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const SystemSettings: React.FC<SystemSettingsProps> = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    phone: '',
    email: ''
  });
  
  const [accountSettings, setAccountSettings] = useState<AccountSettings>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
    const fetchPersonalInfo = async () => {
      setIsLoading(true);
      try {
        const teacherId = getTeacherId();
        const response = await request.get(`/api/teacher/${teacherId}`);
        const teacherData = response.data;
        
        setPersonalInfo({
          name: teacherData.name || '',
          phone: teacherData.phone || '',
          email: teacherData.email || ''
        });
      } catch (error) {
        console.error('获取个人信息失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonalInfo();
  }, []);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleAccountSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSavePersonalInfo = async () => {
    setIsSaving(true);
    setSuccessMessage('');
    try {
      const teacherId = getTeacherId();
      await request.put(`/api/teacher/${teacherId}`, {
        name: personalInfo.name,
        phone: personalInfo.phone,
        email: personalInfo.email
      });
      setSuccessMessage('个人信息保存成功');
      
      // Update userInfo in localStorage if needed
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        userInfo.name = personalInfo.name;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
      }
    } catch (error) {
      console.error('保存个人信息失败:', error);
      alert('保存失败，请稍后重试');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleChangePassword = async () => {
    if (!accountSettings.password || !accountSettings.newPassword || !accountSettings.confirmPassword) {
      alert('请填写所有密码字段');
      return;
    }
    
    if (accountSettings.newPassword !== accountSettings.confirmPassword) {
      alert('新密码和确认密码不一致');
      return;
    }
    
    setIsSaving(true);
    setSuccessMessage('');
    try {
      const teacherId = getTeacherId();
      await request.post(`/api/teacher/${teacherId}/change-password`, {
        currentPassword: accountSettings.password,
        newPassword: accountSettings.newPassword
      });
      setSuccessMessage('密码修改成功');
      setAccountSettings({});
    } catch (error) {
      console.error('修改密码失败:', error);
      alert('修改失败，请检查当前密码是否正确');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 页面头部 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">系统设置</h2>
        <nav className="text-sm text-text-secondary">
          <span>首页</span>
          <i className="fas fa-chevron-right mx-2"></i>
          <span>教师中心</span>
          <i className="fas fa-chevron-right mx-2"></i>
          <span className="text-primary">系统设置</span>
        </nav>
      </div>

      {/* 成功消息 */}
      {successMessage && (
        <div className="mb-6 p-4 bg-success/10 text-success rounded-lg flex items-center">
          <i className="fas fa-check-circle mr-2"></i>
          <span>{successMessage}</span>
        </div>
      )}

      {/* 个人信息设置 */}
      <section className="mb-8">
        <div className="bg-white rounded-xl shadow-card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-6">个人信息</h3>
          
          {isLoading ? (
            <div className="animate-pulse">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-1/4 h-5 bg-gray-200 rounded"></div>
                  <div className="w-3/4 ml-4 h-5 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/4 h-5 bg-gray-200 rounded"></div>
                  <div className="w-3/4 ml-4 h-5 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center">
                  <div className="w-1/4 h-5 bg-gray-200 rounded"></div>
                  <div className="w-3/4 ml-4 h-5 bg-gray-200 rounded"></div>
                </div>
                <div className="w-1/6 h-10 bg-gray-200 rounded mt-4"></div>
              </div>
            </div>
          ) : (
            <div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-1 flex items-center">
                    <label className="text-sm font-medium text-text-primary">姓名</label>
                  </div>
                  <div className="md:col-span-3">
                    <input
                      type="text"
                      name="name"
                      value={personalInfo.name}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-1 flex items-center">
                    <label className="text-sm font-medium text-text-primary">手机号码</label>
                  </div>
                  <div className="md:col-span-3">
                    <input
                      type="tel"
                      name="phone"
                      value={personalInfo.phone}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-1 flex items-center">
                    <label className="text-sm font-medium text-text-primary">邮箱</label>
                  </div>
                  <div className="md:col-span-3">
                    <input
                      type="email"
                      name="email"
                      value={personalInfo.email}
                      onChange={handlePersonalInfoChange}
                      className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSavePersonalInfo}
                  disabled={isSaving}
                  className={`px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSaving ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      保存中...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      保存信息
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 账户安全设置 */}
      <section>
        <div className="bg-white rounded-xl shadow-card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-6">账户安全</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1 flex items-center">
                <label className="text-sm font-medium text-text-primary">当前密码</label>
              </div>
              <div className="md:col-span-3">
                <input
                  type="password"
                  name="password"
                  value={accountSettings.password || ''}
                  onChange={handleAccountSettingsChange}
                  className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1 flex items-center">
                <label className="text-sm font-medium text-text-primary">新密码</label>
              </div>
              <div className="md:col-span-3">
                <input
                  type="password"
                  name="newPassword"
                  value={accountSettings.newPassword || ''}
                  onChange={handleAccountSettingsChange}
                  className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1 flex items-center">
                <label className="text-sm font-medium text-text-primary">确认新密码</label>
              </div>
              <div className="md:col-span-3">
                <input
                  type="password"
                  name="confirmPassword"
                  value={accountSettings.confirmPassword || ''}
                  onChange={handleAccountSettingsChange}
                  className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleChangePassword}
              disabled={isSaving}
              className={`px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSaving ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  修改中...
                </>
              ) : (
                <>
                  <i className="fas fa-key mr-2"></i>
                  修改密码
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SystemSettings;