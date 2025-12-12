

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

interface FilterState {
  timeRange: string;
  community: string;
}

type TabType = 'matching' | 'evaluation' | 'user-growth';

const AdminReportPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('matching');
  const [isExporting, setIsExporting] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>({
    timeRange: '30days',
    community: 'all'
  });

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '数据报表 - 课智配';
    return () => { document.title = originalTitle; };
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilterState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    console.log('应用筛选条件:', filterState);
    alert('筛选条件已应用，数据正在更新...');
  };

  const handleExportReport = async () => {
    const reportTypeMap = {
      'matching': '匹配情况报表',
      'evaluation': '评价统计报表',
      'user-growth': '用户增长报表'
    };

    const reportType = reportTypeMap[activeTab];
    console.log('导出报表:', reportType);

    setIsExporting(true);
    
    // 模拟导出过程
    setTimeout(() => {
      setIsExporting(false);
      alert('报表导出完成！');
    }, 2000);
  };

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
                className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                  src="https://s.coze.cn/image/8QTVS4gJN_o/" 
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
          <div className={`${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}>
            <i className="fas fa-chart-bar w-5"></i>
            <span>数据报表</span>
          </div>
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-6">
          {/* 页面头部 */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">数据报表</h2>
                <nav className="text-sm text-text-secondary">
                  <span>后台管理</span>
                  <i className="fas fa-chevron-right mx-2"></i>
                  <span>数据报表</span>
                </nav>
              </div>
              <button 
                onClick={handleExportReport}
                disabled={isExporting}
                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>导出中...
                  </>
                ) : (
                  <>
                    <i className="fas fa-download mr-2"></i>导出报表
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 报表选择区 */}
          <section className="mb-6">
            <div className="flex space-x-4 mb-4" role="tablist">
              <button 
                onClick={() => handleTabChange('matching')}
                className={`px-6 py-3 text-sm font-medium rounded-lg focus:outline-none ${activeTab === 'matching' ? styles.tabActive : styles.tabInactive}`}
                role="tab"
                aria-controls="matching-content"
              >
                匹配情况报表
              </button>
              <button 
                onClick={() => handleTabChange('evaluation')}
                className={`px-6 py-3 text-sm font-medium rounded-lg focus:outline-none ${activeTab === 'evaluation' ? styles.tabActive : styles.tabInactive}`}
                role="tab"
                aria-controls="evaluation-content"
              >
                评价统计报表
              </button>
              <button 
                onClick={() => handleTabChange('user-growth')}
                className={`px-6 py-3 text-sm font-medium rounded-lg focus:outline-none ${activeTab === 'user-growth' ? styles.tabActive : styles.tabInactive}`}
                role="tab"
                aria-controls="user-growth-content"
              >
                用户增长报表
              </button>
            </div>
          </section>

          {/* 筛选条件区 */}
          <section className="mb-6">
            <div className="bg-white rounded-xl shadow-card p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <label htmlFor="time-range" className="text-sm font-medium text-text-primary">时间范围：</label>
                  <select 
                    id="time-range"
                    value={filterState.timeRange}
                    onChange={(e) => handleFilterChange('timeRange', e.target.value)}
                    className="px-3 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="7days">近7天</option>
                    <option value="30days">近30天</option>
                    <option value="90days">近90天</option>
                    <option value="1year">近1年</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label htmlFor="community-filter" className="text-sm font-medium text-text-primary">社区：</label>
                  <select 
                    id="community-filter"
                    value={filterState.community}
                    onChange={(e) => handleFilterChange('community', e.target.value)}
                    className="px-3 py-2 border border-border-light rounded-lg text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="all">全部社区</option>
                    <option value="sunny">阳光社区</option>
                    <option value="oasis">绿洲社区</option>
                    <option value="wisdom">智慧社区</option>
                  </select>
                </div>
                <button 
                  onClick={handleApplyFilters}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                >
                  应用筛选
                </button>
              </div>
            </div>
          </section>

          {/* 匹配情况报表 */}
          {activeTab === 'matching' && (
            <div>
              {/* 匹配概览 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 shadow-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary mb-1">总匹配次数</p>
                      <p className="text-2xl font-bold text-text-primary">1,247</p>
                      <p className="text-xs text-success mt-1">
                        <i className="fas fa-arrow-up mr-1"></i>+12.5% 较上期
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-magic text-primary text-xl"></i>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary mb-1">匹配成功率</p>
                      <p className="text-2xl font-bold text-text-primary">89.2%</p>
                      <p className="text-xs text-success mt-1">
                        <i className="fas fa-arrow-up mr-1"></i>+3.2% 较上期
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-check-circle text-success text-xl"></i>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary mb-1">平均匹配时间</p>
                      <p className="text-2xl font-bold text-text-primary">2.3天</p>
                      <p className="text-xs text-success mt-1">
                        <i className="fas fa-arrow-down mr-1"></i>-0.5天 较上期
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-clock text-warning text-xl"></i>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary mb-1">课程报名率</p>
                      <p className="text-2xl font-bold text-text-primary">76.8%</p>
                      <p className="text-xs text-success mt-1">
                        <i className="fas fa-arrow-up mr-1"></i>+5.1% 较上期
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-sign-in-alt text-info text-xl"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* 匹配趋势图 */}
              <div className="bg-white rounded-xl shadow-card p-6 mb-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">匹配趋势</h3>
                <div className={`${styles.chartContainer} h-64 flex items-center justify-center`}>
                  <div className="text-center">
                    <i className="fas fa-chart-line text-4xl mb-4"></i>
                    <p className="text-lg font-medium">匹配趋势图表</p>
                    <p className="text-sm opacity-80 mt-2">显示近30天的匹配数据变化趋势</p>
                  </div>
                </div>
              </div>

              {/* 热门课程/教师 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-card p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">热门课程类型</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span className="font-medium text-text-primary">学科类</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className={`${styles.progressBar} w-20 h-2 rounded-full`}></div>
                        </div>
                        <span className="text-sm font-medium text-text-primary">42%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-success rounded-full"></div>
                        <span className="font-medium text-text-primary">艺术类</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-success h-2 rounded-full" style={{width: '28%'}}></div>
                        </div>
                        <span className="text-sm font-medium text-text-primary">28%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-warning rounded-full"></div>
                        <span className="font-medium text-text-primary">科技类</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-warning h-2 rounded-full" style={{width: '18%'}}></div>
                        </div>
                        <span className="text-sm font-medium text-text-primary">18%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-info rounded-full"></div>
                        <span className="font-medium text-text-primary">体育类</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-info h-2 rounded-full" style={{width: '8%'}}></div>
                        </div>
                        <span className="text-sm font-medium text-text-primary">8%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-secondary rounded-full"></div>
                        <span className="font-medium text-text-primary">兴趣类</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-secondary h-2 rounded-full" style={{width: '4%'}}></div>
                        </div>
                        <span className="text-sm font-medium text-text-primary">4%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-card p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">优秀教师排行</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-primary text-white text-sm font-bold rounded-full flex items-center justify-center">1</span>
                        <img 
                          src="https://s.coze.cn/image/ZFF90dJEgio/" 
                          alt="李老师" 
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-text-primary">李老师</p>
                          <p className="text-xs text-text-secondary">数学思维</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-text-primary">4.9分</p>
                        <p className="text-xs text-text-secondary">127次匹配</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-secondary text-white text-sm font-bold rounded-full flex items-center justify-center">2</span>
                        <img 
                          src="https://s.coze.cn/image/4HKCcGEDLXo/" 
                          alt="王老师" 
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-text-primary">王老师</p>
                          <p className="text-xs text-text-secondary">创意绘画</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-text-primary">4.8分</p>
                        <p className="text-xs text-text-secondary">98次匹配</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-warning text-white text-sm font-bold rounded-full flex items-center justify-center">3</span>
                        <img 
                          src="https://s.coze.cn/image/Wf-Y1Lyaqbg/" 
                          alt="陈老师" 
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-text-primary">陈老师</p>
                          <p className="text-xs text-text-secondary">编程入门</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-text-primary">4.7分</p>
                        <p className="text-xs text-text-secondary">76次匹配</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 评价统计报表 */}
          {activeTab === 'evaluation' && (
            <div>
              {/* 评价概览 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 shadow-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary mb-1">总评价数</p>
                      <p className="text-2xl font-bold text-text-primary">892</p>
                      <p className="text-xs text-success mt-1">
                        <i className="fas fa-arrow-up mr-1"></i>+18.3% 较上期
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-star text-warning text-xl"></i>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary mb-1">平均评分</p>
                      <p className="text-2xl font-bold text-text-primary">4.6分</p>
                      <p className="text-xs text-success mt-1">
                        <i className="fas fa-arrow-up mr-1"></i>+0.2分 较上期
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-star-half-alt text-success text-xl"></i>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary mb-1">5星评价率</p>
                      <p className="text-2xl font-bold text-text-primary">73.5%</p>
                      <p className="text-xs text-success mt-1">
                        <i className="fas fa-arrow-up mr-1"></i>+4.2% 较上期
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-award text-primary text-xl"></i>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary mb-1">负面评价率</p>
                      <p className="text-2xl font-bold text-text-primary">2.1%</p>
                      <p className="text-xs text-success mt-1">
                        <i className="fas fa-arrow-down mr-1"></i>-0.8% 较上期
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-danger/10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-exclamation-triangle text-danger text-xl"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* 评价趋势图 */}
              <div className="bg-white rounded-xl shadow-card p-6 mb-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">评价趋势</h3>
                <div className={`${styles.chartContainer} h-64 flex items-center justify-center`}>
                  <div className="text-center">
                    <i className="fas fa-chart-area text-4xl mb-4"></i>
                    <p className="text-lg font-medium">评价趋势图表</p>
                    <p className="text-sm opacity-80 mt-2">显示近30天的评价数据变化趋势</p>
                  </div>
                </div>
              </div>

              {/* 评价词云和详细列表 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-card p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">评价关键词云</h3>
                  <div className={styles.chartContainer}>
                    <div className={styles.keywordCloud}>
                      <span className={styles.keywordItem} style={{fontSize: '24px'}}>优秀</span>
                      <span className={styles.keywordItem} style={{fontSize: '20px'}}>耐心</span>
                      <span className={styles.keywordItem} style={{fontSize: '18px'}}>专业</span>
                      <span className={styles.keywordItem} style={{fontSize: '22px'}}>有趣</span>
                      <span className={styles.keywordItem} style={{fontSize: '16px'}}>负责</span>
                      <span className={styles.keywordItem} style={{fontSize: '19px'}}>认真</span>
                      <span className={styles.keywordItem} style={{fontSize: '17px'}}>细致</span>
                      <span className={styles.keywordItem} style={{fontSize: '21px'}}>生动</span>
                      <span className={styles.keywordItem} style={{fontSize: '15px'}}>准时</span>
                      <span className={styles.keywordItem} style={{fontSize: '18px'}}>热情</span>
                      <span className={styles.keywordItem} style={{fontSize: '16px'}}>高效</span>
                      <span className={styles.keywordItem} style={{fontSize: '14px'}}>友好</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-card p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">最新评价</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex text-warning">
                          <i className="fas fa-star text-xs"></i>
                          <i className="fas fa-star text-xs"></i>
                          <i className="fas fa-star text-xs"></i>
                          <i className="fas fa-star text-xs"></i>
                          <i className="fas fa-star text-xs"></i>
                        </div>
                        <span className="text-sm font-medium text-text-primary">5.0分</span>
                      </div>
                      <p className="text-sm text-text-secondary mb-2">李老师的数学思维课非常好，孩子很喜欢，进步明显！</p>
                      <p className="text-xs text-text-secondary">张家长 · 2024-01-15</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex text-warning">
                          <i className="fas fa-star text-xs"></i>
                          <i className="fas fa-star text-xs"></i>
                          <i className="fas fa-star text-xs"></i>
                          <i className="fas fa-star text-xs"></i>
                          <i className="far fa-star text-xs"></i>
                        </div>
                        <span className="text-sm font-medium text-text-primary">4.0分</span>
                      </div>
                      <p className="text-sm text-text-secondary mb-2">王老师很有耐心，教学方法很好，孩子很感兴趣。</p>
                      <p className="text-xs text-text-secondary">刘家长 · 2024-01-14</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex text-warning">
                          <i className="fas fa-star text-xs"></i>
                          <i className="fas fa-star text-xs"></i>
                          <i className="fas fa-star text-xs"></i>
                          <i className="fas fa-star text-xs"></i>
                          <i className="fas fa-star text-xs"></i>
                        </div>
                        <span className="text-sm font-medium text-text-primary">5.0分</span>
                      </div>
                      <p className="text-sm text-text-secondary mb-2">陈老师的编程课很专业，孩子学到了很多实用的知识。</p>
                      <p className="text-xs text-text-secondary">王家长 · 2024-01-13</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 用户增长报表 */}
          {activeTab === 'user-growth' && (
            <div>
              {/* 用户增长概览 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 shadow-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary mb-1">总注册用户</p>
                      <p className="text-2xl font-bold text-text-primary">2,847</p>
                      <p className="text-xs text-success mt-1">
                        <i className="fas fa-arrow-up mr-1"></i>+23.7% 较上期
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-users text-primary text-xl"></i>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary mb-1">活跃用户</p>
                      <p className="text-2xl font-bold text-text-primary">1,562</p>
                      <p className="text-xs text-success mt-1">
                        <i className="fas fa-arrow-up mr-1"></i>+15.4% 较上期
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-user-check text-success text-xl"></i>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary mb-1">新增用户</p>
                      <p className="text-2xl font-bold text-text-primary">127</p>
                      <p className="text-xs text-success mt-1">
                        <i className="fas fa-arrow-up mr-1"></i>+8.9% 较上期
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-user-plus text-info text-xl"></i>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary mb-1">用户留存率</p>
                      <p className="text-2xl font-bold text-text-primary">68.9%</p>
                      <p className="text-xs text-success mt-1">
                        <i className="fas fa-arrow-up mr-1"></i>+4.3% 较上期
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                      <i className="fas fa-chart-line text-warning text-xl"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* 用户增长趋势图 */}
              <div className="bg-white rounded-xl shadow-card p-6 mb-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">用户增长趋势</h3>
                <div className={`${styles.chartContainer} h-64 flex items-center justify-center`}>
                  <div className="text-center">
                    <i className="fas fa-chart-bar text-4xl mb-4"></i>
                    <p className="text-lg font-medium">用户增长图表</p>
                    <p className="text-sm opacity-80 mt-2">显示近90天的用户增长趋势</p>
                  </div>
                </div>
              </div>

              {/* 用户类型分布和活跃度 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-card p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">用户类型分布</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span className="font-medium text-text-primary">家长用户</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-text-primary">1,892 (66.5%)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-success rounded-full"></div>
                        <span className="font-medium text-text-primary">教师用户</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-text-primary">955 (33.5%)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-border-light">
                    <h4 className="font-semibold text-text-primary mb-3">按社区分布</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">阳光社区</span>
                        <span className="text-sm font-medium text-text-primary">987 (34.7%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">绿洲社区</span>
                        <span className="text-sm font-medium text-text-primary">892 (31.3%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">智慧社区</span>
                        <span className="text-sm font-medium text-text-primary">968 (34.0%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-card p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">用户活跃度</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-text-primary">日活跃用户</span>
                        <span className="font-bold text-primary">892</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{width: '72%'}}></div>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">较昨日 +12.3%</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-text-primary">周活跃用户</span>
                        <span className="font-bold text-success">1,456</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-success h-2 rounded-full" style={{width: '89%'}}></div>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">较上周 +8.7%</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-text-primary">月活跃用户</span>
                        <span className="font-bold text-warning">1,562</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-warning h-2 rounded-full" style={{width: '95%'}}></div>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">较上月 +15.4%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 侧边栏遮罩 */}
      {isSidebarOpen && (
        <div 
          onClick={handleSidebarToggle}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        ></div>
      )}
    </div>
  );
};

export default AdminReportPage;

