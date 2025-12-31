

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import request from '../../utils/request'; // 导入API请求工具
import { useAuth } from '../../contexts/AuthContext'; // 导入Auth上下文

interface LoginFormData {
  id: string;
  role: 'parent' | 'teacher' | 'admin';
}

const LoginRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // 使用Auth上下文
  
  // 表单数据状态
  const [loginFormData, setLoginFormData] = useState<LoginFormData>({
    id: '',
    role: 'parent'
  });
  
  // 隐私政策、服务条款、帮助中心弹窗状态
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '登录注册 - 课智配';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  

  // 表单提交处理
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { id, role } = loginFormData;
    
    if (!id) {
      alert('请填写ID号');
      return;
    }
    
    try {
      console.log('开始登录，参数:', { account: id, role });
      
      
      // 调用后端登录API，使用用户提供的API格式
      console.log('开始调用登录API:', { account: id, role: role });
      
      try {
        const response = await request.post('/api/auth/login', { 
          account: id, 
          role: role 
        });
        
        console.log('登录API响应完整信息:', response);
        console.log('响应状态码:', response.status);
        console.log('响应数据:', response.data);
        
        // 登录成功，保存用户信息到localStorage
        // 处理不同的响应格式：如果有user对象则使用user对象，否则使用整个response.data
        const userData = response.data.user || response.data;
        const userInfo = {
          ...userData,
          id: id,  // 使用用户输入的ID号（兼容）
          account: id, // 同时设置account字段，兼容两种字段名
          role: userData.role || response.data.role || role, // 确保role字段存在
          // 保存teacher_id字段以便教师中心使用
          teacher_id: userData.teacher_id || id // 确保teacher_id字段存在
        };
        
        // 使用Auth上下文进行登录
        login(userInfo);
    
        console.log('保存的用户信息:', userInfo);
        
        // 登录成功后直接跳转
        console.log('登录成功，开始跳转...');
        
        // 根据角色跳转到不同页面
        if (userInfo.role === 'teacher') {
          console.log('跳转到教师中心');
          navigate('/teacher-center');
        } else if (userInfo.role === 'admin') {
          console.log('跳转到管理员中心');
          navigate('/admin/dashboard');
        } else if (userInfo.role === 'parent') {
          console.log('跳转到首页');
          navigate('/home');
        } else {
          console.log('跳转到首页');
          navigate('/home');
        }
      } catch (apiError) {
        console.error('登录API调用失败:', apiError);
        let errorMessage = '未知错误';
        if (typeof apiError === 'object' && apiError !== null) {
          if ('response' in apiError && apiError.response && typeof apiError.response === 'object' && 'data' in apiError.response) {
            const responseData = apiError.response.data;
            if (typeof responseData === 'object' && responseData !== null && 'message' in responseData && typeof responseData.message === 'string') {
              errorMessage = responseData.message;
            } else {
              errorMessage = 'API请求失败';
            }
          } else if ('message' in apiError && typeof apiError.message === 'string') {
            errorMessage = apiError.message;
          }
        }
        console.error('错误详情:', errorMessage);
        alert(`登录失败: ${errorMessage}`);
      }
    } catch (error) {
      console.error('登录失败:', error);
      alert('登录失败，请稍后重试');
    }
  };

  

  

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
          
          {/* 登录卡片 */}
          <div className="bg-white rounded-2xl shadow-login-card p-8">
            {/* 登录表单 */}
            <div>
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                {/* 用户名输入 */}
                <div>
                  <label htmlFor="login-id" className="block text-sm font-medium text-text-primary mb-2">
                    用户名
                    <span className="ml-2 text-xs text-text-secondary">
                      {loginFormData.role === 'parent' ? '(家长ID)' : loginFormData.role === 'teacher' ? '(教师ID)' : '(admin)'}
                    </span>
                  </label>
                  <input 
                    type="text" 
                    id="login-id" 
                    name="id" 
                    value={loginFormData.id}
                    onChange={(e) => setLoginFormData({...loginFormData, id: e.target.value})}
                    className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} transition-all duration-200`}
                    placeholder={`请输入${loginFormData.role === 'parent' ? '家长ID' : loginFormData.role === 'teacher' ? '教师ID' : '管理员用户名'}`}
                    required
                  />
                </div>
                
                {/* 角色选择 */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    登录角色
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <label className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${loginFormData.role === 'parent' ? 'bg-primary/10 border-primary text-primary shadow-md' : 'border-border-light hover:bg-gray-50'}`}>
                      <input 
                        type="radio" 
                        name="role" 
                        value="parent" 
                        checked={loginFormData.role === 'parent'}
                        onChange={(e) => setLoginFormData({...loginFormData, role: e.target.value as 'parent' | 'teacher' | 'admin'})}
                        className="sr-only"
                      />
                      <i className="fas fa-user text-xl mb-2"></i>
                      <span className="text-sm">家长</span>
                    </label>
                    <label className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${loginFormData.role === 'teacher' ? 'bg-primary/10 border-primary text-primary shadow-md' : 'border-border-light hover:bg-gray-50'}`}>
                      <input 
                        type="radio" 
                        name="role" 
                        value="teacher" 
                        checked={loginFormData.role === 'teacher'}
                        onChange={(e) => setLoginFormData({...loginFormData, role: e.target.value as 'parent' | 'teacher' | 'admin'})}
                        className="sr-only"
                      />
                      <i className="fas fa-chalkboard-teacher text-xl mb-2"></i>
                      <span className="text-sm">老师</span>
                    </label>
                    <label className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${loginFormData.role === 'admin' ? 'bg-primary/10 border-primary text-primary shadow-md' : 'border-border-light hover:bg-gray-50'}`}>
                      <input 
                        type="radio" 
                        name="role" 
                        value="admin" 
                        checked={loginFormData.role === 'admin'}
                        onChange={(e) => setLoginFormData({...loginFormData, role: e.target.value as 'parent' | 'teacher' | 'admin'})}
                        className="sr-only"
                      />
                      <i className="fas fa-user-shield text-xl mb-2"></i>
                      <span className="text-sm">管理员</span>
                    </label>
                  </div>
                </div>
                

                
                {/* 登录按钮 */}
                <button 
                  type="submit" 
                  className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200"
                >
                  登录
                </button>
              </form>
            </div>
          </div>
          
          {/* 底部链接 */}
          <div className="text-center mt-8 space-y-2">
            <p className="text-sm text-text-secondary">
              © 2024 课智配. 保留所有权利
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <a href="#" onClick={() => setShowPrivacyPolicy(true)} className="text-text-secondary hover:text-primary transition-colors duration-200">隐私政策</a>
              <a href="#" onClick={() => setShowTermsOfService(true)} className="text-text-secondary hover:text-primary transition-colors duration-200">服务条款</a>
              <a href="#" onClick={() => setShowHelpCenter(true)} className="text-text-secondary hover:text-primary transition-colors duration-200">帮助中心</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* 隐私政策弹窗 */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-text-primary">隐私政策</h2>
                <button 
                  onClick={() => setShowPrivacyPolicy(false)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>
              <div className="text-sm space-y-4 text-text-secondary">
                <p>欢迎使用课智配平台！我们重视您的隐私保护，本隐私政策旨在向您说明我们收集、使用、存储和保护您个人信息的政策和措施。</p>
                <h3 className="font-medium text-text-primary">1. 我们收集的信息</h3>
                <p>我们可能收集以下类型的信息：</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>基本身份信息：姓名、年龄、性别、联系方式等</li>
                  <li>使用信息：平台使用记录、浏览历史等</li>
                  <li>设备信息：IP地址、浏览器类型、操作系统等</li>
                  <li>支付信息：支付方式、交易记录等（如有）</li>
                </ul>
                <h3 className="font-medium text-text-primary">2. 信息使用方式</h3>
                <p>我们将收集的信息用于：</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>提供和改进我们的服务</li>
                  <li>处理您的请求和交易</li>
                  <li>与您沟通和提供支持</li>
                  <li>确保平台安全和防止欺诈</li>
                  <li>进行数据分析和研究</li>
                </ul>
                <h3 className="font-medium text-text-primary">3. 信息保护</h3>
                <p>我们采取合理的技术和组织措施保护您的个人信息安全，防止未经授权的访问、使用或披露。</p>
                <h3 className="font-medium text-text-primary">4. 信息共享</h3>
                <p>我们不会向第三方出售或出租您的个人信息，但在以下情况下可能会共享：</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>获得您的明确同意</li>
                  <li>遵守法律法规要求</li>
                  <li>保护我们的合法权益</li>
                  <li>与提供必要服务的第三方合作（如支付、物流等）</li>
                </ul>
                <h3 className="font-medium text-text-primary">5. 隐私政策更新</h3>
                <p>我们可能会不时更新本隐私政策，更新后的政策将在平台上公布。</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 服务条款弹窗 */}
      {showTermsOfService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-text-primary">服务条款</h2>
                <button 
                  onClick={() => setShowTermsOfService(false)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>
              <div className="text-sm space-y-4 text-text-secondary">
                <p>欢迎使用课智配平台！这些服务条款（"条款"）构成您与课智配之间的法律协议，管辖您对我们平台的使用。</p>
                <h3 className="font-medium text-text-primary">1. 服务内容</h3>
                <p>课智配提供课后托管课程匹配、预约、管理等服务，包括但不限于：</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>家长寻找合适的课后托管课程</li>
                  <li>教师发布和管理课程</li>
                  <li>课程预约和支付</li>
                  <li>学生学习记录和评价</li>
                </ul>
                <h3 className="font-medium text-text-primary">2. 账户注册和使用</h3>
                <p>您需要注册账户才能使用我们的服务。您同意：</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>提供准确、完整的注册信息</li>
                  <li>保护您的账户安全，不与他人共享</li>
                  <li>对您账户下的所有活动负责</li>
                  <li>及时更新您的信息</li>
                </ul>
                <h3 className="font-medium text-text-primary">3. 用户义务</h3>
                <p>使用我们的服务时，您同意：</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>遵守法律法规和公序良俗</li>
                  <li>不发布或传播违法、有害、虚假信息</li>
                  <li>尊重他人的知识产权和隐私</li>
                  <li>不干扰平台的正常运行</li>
                </ul>
                <h3 className="font-medium text-text-primary">4. 服务变更和终止</h3>
                <p>我们可能会不时变更或终止部分或全部服务。如发生以下情况，我们有权终止您的账户：</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>您违反本条款</li>
                  <li>账户长期不活跃</li>
                  <li>法律法规要求</li>
                </ul>
                <h3 className="font-medium text-text-primary">5. 免责声明</h3>
                <p>我们不对以下情况承担责任：</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>因不可抗力导致的服务中断</li>
                  <li>第三方行为导致的损失</li>
                  <li>您自身原因导致的损失</li>
                  <li>平台上用户发布的信息内容</li>
                </ul>
                <h3 className="font-medium text-text-primary">6. 条款更新</h3>
                <p>我们可能会不时更新本条款，更新后的条款将在平台上公布。</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 帮助中心弹窗 */}
      {showHelpCenter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-text-primary">帮助中心</h2>
                <button 
                  onClick={() => setShowHelpCenter(false)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>
              <div className="text-sm space-y-4 text-text-secondary">
                <p>欢迎使用课智配平台！如果您在使用过程中遇到问题，可以参考以下常见问题解答，或通过联系邮箱与我们取得联系。</p>
                <h3 className="font-medium text-text-primary">1. 如何注册账户？</h3>
                <p>进入登录页面，选择您的角色（家长/教师/管理员），输入您的ID号，点击登录按钮即可。</p>
                <h3 className="font-medium text-text-primary">2. 如何发布课程？</h3>
                <p>教师用户登录后，可以在教师中心页面点击"发布课程"按钮，填写课程信息并提交审核。</p>
                <h3 className="font-medium text-text-primary">3. 如何预约课程？</h3>
                <p>家长用户可以浏览课程列表，选择合适的课程，点击"立即预约"按钮完成预约。</p>
                <h3 className="font-medium text-text-primary">4. 如何查看我的课程？</h3>
                <p>登录后，在导航菜单中点击"我的课程"，即可查看您已预约或发布的课程。</p>
                <h3 className="font-medium text-text-primary">5. 如何取消预约？</h3>
                <p>在"我的课程"页面找到您要取消的课程，点击"取消预约"按钮即可。</p>
                <h3 className="font-medium text-text-primary">6. 如何联系我们？</h3>
                <p>如果您有任何问题或建议，可以通过以下方式联系我们：</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><i className="fas fa-envelope mr-2"></i>邮箱：738632006@qq.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  ); 
};

export default LoginRegisterPage;

