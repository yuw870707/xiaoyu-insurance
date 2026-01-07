import { useState } from 'react';
import { GraduationCap, BookOpen, Award, School, TrendingUp, Globe, User, Star } from 'lucide-react';

type TabType = 'SCHOOLS' | 'PATHWAYS' | 'IDENTITY';

interface School {
  id: string;
  name: string;
  nameEn: string;
  tags: string[];
  tuition: string;
  note: string;
}

interface Pathway {
  name: string;
  advantages: string[];
  target: string;
}

interface IdentityProgram {
  name: string;
  nameEn: string;
  description: string;
  requirements: string[];
  benefits: string[];
}

// Mock 数据
const MOCK_SCHOOLS: School[] = [
  {
    id: '1',
    name: '汉基国际学校',
    nameEn: 'Chinese International School (CIS)',
    tags: ['IB均分41', '政商名流'],
    tuition: '$292,300/年',
    note: '需购买提名权(Debenture)',
  },
  {
    id: '2',
    name: '圣保罗男女中学',
    nameEn: 'St. Paul\'s Co-educational College',
    tags: ['DSE状元', 'Band 1A'],
    tuition: '$72,400/年',
    note: '本地最强传统名校',
  },
  {
    id: '3',
    name: '哈罗香港',
    nameEn: 'Harrow International School Hong Kong',
    tags: ['英式贵族', '寄宿'],
    tuition: '$212,000/年',
    note: '英式传统寄宿制',
  },
  {
    id: '4',
    name: '香港国际学校',
    nameEn: 'Hong Kong International School (HKIS)',
    tags: ['美式课程', '升学率高'],
    tuition: '$245,000/年',
    note: 'IB/AP双轨制',
  },
  {
    id: '5',
    name: '德瑞国际学校',
    nameEn: 'German Swiss International School',
    tags: ['IB均分40+', '德语双语'],
    tuition: '$215,000/年',
    note: '德语/英语双语教学',
  },
];

const MOCK_PATHWAYS: Pathway[] = [
  {
    name: '香港 DSE',
    advantages: [
      '免试申请内地 132 所高校',
      '可申请香港本地大学',
      '可申请海外大学（需额外成绩）',
      '费用相对较低',
    ],
    target: '适合计划在内地或香港升学的学生',
  },
  {
    name: 'IB/A-Level',
    advantages: [
      '全球认可度最高',
      '可直接申请全球顶尖大学',
      '培养批判性思维',
      '英语能力要求高',
    ],
    target: '适合计划海外升学的学生',
  },
  {
    name: '内地高考',
    advantages: [
      '费用最低',
      '竞争激烈',
      '升学路径相对单一',
      '需要回内地考试',
    ],
    target: '适合计划在内地升学的学生',
  },
];

const MOCK_IDENTITIES: IdentityProgram[] = [
  {
    name: '高才通',
    nameEn: 'Top Talent Pass Scheme (TTPS)',
    description: '面向高收入、高学历人士的快速通道',
    requirements: [
      '年收入达 250 万港币或以上（过去一年）',
      '或拥有全球百强大学学士学位',
      '无犯罪记录',
    ],
    benefits: [
      '首次获批 2 年有效期',
      '可携带配偶及未成年子女',
      '无配额限制',
      '审批速度快（4-6周）',
    ],
  },
  {
    name: '优才计划',
    nameEn: 'Quality Migrant Admission Scheme (QMAS)',
    description: '通过综合计分制或成就计分制申请',
    requirements: [
      '年龄 18 岁以上',
      '无犯罪记录',
      '具备良好学历或专业能力',
      '通过综合计分制（225分满分，80分合格）',
    ],
    benefits: [
      '首次获批 3 年有效期',
      '可携带配偶及未成年子女',
      '无需本地雇主担保',
      '7年后可申请永久居民',
    ],
  },
];

interface EducationGuideProps {
  onNavigateToCalculator?: () => void;
  onContactAdvisor?: () => void;
}

