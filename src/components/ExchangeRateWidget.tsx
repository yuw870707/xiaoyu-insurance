import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface ExchangeRate {
  pair: string;
  current: number;
  change: number; // 涨跌幅百分比
  status: 'BUY' | 'HOLD' | 'SELL';
  advisorNote: string;
}

// Mock 数据 - 预留 API 对接位置
// TODO: 替换为真实 API 调用
const MOCK_EXCHANGE_RATES: ExchangeRate[] = [
  {
    pair: 'USD/CNY',
    current: 7.25,
    change: 0.05,
    status: 'HOLD',
    advisorNote: '美联储降息预期增强，建议分批换汇。',
  },
  {
    pair: 'HKD/CNY',
    current: 0.92,
    change: -0.12,
    status: 'BUY',
    advisorNote: '港币汇率处于低位，适合配置港币资产。',
  },
];

export default function ExchangeRateWidget() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'BUY':
        return <span className="text-green-500">🟢</span>;
      case 'SELL':
        return <span className="text-red-500">🔴</span>;
      case 'HOLD':
        return <span className="text-yellow-500">🟡</span>;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'BUY':
        return '买入';
      case 'SELL':
        return '卖出';
      case 'HOLD':
        return '观望';
      default:
        return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BUY':
        return 'text-green-600';
      case 'SELL':
        return 'text-red-600';
      case 'HOLD':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="mb-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center">
            <AlertCircle size={16} className="mr-2 text-[#D31145]" />
            汇率红绿灯
          </h3>
          <span className="text-xs text-gray-400">实时更新</span>
        </div>

        {/* 汇率卡片容器 - 横向滚动 */}
        <div className="flex space-x-3 overflow-x-auto pb-2 hide-scrollbar">
          {MOCK_EXCHANGE_RATES.map((rate, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-44 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4"
            >
              {/* 货币对 */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-600">{rate.pair}</span>
                {getStatusIcon(rate.status)}
              </div>

              {/* 当前汇率 */}
              <div className="mb-2">
                <div className="text-2xl font-bold text-slate-900">
                  {rate.current}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  {rate.change > 0 ? (
                    <TrendingUp size={14} className="text-red-500" />
                  ) : (
                    <TrendingDown size={14} className="text-green-500" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      rate.change > 0 ? 'text-red-500' : 'text-green-500'
                    }`}
                  >
                    {rate.change > 0 ? '+' : ''}
                    {rate.change.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* 状态标签 */}
              <div className="mb-2">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    rate.status === 'BUY'
                      ? 'bg-green-100 text-green-700'
                      : rate.status === 'SELL'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {getStatusLabel(rate.status)}
                </span>
              </div>

              {/* 顾问点评 */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  {rate.advisorNote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
