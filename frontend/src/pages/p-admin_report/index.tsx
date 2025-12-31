import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

const AdminReportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('matching');
  const [filterState, setFilterState] = useState({
    timeRange: '30days',
    community: 'all'
  });
  const [isExporting, setIsExporting] = useState(false);
  const [originalTitle, setOriginalTitle] = useState('');

  useEffect(() => {
    const title = '数据报表 - 课后服务平台';
    setOriginalTitle(document.title);
    document.title = title;

    return () => {
      document.title = originalTitle;
    };
  }, [originalTitle]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilterState(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    console.log('应用筛选条件:', filterState);
    alert('筛选条件已应用');
  };

  const handleExportReport = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      setIsExporting(false);
      alert('报表导出完成！');
    }, 2000);
  };

  const renderMatchingReport = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">匹配成功率</h3>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">87.5%</div>
            <p className="text-sm text-text-secondary">本月平均匹配成功率</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">数学课程</span>
              <span className="text-sm font-medium">92.3%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{width: '92.3%'}}></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">英语课程</span>
              <span className="text-sm font-medium">85.7%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{width: '85.7%'}}></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">科学课程</span>
              <span className="text-sm font-medium">84.2%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{width: '84.2%'}}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">课程需求分析</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-text-primary">热门课程</span>
              <span className="font-bold text-primary">数学思维</span>
            </div>
            <p className="text-xs text-text-secondary">需求度: 95%</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-text-primary">新兴需求</span>
              <span className="font-bold text-success">编程入门</span>
            </div>
            <p className="text-xs text-text-secondary">需求度: 78%</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-text-primary">稳定课程</span>
              <span className="font-bold text-warning">艺术创作</span>
            </div>
            <p className="text-xs text-text-secondary">需求度: 65%</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">时间段分布</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">下午 (14:00-17:00)</span>
            <span className="text-sm font-medium text-primary">45%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">傍晚 (17:00-19:00)</span>
            <span className="text-sm font-medium text-primary">32%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">晚上 (19:00-21:00)</span>
            <span className="text-sm font-medium text-primary">23%</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">社区匹配情况</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">阳光社区</span>
            <span className="text-sm font-medium text-success">89%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">绿洲社区</span>
            <span className="text-sm font-medium text-primary">86%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">智慧社区</span>
            <span className="text-sm font-medium text-warning">82%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEvaluationReport = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">评价统计</h3>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-success mb-2">4.8</div>
            <p className="text-sm text-text-secondary">平均评分 (满分5分)</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">5星评价</span>
              <span className="text-sm font-medium">68%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-success h-2 rounded-full" style={{width: '68%'}}></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">4星评价</span>
              <span className="text-sm font-medium">24%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-success h-2 rounded-full" style={{width: '24%'}}></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">3星及以下</span>
              <span className="text-sm font-medium">8%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-warning h-2 rounded-full" style={{width: '8%'}}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">评价维度</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-text-primary">教学质量</span>
              <span className="font-bold text-success">4.9</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-success h-2 rounded-full" style={{width: '98%'}}></div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-text-primary">服务态度</span>
              <span className="font-bold text-success">4.8</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-success h-2 rounded-full" style={{width: '96%'}}></div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-text-primary">环境设施</span>
              <span className="font-bold text-primary">4.7</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{width: '94%'}}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">近期反馈</h3>
        <div className="space-y-3">
          <div className="p-3 bg-green-50 border-l-4 border-success rounded">
            <p className="text-sm text-text-primary">"老师很有耐心，孩子很喜欢这个课程"</p>
            <p className="text-xs text-text-secondary mt-1">2024-01-15</p>
          </div>
          <div className="p-3 bg-blue-50 border-l-4 border-primary rounded">
            <p className="text-sm text-text-primary">"课程安排合理，时间很合适"</p>
            <p className="text-xs text-text-secondary mt-1">2024-01-14</p>
          </div>
          <div className="p-3 bg-yellow-50 border-l-4 border-warning rounded">
            <p className="text-sm text-text-primary">"希望能有更多的实践机会"</p>
            <p className="text-xs text-text-secondary mt-1">2024-01-13</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">改进建议</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-text-primary font-medium">增加课程时长</p>
              <p className="text-xs text-text-secondary">15%的家长希望课程时间更长</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-text-primary font-medium">优化课前准备</p>
              <p className="text-xs text-text-secondary">12%的家长建议提前通知课程要求</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-text-primary font-medium">增加互动环节</p>
              <p className="text-xs text-text-secondary">8%的家长希望有更多课堂互动</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserGrowthReport = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">用户增长趋势</h3>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">1,234</div>
            <p className="text-sm text-text-secondary">本月新增用户</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">本周新增</span>
              <span className="text-sm font-medium text-success">+287</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">上周新增</span>
              <span className="text-sm font-medium">+245</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">增长率</span>
              <span className="text-sm font-medium text-success">+17.1%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">用户类型分布</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-text-primary">学生家长</span>
              <span className="font-bold text-primary">68%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{width: '68%'}}></div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-text-primary">教师</span>
              <span className="font-bold text-success">22%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-success h-2 rounded-full" style={{width: '22%'}}></div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-text-primary">管理员</span>
              <span className="font-bold text-warning">10%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-warning h-2 rounded-full" style={{width: '10%'}}></div>
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

      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">留存率分析</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">次日留存</span>
            <span className="text-sm font-medium text-success">85.2%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">7日留存</span>
            <span className="text-sm font-medium text-primary">72.8%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">30日留存</span>
            <span className="text-sm font-medium text-warning">65.4%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'matching':
        return renderMatchingReport();
      case 'evaluation':
        return renderEvaluationReport();
      case 'user-growth':
        return renderUserGrowthReport();
      default:
        return renderMatchingReport();
    }
  };

  return (
    <div className="p-6">
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
          <Link to="/admin" className="text-primary hover:text-primary/80 font-medium">
            <i className="fas fa-arrow-left mr-2"></i>
            返回管理首页
          </Link>
        </div>
      </div>

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
            <button 
              onClick={handleExportReport}
              disabled={isExporting}
              className="px-4 py-2 bg-success text-white text-sm font-medium rounded-lg hover:bg-success/90 disabled:opacity-50 ml-auto"
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
      </section>

      <section className="mb-6">
        <div className="flex space-x-4 mb-6" role="tablist">
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

      <section className="mb-6">
        <div role="tabpanel" aria-labelledby="matching-content">
          {renderCurrentTab()}
        </div>
      </section>
    </div>
  );
};

export default AdminReportPage;