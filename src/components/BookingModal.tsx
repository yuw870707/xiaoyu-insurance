import { useState, useMemo } from 'react';
import { X, Calendar, Clock, Phone } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ConsultationType = 'FAMILY' | 'WEALTH' | 'REVIEW' | 'OTHER';

const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [consultationType, setConsultationType] = useState<ConsultationType>('FAMILY');
  const [remarks, setRemarks] = useState('');

  // 生成未来7天的日期
  const availableDates = useMemo(() => {
    const dates: { date: string; label: string; day: string }[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      dates.push({
        date: date.toISOString().split('T')[0],
        label: `${date.getMonth() + 1}/${date.getDate()}`,
        day: weekdays[date.getDay()],
      });
    }
    return dates;
  }, []);

  // 模拟某些时间段已满（随机置灰30%的时间段）
  const isTimeSlotAvailable = useMemo(() => {
    const unavailable: Record<string, boolean> = {};
    TIME_SLOTS.forEach((time) => {
      // 每个时间段有30%概率被标记为不可用
      if (Math.random() < 0.3) {
        unavailable[time] = false;
      } else {
        unavailable[time] = true;
      }
    });
    return unavailable;
  }, []);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime) {
      alert('请选择预约日期和时间');
      return;
    }
    // 模拟提交
    console.log('预约提交:', {
      date: selectedDate,
      time: selectedTime,
      type: consultationType,
      remarks,
    });
    alert('预约成功！已同步至微信，顾问小宇将在预约时间前提醒您。');
    // 重置表单
    setSelectedDate('');
    setSelectedTime('');
    setConsultationType('FAMILY');
    setRemarks('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 弹窗容器 - Bottom Sheet 风格 */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-slide-up">
        {/* 拖拽指示条 */}
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-2 mb-4" />

        {/* Header */}
        <div className="px-6 pt-2 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center">
              <span className="mr-2">☕️</span>
              预约顾问小宇的时间
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-220px)]">
          {/* 日期选择 */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center">
              <Calendar size={16} className="mr-2" />
              选择日期
            </label>
            <div className="flex space-x-3 overflow-x-auto pb-2 hide-scrollbar">
              {availableDates.map((item) => (
                <button
                  key={item.date}
                  onClick={() => {
                    setSelectedDate(item.date);
                    setSelectedTime(''); // 切换日期时清空时间选择
                  }}
                  className={`flex-shrink-0 flex flex-col items-center justify-center px-4 py-3 rounded-xl border-2 transition-all ${
                    selectedDate === item.date
                      ? 'border-[#D31145] bg-red-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <span className="text-xs text-gray-500 mb-1">{item.day}</span>
                  <span
                    className={`text-sm font-bold ${
                      selectedDate === item.date ? 'text-[#D31145]' : 'text-slate-800'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 时间段选择 */}
          {selectedDate && (
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center">
                <Clock size={16} className="mr-2" />
                选择时间段
              </label>
              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map((time) => {
                  const isAvailable = isTimeSlotAvailable[time];
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      onClick={() => isAvailable && setSelectedTime(time)}
                      disabled={!isAvailable}
                      className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        !isAvailable
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                          : isSelected
                          ? 'border-[#D31145] bg-red-50 text-[#D31145] shadow-md'
                          : 'border-gray-200 hover:border-gray-300 bg-white text-slate-700'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 咨询来意 */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              咨询来意
            </label>
            <select
              value={consultationType}
              onChange={(e) => setConsultationType(e.target.value as ConsultationType)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D31145]"
            >
              <option value="FAMILY">家庭保障</option>
              <option value="WEALTH">理财规划</option>
              <option value="REVIEW">保单检视</option>
              <option value="OTHER">其他</option>
            </select>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="备注（选填）..."
              rows={2}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D31145] resize-none"
            />
          </div>

          {/* 紧急通道 */}
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-red-800">情况紧急？</div>
                <div className="text-xs text-red-600 mt-0.5">直接联系顾问小宇</div>
              </div>
              <a
                href="tel:+85212345678"
                className="flex items-center space-x-2 px-4 py-2 bg-[#D31145] text-white rounded-lg font-medium hover:bg-[#B80E3A] transition-colors"
              >
                <Phone size={16} />
                <span>立即拨打</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleSubmit}
            disabled={!selectedDate || !selectedTime}
            className={`w-full py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-all ${
              selectedDate && selectedTime
                ? 'bg-[#D31145] text-white hover:bg-[#B80E3A]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            确认预约 (同步至微信)
          </button>
        </div>
      </div>
    </div>
  );
}
