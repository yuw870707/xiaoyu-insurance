import { ArrowLeft } from 'lucide-react';
import DynamicCalculator from '../components/DynamicCalculator';

interface GlobalPowerPageProps {
  onBack: () => void;
}

export default function GlobalPowerPage({ onBack }: GlobalPowerPageProps) {
  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-6 border-b border-gray-100 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span className="text-sm font-medium">返回财富增值</span>
        </button>
        
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-slate-900">环宇盈活储蓄计划</h1>
          <p className="text-sm text-gray-500 mt-1">Global Power Multi-Currency Plan</p>
        </div>
        <p className="text-sm text-[#C5A065] font-medium mt-2">
          多元货币配置，财富世代传承
        </p>
      </div>

      {/* Body - 计算器 */}
      <div className="p-5">
        <DynamicCalculator />
      </div>
    </div>
  );
}
