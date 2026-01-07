// 保单 Mock 数据
export interface Policy {
  id: string;
  member: string; // 'Dad' | 'Mom' | 'Kid'
  memberName: string;
  insuranceCompany: string;
  productName: string;
  productType: 'WEALTH' | 'HEALTH'; // 储蓄险 | 重疾/医疗险
  status: 'ACTIVE' | 'PENDING_PAYMENT' | 'UNDER_REVIEW'; // 保障中 | 待缴费 | 审核中
  sumAssured?: number; // 保额（重疾/医疗险）
  cashValue?: number; // 现金价值（储蓄险）
  annualPremium: number; // 年缴保费
  nextPaymentDate: string; // 下次缴费日期
  policyNumber: string;
}

export const MOCK_POLICIES: Policy[] = [
  // 爸爸的保单
  {
    id: '1',
    member: 'Dad',
    memberName: '张先生',
    insuranceCompany: 'AIA',
    productName: '环宇盈活储蓄计划',
    productType: 'WEALTH',
    status: 'ACTIVE',
    cashValue: 245000,
    annualPremium: 30000,
    nextPaymentDate: '2026-03-12',
    policyNumber: 'GP3-202401-001',
  },
  {
    id: '2',
    member: 'Dad',
    memberName: '张先生',
    insuranceCompany: 'AIA',
    productName: '爱伴航 2 (OYS2)',
    productType: 'HEALTH',
    status: 'ACTIVE',
    sumAssured: 500000,
    annualPremium: 12500,
    nextPaymentDate: '2026-06-15',
    policyNumber: 'OYS2-202302-045',
  },
  // 妈妈的保单
  {
    id: '3',
    member: 'Mom',
    memberName: '李女士',
    insuranceCompany: 'AIA',
    productName: '多重智倍保 (SEU)',
    productType: 'HEALTH',
    status: 'ACTIVE',
    sumAssured: 300000,
    annualPremium: 6600,
    nextPaymentDate: '2026-02-28',
    policyNumber: 'SEU-202401-089',
  },
  {
    id: '4',
    member: 'Mom',
    memberName: '李女士',
    insuranceCompany: 'AIA',
    productName: '盈御多元货币计划 3',
    productType: 'WEALTH',
    status: 'PENDING_PAYMENT',
    cashValue: 180000,
    annualPremium: 50000,
    nextPaymentDate: '2026-01-25',
    policyNumber: 'GP3-202303-123',
  },
  // 孩子的保单
  {
    id: '5',
    member: 'Kid',
    memberName: '张小宝',
    insuranceCompany: 'AIA',
    productName: '爱无忧长享计划 5',
    productType: 'WEALTH',
    status: 'ACTIVE',
    cashValue: 56000,
    annualPremium: 15000,
    nextPaymentDate: '2026-04-08',
    policyNumber: 'FLCP5-202405-067',
  },
];

// 计算总资产和总保额
export const calculateTotals = (policies: Policy[]) => {
  const totalCashValue = policies
    .filter(p => p.productType === 'WEALTH' && p.cashValue)
    .reduce((sum, p) => sum + (p.cashValue || 0), 0);
  
  const totalProtection = policies
    .filter(p => p.productType === 'HEALTH' && p.sumAssured)
    .reduce((sum, p) => sum + (p.sumAssured || 0), 0);

  return {
    totalCashValue,
    totalProtection,
  };
};
