import { useState } from 'react';
import { Check, FileText, Lock } from 'lucide-react';

interface WeChatLoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (userInfo: { nickname: string; avatar: string }) => void;
}

// 品牌定义
const APP_NAME = "智能小宇保险管家";
const WELCOME_TITLE = `欢迎使用${APP_NAME}`;
const DEVELOPER_CREDIT = "本系统由 独立代理人小宇 & AI助手 联合开发";

// 法律文本 - 用户协议 (个人工具版)
const AGREEMENT_TEXT = `【用户协议 (User Agreement)】

服务性质声明
本软件是由【独立保险代理人小宇】个人开发并运营的智能化辅助工具，旨在为用户提供金融信息分享、保险产品查询及科学化的自动配置建议。
特别声明：本软件非友邦保险（AIA）或任何保险公司的官方应用程序。所有配置逻辑、参数设置及算法模型均由开发者基于专业经验设计。

知识产权
本软件的源代码、界面设计、配置算法及"小宇"个人品牌标识，均受知识产权法保护。未经授权，禁止任何形式的复制或反向工程。

免责条款
本平台生成的建议书及分红演示仅供参考，不构成具有法律效力的保险合同。实际保费、现金价值及理赔条款，概以您最终签署的保险公司官方合同为准。`;

// 法律文本 - 隐私政策 (严格保护版)
const PRIVACY_TEXT = `【隐私政策 (Privacy Policy)】

我们收集什么
为了提供个性化的配置建议，我们可能会收集您的基础画像（如年龄、预算）及联系方式（如微信ID）。

我们承诺"三不原则"

绝不转卖：您的信息绝不会被出售给任何第三方数据公司或广告商。

绝不骚扰：我们不会利用您的信息进行高频骚扰式推销。

绝不滥用：数据仅用于生成方案、后台统计分析以及在您需要时进行服务回访。

联系与反馈
我们可能会通过您留下的联系方式，邀请您对本工具的使用体验提供反馈，以便我们不断优化算法。`;

export default function WeChatLoginModal({ isOpen, onLoginSuccess }: WeChatLoginModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showUserAgreement, setShowUserAgreement] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async () => {
    if (!agreed) {
      // 震动提示
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
      return;
    }
    
    setIsLoading(true);
    
    // 模拟登录延迟
    setTimeout(() => {
      const userInfo = {
        nickname: '微信用户',
        avatar: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0', // 微信默认灰头像
      };
      
      // 存入 localStorage
      localStorage.setItem('aia_user_info', JSON.stringify(userInfo));
      localStorage.setItem('aia_logged_in', 'true');
      
      setIsLoading(false);
      onLoginSuccess(userInfo);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* 全屏磨砂背景 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      
      {/* 内容区域 */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 animate-slide-up">
        {/* Logo 区域 */}
        <div className="pt-8 pb-6 px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-[#D31145] flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">AIA</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">{WELCOME_TITLE}</h2>
          <p className="text-sm text-gray-500">请登录以继续使用</p>
        </div>

        {/* 登录按钮区域 */}
        <div className="px-6 pb-6">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full py-4 rounded-xl text-white font-bold text-base shadow-lg active:scale-95 transition-all flex items-center justify-center ${
              agreed && !isLoading
                ? 'bg-[#07C160] hover:bg-[#06AD56]'
                : 'bg-gray-300 cursor-not-allowed'
            } ${shouldShake ? 'animate-shake' : ''}`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                <span>登录中...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="white">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.747c-3.299 0-5.741 2.444-5.741 5.74 0 3.297 2.442 5.742 5.741 5.742 1.766 0 3.363-.769 4.432-2.012a.59.59 0 0 1 .832-.047c.93.82 1.28 1.013 1.752 1.013.181 0 .327-.146.327-.327 0-.496-1.407-2.635-1.588-3.218a.582.582 0 0 1 .254-.679c1.549-1.01 2.504-2.754 2.504-4.692 0-3.296-2.442-5.741-5.741-5.741zm.196 3.524c.556 0 1.007.452 1.007 1.009a1.005 1.005 0 0 1-1.007 1.007 1.005 1.005 0 0 1-1.007-1.007c0-.557.451-1.01 1.007-1.01zm-3.828 0c.556 0 1.007.452 1.007 1.009a1.005 1.005 0 0 1-1.007 1.007 1.005 1.005 0 0 1-1.007-1.007c0-.557.451-1.01 1.007-1.01z" />
                </svg>
                <span>微信一键登录</span>
              </>
            )}
          </button>
        </div>

        {/* 协议勾选栏 */}
        <div className="px-6 pb-4">
          <div className="flex items-start">
            <button
              onClick={() => setAgreed(!agreed)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5 transition-all ${
                agreed
                  ? 'bg-[#07C160] border-[#07C160]'
                  : 'border-gray-300 bg-white'
              }`}
            >
              {agreed && <Check size={14} className="text-white" />}
            </button>
            <div className="flex-1">
              <p className="text-xs text-gray-600 leading-relaxed">
                我已阅读并同意
                <button
                  onClick={() => setShowUserAgreement(true)}
                  className="text-blue-600 hover:underline mx-1"
                >
                  用户协议
                </button>
                与
                <button
                  onClick={() => setShowPrivacyPolicy(true)}
                  className="text-blue-600 hover:underline mx-1"
                >
                  隐私政策
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* 开发者声明 */}
        <div className="px-6 pb-6">
          <p className="text-[10px] text-gray-300 text-center">{DEVELOPER_CREDIT}</p>
        </div>

        {/* 用户协议 Modal */}
        {showUserAgreement && (
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowUserAgreement(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden animate-slide-up">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 flex items-center">
                  <FileText size={20} className="mr-2 text-[#D31145]" />
                  用户协议
                </h3>
                <button
                  onClick={() => setShowUserAgreement(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                >
                  <span className="text-gray-600 text-xl">×</span>
                </button>
              </div>
              <div className="px-6 py-4 overflow-y-auto max-h-[60vh] text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {AGREEMENT_TEXT}
              </div>
            </div>
          </div>
        )}

        {/* 隐私政策 Modal */}
        {showPrivacyPolicy && (
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPrivacyPolicy(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden animate-slide-up">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 flex items-center">
                  <Lock size={20} className="mr-2 text-[#D31145]" />
                  隐私政策
                </h3>
                <button
                  onClick={() => setShowPrivacyPolicy(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                >
                  <span className="text-gray-600 text-xl">×</span>
                </button>
              </div>
              <div className="px-6 py-4 overflow-y-auto max-h-[60vh] text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {PRIVACY_TEXT}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
