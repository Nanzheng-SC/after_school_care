import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import request from '../../utils/request';



interface WeeklySchedule {
  weekday: string;
  saturday: string;
  sunday: string;
}

const Schedule: React.FC = () => {
  const [schedule, setSchedule] = useState<WeeklySchedule>({
    weekday: '',
    saturday: '',
    sunday: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    weekdayStart: '',
    weekdayEnd: '',
    saturdayStart: '',
    saturdayEnd: '',
    sundayStart: '',
    sundayEnd: ''
  });

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
    const fetchSchedule = async () => {
      setIsLoading(true);
      try {
        const teacherId = getTeacherId();
        const response = await request.get(`/api/teacher/${teacherId}`);
        const teacherData = response.data;
        
        // 解析可用时间
        const availableTimeStr = teacherData.available_time || '';
        
        // 构建周计划数据
        const weeklySchedule: WeeklySchedule = {
          weekday: availableTimeStr.includes('周一') || availableTimeStr.includes('周三') || availableTimeStr.includes('周五') ? '16:00-20:00' : '',
          saturday: availableTimeStr.includes('周六') ? '09:00-18:00' : '',
          sunday: availableTimeStr.includes('周日') ? '10:00-16:00' : ''
        };
        
        setSchedule(weeklySchedule);
        console.log('获取到的日程数据:', weeklySchedule);
      } catch (error) {
        console.error('获取日程失败:', error);
        setSchedule({
          weekday: '',
          saturday: '',
          sunday: ''
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const parseTimeSlot = (timeSlot: string) => {
    if (!timeSlot) return { start: '', end: '' };
    const [start, end] = timeSlot.split('-');
    return { start: start || '', end: end || '' };
  };

  const handleEdit = () => {
    const weekdayTime = parseTimeSlot(schedule.weekday);
    const saturdayTime = parseTimeSlot(schedule.saturday);
    const sundayTime = parseTimeSlot(schedule.sunday);
    
    setEditForm({
      weekdayStart: weekdayTime.start,
      weekdayEnd: weekdayTime.end,
      saturdayStart: saturdayTime.start,
      saturdayEnd: saturdayTime.end,
      sundayStart: sundayTime.start,
      sundayEnd: sundayTime.end
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveSchedule = async () => {
    try {
      const updatedSchedule: WeeklySchedule = {
        weekday: editForm.weekdayStart && editForm.weekdayEnd ? `${editForm.weekdayStart}-${editForm.weekdayEnd}` : '',
        saturday: editForm.saturdayStart && editForm.saturdayEnd ? `${editForm.saturdayStart}-${editForm.saturdayEnd}` : '',
        sunday: editForm.sundayStart && editForm.sundayEnd ? `${editForm.sundayStart}-${editForm.sundayEnd}` : ''
      };
      
      // 构建可用时间字符串
      let availableTimeStr = '';
      if (updatedSchedule.weekday) {
        availableTimeStr += `周一,周三,周五:${updatedSchedule.weekday};`;
      }
      if (updatedSchedule.saturday) {
        availableTimeStr += `周六:${updatedSchedule.saturday};`;
      }
      if (updatedSchedule.sunday) {
        availableTimeStr += `周日:${updatedSchedule.sunday};`;
      }
      
      // 移除末尾的分号
      availableTimeStr = availableTimeStr.slice(0, -1);
      
      // 调用API保存日程
      const teacherId = getTeacherId();
      await request.put(`/api/teacher/${teacherId}`, {
        available_time: availableTimeStr
      });
      
      setSchedule(updatedSchedule);
      setIsEditing(false);
      alert('日程保存成功！');
    } catch (error) {
      console.error('保存日程失败:', error);
      alert('保存日程失败，请稍后重试！');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 页面头部 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">日程安排</h2>
        <nav className="text-sm text-text-secondary">
          <span>首页</span>
          <i className="fas fa-chevron-right mx-2"></i>
          <span>教师中心</span>
          <i className="fas fa-chevron-right mx-2"></i>
          <span className="text-primary">日程安排</span>
        </nav>
      </div>

      {/* 日程安排 */}
      <section>
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">我的服务时间</h3>
            {!isEditing ? (
              <button 
                onClick={handleEdit}
                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
              >
                <i className="fas fa-edit mr-2"></i>编辑日程
              </button>
            ) : (
              <div className="flex space-x-3">
                <button 
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button 
                  onClick={handleSaveSchedule}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
                >
                  保存
                </button>
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['周一至周五', '周六', '周日'].map((_, index) => (
                  <div key={index} className="border border-border-light rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
                      <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 周一至周五 */}
              <div className="border border-border-light rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-text-primary">周一至周五</h4>
                </div>
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <input 
                      type="time" 
                      value={editForm.weekdayStart}
                      onChange={(e) => setEditForm({ ...editForm, weekdayStart: e.target.value })}
                      className="border border-border-light rounded px-2 py-1 text-sm"
                    />
                    <span className="text-text-secondary">-</span>
                    <input 
                      type="time" 
                      value={editForm.weekdayEnd}
                      onChange={(e) => setEditForm({ ...editForm, weekdayEnd: e.target.value })}
                      className="border border-border-light rounded px-2 py-1 text-sm"
                    />
                  </div>
                ) : (
                  <div className="text-text-primary">
                    {schedule.weekday || '休息'}
                  </div>
                )}
              </div>
              
              {/* 周六 */}
              <div className="border border-border-light rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-text-primary">周六</h4>
                </div>
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <input 
                      type="time" 
                      value={editForm.saturdayStart}
                      onChange={(e) => setEditForm({ ...editForm, saturdayStart: e.target.value })}
                      className="border border-border-light rounded px-2 py-1 text-sm"
                    />
                    <span className="text-text-secondary">-</span>
                    <input 
                      type="time" 
                      value={editForm.saturdayEnd}
                      onChange={(e) => setEditForm({ ...editForm, saturdayEnd: e.target.value })}
                      className="border border-border-light rounded px-2 py-1 text-sm"
                    />
                  </div>
                ) : (
                  <div className="text-text-primary">
                    {schedule.saturday || '休息'}
                  </div>
                )}
              </div>
              
              {/* 周日 */}
              <div className="border border-border-light rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-text-primary">周日</h4>
                </div>
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <input 
                      type="time" 
                      value={editForm.sundayStart}
                      onChange={(e) => setEditForm({ ...editForm, sundayStart: e.target.value })}
                      className="border border-border-light rounded px-2 py-1 text-sm"
                    />
                    <span className="text-text-secondary">-</span>
                    <input 
                      type="time" 
                      value={editForm.sundayEnd}
                      onChange={(e) => setEditForm({ ...editForm, sundayEnd: e.target.value })}
                      className="border border-border-light rounded px-2 py-1 text-sm"
                    />
                  </div>
                ) : (
                  <div className="text-text-primary">
                    {schedule.sunday || '休息'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 日历视图 */}
      <section className="mt-8">
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">近期课程安排</h3>
            <button 
              onClick={() => console.log('查看完整日历')}
              className="px-4 py-2 border border-primary text-primary text-sm font-medium rounded-lg hover:bg-primary/5"
            >
              <i className="fas fa-calendar-alt mr-2"></i>完整日历
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-border-light px-4 py-3 text-left text-sm font-medium text-text-secondary">日期</th>
                  <th className="border border-border-light px-4 py-3 text-left text-sm font-medium text-text-secondary">时间</th>
                  <th className="border border-border-light px-4 py-3 text-left text-sm font-medium text-text-secondary">课程名称</th>
                  <th className="border border-border-light px-4 py-3 text-left text-sm font-medium text-text-secondary">学生</th>
                  <th className="border border-border-light px-4 py-3 text-left text-sm font-medium text-text-secondary">状态</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="border border-border-light px-4 py-8">
                      <div className="animate-pulse text-center">
                        <div className="w-32 h-4 bg-gray-200 rounded mx-auto mb-2"></div>
                        <div className="w-24 h-3 bg-gray-200 rounded mx-auto"></div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={5} className="border border-border-light px-4 py-12 text-center">
                      <i className="fas fa-calendar-check text-5xl text-gray-300 mb-4"></i>
                      <p className="text-gray-500 text-lg">暂无近期课程安排</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Schedule;
