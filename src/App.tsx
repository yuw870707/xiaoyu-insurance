import React, { useState, useMemo, useEffect } from 'react';
import { 
  Globe, Lock, Users, TrendingUp, Shield, Settings, 
  ChevronRight, Calculator, AlertCircle, CheckCircle, 
  Gift, AlertTriangle, Menu, UserCircle, RefreshCw,
  GraduationCap, Palmtree, Coins, Landmark, ChevronDown, ChevronUp,
  Leaf, Zap, HeartHandshake, Shuffle, Umbrella, Ticket, PiggyBank, Heart, Thermometer,
  LayoutDashboard, FileText, Phone, ArrowRight, PieChart, Activity, Crosshair, Star, CheckSquare,
  Plus, Sparkles
} from 'lucide-react';
import GlobalPowerPage from './pages/GlobalPowerPage';
import PolicyManager from './pages/PolicyManager';
import OnboardingWizard from './components/OnboardingWizard';
import ClaimsModal from './components/ClaimsModal';
import BookingModal from './components/BookingModal';
import ExchangeRateWidget from './components/ExchangeRateWidget';
import MedicalGuide from './components/MedicalGuide';
import DailyQuoteCard from './components/DailyQuoteCard';
import EducationGuide from './components/EducationGuide';
import BankingGuide from './components/BankingGuide';
import IdentityGuide from './components/IdentityGuide';
import WeChatLoginModal from './components/WeChatLoginModal';

// ============================================================================
// 1. 数据库 / 配置中心 (Database & Config)
//    V6.3 迭代：重疾险矩阵扩容 & 家庭结构联动配置 & DIY 逻辑
// ============================================================================

// 定义产品数据结构
interface ProductConfig {
  id: string;
  name: string;
  slogan: string;
  themeColor: string; 
  subColor: string;   
  features: { icon: React.ElementType, label: string }[];
  currencies: typeof DB_COMMON.currencies;
  exchangeRates: Record<string, number>;
  limits: Record<string, Record<string, number>>;
  termLabels: Record<string, string>;
  scenarios: any[];
}

interface HealthProductConfig {
  id: string;
  name: string;
  slogan: string;
  themeColor: string;
  subColor: string;
  features: { icon: React.ElementType, label: string }[];
  tags: string[]; // 新增标签
  pricing: {
    baseRate: number;
    ageFactor: number;
    smokerMultiplier: number;
    genderAdjustment: { male: number; female: number };
    addons?: { id: string; label: string; rate: number }[]; // 新增 DIY 附加包
  };
}

// 通用配置
const DB_COMMON = {
  currencies: [
    { code: 'CNY', symbol: '¥', label: '人民币 (CNY)' },
    { code: 'GBP', symbol: '£', label: '英镑 (GBP)' },
    { code: 'USD', symbol: '$', label: '美元 (USD)' },
    { code: 'AUD', symbol: 'A$', label: '澳元 (AUD)' },
    { code: 'CAD', symbol: 'C$', label: '加元 (CAD)' },
    { code: 'HKD', symbol: 'HK$', label: '港币 (HKD)' },
    { code: 'MOP', symbol: 'MOP$', label: '澳门币 (MOP)' },
    { code: 'EUR', symbol: '€', label: '欧元 (EUR)' },
    { code: 'SGD', symbol: 'S$', label: '新币 (SGD)' },
  ],
  exchangeRates: {
    'USD': 1.0, 'CNY': 7.0, 'HKD': 7.8, 'MOP': 7.8, 
    'GBP': 0.8, 'EUR': 0.9, 'SGD': 1.35, 'AUD': 1.5, 'CAD': 1.35
  } as Record<string, number>,
};

