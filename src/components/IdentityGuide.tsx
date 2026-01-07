import { useState } from 'react';
import { CreditCard, Award, GraduationCap, Briefcase, Landmark, Rocket, X, CheckCircle, FileText, User, Phone, QrCode } from 'lucide-react';

type IdentityType = 'TTPS' | 'QMAS' | 'IANG' | 'GEP' | 'CIES';

interface IdentityPathway {
  id: IdentityType;
  name: string;
  nameEn: string;
  tags: string[];
  suitableFor: string;
  difficulty?: string;
  description: string;
  requirements: string[];
  icon: React.ElementType;
}

// Mock 数据 - 使用图标组件而不是 JSX
const IDENTITY_PATHWAYS: IdentityPathway[] = [
  {
    id: 'TTPS',
    name: '高才通',
    nameEn: 'Top Talent Pass Scheme (TTPS)',
    tags: ['最快获批', '年薪250w+', '百强名校'],
    suitableFor: '高净值人士 / 顶尖名校毕业生',
    difficulty: '续签需要由雇主聘用',
    description: '面向高收入、高学历人士的快速通道，首次获批2年有效期，审批速度快（4-6周）。',
    requirements: [
      '年收入达 250 万港币或以上（过去一年）',
      '或拥有全球百强大学学士学位',
      '无犯罪记录',
      '可携带配偶及未成年子女',
    ],
    icon: Rocket, // 高才用火箭
  },
  {
    id: 'QMAS',
    name: '优才计划',
    nameEn: 'Quality Migrant Admission Scheme (QMAS)',
    tags: ['无需雇主', '打分制', '名额充裕'],
    suitableFor: '综合条件优秀的行业专才',
    description: '通过综合计分制或成就计分制申请，首次获批3年有效期，无需本地雇主担保。',
    requirements: [
      '年龄 18 岁以上',
      '无犯罪记录',
      '具备良好学历或专业能力',
      '通过综合计分制（225分满分，80分合格）',
      '可携带配偶及未成年子女',
    ],
    icon: Award, // 优才用奖章
  },
  {
    id: 'IANG',
    name: '留学进修',
    nameEn: 'Immigration Arrangements for Non-local Graduates (IANG)',
    tags: ['门槛较低', '全家获批', '双证加持'],
    suitableFor: '愿意花一年时间赴港读书提升自己的人群',
    description: '在港完成全日制学位课程后，可申请IANG签证留港工作，并可带配偶及子女。',
    requirements: [
      '在港完成全日制学士或以上学位',
      '毕业后6个月内提交申请',
      '可携带配偶及未成年子女',
      '首次获批1年，续签需有工作证明',
    ],
    icon: GraduationCap,
  },
  {
    id: 'GEP',
    name: '专才计划',
    nameEn: 'General Employment Policy (GEP)',
    tags: ['雇主担保', '获批率高'],
    suitableFor: '已获得香港公司 Offer 的专业人士',
    description: '需由香港雇主担保申请，获批率高，适合已有工作机会的专业人士。',
    requirements: [
      '已获得香港公司聘书',
      '具备相关学历或专业经验',
      '雇主需证明无法在本地招聘到合适人才',
      '可携带配偶及未成年子女',
    ],
    icon: Briefcase,
  },
  {
    id: 'CIES',
    name: '投资移民',
    nameEn: 'Capital Investment Entrant Scheme (CIES)',
    tags: ['新政重启', '3000万资产', '纯资金'],
    suitableFor: '超高净值家庭（资金可买基金/非住宅房产）',
    description: '需投资3000万港币于获许投资资产，投资期限7年，期满后可申请永久居民。',
    requirements: [
      '年满18岁',
      '无犯罪记录',
      '投资3000万港币（可投基金/非住宅房产/指定金融产品）',
      '投资期限7年',
      '可携带配偶及未成年子女',
    ],
    icon: Landmark,
  },
];

