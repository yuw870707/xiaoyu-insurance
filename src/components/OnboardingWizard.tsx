import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

type Identity = 'SINGLE' | 'COUPLE' | 'FAMILY' | 'RETIREMENT';
type Goal = 'WEALTH' | 'HEALTH' | 'EDUCATION';
type Knowledge = 'NEWBIE' | 'EXPERT';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: {
    identity: Identity;
    goal: Goal;
    knowledge: Knowledge;
  }) => void;
}

const STEPS = [
  { id: 1, title: '身份', subtitle: '告诉我您的生活状态' },
  { id: 2, title: '目标', subtitle: '您最关心什么？' },
  { id: 3, title: '认知', subtitle: '您对港险了解多少？' },
];

export default function OnboardingWizard({ isOpen, onClose, onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIdentity, setSelectedIdentity] = useState<Identity | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedKnowledge, setSelectedKnowledge] = useState<Knowledge | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // 重置状态
      setCurrentStep(1);
      setSelectedIdentity(null);
      setSelectedGoal(null);
      setSelectedKnowledge(null);
      setShowCelebration(false);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    if (selectedIdentity && selectedGoal && selectedKnowledge) {
      setShowCelebration(true);
      setTimeout(() => {
        onComplete({
          identity: selectedIdentity,
          goal: selectedGoal,
          knowledge: selectedKnowledge,
        });
        setTimeout(() => {
          onClose();
        }, 500);
      }, 1500);
    }
  };

  if (!isOpen) return null;

  const progress = (currentStep / 3) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 半透明磨砂背景 - Keep/多邻国风格 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D31145]/10 via-white to-[#C5A065]/10 backdrop-blur-md" />
      
      {/* 主容器 */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden animate-fade-in">
        {/* 进度条 */}
        <div className="h-1.5 bg-gray-100">
          <div 
            className="h-full bg-gradient-to-r from-[#D31145] to-[#C5A065] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 内容区域 */}
        <div className="p-6 pb-8 overflow-y-auto max-h-[calc(90vh-60px)]">
          {/* 步骤标题 */}
          <div className="text-center mb-8">
            <div className="text-sm text-gray-400 mb-2 font-medium">
              步骤 {currentStep} / 3
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {STEPS[currentStep - 1].title}
            </h2>
            <p className="text-base text-gray-500">
              {STEPS[currentStep - 1].subtitle}
            </p>
          </div>

          {/* Step 1: 身份 */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              {[
                { id: 'SINGLE' as Identity, emoji: '🎯', title: '单身', desc: '一人吃饱全家不饿', color: 'from-blue-50 to-blue-100' },
                { id: 'COUPLE' as Identity, emoji: '💑', title: '二人世界', desc: '筑巢引凤，责任共担', color: 'from-pink-50 to-pink-100' },
                { id: 'FAMILY' as Identity, emoji: '👨‍👩‍👧', title: '核心家庭', desc: '上有老下有小', color: 'from-green-50 to-green-100' },
                { id: 'RETIREMENT' as Identity, emoji: '👴', title: '退休', desc: '乐享晚年时光', color: 'from-amber-50 to-amber-100' },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedIdentity(option.id);
                    setTimeout(() => handleNext(), 400);
                  }}
                  className={`w-full p-5 rounded-2xl border-2 transition-all text-left transform ${
                    selectedIdentity === option.id
                      ? 'border-[#D31145] bg-gradient-to-r shadow-lg scale-[1.02]'
                      : `border-gray-200 hover:border-gray-300 bg-gradient-to-r ${option.color} hover:shadow-md`
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{option.emoji}</div>
                    <div className="flex-1">
                      <div className="font-bold text-lg text-slate-900">{option.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                    </div>
                    {selectedIdentity === option.id && (
                      <ArrowRight size={20} className="text-[#D31145]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: 目标 */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              {[
                { id: 'WEALTH' as Goal, emoji: '💰', title: '财富增值', desc: '让钱生钱，稳健增值', color: 'from-yellow-50 to-yellow-100' },
                { id: 'HEALTH' as Goal, emoji: '🛡️', title: '健康保障', desc: '全方位医疗保障', color: 'from-blue-50 to-blue-100' },
                { id: 'EDUCATION' as Goal, emoji: '🎓', title: '教育规划', desc: '为孩子未来铺路', color: 'from-purple-50 to-purple-100' },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedGoal(option.id)}
                  className={`w-full p-5 rounded-2xl border-2 transition-all text-left transform ${
                    selectedGoal === option.id
                      ? 'border-[#D31145] bg-gradient-to-r shadow-lg scale-[1.02]'
                      : `border-gray-200 hover:border-gray-300 bg-gradient-to-r ${option.color} hover:shadow-md`
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{option.emoji}</div>
                    <div className="flex-1">
                      <div className="font-bold text-lg text-slate-900">{option.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                    </div>
                    {selectedGoal === option.id && (
                      <div className="w-6 h-6 rounded-full bg-[#D31145] flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
              <button
                onClick={handleNext}
                disabled={!selectedGoal}
                className={`w-full mt-6 py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                  selectedGoal
                    ? 'bg-[#D31145] hover:bg-[#B80E3A] active:scale-95'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                继续
              </button>
            </div>
          )}

          {/* Step 3: 认知 */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              {[
                { id: 'NEWBIE' as Knowledge, emoji: '🌱', title: '保险小白', desc: '刚开始了解保险', color: 'from-green-50 to-green-100' },
                { id: 'EXPERT' as Knowledge, emoji: '🎯', title: '保险专家', desc: '非常熟悉港险产品', color: 'from-blue-50 to-blue-100' },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedKnowledge(option.id)}
                  className={`w-full p-5 rounded-2xl border-2 transition-all text-left transform ${
                    selectedKnowledge === option.id
                      ? 'border-[#D31145] bg-gradient-to-r shadow-lg scale-[1.02]'
                      : `border-gray-200 hover:border-gray-300 bg-gradient-to-r ${option.color} hover:shadow-md`
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{option.emoji}</div>
                    <div className="flex-1">
                      <div className="font-bold text-lg text-slate-900">{option.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                    </div>
                    {selectedKnowledge === option.id && (
                      <div className="w-6 h-6 rounded-full bg-[#D31145] flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
              <button
                onClick={handleComplete}
                disabled={!selectedKnowledge}
                className={`w-full mt-6 py-4 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center ${
                  selectedKnowledge
                    ? 'bg-[#D31145] hover:bg-[#B80E3A] active:scale-95'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {showCelebration ? (
                  <>
                    <Sparkles size={18} className="mr-2 animate-pulse" />
                    生成您的专属报告
                  </>
                ) : (
                  '完成'
                )}
              </button>
            </div>
          )}
        </div>

        {/* 庆祝特效 */}
        {showCelebration && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm z-20 animate-fade-in">
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">完成！</h3>
              <p className="text-gray-600">正在为您生成专属报告...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