const DB = {
  products: {
    // 1. GP3
    'GP3': {
      id: 'GP3',
      name: '盈御多元货币计划 3',
      slogan: '多元货币 · 基业长青',
      themeColor: '#D31145', 
      subColor: '#C5A065',   
      features: [
        { icon: Globe, label: '多元货币' },
        { icon: Lock, label: '红利锁定' },
        { icon: TrendingUp, label: '保单分拆' },
        { icon: Users, label: '无限传承' },
      ],
      currencies: DB_COMMON.currencies,
      exchangeRates: DB_COMMON.exchangeRates,
      limits: {
        'CNY': { 'SINGLE': 45000, '3_YEAR': 12000, '5_YEAR': 12000, '10_YEAR': 8400 },
        'GBP': { 'SINGLE': 4500,  '3_YEAR': 1200,  '5_YEAR': 1200,  '10_YEAR': 840 },
        'USD': { 'SINGLE': 7500,  '3_YEAR': 2000,  '5_YEAR': 2000,  '10_YEAR': 1400 },
        'AUD': { 'SINGLE': 7500,  '3_YEAR': 2000,  '5_YEAR': 2000,  '10_YEAR': 1400 },
        'CAD': { 'SINGLE': 7500,  '3_YEAR': 2000,  '5_YEAR': 2000,  '10_YEAR': 1400 },
        'HKD': { 'SINGLE': 56250, '3_YEAR': 15000, '5_YEAR': 15000, '10_YEAR': 10500 },
        'MOP': { 'SINGLE': 56250, '3_YEAR': 15000, '5_YEAR': 15000, '10_YEAR': 10500 },
        'EUR': { 'SINGLE': 5250,  '3_YEAR': 1400,  '5_YEAR': 1400,  '10_YEAR': 980 },
        'SGD': { 'SINGLE': 9000,  '3_YEAR': 2400,  '5_YEAR': 2400,  '10_YEAR': 1680 }
      },
      termLabels: {
        'SINGLE': '一次性', '3_YEAR': '3年 (限额)', '5_YEAR': '5年', '10_YEAR': '10年'
      },
      scenarios: [
        { id: 'edu', name: '状元及第 · 教育金', icon: <GraduationCap size={24} />, desc: '18-21岁提取大学学费，30岁取婚嫁金', highlight: '适合 0-5岁 宝宝' },
        { id: 'retire', name: '自在人生 · 退休通', icon: <Palmtree size={24} />, desc: '60-85岁每年领取稳定被动收入', highlight: '适合 35-45岁 中产' },
        { id: 'flexi', name: '灵活钱袋 · 10/20/30', icon: <Coins size={24} />, desc: '第10/20/30年回本倍数演示', highlight: '适合 创业者/单身贵族' },
        { id: 'legacy', name: '富过三代 · 永续号', icon: <Landmark size={24} />, desc: '长期复利滚存，无限次更换受保人', highlight: '适合 高净值/传承' }
      ]
    },

    // 2. GF
    'GF': {
      id: 'GF',
      name: '环宇盈活储蓄计划',
      slogan: '弹性理财 · 宠您所爱',
      themeColor: '#C5A065', 
      subColor: '#855E00',   
      features: [
        { icon: Shuffle, label: '灵活提取' },
        { icon: Leaf, label: '较短回本' },
        { icon: HeartHandshake, label: '额外关怀' },
        { icon: Globe, label: '货币转换' },
      ],
      currencies: DB_COMMON.currencies,
      exchangeRates: DB_COMMON.exchangeRates,
      limits: {
        'CNY': { 'SINGLE': 35000, '5_YEAR': 7000 },
        'GBP': { 'SINGLE': 3000,  '5_YEAR': 600 },
        'USD': { 'SINGLE': 5000,  '5_YEAR': 1000 },
        'AUD': { 'SINGLE': 5000,  '5_YEAR': 1000 },
        'CAD': { 'SINGLE': 5000,  '5_YEAR': 1000 },
        'HKD': { 'SINGLE': 37500, '5_YEAR': 7500 },
        'MOP': { 'SINGLE': 37500, '5_YEAR': 7500 },
        'EUR': { 'SINGLE': 3500,  '5_YEAR': 700 },
        'SGD': { 'SINGLE': 6000,  '5_YEAR': 1200 }
      },
      termLabels: {
        'SINGLE': '一次性', '5_YEAR': '5年'
      },
      scenarios: [
        { id: 'flexi_cash', name: '灵活周转 · 现金流', icon: <Coins size={24} />, desc: '第10/20年回本演示，随时可动用', highlight: '适合 创业者/资金周转' },
        { id: 'retire_early', name: '提早退休 · 享乐派', icon: <Palmtree size={24} />, desc: '55岁起每年提取旅游基金', highlight: '适合 单身贵族/丁克' },
        { id: 'edu_quick', name: '快闪教育金', icon: <GraduationCap size={24} />, desc: '短期供款，15年后供子女读研', highlight: '适合 大龄子女家庭' },
        { id: 'legacy_gf', name: '财富传承 · 恒久留存', icon: <Landmark size={24} />, desc: '稳健增值，守护挚爱与资产', highlight: '适合 资产配置/传承' }
      ]
    },

    // 3. FLCP5
    'FLCP5': {
      id: 'FLCP5',
      name: '爱无忧长享计划 5',
      slogan: '以爱规划 · 拥抱未来',
      themeColor: '#EC407A', 
      subColor: '#880E4F',   
      features: [
        { icon: Ticket, label: '保证派息' },
        { icon: Umbrella, label: '家庭保障' },
        { icon: PiggyBank, label: '每年领钱' },
        { icon: Heart, label: '父母豁免' },
      ],
      currencies: DB_COMMON.currencies.filter(c => ['USD', 'HKD', 'MOP'].includes(c.code)),
      exchangeRates: DB_COMMON.exchangeRates,
      limits: {
        'CNY': { '6_YEAR': 6000, '10_YEAR': 3500, '15_YEAR': 2500, '20_YEAR': 2000 },
        'GBP': { '6_YEAR': 600,  '10_YEAR': 350,  '15_YEAR': 250,  '20_YEAR': 200 },
        'USD': { '6_YEAR': 1000, '10_YEAR': 600,  '15_YEAR': 400,  '20_YEAR': 300 }, 
        'HKD': { '6_YEAR': 7500, '10_YEAR': 4500, '15_YEAR': 3000, '20_YEAR': 2250 },
        'AUD': { '6_YEAR': 1000, '10_YEAR': 600, '15_YEAR': 400, '20_YEAR': 300 },
        'CAD': { '6_YEAR': 1000, '10_YEAR': 600, '15_YEAR': 400, '20_YEAR': 300 },
        'MOP': { '6_YEAR': 7500, '10_YEAR': 4500, '15_YEAR': 3000, '20_YEAR': 2250 },
        'EUR': { '6_YEAR': 800,  '10_YEAR': 500,  '15_YEAR': 350,  '20_YEAR': 250 },
        'SGD': { '6_YEAR': 1200, '10_YEAR': 800,  '15_YEAR': 500,  '20_YEAR': 400 },
      },
      termLabels: {
        '6_YEAR': '6年 (快)', '10_YEAR': '10年', '15_YEAR': '15年', '20_YEAR': '20年 (长)'
      },
      scenarios: [
        { id: 'edu_coupon', name: '无忧教育 · 必胜券', icon: <GraduationCap size={24} />, desc: '第5年起每年领钱，雷打不动', highlight: '适合 0岁宝宝/教育金' },
        { id: 'family_safe', name: '家庭支柱 · 安全网', icon: <Umbrella size={24} />, desc: '父母豁免保障，守护孩子未来', highlight: '适合 家庭支柱' },
        { id: 'retire_coupon', name: '乐享退休 · 加薪水', icon: <Ticket size={24} />, desc: '退休后每年派发固定年金', highlight: '适合 养老补充' },
        { id: 'love_gift', name: '爱的礼物 · 传家宝', icon: <Gift size={24} />, desc: '一份确定的现金流礼物', highlight: '适合 祖辈赠礼' }
      ]
    }
  } as Record<string, ProductConfig>,
  
  // *** V6.2 迭代：重疾险矩阵扩容 (Health Products) ***
  healthProducts: {
    // 1. 爱伴航 2 (OYS2) - 旗舰
    'OYS2': {
      id: 'OYS2',
      name: '爱伴航 2 (OYS2)',
      slogan: '全方位守护 · ICU 留院也赔',
      themeColor: '#0097A7', // 医疗蓝
      subColor: '#006064',
      features: [
        { icon: Shield, label: '900% 多重赔付' },
        { icon: Zap, label: 'ICU 留院保障' },
        { icon: HeartHandshake, label: '脑退化支援' },
        { icon: Users, label: '家庭共享保额' }
      ],
      tags: ['旗舰', '家庭支柱'],
      pricing: { baseRate: 25, ageFactor: 1.04, smokerMultiplier: 1.5, genderAdjustment: { male: 1.0, female: 0.9 } }
    },
    // 2. 简致·爱伴航 (EOYS) - 新增
    'EOYS': {
      id: 'EOYS',
      name: '简致·爱伴航 (EOYS)',
      slogan: '重点守护 · 性价比首选',
      themeColor: '#00BCD4', // 浅蓝
      subColor: '#00838F',
      features: [
        { icon: Shield, label: '58种危疾' },
        { icon: Star, label: '重点癌/心/脑' },
        { icon: Activity, label: '保费实惠' },
        { icon: RefreshCw, label: '市场首创' }
      ],
      tags: ['高性价比', '单身首选'],
      pricing: { baseRate: 18, ageFactor: 1.04, smokerMultiplier: 1.5, genderAdjustment: { male: 1.0, female: 0.9 } }
    },
    // 3. 多重智倍保 (SEU)
    'SEU': {
      id: 'SEU',
      name: '多重智倍保 (SEU)',
      slogan: '良性病变亦受保 · 守护女性儿童',
      themeColor: '#8E24AA', // 紫色
      subColor: '#4A148C',
      features: [
        { icon: CheckCircle, label: '良性病变赔付' },
        { icon: Shield, label: '先天性疾病' },
        { icon: RefreshCw, label: '癌症多次赔' },
        { icon: Heart, label: '原位癌豁免' }
      ],
      tags: ['儿童首选', '女性关怀'],
      pricing: { baseRate: 22, ageFactor: 1.035, smokerMultiplier: 1.4, genderAdjustment: { male: 0.9, female: 1.1 } }
    },
    // 4. 自在自选 (ASSEMBLE) - 新增 (带 DIY 逻辑)
    'ASSEMBLE': {
      id: 'ASSEMBLE',
      name: '自在自选 (Assemble)',
      slogan: '灵活DIY · 打破捆绑',
      themeColor: '#FF7043', // 活力橙
      subColor: '#D84315',
      features: [
        { icon: CheckSquare, label: '自选保障' },
        { icon: Shuffle, label: '灵活搭配' },
        { icon: Zap, label: '针对性强' },
        { icon: Coins, label: '预算自主' }
      ],
      tags: ['灵活DIY', '极客'],
      pricing: { 
        baseRate: 15, ageFactor: 1.03, smokerMultiplier: 1.6, genderAdjustment: { male: 1.0, female: 1.0 },
        // DIY 附加包配置
        addons: [
          { id: 'heart', label: '心脏及血管保障', rate: 0.15 },
          { id: 'neuro', label: '神经系统保障', rate: 0.10 },
          { id: 'other', label: '其它危疾保障', rate: 0.05 },
          { id: 'waiver', label: '豁免保障', rate: 0.02 }
        ]
      }
    },
    // 5. 进添计划 (CANCER_PRO)
    'CANCER_PRO': {
      id: 'CANCER_PRO',
      name: '进添计划 (Cancer Pro)',
      slogan: '专注癌症 · 极低保费撬动高杠杆',
      themeColor: '#E53935', // 警示红
      subColor: '#B71C1C',
      features: [
        { icon: Crosshair, label: '癌症专用' },
        { icon: TrendingUp, label: '超低保费' },
        { icon: Shield, label: '原有保单外挂' },
        { icon: RefreshCw, label: '持续癌症津贴' }
      ],
      tags: ['癌症专用', '高杠杆'],
      pricing: { baseRate: 8, ageFactor: 1.05, smokerMultiplier: 2.0, genderAdjustment: { male: 1.2, female: 1.0 } }
    }
  } as Record<string, HealthProductConfig>,

  // B端配置
  campaignConfig: {
    promoEndDate: '2026-01-31',
    prepayRates: { term1yr: 4.3, term4yr: { tier1: 3.8, tier2: 4.0, threshold: 200000 } },
    rebateTiers: [ { min: 5000, max: 19999, rate: 10 }, { min: 200000, max: 9999999, rate: 18 } ],
    comboBonus: 3, 
    hnwThresholds: { standard: 100000, deluxe: 350000 }
  }
};

