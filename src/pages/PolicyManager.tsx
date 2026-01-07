import { useState } from 'react';
import { ArrowLeft, Plus, Shield, TrendingUp, Calendar, Download, X, Users } from 'lucide-react';

interface Policy {
  id: string;
  member: string;
  memberRole: 'Dad' | 'Mom' | 'Kid';
  company: string;
  productName: string;
  type: 'SAVINGS' | 'HEALTH';
  sumAssured?: number;
  cashValue?: number;
  nextPaymentDate?: string;
  status: 'ACTIVE' | 'PENDING' | 'REVIEW';
  premium?: number;
}

interface PolicyManagerProps {
  onBack: () => void;
}

// Mock 数据
const MOCK_POLICIES: Policy[] = [
  {
    id: '1',
    member: '爸爸',
    memberRole: 'Dad',
    company: 'AIA',
    productName: '环宇盈活储蓄计划',
    type: 'SAVINGS',
    cashValue: 125000,
    nextPaymentDate: '2026-03-15',
    status: 'ACTIVE',
    premium: 30000,
  },
  {
    id: '2',
    member: '爸爸',
    memberRole: 'Dad',
    company: 'AIA',
    productName: '爱伴航 2 (OYS2)',
    type: 'HEALTH',
    sumAssured: 500000,
    nextPaymentDate: '2026-04-01',
    status: 'ACTIVE',
    premium: 8500,
  },
  {
    id: '3',
    member: '妈妈',
    memberRole: 'Mom',
    company: 'AIA',
    productName: '盈御多元货币计划 3',
    type: 'SAVINGS',
    cashValue: 89000,
    nextPaymentDate: '2026-03-20',
    status: 'ACTIVE',
    premium: 25000,
  },
  {
    id: '4',
    member: '妈妈',
    memberRole: 'Mom',
    company: 'Prudential',
    productName: '多重智倍保 (SEU)',
    type: 'HEALTH',
    sumAssured: 300000,
    nextPaymentDate: '2026-03-10',
    status: 'PENDING',
    premium: 5500,
  },
  {
    id: '5',
    member: '小宝',
    memberRole: 'Kid',
    company: 'AIA',
    productName: '爱无忧长享计划 5',
    type: 'SAVINGS',
    cashValue: 45000,
    nextPaymentDate: '2026-03-25',
    status: 'ACTIVE',
    premium: 15000,
  },
];

const MEMBERS = ['爸爸', '妈妈', '小宝'];

