import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import { Calculator, DollarSign, Clock, Zap, Eye, EyeOff } from 'lucide-react';
import { calculatePlan } from '../data/insurance_scenarios';

type ViewMode = 'focus' | 'full';

// 自定义 Tooltip - 磨砂玻璃风格
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const returnRate = data.totalPremiumPaid > 0 
      ? ((data.cashValue / data.totalPremiumPaid - 1) * 100).toFixed(1)
      : '0.0';
    const leverage = data.totalPremiumPaid > 0
      ? (data.deathBenefit / data.totalPremiumPaid).toFixed(1)
      : '0.0';

    return (
      <div className="bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-xl border border-gray-200/50">
        <p className="font-bold text-sm mb-2 text-slate-800">第 {label} 年</p>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">现金价值:</span>
            <span className="font-bold text-[#D31145]">${data.cashValue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">身故赔偿:</span>
            <span className="font-bold text-[#C5A065]">${data.deathBenefit.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-gray-200">
            <span className="text-gray-500">当年回报率:</span>
            <span className={`font-semibold ${parseFloat(returnRate) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {returnRate}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">身故杠杆:</span>
            <span className="font-semibold text-[#C5A065]">{leverage}x</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function DynamicCalculator() {
  const [annualPremium, setAnnualPremium] = useState<number>(10000); // 默认值 10,000
  const [viewMode, setViewMode] = useState<ViewMode>('focus'); // 默认聚焦前期

  // 动态计算数据
  const fullChartData = useMemo(() => {
    return calculatePlan(annualPremium);
  }, [annualPremium]);

  // 根据视图模式过滤数据
  const chartData = useMemo(() => {
    if (viewMode === 'focus') {
      // 聚焦前20年：找到前20年的数据点
      return fullChartData.filter(item => item.year <= 20);
    }
    return fullChartData;
  }, [viewMode, fullChartData]);

  // 计算关键指标
  const metrics = useMemo(() => {
    const totalPremium = annualPremium * 5;
    
    // 回本时间：找到第一个现金价值 > 总保费的年份（使用完整数据）
    const breakEvenYear = fullChartData.find(item => item.cashValue > totalPremium);
    const breakEven = breakEvenYear ? breakEvenYear.year : null;

    // 第100年（实际是99年）的身故赔偿倍数（使用完整数据）
    const year100Data = fullChartData.find(item => item.year === 99) || fullChartData[fullChartData.length - 1];
    const legacyMultiplier = totalPremium > 0 
      ? (year100Data.deathBenefit / totalPremium).toFixed(1)
      : '0.0';

    return {
      totalPremium,
      breakEven,
      legacyMultiplier
    };
  }, [annualPremium, fullChartData]);

  // Y轴格式化
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    }
    return (value / 1000).toFixed(0) + 'k';
  };

  // X轴关键年份（根据视图模式调整）
  const keyYears = useMemo(() => {
    if (viewMode === 'focus') {
      return [1, 5, 10, 15, 20]; // 前期视角：显示更密集的年份
    }
    return [1, 20, 50, 80, 99]; // 全景视角：显示关键节点
  }, [viewMode]);

  const formatXAxisTick = (value: number) => {
    if (keyYears.includes(value)) {
      return value.toString();
    }
    return '';
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-slate-800 flex items-center text-lg">
          <Calculator size={20} className="mr-2 text-[#D31145]" />
          智能保单动态计算器
        </h2>
      </div>

      {/* 输入区 */}
      <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
        <label className="block text-sm font-bold text-slate-700 mb-3">
          年缴保费 (USD)
        </label>
        <div className="flex items-center space-x-4">
          {/* 滑块 */}
          <input
            type="range"
            min="2000"
            max="500000"
            step="1000"
            value={annualPremium}
            onChange={(e) => setAnnualPremium(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#D31145]"
            style={{
              background: `linear-gradient(to right, #D31145 0%, #D31145 ${((annualPremium - 2000) / (500000 - 2000)) * 100}%, #e5e7eb ${((annualPremium - 2000) / (500000 - 2000)) * 100}%, #e5e7eb 100%)`
            }}
          />
          {/* 数字输入框 */}
          <div className="relative w-32">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
            <input
              type="number"
              min="2000"
              max="500000"
              step="1000"
              value={annualPremium}
              onChange={(e) => {
                const val = Math.max(2000, Math.min(500000, Number(e.target.value)));
                setAnnualPremium(val);
              }}
              className="w-full pl-7 pr-3 py-2 text-right font-bold text-slate-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D31145]"
            />
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>$2,000</span>
          <span>$500,000</span>
        </div>
      </div>

      {/* 核心指标卡 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center mb-2">
            <DollarSign size={18} className="text-blue-600 mr-2" />
            <span className="text-xs font-bold text-blue-700">总投入本金</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">
            ${metrics.totalPremium.toLocaleString()}
          </div>
          <div className="text-xs text-blue-600 mt-1">5年缴费期</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center mb-2">
            <Clock size={18} className="text-green-600 mr-2" />
            <span className="text-xs font-bold text-green-700">回本时间</span>
          </div>
          <div className="text-2xl font-bold text-green-900">
            {metrics.breakEven ? `第${metrics.breakEven}年` : '未回本'}
          </div>
          <div className="text-xs text-green-600 mt-1">
            {metrics.breakEven ? '现金价值 > 本金' : '持续增长中'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center mb-2">
            <Zap size={18} className="text-amber-600 mr-2" />
            <span className="text-xs font-bold text-amber-700">传承倍数</span>
          </div>
          <div className="text-2xl font-bold text-amber-900">
            {metrics.legacyMultiplier}x
          </div>
          <div className="text-xs text-amber-600 mt-1">第99年身故赔偿</div>
        </div>
      </div>

      {/* 视图切换控件 */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-600">视图模式</span>
        <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-bold">
          <button
            onClick={() => setViewMode('focus')}
            className={`px-4 py-2 rounded-md transition-all duration-300 flex items-center ${
              viewMode === 'focus'
                ? 'bg-white text-[#D31145] shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Eye size={14} className="mr-1.5" />
            前期视角 (前20年)
          </button>
          <button
            onClick={() => setViewMode('full')}
            className={`px-4 py-2 rounded-md transition-all duration-300 flex items-center ${
              viewMode === 'full'
                ? 'bg-white text-[#D31145] shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <EyeOff size={14} className="mr-1.5" />
            终身视角 (100年)
          </button>
        </div>
      </div>

      {/* 动态图表 */}
      <div className="mt-2 transition-all duration-500 ease-in-out">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorCashValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D31145" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#D31145" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="year" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={formatXAxisTick}
              ticks={keyYears}
              label={{ 
                value: viewMode === 'focus' ? '保单年度 (前期)' : '保单年度 (终身)', 
                position: 'insideBottom', 
                offset: -5, 
                style: { fontSize: '12px', fill: '#6b7280' } 
              }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={formatYAxis}
              // 确保小金额也能清晰显示，domain 根据视图模式自动调整
              domain={viewMode === 'focus' ? [0, 'auto'] : [0, 'auto']}
              label={{ value: '金额 (USD)', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#6b7280', textAnchor: 'middle' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              iconType="line"
            />
            
            {/* 已缴保费 - 灰色区域 */}
            <Area
              type="monotone"
              dataKey="totalPremiumPaid"
              stroke="#9ca3af"
              strokeWidth={1}
              fill="#e5e7eb"
              fillOpacity={0.3}
              name="已缴保费"
              dot={false}
              animationDuration={500}
            />
            
            {/* 现金价值 - AIA红色实线 */}
            <Line
              type="monotone"
              dataKey="cashValue"
              name="现金价值"
              stroke="#D31145"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#D31145' }}
              animationDuration={500}
            />
            
            {/* 身故赔偿 - 金色虚线 */}
            <Line
              type="monotone"
              dataKey="deathBenefit"
              name="身故赔偿"
              stroke="#C5A065"
              strokeWidth={2.5}
              strokeDasharray="8 4"
              dot={false}
              activeDot={{ r: 5, fill: '#C5A065' }}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