// ============================================================================
// 2. 核心算法引擎
// ============================================================================
const getYearsFromTerm = (term: string) => {
  if (term === 'SINGLE') return 1;
  const match = term.match(/^(\d+)_YEAR/);
  return match ? parseInt(match[1]) : 1;
};

// 预缴利息计算
const calculatePrepayInterest = (premium: number, term: string, config: any) => {
  if (term !== '5_YEAR') return { interest: 0, rate: 0 };
  const today = '2026-01-15'; 
  if (today > config.promoEndDate) return { interest: 0, rate: 0 };
  let rate = 4.3; 
  return { interest: Math.floor(premium * (rate / 100)), rate };
};

const calculateScenarioProjection = (scenarioId: string, premium: number, term: string, productId: string) => {
  const years = getYearsFromTerm(term);
  const totalPrincipal = premium * years;
  
  if (productId === 'FLCP5') {
    const annualCoupon = Math.round(totalPrincipal * 0.03); 
    return { type: 'stream', monthly: Math.round(annualCoupon / 12), annual: annualCoupon, period: '第5年 起 - 终身' };
  }

  let multiplier = 1.0;
  if (productId === 'GP3') multiplier = 1.2; 
  if (productId === 'GF') multiplier = 1.1;

  if (scenarioId.includes('edu') || scenarioId.includes('edu_quick')) {
    return {
      type: 'timeline',
      events: [
        { label: '大学期 (4年)', value: Math.round(totalPrincipal * 0.15), sub: '/年' },
        { label: '毕业基金', value: Math.round(totalPrincipal * 0.6 * multiplier), sub: '一次性' },
        { label: '总提取额', value: Math.round(totalPrincipal * (0.15*4 + 0.6*multiplier)), sub: `约本金 ${(0.6 + 0.6 * multiplier).toFixed(1)} 倍` }
      ]
    };
  }
  
  if (scenarioId.includes('retire')) {
    return {
      type: 'stream',
      monthly: Math.round((totalPrincipal * 0.05 * multiplier) / 12),
      annual: Math.round(totalPrincipal * 0.05 * multiplier),
      period: productId === 'GF' ? '55岁 - 80岁' : '60岁 - 85岁'
    };
  }

  if (scenarioId.includes('legacy') || scenarioId.includes('flexi') || scenarioId.includes('flexi_cash') || scenarioId === 'legacy_gf') {
    return {
      type: 'curve',
      data: [
        { year: '10', label: '回本期', val: Math.round(totalPrincipal * (productId==='GF'?1.02:0.95)) }, 
        { year: '20', label: '增值期', val: Math.round(totalPrincipal * 2.2 * multiplier) },
        { year: '30', label: '财富期', val: Math.round(totalPrincipal * 3.5 * multiplier) }
      ]
    };
  }
  return null;
};

// ============================================================================
// 3. UI 组件层
// ============================================================================

type PageView = 'HOME' | 'WEALTH_LIST' | 'GLOBAL_POWER' | 'POLICY_MANAGER';