export default function PolicyManager({ onBack }: PolicyManagerProps) {
  const [activeTab, setActiveTab] = useState<'MEMBER' | 'CALENDAR'>('MEMBER');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // 计算总资产和总保额
  const totals = {
    cashValue: MOCK_POLICIES.filter(p => p.type === 'SAVINGS').reduce((sum, p) => sum + (p.cashValue || 0), 0),
    sumAssured: MOCK_POLICIES.filter(p => p.type === 'HEALTH').reduce((sum, p) => sum + (p.sumAssured || 0), 0),
  };

  // 按成员分组
  const policiesByMember = selectedMember
    ? MOCK_POLICIES.filter(p => p.member === selectedMember)
    : MOCK_POLICIES;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">🟢 保障中</span>;
      case 'PENDING':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">🔴 待缴费</span>;
      case 'REVIEW':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">🟡 审核中</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-6 border-b border-gray-100 sticky top-0 z-10">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span className="text-sm font-medium">返回服务</span>
        </button>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-4">我的保障管家</h1>

        {/* 总资产/总保额摘要 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center mb-2">
              <TrendingUp size={16} className="text-blue-600 mr-2" />
              <span className="text-xs font-bold text-blue-700">总资产价值</span>
            </div>
            <div className="text-xl font-bold text-blue-900">
              ${totals.cashValue.toLocaleString()}
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
            <div className="flex items-center mb-2">
              <Shield size={16} className="text-red-600 mr-2" />
              <span className="text-xs font-bold text-red-700">总保额</span>
            </div>
            <div className="text-xl font-bold text-red-900">
              ${totals.sumAssured.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Tab 切换 */}
        <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-bold">
          <button
            onClick={() => setActiveTab('MEMBER')}
            className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center ${
              activeTab === 'MEMBER'
                ? 'bg-white text-[#D31145] shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Users size={14} className="mr-1.5" />
            按成员查看
          </button>
          <button
            onClick={() => setActiveTab('CALENDAR')}
            className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center ${
              activeTab === 'CALENDAR'
                ? 'bg-white text-[#D31145] shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Calendar size={14} className="mr-1.5" />
            缴费日历
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-5 space-y-4">
        {/* 成员筛选器 */}
        {activeTab === 'MEMBER' && (
          <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
            <button
              onClick={() => setSelectedMember(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedMember === null
                  ? 'bg-[#D31145] text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              全部成员
            </button>
            {MEMBERS.map((member) => (
              <button
                key={member}
                onClick={() => setSelectedMember(member)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedMember === member
                    ? 'bg-[#D31145] text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                {member}
              </button>
            ))}
          </div>
        )}

        {/* 保单列表 */}
        {activeTab === 'MEMBER' && (
          <div className="space-y-4">
            {policiesByMember.map((policy) => (
              <div
                key={policy.id}
                onClick={() => setSelectedPolicy(policy)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-bold text-gray-500">{policy.company}</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-500">{policy.member}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {policy.productName}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {policy.type === 'SAVINGS' ? (
                        <TrendingUp size={14} className="text-[#C5A065]" />
                      ) : (
                        <Shield size={14} className="text-[#0097A7]" />
                      )}
                      <span className="text-xs text-gray-500">
                        {policy.type === 'SAVINGS' ? '储蓄险' : '重疾险'}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(policy.status)}
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                  {policy.type === 'SAVINGS' ? (
                    <>
                      <div>
                        <div className="text-xs text-gray-500 mb-0.5">现金价值</div>
                        <div className="text-sm font-bold text-slate-800">
                          ${policy.cashValue?.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-0.5">年缴保费</div>
                        <div className="text-sm font-bold text-slate-800">
                          ${policy.premium?.toLocaleString()}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="text-xs text-gray-500 mb-0.5">保额</div>
                        <div className="text-sm font-bold text-slate-800">
                          ${policy.sumAssured?.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-0.5">年缴保费</div>
                        <div className="text-sm font-bold text-slate-800">
                          ${policy.premium?.toLocaleString()}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {policy.nextPaymentDate && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      下次缴费: <span className="font-medium text-slate-700">{policy.nextPaymentDate}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 缴费日历视图 */}
        {activeTab === 'CALENDAR' && (
          <div className="space-y-4">
            {MOCK_POLICIES.filter(p => p.nextPaymentDate).map((policy) => (
              <div
                key={policy.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">{policy.member}</div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      {policy.productName}
                    </h3>
                    <div className="text-xs text-gray-600">
                      应缴: ${policy.premium?.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">缴费日期</div>
                    <div className="text-base font-bold text-[#D31145]">
                      {policy.nextPaymentDate?.split('-')[2]}
                    </div>
                    <div className="text-xs text-gray-400">
                      {policy.nextPaymentDate?.split('-')[0]}/{policy.nextPaymentDate?.split('-')[1]}
                    </div>
                  </div>
                  {getStatusBadge(policy.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB 按钮 - 新增托管 */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-5 w-14 h-14 bg-[#D31145] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#B80E3A] active:scale-95 transition-all z-40"
      >
        <Plus size={24} />
      </button>

      {/* 新增托管弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-slide-up">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-2 mb-4" />
            <div className="px-6 pt-2 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">申请托管新保单</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X size={18} className="text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    保险公司
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D31145]">
                    <option>AIA 友邦</option>
                    <option>Prudential 保诚</option>
                    <option>Manulife 宏利</option>
                    <option>其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    险种类型
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D31145]">
                    <option>储蓄险</option>
                    <option>重疾险</option>
                    <option>医疗险</option>
                    <option>其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    上传保单首页
                  </label>
                  <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#D31145] hover:bg-red-50/50 transition-all">
                    <Plus size={32} className="text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600 text-center">
                      点击拍照或选择照片
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      支持 JPG/PNG/PDF
                    </span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      capture="environment"
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    上传后，顾问小宇将在 24 小时内为您整理录入
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => {
                  alert('申请已提交！顾问小宇将在24小时内联系您。');
                  setShowAddModal(false);
                }}
                className="w-full py-3 bg-[#D31145] text-white rounded-xl font-bold shadow-lg hover:bg-[#B80E3A] active:scale-95 transition-all"
              >
                提交申请
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 保单详情 Modal */}
      {selectedPolicy && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedPolicy(null)}
          />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-slide-up">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-2 mb-4" />
            <div className="px-6 pt-2 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">保单详情</h2>
                <button
                  onClick={() => setSelectedPolicy(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X size={18} className="text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">产品名称</div>
                  <div className="text-lg font-bold text-slate-900">{selectedPolicy.productName}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">被保人</div>
                    <div className="text-sm font-medium text-slate-800">{selectedPolicy.member}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">状态</div>
                    {getStatusBadge(selectedPolicy.status)}
                  </div>
                </div>
                {selectedPolicy.type === 'SAVINGS' ? (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">现金价值</div>
                    <div className="text-xl font-bold text-slate-900">
                      ${selectedPolicy.cashValue?.toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">保额</div>
                    <div className="text-xl font-bold text-slate-900">
                      ${selectedPolicy.sumAssured?.toLocaleString()}
                    </div>
                  </div>
                )}
                {selectedPolicy.nextPaymentDate && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">下次缴费日期</div>
                    <div className="text-sm font-medium text-slate-800">{selectedPolicy.nextPaymentDate}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 space-y-2">
              <button
                onClick={() => {
                  alert('保单电子档下载功能开发中...');
                }}
                className="w-full py-3 bg-white border-2 border-[#D31145] text-[#D31145] rounded-xl font-bold hover:bg-red-50 active:scale-95 transition-all flex items-center justify-center"
              >
                <Download size={18} className="mr-2" />
                保单电子档下载
              </button>
              <button
                onClick={() => {
                  alert('已通知顾问小宇，将尽快联系您协助变更。');
                  setSelectedPolicy(null);
                }}
                className="w-full py-3 bg-[#D31145] text-white rounded-xl font-bold shadow-lg hover:bg-[#B80E3A] active:scale-95 transition-all"
              >
                联系小宇协助变更
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
