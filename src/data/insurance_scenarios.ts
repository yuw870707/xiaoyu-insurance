// 1. 定义与 JSON 严格对应的基础数据接口
export interface RawGrowthFactor {
  year: number;
  total_premium_paid: number;
  cv_multiplier: number;
  db_multiplier: number;
}

// 2. 定义前端使用的扩展数据接口 (包含 IRR 和 杠杆)
export interface CalculatedPlanData {
  year: number;
  totalPremiumPaid: number;  // 累计已缴保费
  cashValue: number;         // 现金价值
  deathBenefit: number;      // 身故赔偿
  netProfit: number;         // 净收益
  cvLeverage: number;        // 现价杠杆 (退保金 / 本金)
  dbLeverage: number;        // 身故杠杆 (赔偿金 / 本金)
  irr: number;               // 内部回报率 (预估)
}

// 3. 核心模型数据 (1-99年 完整系数表)
export const AIA_GROWTH_MODEL: RawGrowthFactor[] = [
  { "year": 1, "total_premium_paid": 30000, "cv_multiplier": 0.0010, "db_multiplier": 1.0500 },
  { "year": 2, "total_premium_paid": 60000, "cv_multiplier": 0.0005, "db_multiplier": 1.0500 },
  { "year": 3, "total_premium_paid": 90000, "cv_multiplier": 0.1676, "db_multiplier": 1.0500 },
  { "year": 4, "total_premium_paid": 120000, "cv_multiplier": 0.3137, "db_multiplier": 1.0500 },
  { "year": 5, "total_premium_paid": 150000, "cv_multiplier": 0.4684, "db_multiplier": 1.0500 },
  // ... 请在此处保留你 JSON 中第 6 年到第 98 年的所有数据，太长了我就不全部重复贴了，把你刚才那一大段中间部分保留好 ...
  { "year": 99, "total_premium_paid": 150000, "cv_multiplier": 451.4753, "db_multiplier": 451.4753 }
];

// 辅助函数：简易 IRR 估算 (Newton-Raphson 近似法)
const estimateIRR = (years: number, finalValue: number, annualPremium: number, premiumYears: number = 5): number => {
  if (finalValue <= 0) return -1; // 亏损极大
  // 简化逻辑：假设资金平均占用时间。更精确的需要现金流折现迭代。
  // 这里使用 CAGR (复合年均增长率) 作为近似替代，针对总投入
  const totalCost = annualPremium * premiumYears;
  if (finalValue < totalCost) {
     // 简单亏损率
     return (finalValue - totalCost) / totalCost / years; 
  }
  // 复利公式: (Final / Cost) ^ (1/Year) - 1
  return Math.pow(finalValue / totalCost, 1 / years) - 1;
};

// 4. 智能计算函数 (输入年缴保费，返回全维度数据)
export const calculatePlan = (annualPremium: number): CalculatedPlanData[] => {
  const totalFixedPremium = annualPremium * 5; // 5年缴费期

  return AIA_GROWTH_MODEL.map(data => {
    // 动态计算当前年份的累计已缴保费
    let currentPaid = 0;
    if (data.year <= 5) {
      currentPaid = annualPremium * data.year;
    } else {
      currentPaid = totalFixedPremium;
    }

    // 核心计算
    // 注意：这里用 data.cv_multiplier (JSON里的键) 算出实际金额
    const cashValue = Math.round(totalFixedPremium * data.cv_multiplier);
    const deathBenefit = Math.round(totalFixedPremium * data.db_multiplier);
    
    // 杠杆计算 (保留2位小数)
    const cvLev = parseFloat(data.cv_multiplier.toFixed(2));
    const dbLev = parseFloat(data.db_multiplier.toFixed(2));

    // IRR 计算 (百分比)
    const irrVal = estimateIRR(data.year, cashValue, annualPremium);

    return {
      year: data.year,
      totalPremiumPaid: currentPaid,
      cashValue: cashValue,
      deathBenefit: deathBenefit,
      netProfit: cashValue - currentPaid,
      cvLeverage: cvLev,   // 现价杠杆
      dbLeverage: dbLev,   // 身故杠杆
      irr: parseFloat((irrVal * 100).toFixed(2)) // 转为百分比
    };
  });
};