export default function EducationGuide({ onNavigateToCalculator, onContactAdvisor }: EducationGuideProps) {
  const [activeTab, setActiveTab] = useState<TabType>('SCHOOLS');

  const handleViewPlan = () => {
    if (onNavigateToCalculator) {
      onNavigateToCalculator();
    }
  };

  const handleContactAdvisor = () => {
    if (onContactAdvisor) {
      onContactAdvisor();
    } else {
      alert('请联系顾问小宇评估申请资格');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
      {/* 标题栏 - 统一格式 */}
      <div className="p-5 pb-3">
        <div className="flex items-center mb-1">
          <GraduationCap size={20} className="text-[#D31145] mr-2" />
          <h2 className="text-lg font-bold text-slate-900">香港教育资源指南</h2>
        </div>
        <p className="text-xs text-gray-500">一站式教育规划服务</p>
      </div>

      {/* Tab 切换 */}
      <div className="px-5 pb-3">
        <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-bold">
          <button
            onClick={() => setActiveTab('SCHOOLS')}
            className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center ${
              activeTab === 'SCHOOLS'
                ? 'bg-white text-[#D31145] shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <School size={14} className="mr-1.5" />
            顶尖名校
          </button>
          <button
            onClick={() => setActiveTab('PATHWAYS')}
            className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center ${
              activeTab === 'PATHWAYS'
                ? 'bg-white text-[#D31145] shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <TrendingUp size={14} className="mr-1.5" />
            升学路径
          </button>
          <button
            onClick={() => setActiveTab('IDENTITY')}
            className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center ${
              activeTab === 'IDENTITY'
                ? 'bg-white text-[#D31145] shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Award size={14} className="mr-1.5" />
            身份红利
          </button>
        </div>
      </div>

      {/* Tab 内容 */}
      <div className="px-5 pb-5">
        {/* Tab 1: 顶尖名校 */}
        {activeTab === 'SCHOOLS' && (
          <div className="space-y-3 animate-fade-in">
            {MOCK_SCHOOLS.map((school) => (
              <div
                key={school.id}
                className="p-4 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-slate-900 mb-0.5">
                      {school.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{school.nameEn}</p>
                  </div>
                  <GraduationCap size={20} className="text-[#D31145] flex-shrink-0 ml-2" />
                </div>

                {/* 标签 - 统一样式 */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {school.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 bg-red-50 text-red-700 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 学费和备注 */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs text-gray-500">学费：</span>
                    <span className="text-sm font-bold text-slate-800 ml-1">
                      {school.tuition}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500">{school.note}</span>
                </div>

                {/* CTA 按钮 - 统一按钮样式 */}
                <button
                  onClick={handleViewPlan}
                  className="w-full py-2.5 bg-[#D31145] hover:bg-[#B80E3A] rounded-lg text-white text-xs font-bold active:scale-95 transition-all flex items-center justify-center"
                >
                  <BookOpen size={14} className="mr-1.5" />
                  查看学费储备方案
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: 升学路径 */}
        {activeTab === 'PATHWAYS' && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center py-2">
              <p className="text-xs text-gray-500">选择适合的升学路径，规划更清晰</p>
            </div>

            {MOCK_PATHWAYS.map((pathway, idx) => (
              <div
                key={idx}
                className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center">
                    <TrendingUp size={16} className="mr-2 text-[#D31145]" />
                    {pathway.name}
                  </h3>
                </div>

                <div className="space-y-2 mb-3">
                  {pathway.advantages.map((advantage, advIdx) => (
                    <div
                      key={advIdx}
                      className="flex items-start text-xs text-gray-700"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D31145] mt-1.5 mr-2 flex-shrink-0" />
                      <span>{advantage}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <p className="text-[10px] text-gray-500 italic">{pathway.target}</p>
                </div>
              </div>
            ))}

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mt-4">
              <div className="flex items-start">
                <Globe size={16} className="text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-900 mb-1">DSE 升学优势</p>
                  <p className="text-[10px] text-amber-700 leading-relaxed">
                    DSE 成绩可直接用于申请内地 132 所高校，包括清华大学、北京大学等顶尖学府，无需额外考试。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 身份红利 */}
        {activeTab === 'IDENTITY' && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center py-2">
              <p className="text-xs text-gray-500">获得香港身份，享受教育资源红利</p>
            </div>

            {MOCK_IDENTITIES.map((identity, idx) => (
              <div
                key={idx}
                className="p-4 bg-gradient-to-br from-blue-50/50 to-white rounded-xl border border-blue-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-0.5">
                      {identity.name}
                    </h3>
                    <p className="text-xs text-gray-500">{identity.nameEn}</p>
                  </div>
                  <Award size={20} className="text-[#D31145] flex-shrink-0 ml-2" />
                </div>

                <p className="text-xs text-gray-700 mb-3">{identity.description}</p>

                <div className="mb-3">
                  <div className="text-xs font-bold text-slate-800 mb-2 flex items-center">
                    <User size={12} className="mr-1" />
                    申请条件
                  </div>
                  <div className="space-y-1.5">
                    {identity.requirements.map((req, reqIdx) => (
                      <div
                        key={reqIdx}
                        className="flex items-start text-xs text-gray-700"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2 flex-shrink-0" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-800 mb-2 flex items-center">
                    <Star size={12} className="mr-1" />
                    优势亮点
                  </div>
                  <div className="space-y-1.5">
                    {identity.benefits.map((benefit, benIdx) => (
                      <div
                        key={benIdx}
                        className="flex items-start text-xs text-gray-700"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 mr-2 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* CTA 按钮 - 统一按钮样式 */}
            <button
              onClick={handleContactAdvisor}
              className="w-full py-3.5 bg-[#D31145] hover:bg-[#B80E3A] rounded-xl text-white text-sm font-bold active:scale-95 transition-all flex items-center justify-center shadow-md mt-4"
            >
              <User size={16} className="mr-2" />
              评估我的申请资格（联系小宇）
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
