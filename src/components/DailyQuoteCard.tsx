import { Sparkles, Quote } from 'lucide-react';

// Mock 日签数据 - 可以后续替换为 API
const DAILY_QUOTES = [
  {
    id: 1,
    text: '财富不是目的，而是实现人生价值的工具。',
    author: '巴菲特',
    category: '财富智慧',
  },
  {
    id: 2,
    text: '保险是未雨绸缪的智慧，是给未来自己的礼物。',
    author: '未知',
    category: '风险管理',
  },
  {
    id: 3,
    text: '家庭财务健康，始于今日的规划。',
    author: '未知',
    category: '家庭规划',
  },
];

// 根据日期选择日签（确保每天同一签）
const getDailyQuote = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
};

export default function DailyQuoteCard() {
  const quote = getDailyQuote();

  return (
    <div className="bg-gradient-to-br from-[#D31145]/5 to-[#C5A065]/10 rounded-2xl p-5 border border-[#D31145]/10 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <Quote size={18} className="text-[#D31145] mr-2" />
          <span className="text-xs font-bold text-[#D31145]">每日日签</span>
        </div>
        <Sparkles size={16} className="text-[#C5A065] opacity-60" />
      </div>
      
      <p className="text-sm text-slate-700 leading-relaxed mb-3 italic">
        "{quote.text}"
      </p>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">— {quote.author}</span>
        <span className="text-[10px] px-2 py-0.5 bg-[#C5A065]/20 text-[#C5A065] rounded-full font-medium">
          {quote.category}
        </span>
      </div>
    </div>
  );
}