// 申请清单数据
const APPLICATION_CHECKLIST: Record<IdentityType, string[]> = {
  TTPS: [
    '身份证明文件（护照、身份证）',
    '学位证书及成绩单',
    '过去12个月收入证明（如适用）',
    '百强大学毕业证书（如适用）',
    '无犯罪记录证明',
    '照片（近期彩色证件照）',
  ],
  QMAS: [
    '身份证明文件',
    '学历证明文件',
    '工作经历证明',
    '语言能力证明（如适用）',
    '家庭成员证明文件',
    '资产证明文件',
    '推荐信（如适用）',
  ],
  IANG: [
    '香港高校毕业证书',
    '学位证明',
    '成绩单',
    '身份证明文件',
    '照片',
    '申请表',
  ],
  GEP: [
    '香港公司聘书',
    '雇主公司注册证明',
    '个人学历证明',
    '工作经历证明',
    '身份证明文件',
    '照片',
  ],
  CIES: [
    '身份证明文件',
    '资产证明（3000万港币）',
    '无犯罪记录证明',
    '投资计划书',
    '资金来源证明',
    '照片',
  ],
};

interface IdentityGuideProps {
  onContactAdvisor?: () => void;
}

export default function IdentityGuide({ onContactAdvisor }: IdentityGuideProps) {
  const [selectedPathway, setSelectedPathway] = useState<IdentityType | null>(null);
  const [showChecklist, setShowChecklist] = useState<IdentityType | null>(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);

  const handleContactAdvisor = () => {
    setShowEvaluationModal(true);
  };

  const handleCloseEvaluation = () => {
    setShowEvaluationModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
        {/* 标题栏 - 统一格式 */}
        <div className="p-5 pb-3">
          <div className="flex items-center mb-1">
            <CreditCard size={20} className="text-[#D31145] mr-2" />
            <h2 className="text-lg font-bold text-slate-900">香港身份全攻略</h2>
          </div>
          <p className="text-xs text-gray-500">开启全球自由行 · 教育/医疗/税务/护照 四重红利</p>
        </div>

        {/* 横向滑动卡片组 */}
        <div className="px-5 pb-5">
          <div className="flex space-x-4 overflow-x-auto pb-2 hide-scrollbar">
            {IDENTITY_PATHWAYS.map((pathway) => {
              const IconComponent = pathway.icon;
              const isSelected = selectedPathway === pathway.id;
              
              return (
                <div
                  key={pathway.id}
                  onClick={() => setSelectedPathway(isSelected ? null : pathway.id)}
                  className={`flex-shrink-0 w-72 bg-white rounded-xl border-2 p-5 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#C5A065] shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* 图标和标题 */}
                  <div className="flex items-center mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-3 ${
                      isSelected ? 'bg-[#C5A065]/20' : 'bg-gray-100'
                    }`}>
                      <IconComponent size={24} className={isSelected ? 'text-[#C5A065]' : 'text-gray-600'} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-slate-900">{pathway.name}</h3>
                      <p className="text-[10px] text-gray-500 truncate">{pathway.nameEn}</p>
                    </div>
                  </div>

                  {/* 标签 - 统一样式 */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {pathway.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 bg-red-50 text-red-700 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 描述 */}
                  <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-2">
                    {pathway.description}
                  </p>

                  {/* 适合人群 */}
                  <div className="bg-gray-50 rounded-lg p-2 mb-3">
                    <p className="text-[10px] text-gray-500 mb-1">适合人群</p>
                    <p className="text-xs text-slate-700">{pathway.suitableFor}</p>
                  </div>

                  {/* 展开详情 */}
                  {isSelected && (
                    <div className="animate-fade-in space-y-3 mt-3 pt-3 border-t border-gray-100">
                      {/* 难点提示 */}
                      {pathway.difficulty && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
                          <p className="text-[10px] font-bold text-amber-800 mb-1">⚠️ 注意事项</p>
                          <p className="text-xs text-amber-700">{pathway.difficulty}</p>
                        </div>
                      )}

                      {/* 核心要求 */}
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 mb-2">核心要求</p>
                        <div className="space-y-1.5">
                          {pathway.requirements.slice(0, 3).map((req, idx) => (
                            <div key={idx} className="flex items-start text-xs text-gray-700">
                              <CheckCircle size={12} className="text-[#D31145] mr-2 flex-shrink-0 mt-0.5" />
                              <span>{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 查看申请清单按钮 - 统一按钮样式 */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowChecklist(pathway.id);
                        }}
                        className="w-full py-2.5 bg-[#D31145] hover:bg-[#B80E3A] rounded-lg text-white text-xs font-bold active:scale-95 transition-all flex items-center justify-center"
                      >
                        <FileText size={14} className="mr-1.5" />
                        查看申请清单
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 主 CTA 按钮 - 统一按钮样式 */}
          <button
            onClick={handleContactAdvisor}
            className="w-full mt-4 py-3.5 bg-[#D31145] hover:bg-[#B80E3A] rounded-xl text-white text-sm font-bold shadow-md active:scale-95 transition-all flex items-center justify-center"
          >
            <Phone size={18} className="mr-2" />
            联系小宇做免费评估
          </button>
          <p className="text-[10px] text-gray-400 text-center mt-2">暗号：身份评估</p>
        </div>
      </div>

      {/* 申请清单 Modal */}
      {showChecklist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowChecklist(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden animate-slide-up">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-2 mb-4" />
            
            <div className="px-6 pt-2 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">
                  {IDENTITY_PATHWAYS.find(p => p.id === showChecklist)?.name} 申请清单
                </h3>
                <button
                  onClick={() => setShowChecklist(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X size={18} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
              <div className="space-y-2">
                {APPLICATION_CHECKLIST[showChecklist].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#D31145]/10 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-xs font-bold text-[#D31145]">{idx + 1}</span>
                    </div>
                    <span className="text-sm text-slate-700 flex-1">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => {
                  setShowChecklist(null);
                  handleContactAdvisor();
                }}
                className="w-full py-3 bg-[#D31145] hover:bg-[#B80E3A] rounded-lg text-white text-sm font-bold active:scale-95 transition-all"
              >
                联系小宇协助准备材料
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 免费评估 Modal */}
      {showEvaluationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseEvaluation}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-2 mb-4" />
            
            <div className="px-6 pt-2 pb-4 border-b border-gray-100 text-center">
              <div className="w-16 h-16 rounded-full bg-[#D31145]/10 flex items-center justify-center mx-auto mb-3">
                <Phone size={32} className="text-[#D31145]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">免费身份评估</h3>
              <p className="text-xs text-gray-500">联系顾问小宇获取专业建议</p>
              <p className="text-[10px] text-[#D31145] mt-1 font-medium">暗号：身份评估</p>
            </div>

            <div className="px-6 py-6 space-y-3">
              <button
                onClick={() => {
                  if (onContactAdvisor) {
                    onContactAdvisor();
                  } else {
                    alert('请联系顾问小宇进行身份评估\n微信：xiaoyu_helper\n电话：+852 1234 5678');
                  }
                  handleCloseEvaluation();
                }}
                className="w-full py-3 bg-[#D31145] hover:bg-[#B80E3A] rounded-lg text-white text-sm font-bold active:scale-95 transition-all flex items-center justify-center"
              >
                <Phone size={16} className="mr-2" />
                立即联系
              </button>
              
              <div className="text-center">
                <p className="text-xs text-gray-500">或扫描二维码添加微信</p>
                <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto mt-3 flex items-center justify-center">
                  <QrCode size={48} className="text-gray-400" />
                </div>
                <p className="text-[10px] text-gray-400 mt-2">微信：xiaoyu_helper</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