export default function App() {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'CALCULATOR' | 'SERVICE'>('DASHBOARD');
  const [pageView, setPageView] = useState<PageView>('HOME'); // 页面视图状态
  const [viewMode, setViewMode] = useState<'CLIENT' | 'ADMIN'>('CLIENT');
  
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<'GP3' | 'GF' | 'FLCP5'>('GP3');
  const product = DB.products[currentProductId]; 
  
  // 登录和用户状态
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<{ nickname: string; avatar: string } | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // 家庭结构 (Dashboard用)
  const [familyType, setFamilyType] = useState<'SINGLE' | 'COUPLE' | 'FAMILY' | 'RETIREMENT'>('FAMILY');
  
  // 引导问卷状态
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // 服务弹窗状态
  const [showClaimsModal, setShowClaimsModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // 检查登录状态和引导问卷
  useEffect(() => {
    const loggedIn = localStorage.getItem('aia_logged_in') === 'true';
    const userInfoStr = localStorage.getItem('aia_user_info');
    const hasCompletedOnboarding = localStorage.getItem('aia_onboarding_completed');
    
    if (loggedIn && userInfoStr) {
      setIsLoggedIn(true);
      setUserInfo(JSON.parse(userInfoStr));
      
      // 如果未完成引导问卷，显示引导问卷
      if (!hasCompletedOnboarding) {
        setTimeout(() => {
          setShowOnboarding(true);
        }, 500);
      }
    } else {
      // 未登录，显示登录弹窗
      setShowLoginModal(true);
    }
  }, []);
  
  // 处理登录成功
  const handleLoginSuccess = (userInfo: { nickname: string; avatar: string }) => {
    setIsLoggedIn(true);
    setUserInfo(userInfo);
    setShowLoginModal(false);
    
    // 检查是否需要显示引导问卷
    const hasCompletedOnboarding = localStorage.getItem('aia_onboarding_completed');
    if (!hasCompletedOnboarding) {
      setTimeout(() => {
        setShowOnboarding(true);
      }, 500);
    }
  };
  
  // 处理引导问卷完成
  const handleOnboardingComplete = (data: {
    identity: 'SINGLE' | 'COUPLE' | 'FAMILY' | 'RETIREMENT';
    goal: 'WEALTH' | 'HEALTH' | 'EDUCATION';
    knowledge: 'NEWBIE' | 'EXPERT';
  }) => {
    // 更新家庭结构
    setFamilyType(data.identity);
    
    // 标记引导问卷已完成
    localStorage.setItem('aia_onboarding_completed', 'true');
    localStorage.setItem('aia_onboarding_data', JSON.stringify(data));
    
    setShowOnboarding(false);
  };
  
  // 定制页状态 (储蓄险)
  const [clientCurrency, setClientCurrency] = useState('USD'); 
  const [clientTerm, setClientTerm] = useState<string>('5_YEAR'); 
  const [clientPremium, setClientPremium] = useState<number>(5000); 
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  // === 重疾险状态 ===
  const [productCategory, setProductCategory] = useState<'WEALTH' | 'HEALTH'>('WEALTH');
  const [currentHealthId, setCurrentHealthId] = useState<'OYS2' | 'EOYS' | 'SEU' | 'ASSEMBLE' | 'CANCER_PRO'>('OYS2');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [isSmoker, setIsSmoker] = useState<boolean>(false);
  const [sumAssured, setSumAssured] = useState<number>(100000); 
  
  // DIY Addons State (Assemble)
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // *** V6.3 核心：家庭结构配置表 (Family Scenarios) ***
  const FAMILY_SCENARIOS = {
    'SINGLE': {
      label: '单身贵族',
      desc: '一人吃饱全家不饿，重点关注收入保障',
      dashboardData: [
        { label: '收入保障', val: 80, color: '#E53935', linkId: 'EOYS', linkType: 'HEALTH' }, 
        { label: '医疗尊严', val: 60, color: '#FDD835', linkId: 'ASSEMBLE', linkType: 'HEALTH' }, 
        { label: '退休/储蓄', val: 40, color: '#43A047', linkId: 'GF', linkType: 'WEALTH' },
        { label: '梦想基金', val: 30, color: '#FF9800', linkId: 'GP3', linkType: 'WEALTH' },
        { label: '父母赡养', val: 50, color: '#9C27B0', linkId: 'OYS2', linkType: 'HEALTH' }
      ],
      recommendations: [
        { id: 'ASSEMBLE', type: 'HEALTH', desc: '自在自选 · 灵活DIY' },
        { id: 'EOYS', type: 'HEALTH', desc: '简致爱伴航 · 性价比' },
        { id: 'GF', type: 'WEALTH', desc: '环宇盈活 · 灵活小金库' }
      ]
    },
    'COUPLE': {
      label: '二人世界',
      desc: '筑巢引凤，责任共担，关注家庭支柱',
      dashboardData: [
        { label: '家庭责任', val: 70, color: '#E53935', linkId: 'OYS2', linkType: 'HEALTH' },
        { label: '房贷对冲', val: 40, color: '#FF5722', linkId: 'OYS2', linkType: 'HEALTH' },
        { label: '婚姻资产', val: 50, color: '#9C27B0', linkId: 'GP3', linkType: 'WEALTH' },
        { label: '子女筹备', val: 60, color: '#FDD835', linkId: 'FLCP5', linkType: 'WEALTH' },
        { label: '养老现金流', val: 40, color: '#43A047', linkId: 'GP3', linkType: 'WEALTH' }
      ],
      recommendations: [
        { id: 'OYS2', type: 'HEALTH', desc: '爱伴航2 · 旗舰全保' },
        { id: 'CANCER_PRO', type: 'HEALTH', desc: '进添计划 · 癌症防卫' },
        { id: 'GP3', type: 'WEALTH', desc: '盈御3 · 长线增值' }
      ]
    },
    'FAMILY': {
      label: '核心家庭',
      desc: '上有老下有小，全方位无死角防护',
      dashboardData: [
        { label: '子女教育', val: 70, color: '#E53935', linkId: 'FLCP5', linkType: 'WEALTH' }, 
        { label: '全球配置', val: 20, color: '#FF9800', linkId: 'GP3', linkType: 'WEALTH' },
        { label: '家庭支柱', val: 50, color: '#9C27B0', linkId: 'OYS2', linkType: 'HEALTH' },
        { label: '医疗资源', val: 80, color: '#FDD835', linkId: 'SEU', linkType: 'HEALTH' },
        { label: '养老储备', val: 40, color: '#43A047', linkId: 'GP3', linkType: 'WEALTH' }
      ],
      recommendations: [
        { id: 'FLCP5', type: 'WEALTH', desc: '爱无忧 · 必胜教育金' },
        { id: 'SEU', type: 'HEALTH', desc: '智倍保 · 儿童重疾首选' },
        { id: 'OYS2', type: 'HEALTH', desc: '爱伴航2 · 父母支柱' }
      ]
    },
    'RETIREMENT': {
      label: '退休银发族',
      desc: '乐享晚年，守护健康与财富传承',
      dashboardData: [
        { label: '高端医疗', val: 60, color: '#E53935', linkId: 'OYS2', linkType: 'HEALTH' },
        { label: '尊严护工', val: 30, color: '#FF9800', linkId: 'OYS2', linkType: 'HEALTH' },
        { label: '生前控权', val: 40, color: '#9C27B0', linkId: 'GP3', linkType: 'WEALTH' },
        { label: '财富传承', val: 70, color: '#C5A065', linkId: 'GP3', linkType: 'WEALTH' },
        { label: '流动资金', val: 50, color: '#43A047', linkId: 'GP3', linkType: 'WEALTH' }
      ],
      recommendations: [
        { id: 'GP3', type: 'WEALTH', desc: '盈御3 · 终身现金流' },
        { id: 'OYS2', type: 'HEALTH', desc: '爱伴航2 · 全方位医疗' },
        { id: 'FLCP5', type: 'WEALTH', desc: '爱无忧 · 稳定派息' }
      ]
    }
  };

  const currentFamilyConfig = FAMILY_SCENARIOS[familyType];

  // 路由跳转辅助 (支持跨赛道跳转)
  const navigateToProduct = (pid: string, type: 'WEALTH' | 'HEALTH') => {
    setProductCategory(type);
    if (type === 'WEALTH') setCurrentProductId(pid as any);
    else {
        setCurrentHealthId(pid as any);
        // 如果跳到 Assemble，重置 addons
        if (pid === 'ASSEMBLE') setSelectedAddons([]);
    }
    setActiveTab('CALCULATOR');
  };

  const switchProduct = (pid: 'GP3' | 'GF' | 'FLCP5') => {
    setCurrentProductId(pid);
    setSelectedScenario(null);
    const newProduct = DB.products[pid];
    const defaultTerm = Object.keys(newProduct.limits['USD'])[0]; 
    if (!newProduct.limits['USD'][clientTerm]) {
        setClientTerm(defaultTerm);
    }
    setIsProductMenuOpen(false);
  };

  const safeTerm = product.limits[clientCurrency]?.[clientTerm] ? clientTerm : Object.keys(product.limits[clientCurrency] || {})[0];
  const currentLimit = product.limits[clientCurrency]?.[safeTerm] || 0;
  
  const totalPremiumUSD = clientPremium * getYearsFromTerm(safeTerm) * (DB_COMMON.exchangeRates[clientCurrency] === 1.0 ? 1 : (1/DB_COMMON.exchangeRates[clientCurrency] || 1));
  const isTooHigh = totalPremiumUSD >= 5000000;

  // 预缴优惠计算
  const prepayInfo = useMemo(() => {
    return calculatePrepayInterest(clientPremium, safeTerm, DB.campaignConfig);
  }, [clientPremium, safeTerm]);

  useEffect(() => {
    if (clientPremium < currentLimit) setClientPremium(currentLimit);
  }, [currentLimit, clientCurrency, clientTerm]);

  const currentSymbol = product.currencies.find(c => c.code === clientCurrency)?.symbol || '$';
  
  const scenarioData = useMemo(() => {
    if (!selectedScenario || clientPremium < currentLimit) return null;
    return calculateScenarioProjection(selectedScenario, clientPremium, safeTerm, currentProductId);
  }, [selectedScenario, clientPremium, safeTerm, currentLimit, currentProductId]);

  // 重疾险保费计算逻辑 (含 DIY 逻辑)
  const healthPremium = useMemo(() => {
    const pConfig = DB.healthProducts[currentHealthId];
    if (!pConfig) return 0;
    const baseBlock = sumAssured / 1000;
    const ageImpact = Math.pow(pConfig.pricing.ageFactor, Math.max(0, age - 18));
    const smokerImpact = isSmoker ? pConfig.pricing.smokerMultiplier : 1;
    const genderImpact = pConfig.pricing.genderAdjustment[gender === 'M' ? 'male' : 'female'];
    
    let totalRate = pConfig.pricing.baseRate;

    // DIY 叠加
    if (currentHealthId === 'ASSEMBLE' && pConfig.pricing.addons) {
        selectedAddons.forEach(addonId => {
            const addon = pConfig.pricing.addons?.find(a => a.id === addonId);
            if (addon) totalRate += pConfig.pricing.baseRate * addon.rate;
        });
    }

    return Math.round(baseBlock * totalRate * ageImpact * smokerImpact * genderImpact);
  }, [currentHealthId, age, gender, isSmoker, sumAssured, selectedAddons]);

  const handleScenarioClick = (id: string) => {
    if (clientPremium < currentLimit) return;
    if (selectedScenario === id) setSelectedScenario(null); 
    else setSelectedScenario(id);
  };

  const toggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter(a => a !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  // 页面视图路由
  if (pageView === 'POLICY_MANAGER') {
    return (
      <PolicyManager onBack={() => setPageView('HOME')} />
    );
  }

  if (pageView === 'GLOBAL_POWER') {
    return (
      <GlobalPowerPage onBack={() => setPageView('WEALTH_LIST')} />
    );
  }

  if (pageView === 'WEALTH_LIST') {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <div className="bg-white px-5 pt-12 pb-6 border-b border-gray-100">
          <button
            onClick={() => setPageView('HOME')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ChevronRight size={18} className="mr-2 rotate-180" />
            <span className="text-sm font-medium">返回首页</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-900">财富增值产品</h1>
          <p className="text-sm text-gray-500 mt-1">储蓄计划 · 多元货币 · 传承规划</p>
        </div>

        {/* 产品列表 */}
        <div className="p-5 space-y-4">
          {/* 环宇盈活 */}
          <div 
            onClick={() => setPageView('GLOBAL_POWER')}
            className="bg-white p-5 rounded-xl border-2 border-[#D31145]/20 shadow-sm active:scale-95 transition-transform cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-800">环宇盈活储蓄计划</h3>
                <p className="text-sm text-gray-500 mt-1">Global Power Multi-Currency Plan</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#D31145] flex items-center justify-center text-white font-bold shadow-md">
                GP
              </div>
            </div>
            <p className="text-sm text-[#C5A065] font-medium mb-3">多元货币配置，财富世代传承</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-red-50 text-[#D31145] rounded-full">多元货币</span>
              <span className="text-xs px-2 py-1 bg-red-50 text-[#D31145] rounded-full">红利锁定</span>
              <span className="text-xs px-2 py-1 bg-red-50 text-[#D31145] rounded-full">保单分拆</span>
              <span className="text-xs px-2 py-1 bg-red-50 text-[#D31145] rounded-full">无限传承</span>
            </div>
            <div className="mt-4 flex items-center text-[#D31145] font-medium text-sm">
              <span>查看详情</span>
              <ChevronRight size={16} className="ml-1" />
            </div>
          </div>

          {/* 其他产品占位 */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm opacity-60">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">盈御多元货币计划 3</h3>
                <p className="text-sm text-gray-500 mt-1">GP3</p>
              </div>
              <span className="text-xs text-gray-400">即将上线</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800 pb-24 transition-colors duration-500 relative">
      
      {/* ======================= Tab 1: 首页 Dashboard ======================= */}
      {activeTab === 'DASHBOARD' && (
        <div className="animate-fade-in">
          {/* Header - 简化版，只保留标题 */}
          <div className="bg-white px-5 pt-12 pb-4 sticky top-0 z-10 border-b border-gray-100/50 backdrop-blur-sm bg-white/90">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-[#8B0000] pb-2 border-b-2 border-[#C5A065]">家庭资产驾驶舱</h1>
                <p className="text-xs text-gray-500 mt-1">全景扫描 · 缺口分析 · 智能配置</p>
              </div>
              {userInfo ? (
                <img
                  src={userInfo.avatar}
                  alt={userInfo.nickname}
                  className="w-10 h-10 rounded-full border-2 border-[#D31145] shadow-md object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#D31145] flex items-center justify-center text-white font-bold shadow-md">
                  AIA
                </div>
              )}
            </div>
          </div>

          {/* ========== 第一梯队：高频工具与破冰 (Top Hooks) ========== */}
          <div className="px-5 pt-6 pb-4 bg-gradient-to-b from-gray-50/50 to-white">
            <div className="space-y-4">
              {/* 1. OnboardingCTA - 30秒测试按钮 */}
              <button
                onClick={() => setShowOnboarding(true)}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#D31145] to-[#C5A065] rounded-xl text-white font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <Sparkles size={20} />
                <span>✨ 30秒测测你的家庭抗风险能力</span>
              </button>

              {/* 2. ExchangeRateWidget - 汇率红绿灯 */}
              <ExchangeRateWidget />

              {/* 3. DailyQuoteCard - 每日日签 */}
              <DailyQuoteCard />
            </div>
          </div>

          {/* ========== 第二梯队：身份定义与反馈 (Identity & Feedback) ========== */}
          <div className="px-5 py-8 space-y-6">
            {/* ProfileSelector - 家庭结构选择器 */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="mb-4">
                <h2 className="text-sm font-bold text-slate-800 mb-1">选择您的家庭结构</h2>
                <p className="text-xs text-gray-500">我们将为您个性化定制配置方案</p>
              </div>
              
              <div className="bg-gray-100 p-1 rounded-lg flex text-xs font-bold text-gray-500">
                <button 
                  onClick={() => setFamilyType('SINGLE')}
                  className={`flex-1 py-2 rounded-md transition-all ${familyType === 'SINGLE' ? 'bg-white text-slate-900 shadow-sm text-[#D31145]' : ''}`}
                >
                  单身贵族
                </button>
                <button 
                  onClick={() => setFamilyType('COUPLE')}
                  className={`flex-1 py-2 rounded-md transition-all ${familyType === 'COUPLE' ? 'bg-white text-slate-900 shadow-sm text-[#D31145]' : ''}`}
                >
                  二人世界
                </button>
                <button 
                  onClick={() => setFamilyType('FAMILY')}
                  className={`flex-1 py-2 rounded-md transition-all ${familyType === 'FAMILY' ? 'bg-white text-slate-900 shadow-sm text-[#D31145]' : ''}`}
                >
                  核心家庭
                </button>
                <button 
                  onClick={() => setFamilyType('RETIREMENT')}
                  className={`flex-1 py-2 rounded-md transition-all ${familyType === 'RETIREMENT' ? 'bg-white text-slate-900 shadow-sm text-[#D31145]' : ''}`}
                >
                  退休银发
                </button>
              </div>
              
              <div className="mt-3 text-[10px] text-gray-400 text-center animate-fade-in transition-all duration-300">
                {currentFamilyConfig.desc}
              </div>
            </div>

            {/* RadarChart - 配置健康度分析（带过渡动画） */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-500 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-800 flex items-center">
                  <Activity size={18} className="mr-2 text-[#D31145]" />
                  配置健康度分析
                </h2>
                <span className="text-xs bg-red-50 text-[#D31145] px-2 py-0.5 rounded font-bold">待完善</span>
              </div>
              
              <div className="grid grid-cols-5 gap-2 text-center">
                {currentFamilyConfig.dashboardData.map((data, idx) => {
                  return (
                    <div 
                        key={idx} 
                        className="flex flex-col items-center group cursor-pointer animate-fade-in transition-all duration-300" 
                        style={{ animationDelay: `${idx * 50}ms` }}
                        onClick={() => data.linkId && navigateToProduct(data.linkId, data.linkType as any)}
                    >
                      <div className="relative w-14 h-14 mb-2">
                        <svg className="w-full h-full transform -rotate-90 transition-all duration-500" viewBox="0 0 36 36">
                          <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                          <path stroke={data.color} strokeDasharray={`${data.val}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" className="transition-all duration-500" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-400 group-hover:text-black transition-colors">{data.val}%</div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 truncate w-full">{data.label}</span>
                      <span className="text-[9px] text-[#D31145] scale-0 group-hover:scale-100 transition-transform">去补充 &gt;</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ========== 第三梯队：解决方案 (Solutions) ========== */}
          <div className="px-5 pb-8 space-y-6">

            {/* 缺口分析文字提示 */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <div className="flex items-start">
                <AlertTriangle size={18} className="text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-amber-900 mb-1">保障缺口分析</h3>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    根据您选择的家庭结构，我们已为您扫描出潜在的保障缺口。上方健康度分析展示了各维度的完善程度，建议优先补充得分较低的保障项目。
                  </p>
                </div>
              </div>
            </div>

            {/* 产品分类入口 */}
            <div className="space-y-3">
              <h2 className="font-bold text-slate-800 flex items-center">
                <Settings size={18} className="mr-2 text-[#D31145]" />
                产品中心
              </h2>

              {/* 财富增值入口 */}
              <div 
                onClick={() => setPageView('WEALTH_LIST')} 
                className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl border-2 border-[#D31145]/20 shadow-sm flex items-center justify-between active:scale-95 transition-transform cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3 text-white font-bold text-xs shadow-sm bg-[#D31145]">
                    <Coins size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-base text-slate-800">财富增值</div>
                    <div className="text-xs text-gray-600 mt-0.5">储蓄计划 · 多元货币 · 传承规划</div>
                  </div>
                </div>
                <ChevronRight size={20} className="text-[#D31145]" />
              </div>

              {/* 健康保障入口 */}
              <div 
                onClick={() => navigateToProduct('OYS2', 'HEALTH')} 
                className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border-2 border-blue-200 shadow-sm flex items-center justify-between active:scale-95 transition-transform cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3 text-white font-bold text-xs shadow-sm bg-[#0097A7]">
                    <Shield size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-base text-slate-800">健康保障</div>
                    <div className="text-xs text-gray-600 mt-0.5">重疾险 · 医疗保障 · 家庭守护</div>
                  </div>
                </div>
                <ChevronRight size={20} className="text-blue-600" />
              </div>
            </div>

            {/* 3. 智能产品推荐 (联动跳转) */}
            <div className="space-y-3">
              <h2 className="font-bold text-slate-800 flex items-center">
                <Settings size={18} className="mr-2 text-[#D31145]" />
                为您精选的配置方案
              </h2>

              <div className="space-y-3">
                {currentFamilyConfig.recommendations.map((rec, idx) => {
                  // 根据类型获取产品信息
                  let prodInfo;
                  if (rec.type === 'WEALTH') prodInfo = DB.products[rec.id];
                  else prodInfo = DB.healthProducts[rec.id];

                  return (
                    <div 
                      key={idx}
                      onClick={() => navigateToProduct(rec.id, rec.type as any)} 
                      className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between active:scale-95 transition-transform cursor-pointer animate-slide-up"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center mr-3 text-white font-bold text-xs shadow-sm"
                          style={{ backgroundColor: prodInfo?.themeColor || '#ccc' }}
                        >
                          {rec.type === 'WEALTH' ? <Landmark size={18} /> : <Shield size={18} />}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-800">{prodInfo?.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{rec.desc}</div>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-300" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= Tab 2: 定制计算器 (整合储蓄与重疾) ======================= */}
      {activeTab === 'CALCULATOR' && (
        <div className="animate-fade-in">
          
          {/* 顶部导航 */}
          <div className="fixed top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 z-50">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold shadow-sm transition-colors duration-300" style={{ backgroundColor: '#D31145' }}>AIA</div>
            </div>
            
            {/* V6.3 优化：大型卡片式 Tab 切换 (Segmented Control Style) */}
            <div className="flex bg-gray-100 p-1 rounded-lg text-xs font-bold ml-auto w-48 shadow-inner">
              <button 
                onClick={() => setProductCategory('WEALTH')}
                className={`flex-1 py-1.5 rounded-md transition-all flex items-center justify-center ${productCategory === 'WEALTH' ? 'bg-white text-[#D31145] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Coins size={14} className="mr-1.5" />
                财富增值
              </button>
              <button 
                onClick={() => setProductCategory('HEALTH')}
                className={`flex-1 py-1.5 rounded-md transition-all flex items-center justify-center ${productCategory === 'HEALTH' ? 'bg-white text-[#0097A7] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Heart size={14} className="mr-1.5" />
                健康保障
              </button>
            </div>
          </div>

          <div className="pt-20 px-4 md:px-0 md:max-w-md mx-auto space-y-5">
            
            {/* === 赛道 A: 储蓄理财 (WEALTH) - 保持原有逻辑不变 === */}
            {productCategory === 'WEALTH' && (
              <div className="animate-fade-in space-y-5">
                {/* 原有储蓄计算器逻辑 */}
                <div className="flex justify-between items-center mb-2 px-1">
                  <div className="relative">
                    <button onClick={() => setIsProductMenuOpen(!isProductMenuOpen)} className="flex items-center text-sm font-bold text-gray-800 hover:text-black">
                      {product.name} <ChevronDown size={14} className="ml-1" />
                    </button>
                    {isProductMenuOpen && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                         <div className="p-2 space-y-1">
                            {['GP3', 'GF', 'FLCP5'].map((pid) => (
                              <button key={pid} onClick={() => switchProduct(pid as any)} className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold flex items-center ${currentProductId === pid ? 'bg-gray-100 text-black' : 'hover:bg-gray-50 text-gray-600'}`}>
                                {DB.products[pid as any].name}
                              </button>
                            ))}
                         </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative group transition-all duration-500">
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl -mr-10 -mt-10 transition-colors duration-500" style={{ backgroundColor: `${product.themeColor}20` }}></div>
                  <div className="p-6 pb-4">
                    <div className="flex justify-between items-start">
                      <div><h1 className="text-xl font-bold text-slate-900">{product.name}</h1><p className="font-medium text-sm mt-1 transition-colors duration-300" style={{ color: product.subColor }}>{product.slogan}</p></div>
                      <Globe className="opacity-20 transition-colors duration-300" size={40} style={{ color: product.themeColor }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 px-4 pb-6 border-b border-gray-50">
                    {product.features.map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mb-1.5 transition-colors duration-300" style={{ backgroundColor: `${product.themeColor}10`, color: product.themeColor }}><item.icon size={18} /></div>
                        <span className="text-[10px] text-gray-500">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* 投保门槛校验器 */}
                  <div className="p-5 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-3"><div className="text-sm font-bold text-slate-800 flex items-center"><Calculator size={14} className="mr-2" style={{ color: product.themeColor }} />快速测算起步门槛</div></div>
                    <div className="mb-4">
                      <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
                        {product.currencies.map((c) => (
                          <button key={c.code} onClick={() => setClientCurrency(c.code)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border flex-shrink-0 ${clientCurrency === c.code ? 'text-white border-transparent shadow' : 'bg-white text-gray-500 border-gray-200'}`} style={{ backgroundColor: clientCurrency === c.code ? '#1e293b' : 'white' }}>{c.label}</button>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2 mb-4 overflow-x-auto pb-1">
                      {(Object.keys(product.termLabels) as string[]).map((term) => (
                        <button key={term} onClick={() => setClientTerm(term)} className={`flex-1 py-2 px-2 text-xs rounded-lg border font-medium transition-all whitespace-nowrap flex-shrink-0 ${safeTerm === term ? 'text-white shadow-md border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`} style={{ backgroundColor: safeTerm === term ? product.themeColor : 'white' }}>{product.termLabels[term]}</button>
                      ))}
                    </div>

                    {/* 金额输入 (V6.3 智能输入胶囊回归) */}
                    <div className="relative">
                      <label className="text-[10px] text-gray-400 absolute -top-2 left-0">年缴保费 ({clientCurrency})</label>
                      <div className="relative border-b border-gray-200 py-1 mb-2">
                         <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                          <span className="text-xl font-bold text-gray-400 mr-2">{currentSymbol}</span>
                        </div>
                        <input 
                          type="number" 
                          value={clientPremium} 
                          onChange={(e) => setClientPremium(Number(e.target.value))}
                          className="w-full text-3xl font-bold bg-transparent pl-7 outline-none appearance-none transition-colors text-slate-800"
                        />
                      </div>
                      
                      {/* 快捷加钱胶囊 */}
                      <div className="flex space-x-2 mb-3 overflow-x-auto pb-1 hide-scrollbar">
                         {[1000, 5000, 10000].map(add => (
                           <button 
                            key={add} 
                            onClick={() => setClientPremium(p => p + add)}
                            className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 active:scale-95 transition-transform flex-shrink-0"
                           >
                             +{currentSymbol}{add.toLocaleString()}
                           </button>
                         ))}
                      </div>

                      {prepayInfo.interest > 0 && (
                        <div className="mb-3 bg-orange-50 border border-orange-100 rounded-lg p-2 flex items-center justify-between text-[10px] text-orange-800 animate-fade-in">
                          <div className="flex items-center"><Gift size={12} className="mr-1.5" /><span>限时预缴优惠：首年立减利息</span></div>
                          <span className="font-bold">-{currentSymbol}{prepayInfo.interest.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2">
                      {isTooHigh ? (
                        <div className="flex items-start text-red-600 text-xs bg-red-50 p-3 rounded-lg border border-red-100 animate-pulse">
                          <Thermometer size={16} className="mr-2 flex-shrink-0 mt-0.5" /><div><div className="font-bold text-sm">保费过高，请保持冷静</div><div className="mt-1 opacity-90">总保费已超 500万美金，请联系小宇进行冷静投保评估。</div></div>
                        </div>
                      ) : clientPremium < currentLimit ? (
                        <div className="flex items-center text-red-500 text-xs"><AlertTriangle size={14} className="mr-1.5" /><span>最低起缴额为 {currentSymbol}{currentLimit.toLocaleString()}</span></div>
                      ) : (
                        <div className="flex items-center text-green-600 text-xs"><CheckCircle size={14} className="mr-1.5" /><span>符合投保要求</span></div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-gray-400 px-2 uppercase tracking-wider">选择您的规划目标</h2>
                  {product.scenarios.map((sc) => {
                    const isSelected = selectedScenario === sc.id;
                    return (
                      <div key={sc.id} className="transition-all duration-300">
                        <button onClick={() => handleScenarioClick(sc.id)} className={`w-full text-left p-4 rounded-xl border flex items-center transition-all ${isSelected ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-[1.02] z-10 relative rounded-b-none border-b-0' : `bg-white border-gray-100 ${clientPremium < currentLimit ? 'opacity-50 cursor-not-allowed' : ''}`}`}>
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-colors ${isSelected ? 'bg-white/10' : 'bg-gray-50'}`} style={{ color: isSelected ? product.subColor : product.themeColor }}>{sc.icon}</div>
                          <div className="flex-1"><div className="flex justify-between items-center mb-1"><span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>{sc.name}</span><span className={`text-[10px] px-2 py-0.5 rounded-full transition-colors`} style={{ backgroundColor: isSelected ? product.subColor : '#f3f4f6', color: isSelected ? 'white' : '#6b7280' }}>{sc.highlight}</span></div><div className={`text-xs ${isSelected ? 'text-gray-400' : 'text-gray-400'}`}>{sc.desc}</div></div>
                          <div className="ml-2">{isSelected ? <ChevronUp size={20} style={{ color: product.themeColor }} /> : <ChevronDown size={20} className="text-gray-300" />}</div>
                        </button>
                        {isSelected && scenarioData && (
                          <div className="bg-slate-900 text-white rounded-b-xl border-x border-b border-slate-900 p-5 shadow-xl animate-fade-in origin-top">
                            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2"><span className="font-bold text-xs flex items-center" style={{ color: product.themeColor }}><Calculator size={14} className="mr-2" />现金流预演 ({currentProductId})</span></div>
                            {scenarioData.type === 'timeline' && <div className="space-y-3">{scenarioData.events?.map((ev: any, idx: number) => (<div key={idx} className="flex items-center justify-between text-sm"><span className="text-gray-300">{ev.label}</span><div className="text-right"><div className="font-bold text-white">{currentSymbol}{ev.value.toLocaleString()}</div><div className="text-[10px] text-gray-500">{ev.sub}</div></div></div>))}</div>}
                            {scenarioData.type === 'stream' && <div className="text-center py-2"><div className="text-3xl font-bold mb-1" style={{ color: product.subColor }}>{currentSymbol}{scenarioData.annual?.toLocaleString()}</div><div className="text-xs text-gray-400">预计每年领取 ({scenarioData.period})</div></div>}
                            {scenarioData.type === 'curve' && <div className="space-y-3 pt-1">{scenarioData.data?.map((d: any, idx: number) => (<div key={idx}><div className="flex justify-between text-xs mb-1"><span className="text-gray-400">第 {d.year} 年</span><span className="font-bold" style={{ color: product.themeColor }}>{currentSymbol}{d.val.toLocaleString()}</span></div><div className="h-1.5 bg-gray-700 rounded-full overflow-hidden"><div className="h-full transition-all duration-1000 ease-out" style={{ width: `${(idx + 1) * 33}%`, backgroundColor: product.themeColor }}></div></div></div>))}</div>}
                            <div className="mt-5 pt-3 border-t border-white/10 text-center"><button className="w-full text-white py-3 rounded-lg font-bold shadow-md active:scale-95 transition-transform flex items-center justify-center text-sm" style={{ backgroundColor: product.themeColor }}><UserCircle className="mr-2" size={18} />联系顾问小宇生成详细计划书</button></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* === 赛道 B: 健康保障 (HEALTH) - 新增板块 === */}
            {productCategory === 'HEALTH' && (
              <div className="animate-fade-in space-y-5">
                
                {/* 1. 产品横向选择器 */}
                <div className="flex space-x-3 overflow-x-auto pb-2 hide-scrollbar">
                  {['OYS2', 'EOYS', 'SEU', 'ASSEMBLE', 'CANCER_PRO'].map((hid) => {
                    const hp = DB.healthProducts[hid as any];
                    const isActive = currentHealthId === hid;
                    return (
                      <button 
                        key={hid}
                        onClick={() => {
                            setCurrentHealthId(hid as any);
                            if (hid === 'ASSEMBLE') setSelectedAddons([]); // 重置 DIY
                        }}
                        className={`flex-shrink-0 w-32 p-3 rounded-xl border transition-all relative ${
                          isActive 
                          ? 'bg-white border-transparent ring-2 shadow-md' 
                          : 'bg-white border-gray-100 text-gray-400'
                        }`}
                        style={{ '--tw-ring-color': isActive ? hp.themeColor : 'transparent' } as React.CSSProperties}
                      >
                         {/* Tag */}
                         {hp.tags && hp.tags.length > 0 && (
                             <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] text-white px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap z-10" style={{ backgroundColor: hp.themeColor }}>
                                 {hp.tags[0]}
                             </span>
                         )}
                        <div className={`text-xs font-bold mb-1 truncate ${isActive ? 'text-slate-800' : ''}`}>{hp.name}</div>
                        <div className="text-[10px] truncate opacity-70">{hp.slogan}</div>
                      </button>
                    );
                  })}
                </div>

                {/* 2. 重疾计算器卡片 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-5 text-white transition-colors duration-500" style={{ backgroundColor: DB.healthProducts[currentHealthId].themeColor }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="text-xl font-bold">{DB.healthProducts[currentHealthId].name}</h1>
                        <p className="text-xs mt-1 opacity-90">{DB.healthProducts[currentHealthId].slogan}</p>
                      </div>
                      <Shield className="opacity-20" size={36} />
                    </div>
                  </div>

                  <div className="p-5 space-y-6">
                    {/* 表单区域 */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* 年龄 */}
                      <div className="col-span-2">
                        <div className="flex justify-between mb-2">
                          <span className="text-xs font-bold text-gray-500">投保年龄</span>
                          <span className="text-sm font-bold text-slate-800">{age} 岁</span>
                        </div>
                        <input 
                          type="range" min="0" max="70" value={age} 
                          onChange={(e) => setAge(Number(e.target.value))}
                          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                        />
                      </div>

                      {/* 性别 */}
                      <div>
                        <span className="text-xs font-bold text-gray-500 block mb-2">性别</span>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                          <button onClick={() => setGender('M')} className={`flex-1 py-1.5 text-xs rounded font-bold ${gender === 'M' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}>男</button>
                          <button onClick={() => setGender('F')} className={`flex-1 py-1.5 text-xs rounded font-bold ${gender === 'F' ? 'bg-white shadow-sm text-pink-500' : 'text-gray-400'}`}>女</button>
                        </div>
                      </div>

                      {/* 吸烟 */}
                      <div>
                        <span className="text-xs font-bold text-gray-500 block mb-2">吸烟习惯</span>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                          <button onClick={() => setIsSmoker(false)} className={`flex-1 py-1.5 text-xs rounded font-bold ${!isSmoker ? 'bg-white shadow-sm text-green-600' : 'text-gray-400'}`}>否</button>
                          <button onClick={() => setIsSmoker(true)} className={`flex-1 py-1.5 text-xs rounded font-bold ${isSmoker ? 'bg-white shadow-sm text-slate-800' : 'text-gray-400'}`}>是</button>
                        </div>
                      </div>
                    </div>

                    {/* V6.3 特性: Assemble 专属 DIY 区域 */}
                    {currentHealthId === 'ASSEMBLE' && DB.healthProducts['ASSEMBLE'].pricing.addons && (
                        <div className="col-span-2 bg-orange-50 p-3 rounded-xl border border-orange-100">
                             <span className="text-xs font-bold text-orange-800 block mb-2 flex items-center"><Shuffle size={12} className="mr-1"/> 自由搭配保障 (DIY)</span>
                             <div className="space-y-2">
                                 {DB.healthProducts['ASSEMBLE'].pricing.addons.map(addon => (
                                     <div key={addon.id} onClick={() => toggleAddon(addon.id)} className="flex items-center justify-between cursor-pointer">
                                         <div className="flex items-center">
                                             <div className={`w-4 h-4 rounded border flex items-center justify-center mr-2 ${selectedAddons.includes(addon.id) ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-300 bg-white'}`}>
                                                 {selectedAddons.includes(addon.id) && <CheckSquare size={10} />}
                                             </div>
                                             <span className="text-xs text-gray-700">{addon.label}</span>
                                         </div>
                                         <span className="text-[10px] text-orange-600 font-bold">+{addon.rate * 100}%</span>
                                     </div>
                                 ))}
                             </div>
                        </div>
                    )}

                    {/* 保额输入 (V6.3 回归智能输入) */}
                    <div>
                      <label className="text-[10px] text-gray-400 block mb-1">重疾保额 (USD)</label>
                      <div className="relative border-b border-gray-200 pb-1 mb-2">
                        <span className="absolute left-0 top-1 text-lg font-bold text-gray-400">$</span>
                        <input 
                          type="number" 
                          value={sumAssured}
                          onChange={(e) => setSumAssured(Number(e.target.value))}
                          className="w-full text-2xl font-bold bg-transparent outline-none text-slate-800 pl-4"
                        />
                      </div>
                       <div className="flex space-x-2 overflow-x-auto pb-1 hide-scrollbar">
                         {[10000, 50000, 100000].map(add => (
                           <button 
                            key={add} 
                            onClick={() => setSumAssured(p => p + add)}
                            className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 active:scale-95 transition-transform flex-shrink-0"
                           >
                             +${(add/1000).toFixed(0)}k
                           </button>
                         ))}
                      </div>
                    </div>

                    {/* 结果展示区 */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs text-gray-500">预估年缴保费</span>
                        <span className="text-2xl font-bold text-slate-800">${healthPremium.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-400">杠杆倍数</span>
                        <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold">
                          {(sumAssured / healthPremium).toFixed(1)}x
                        </span>
                      </div>
                    </div>
                    
                    <button className="w-full py-3 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-transform" 
                            style={{ backgroundColor: DB.healthProducts[currentHealthId].themeColor }}>
                      联系顾问小宇获取 {DB.healthProducts[currentHealthId].name} 计划书
                    </button>

                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ======================= Tab 3: 服务页 (Concierge) ======================= */}
      {activeTab === 'SERVICE' && (
        <div className="animate-fade-in p-5 space-y-6 pt-16">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-50 rounded-full mx-auto flex items-center justify-center mb-4 text-[#D31145]">
              <UserCircle size={32} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">顾问小宇</h1>
            <p className="text-sm text-gray-500 mt-1">您的专属财富管家</p>
          </div>
          
          {/* 香港医疗资源指南 */}
          <MedicalGuide />
          
          {/* 香港金融基建指南 */}
          <BankingGuide 
            onContactAdvisor={() => setShowBookingModal(true)}
          />
          
          {/* 香港身份全攻略 */}
          <IdentityGuide 
            onContactAdvisor={() => setShowBookingModal(true)}
          />
          
          {/* 香港教育资源指南 */}
          <EducationGuide 
            onNavigateToCalculator={() => {
              setPageView('GLOBAL_POWER');
            }}
            onContactAdvisor={() => setShowBookingModal(true)}
          />
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
            <button
              onClick={() => {
                setPageView('POLICY_MANAGER');
                setActiveTab('DASHBOARD'); // 保持在同一Tab
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <FileText size={18} className="text-[#D31145] mr-3" />
                <span className="text-sm font-bold text-slate-700">保单托管服务</span>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
            <button
              onClick={() => setShowClaimsModal(true)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <HeartHandshake size={18} className="text-[#D31145] mr-3" />
                <span className="text-sm font-bold text-slate-700">理赔协助</span>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
            <button
              onClick={() => setShowBookingModal(true)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <Phone size={18} className="text-[#D31145] mr-3" />
                <span className="text-sm font-bold text-slate-700">预约咨询</span>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          </div>
        </div>
      )}

      {/* ======================= 底部导航栏 (Tab Bar) ======================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center h-20 pb-4 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
        <button 
          onClick={() => setActiveTab('DASHBOARD')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'DASHBOARD' ? 'text-[#D31145]' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-bold">首页</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('CALCULATOR')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'CALCULATOR' ? 'text-[#D31145]' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Calculator size={20} />
          <span className="text-[10px] font-bold">定制</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('SERVICE')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${activeTab === 'SERVICE' ? 'text-[#D31145]' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Users size={20} />
          <span className="text-[10px] font-bold">服务</span>
        </button>
      </div>

      {/* 微信登录弹窗 */}
      <WeChatLoginModal
        isOpen={showLoginModal}
        onLoginSuccess={handleLoginSuccess}
      />
      
      {/* 引导问卷 */}
      <OnboardingWizard
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />

      {/* 理赔协助弹窗 */}
      <ClaimsModal
        isOpen={showClaimsModal}
        onClose={() => setShowClaimsModal(false)}
      />

      {/* 预约咨询弹窗 */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />

    </div>
  );
}