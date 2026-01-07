import { Building2, CreditCard, ArrowRight, Download, Phone, CheckCircle, Shield, Zap } from 'lucide-react';

interface BankCard {
  id: string;
  name: string;
  nameEn: string;
  type: 'VIRTUAL' | 'TRADITIONAL';
  tags: string[];
  description: string;
  ctaText: string;
  ctaAction: () => void;
  icon?: React.ReactNode;
}

interface BankingGuideProps {
  onContactAdvisor?: () => void;
}

export default function BankingGuide({ onContactAdvisor }: BankingGuideProps) {
  
  const handleViewTutorial = () => {
    // 可以打开 PDF 或跳转到教程页面
    alert('开户教程 PDF 已准备，请联系顾问小宇获取');
  };

  const handleContactBankManager = () => {
    if (onContactAdvisor) {
      onContactAdvisor();
    } else {
      alert('请联系顾问小宇预约银行经理');
    }
  };

  const bankCards: BankCard[] = [
    {
      id: 'za-bank',
      name: 'ZA Bank',
      nameEn: '众安银行',
      type: 'VIRTUAL',
      tags: ['内地直连', '无管理费', '保险直付'],
      description: '人在内地即可开户，支持微信/支付宝转账，理赔款秒到账。',
      ctaText: '查看开户教程 (PDF)',
      ctaAction: handleViewTutorial,
      icon: <Building2 size={24} className="text-blue-600" />,
    },
    {
      id: 'hsbc',
      name: 'HSBC',
      nameEn: '汇丰银行',
      type: 'TRADITIONAL',
      tags: ['全球流转', '理财首选'],
      description: '需亲临香港分行。建议提前预约，小宇可提供开户指引。',
      ctaText: '联系小宇预约银行经理',
      ctaAction: handleContactBankManager,
      icon: <CreditCard size={24} className="text-red-600" />,
    },
    {
      id: 'bochk',
      name: 'BOCHK',
      nameEn: '中银香港',
      type: 'TRADITIONAL',
      tags: ['全球流转', '理财首选', '保费直付'],
      description: '需亲临香港分行。支持保费自动扣款，续期无忧。',
      ctaText: '联系小宇预约银行经理',
      ctaAction: handleContactBankManager,
      icon: <CreditCard size={24} className="text-red-700" />,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
      {/* 标题栏 - 统一格式 */}
      <div className="p-5 pb-3">
        <div className="flex items-center mb-1">
          <CreditCard size={20} className="text-[#D31145] mr-2" />
          <h2 className="text-lg font-bold text-slate-900">香港金融基建指南</h2>
        </div>
        <p className="text-xs text-gray-500">解决缴费难、收款难的核心工具</p>
      </div>

      {/* 银行卡片列表 - 横向滚动 */}
      <div className="px-5 pb-5">
        <div className="flex space-x-4 overflow-x-auto pb-2 hide-scrollbar">
          {bankCards.map((bank) => (
            <div
              key={bank.id}
              className="flex-shrink-0 w-72 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-5"
            >
              {/* 银行 Logo 和名称 */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  {/* Logo 占位符 */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-3 ${
                    bank.type === 'VIRTUAL' 
                      ? 'bg-blue-100' 
                      : 'bg-red-100'
                  }`}>
                    {bank.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{bank.name}</h3>
                    <p className="text-xs text-gray-500">{bank.nameEn}</p>
                  </div>
                </div>
                {bank.type === 'VIRTUAL' && (
                  <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-bold">
                    0门槛
                  </span>
                )}
              </div>

              {/* 标签 - 统一样式 */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {bank.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 bg-red-50 text-red-700 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 描述 */}
              <p className="text-xs text-gray-700 leading-relaxed mb-4">
                {bank.description}
              </p>

              {/* CTA 按钮 - 统一按钮样式 */}
              <button
                onClick={bank.ctaAction}
                className="w-full py-2.5 bg-[#D31145] hover:bg-[#B80E3A] rounded-lg text-white text-xs font-bold active:scale-95 transition-all flex items-center justify-center"
              >
                {bank.type === 'VIRTUAL' ? (
                  <Download size={14} className="mr-1.5" />
                ) : (
                  <Phone size={14} className="mr-1.5" />
                )}
                {bank.ctaText}
              </button>
            </div>
          ))}
        </div>

        {/* 资金小贴士 */}
        <div className="mt-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-4">
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
              <Zap size={16} className="text-amber-700" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-amber-900 mb-1.5 flex items-center">
                <span className="text-base mr-1">💡</span>
                资金小贴士
              </h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                买了环宇盈活？建议首选绑定<strong className="font-bold">中银香港</strong>，续期保费自动扣款，省去每年汇款手续费！
              </p>
            </div>
          </div>
        </div>

        {/* 安全提示 */}
        <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
          <div className="flex items-start">
            <Shield size={16} className="text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-blue-900 mb-1">安全提示</p>
              <p className="text-[10px] text-blue-700 leading-relaxed">
                所有开户流程均需通过官方渠道完成，顾问小宇仅提供指引服务，不会要求您转账任何费用。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
