import { useState } from 'react';
import { ExternalLink, Phone, MessageCircle, X, Building2, Stethoscope, Syringe, ChevronRight } from 'lucide-react';

type TabType = 'VACCINE' | 'HOSPITAL' | 'SPECIALIST';

interface MedicalResource {
  id: string;
  name: string;
  type: TabType;
  tags: string[];
  description: string;
  website?: string;
  phone?: string;
  wechat?: string;
}

// Mock 数据
const MOCK_RESOURCES: MedicalResource[] = [
  {
    id: '1',
    name: '九价 HPV 预约',
    type: 'VACCINE',
    tags: ['现货充足'],
    description: '中环诊所，三针包打',
    phone: '+852 1234 5678',
    wechat: 'xiaoyu_helper',
  },
  {
    id: '2',
    name: '养和医院',
    type: 'HOSPITAL',
    tags: ['全港顶尖', '直付理赔'],
    description: '富豪首选，肿瘤科权威',
    website: 'https://www.hksh.com',
    phone: '+852 2572 0211',
    wechat: 'xiaoyu_helper',
  },
  {
    id: '3',
    name: '港怡医院',
    type: 'HOSPITAL',
    tags: ['高性价比', '免找数'],
    description: '环境舒适，无需排队',
    website: 'https://www.gleneagles.hk',
    phone: '+852 3153 9000',
    wechat: 'xiaoyu_helper',
  },
  {
    id: '4',
    name: '香港港安医院',
    type: 'HOSPITAL',
    tags: ['老牌医院', '综合服务'],
    description: '历史悠久，综合医疗实力强',
    website: 'https://www.hkah.org.hk',
    phone: '+852 3651 8888',
    wechat: 'xiaoyu_helper',
  },
  {
    id: '5',
    name: '心脏科名医 - 李医生',
    type: 'SPECIALIST',
    tags: ['专科名医', '预约难'],
    description: '港大医学院教授，心脏介入专家',
    phone: '+852 1234 5678',
    wechat: 'xiaoyu_helper',
  },
  {
    id: '6',
    name: '肿瘤科名医 - 张医生',
    type: 'SPECIALIST',
    tags: ['权威专家', '需转介'],
    description: '养和医院肿瘤中心主任',
    phone: '+852 1234 5678',
    wechat: 'xiaoyu_helper',
  },
];

export default function MedicalGuide() {
  const [activeTab, setActiveTab] = useState<TabType>('VACCINE');
  const [selectedResource, setSelectedResource] = useState<MedicalResource | null>(null);

  const filteredResources = MOCK_RESOURCES.filter(r => r.type === activeTab);

  const handleResourceClick = (resource: MedicalResource) => {
    setSelectedResource(resource);
  };

  const handleOpenWebsite = () => {
    if (selectedResource?.website) {
      window.open(selectedResource.website, '_blank');
      setSelectedResource(null);
    }
  };

  const handleCall = () => {
    if (selectedResource?.phone) {
      window.location.href = `tel:${selectedResource.phone}`;
    }
  };

  const handleCopyWechat = () => {
    if (selectedResource?.wechat) {
      navigator.clipboard.writeText(selectedResource.wechat);
      alert(`已复制微信号：${selectedResource.wechat}\n\n联系顾问小宇协助预约`);
      setSelectedResource(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
        {/* 标题栏 - 统一格式 */}
        <div className="p-5 pb-3">
          <div className="flex items-center mb-1">
            <Stethoscope size={20} className="text-[#D31145] mr-2" />
            <h2 className="text-lg font-bold text-slate-900">香港医疗资源指南</h2>
          </div>
          <p className="text-xs text-gray-500">一站式医疗预约服务</p>
        </div>

        {/* Tab 切换 */}
        <div className="px-5 pb-3">
          <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-bold">
            <button
              onClick={() => setActiveTab('VACCINE')}
              className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center ${
                activeTab === 'VACCINE'
                  ? 'bg-white text-[#D31145] shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Syringe size={14} className="mr-1.5" />
              疫苗预约
            </button>
            <button
              onClick={() => setActiveTab('HOSPITAL')}
              className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center ${
                activeTab === 'HOSPITAL'
                  ? 'bg-white text-[#D31145] shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Building2 size={14} className="mr-1.5" />
              私家医院
            </button>
            <button
              onClick={() => setActiveTab('SPECIALIST')}
              className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center ${
                activeTab === 'SPECIALIST'
                  ? 'bg-white text-[#D31145] shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Stethoscope size={14} className="mr-1.5" />
              专科名医
            </button>
          </div>
        </div>

        {/* 资源列表 */}
        <div className="px-5 pb-5 space-y-3">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              onClick={() => handleResourceClick(resource)}
              className="p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:shadow-md active:scale-[0.98] transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-base font-bold text-slate-900 flex-1">
                  {resource.name}
                </h3>
              </div>
              
              {/* 标签 - 统一样式 */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {resource.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 bg-red-50 text-red-700 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 描述 */}
              <p className="text-xs text-gray-600">{resource.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Sheet - 底部弹出操作菜单 */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedResource(null)}
          />
          <div className="relative bg-white rounded-t-2xl shadow-2xl w-full max-w-md animate-slide-up">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-2 mb-4" />
            
            <div className="px-6 pt-2 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">{selectedResource.name}</h3>
                <button
                  onClick={() => setSelectedResource(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X size={18} className="text-gray-600" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">{selectedResource.description}</p>
            </div>

            <div className="p-4 space-y-2">
              {/* 查看官网 */}
              {selectedResource.website && (
                <button
                  onClick={handleOpenWebsite}
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 active:scale-95 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <ExternalLink size={18} className="text-[#D31145] mr-3" />
                    <span className="font-medium text-slate-800">查看医院官网</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
              )}

              {/* 联系小宇协助预约 - 统一按钮样式 */}
              <button
                onClick={() => {
                  // 优先复制微信，如果没有则拨打电话
                  if (selectedResource.wechat) {
                    handleCopyWechat();
                  } else if (selectedResource.phone) {
                    handleCall();
                  }
                }}
                className="w-full py-3.5 bg-[#D31145] hover:bg-[#B80E3A] rounded-xl text-white text-sm font-bold active:scale-95 transition-all flex items-center justify-between shadow-md"
              >
                <div className="flex items-center">
                  <MessageCircle size={18} className="mr-3" />
                  <span>联系小宇协助预约</span>
                </div>
                {selectedResource.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="opacity-80" />
                    <span className="text-xs opacity-80">{selectedResource.phone}</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
