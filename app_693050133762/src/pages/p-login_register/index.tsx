

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
  role: 'parent' | 'teacher' | 'admin';
}

interface RegisterFormData {
  phone: string;
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface ForgotPasswordFormData {
  phone: string;
  code: string;
  newPassword: string;
  confirmNewPassword: string;
}

type AuthTab = 'login' | 'register' | 'forgot';

const LoginRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 页面状态
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // 密码可见性状态
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  
  // 验证码倒计时状态
  const [registerCodeCountdown, setRegisterCodeCountdown] = useState(0);
  const [forgotCodeCountdown, setForgotCodeCountdown] = useState(0);
  
  // 表单数据状态
  const [loginFormData, setLoginFormData] = useState<LoginFormData>({
    username: '',
    password: '',
    rememberMe: false,
    role: 'parent'
  });
  
  const [registerFormData, setRegisterFormData] = useState<RegisterFormData>({
    phone: '',
    email: '',
    code: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  const [forgotPasswordFormData, setForgotPasswordFormData] = useState<ForgotPasswordFormData>({
    phone: '',
    code: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '登录注册 - 课智配';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // 验证码倒计时效果
  useEffect(() => {
    let timer: number | null = null;
    if (registerCodeCountdown > 0) {
      timer = window.setTimeout(() => {
        setRegisterCodeCountdown(registerCodeCountdown - 1);
      }, 1000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [registerCodeCountdown]);

  useEffect(() => {
    let timer: number | null = null;
    if (forgotCodeCountdown > 0) {
      timer = window.setTimeout(() => {
        setForgotCodeCountdown(forgotCodeCountdown - 1);
      }, 1000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [forgotCodeCountdown]);

  // 表单验证函数
  const validatePassword = (password: string): boolean => {
    return password.length >= 6 && password.length <= 20;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  // 验证码发送函数
  const handleSendCode = (phone: string, type: 'register' | 'forgot') => {
    if (!phone) {
      alert('请先输入手机号');
      return;
    }
    
    if (!validatePhone(phone)) {
      alert('请输入正确的手机号');
      return;
    }
    
    // 开始倒计时
    if (type === 'register') {
      setRegisterCodeCountdown(60);
    } else {
      setForgotCodeCountdown(60);
    }
    
    console.log('发送验证码到手机号：', phone);
  };

  // 表单提交处理
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { username, password, role } = loginFormData;
    
    if (!username || !password) {
      alert('请填写完整的登录信息');
      return;
    }
    
    // 模拟登录成功
    console.log('登录信息：', { username, password, role });
    setSuccessMessage('登录成功，正在跳转...');
    setShowSuccessModal(true);
    
    setTimeout(() => {
      setShowSuccessModal(false);
      // 根据选择的角色跳转到不同页面
      if (role === 'teacher') {
        navigate('/teacher-center');
      } else if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        // 默认跳转到家长页面
        navigate('/home');
      }
    }, 1500);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { phone, email, code, password, confirmPassword, agreeTerms } = registerFormData;
    
    if (!phone || !email || !code || !password || !confirmPassword) {
      alert('请填写完整的注册信息');
      return;
    }
    
    if (!validatePhone(phone)) {
      alert('请输入正确的手机号');
      return;
    }
    
    if (!validateEmail(email)) {
      alert('请输入正确的邮箱地址');
      return;
    }
    
    if (!validatePassword(password)) {
      alert('密码长度应为6-20位');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    
    if (!agreeTerms) {
      alert('请同意用户协议和隐私政策');
      return;
    }
    
    // 模拟注册成功
    console.log('注册信息：', { phone, email, code, password });
    setSuccessMessage('注册成功，正在跳转...');
    setShowSuccessModal(true);
    
    setTimeout(() => {
      setShowSuccessModal(false);
      navigate('/home');
    }, 1500);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { phone, code, newPassword, confirmNewPassword } = forgotPasswordFormData;
    
    if (!phone || !code || !newPassword || !confirmNewPassword) {
      alert('请填写完整的信息');
      return;
    }
    
    if (!validatePhone(phone)) {
      alert('请输入正确的手机号');
      return;
    }
    
    if (!validatePassword(newPassword)) {
      alert('新密码长度应为6-20位');
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      alert('两次输入的新密码不一致');
      return;
    }
    
    // 模拟重置密码成功
    console.log('重置密码信息：', { phone, code, newPassword });
    setSuccessMessage('密码重置成功，请重新登录');
    setShowSuccessModal(true);
    
    setTimeout(() => {
      setShowSuccessModal(false);
      setActiveTab('login');
    }, 1500);
  };

  // 模态框处理
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  const handleSuccessModalBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowSuccessModal(false);
    }
  };

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSuccessModal(false);
      }
      
      if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement?.tagName === 'INPUT' && (activeElement as HTMLInputElement).form) {
          const form = (activeElement as HTMLInputElement).form;
          const submitButton = form?.querySelector('button[type="submit"]') as HTMLButtonElement;
          if (submitButton) {
            submitButton.click();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <div className="min-h-screen flex items-center justify-center p-4">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-success/10 rounded-full blur-3xl"></div>
        </div>
        
        {/* 主内容区 */}
        <div className="relative w-full max-w-md">
          {/* Logo区域 */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 ${styles.logoGlow}`}>
              <i className="fas fa-graduation-cap text-white text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">课智配</h1>
            <p className="text-text-secondary">智能匹配课后托管服务</p>
          </div>
          
          {/* 登录注册卡片 */}
          <div className="bg-white rounded-2xl shadow-login-card p-8">
            {/* Tab切换 */}
            {activeTab !== 'forgot' && (
              <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-3 px-4 text-center text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === 'login' ? styles.tabActive : styles.tabInactive
                  }`}
                >
                  登录
                </button>
                <button 
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 py-3 px-4 text-center text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === 'register' ? styles.tabActive : styles.tabInactive
                  }`}
                >
                  注册
                </button>
              </div>
            )}
            
            {/* 登录表单 */}
            {activeTab === 'login' && (
              <div>
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="login-username" className="block text-sm font-medium text-text-primary mb-2">
                      手机号/邮箱
                    </label>
                    <input 
                      type="text" 
                      id="login-username" 
                      name="username" 
                      value={loginFormData.username}
                      onChange={(e) => setLoginFormData({...loginFormData, username: e.target.value})}
                      className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} transition-all duration-200`}
                      placeholder="请输入手机号或邮箱"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="login-password" className="block text-sm font-medium text-text-primary mb-2">
                      密码
                    </label>
                    <div className="relative">
                      <input 
                        type={showLoginPassword ? 'text' : 'password'}
                        id="login-password" 
                        name="password" 
                        value={loginFormData.password}
                        onChange={(e) => setLoginFormData({...loginFormData, password: e.target.value})}
                        className={`w-full px-4 py-3 pr-12 border border-border-light rounded-lg ${styles.formInputFocus} transition-all duration-200`}
                        placeholder="请输入密码"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                      >
                        <i className={`fas ${showLoginPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={loginFormData.rememberMe}
                        onChange={(e) => setLoginFormData({...loginFormData, rememberMe: e.target.checked})}
                        className="w-4 h-4 text-primary border-border-light rounded focus:ring-primary focus:ring-2"
                      />
                      <span className="ml-2 text-sm text-text-secondary">记住密码</span>
                    </label>
                    <button 
                      type="button" 
                      onClick={() => setActiveTab('forgot')}
                      className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
                    >
                      忘记密码？
                    </button>
                  </div>
                  
                  {/* 角色选择 */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      登录角色
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <label className="flex flex-col items-center justify-center p-3 border border-border-light rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                        <input 
                          type="radio" 
                          name="role" 
                          value="parent" 
                          checked={loginFormData.role === 'parent'}
                          onChange={(e) => setLoginFormData({...loginFormData, role: e.target.value as 'parent' | 'teacher' | 'admin'})}
                          className="sr-only"
                        />
                        <i className="fas fa-user text-primary text-xl mb-2"></i>
                        <span className="text-sm text-text-primary">家长</span>
                      </label>
                      <label className="flex flex-col items-center justify-center p-3 border border-border-light rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                        <input 
                          type="radio" 
                          name="role" 
                          value="teacher" 
                          checked={loginFormData.role === 'teacher'}
                          onChange={(e) => setLoginFormData({...loginFormData, role: e.target.value as 'parent' | 'teacher' | 'admin'})}
                          className="sr-only"
                        />
                        <i className="fas fa-chalkboard-teacher text-primary text-xl mb-2"></i>
                        <span className="text-sm text-text-primary">老师</span>
                      </label>
                      <label className="flex flex-col items-center justify-center p-3 border border-border-light rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                        <input 
                          type="radio" 
                          name="role" 
                          value="admin" 
                          checked={loginFormData.role === 'admin'}
                          onChange={(e) => setLoginFormData({...loginFormData, role: e.target.value as 'parent' | 'teacher' | 'admin'})}
                          className="sr-only"
                        />
                        <i className="fas fa-user-shield text-primary text-xl mb-2"></i>
                        <span className="text-sm text-text-primary">管理员</span>
                      </label>
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200"
                  >
                    登录
                  </button>
                </form>
              </div>
            )}
            
            {/* 注册表单 */}
            {activeTab === 'register' && (
              <div>
                <form onSubmit={handleRegisterSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="register-phone" className="block text-sm font-medium text-text-primary mb-2">
                      手机号
                    </label>
                    <input 
                      type="tel" 
                      id="register-phone" 
                      name="phone" 
                      value={registerFormData.phone}
                      onChange={(e) => setRegisterFormData({...registerFormData, phone: e.target.value})}
                      className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} transition-all duration-200`}
                      placeholder="请输入手机号"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="register-email" className="block text-sm font-medium text-text-primary mb-2">
                      邮箱
                    </label>
                    <input 
                      type="email" 
                      id="register-email" 
                      name="email" 
                      value={registerFormData.email}
                      onChange={(e) => setRegisterFormData({...registerFormData, email: e.target.value})}
                      className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} transition-all duration-200`}
                      placeholder="请输入邮箱"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="register-code" className="block text-sm font-medium text-text-primary mb-2">
                      验证码
                    </label>
                    <div className="flex space-x-3">
                      <input 
                        type="text" 
                        id="register-code" 
                        name="code" 
                        value={registerFormData.code}
                        onChange={(e) => setRegisterFormData({...registerFormData, code: e.target.value})}
                        className={`flex-1 px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} transition-all duration-200`}
                        placeholder="请输入验证码"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => handleSendCode(registerFormData.phone, 'register')}
                        disabled={registerCodeCountdown > 0}
                        className="px-4 py-3 bg-gray-100 text-text-secondary rounded-lg hover:bg-gray-200 transition-all duration-200 whitespace-nowrap disabled:opacity-50"
                      >
                        {registerCodeCountdown > 0 ? `${registerCodeCountdown}秒后重发` : '发送验证码'}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="register-password" className="block text-sm font-medium text-text-primary mb-2">
                      密码
                    </label>
                    <div className="relative">
                      <input 
                        type={showRegisterPassword ? 'text' : 'password'}
                        id="register-password" 
                        name="password" 
                        value={registerFormData.password}
                        onChange={(e) => setRegisterFormData({...registerFormData, password: e.target.value})}
                        className={`w-full px-4 py-3 pr-12 border border-border-light rounded-lg ${styles.formInputFocus} transition-all duration-200`}
                        placeholder="请输入密码（6-20位）"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                      >
                        <i className={`fas ${showRegisterPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-text-primary mb-2">
                      确认密码
                    </label>
                    <div className="relative">
                      <input 
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirm-password" 
                        name="confirmPassword" 
                        value={registerFormData.confirmPassword}
                        onChange={(e) => setRegisterFormData({...registerFormData, confirmPassword: e.target.value})}
                        className={`w-full px-4 py-3 pr-12 border border-border-light rounded-lg ${styles.formInputFocus} transition-all duration-200`}
                        placeholder="请再次输入密码"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                      >
                        <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <input 
                      type="checkbox" 
                      id="agree-terms" 
                      checked={registerFormData.agreeTerms}
                      onChange={(e) => setRegisterFormData({...registerFormData, agreeTerms: e.target.checked})}
                      className="w-4 h-4 text-primary border-border-light rounded focus:ring-primary focus:ring-2 mt-1"
                      required
                    />
                    <span className="ml-2 text-sm text-text-secondary">
                      我已阅读并同意
                      <a href="#" className="text-primary hover:text-primary/80">《用户协议》</a>
                      和
                      <a href="#" className="text-primary hover:text-primary/80">《隐私政策》</a>
                    </span>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200"
                  >
                    注册
                  </button>
                </form>
              </div>
            )}
            
            {/* 找回密码表单 */}
            {activeTab === 'forgot' && (
              <div>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">找回密码</h3>
                  <p className="text-sm text-text-secondary">请输入您的手机号，我们将发送验证码帮您重置密码</p>
                </div>
                
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="forgot-phone" className="block text-sm font-medium text-text-primary mb-2">
                      手机号
                    </label>
                    <input 
                      type="tel" 
                      id="forgot-phone" 
                      name="phone" 
                      value={forgotPasswordFormData.phone}
                      onChange={(e) => setForgotPasswordFormData({...forgotPasswordFormData, phone: e.target.value})}
                      className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} transition-all duration-200`}
                      placeholder="请输入手机号"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="forgot-code" className="block text-sm font-medium text-text-primary mb-2">
                      验证码
                    </label>
                    <div className="flex space-x-3">
                      <input 
                        type="text" 
                        id="forgot-code" 
                        name="code" 
                        value={forgotPasswordFormData.code}
                        onChange={(e) => setForgotPasswordFormData({...forgotPasswordFormData, code: e.target.value})}
                        className={`flex-1 px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} transition-all duration-200`}
                        placeholder="请输入验证码"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => handleSendCode(forgotPasswordFormData.phone, 'forgot')}
                        disabled={forgotCodeCountdown > 0}
                        className="px-4 py-3 bg-gray-100 text-text-secondary rounded-lg hover:bg-gray-200 transition-all duration-200 whitespace-nowrap disabled:opacity-50"
                      >
                        {forgotCodeCountdown > 0 ? `${forgotCodeCountdown}秒后重发` : '发送验证码'}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-text-primary mb-2">
                      新密码
                    </label>
                    <div className="relative">
                      <input 
                        type={showNewPassword ? 'text' : 'password'}
                        id="new-password" 
                        name="newPassword" 
                        value={forgotPasswordFormData.newPassword}
                        onChange={(e) => setForgotPasswordFormData({...forgotPasswordFormData, newPassword: e.target.value})}
                        className={`w-full px-4 py-3 pr-12 border border-border-light rounded-lg ${styles.formInputFocus} transition-all duration-200`}
                        placeholder="请输入新密码（6-20位）"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                      >
                        <i className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="confirm-new-password" className="block text-sm font-medium text-text-primary mb-2">
                      确认新密码
                    </label>
                    <div className="relative">
                      <input 
                        type={showConfirmNewPassword ? 'text' : 'password'}
                        id="confirm-new-password" 
                        name="confirmNewPassword" 
                        value={forgotPasswordFormData.confirmNewPassword}
                        onChange={(e) => setForgotPasswordFormData({...forgotPasswordFormData, confirmNewPassword: e.target.value})}
                        className={`w-full px-4 py-3 pr-12 border border-border-light rounded-lg ${styles.formInputFocus} transition-all duration-200`}
                        placeholder="请再次输入新密码"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                      >
                        <i className={`fas ${showConfirmNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button 
                      type="button" 
                      onClick={() => setActiveTab('login')}
                      className="flex-1 bg-gray-100 text-text-primary py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
                    >
                      返回登录
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-all duration-200"
                    >
                      重置密码
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          
          {/* 底部链接 */}
          <div className="text-center mt-8 space-y-2">
            <p className="text-sm text-text-secondary">
              © 2024 课智配. 保留所有权利
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <a href="#" className="text-text-secondary hover:text-primary transition-colors duration-200">隐私政策</a>
              <a href="#" className="text-text-secondary hover:text-primary transition-colors duration-200">服务条款</a>
              <a href="#" className="text-text-secondary hover:text-primary transition-colors duration-200">帮助中心</a>
            </div>
          </div>
        </div>
      </div>

      {/* 成功提示弹窗 */}
      {showSuccessModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleSuccessModalBackgroundClick}
        >
          <div className="bg-white rounded-xl p-6 mx-4 max-w-sm w-full">
            <div className="text-center">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check text-success text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">操作成功</h3>
              <p className="text-text-secondary mb-6">{successMessage}</p>
              <button 
                onClick={handleSuccessModalClose}
                className="w-full bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-primary/90 transition-all duration-200"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginRegisterPage;

