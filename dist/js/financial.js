// Financial Calculators Dataset

export const financialCalculators = [
  {
    id: "mortgage-calculator",
    name: "Mortgage Calculator",
    category: "financial",
    description: "Calculate your monthly mortgage payments including principal, interest, taxes, insurance, and HOA fees.",
    seo: {
      title: "Mortgage Calculator - Estimate Monthly Home Loan Payments",
      description: "Estimate monthly mortgage payments based on purchase price, down payment, tax rates, homeowners insurance, and HOA fees.",
      keywords: ["mortgage calculator", "home loan payment", "monthly mortgage payment", "mortgage tax calculator"]
    },
    formula: "M = P \\frac{r(1+r)^n}{(1+r)^n - 1} + T_{monthly} + I_{monthly} + H_{monthly}",
    explanation: "A mortgage payment consists of the core Principal and Interest (P&I) coupled with local property taxes, home hazard insurance, and optional homeowners association (HOA) charges. If the down payment is less than 20% of the home price, Private Mortgage Insurance (PMI) is dynamically added.",
    inputs: [
      { id: "homePrice", label: "Home Price ($)", type: "number", default: 400000, min: 0 },
      { id: "downPayment", label: "Down Payment ($ or %)", type: "number", default: 80000, min: 0 },
      { id: "termYears", label: "Loan Term (Years)", type: "number", default: 30, min: 1 },
      { id: "interestRate", label: "Interest Rate (Annual %)", type: "number", default: 6.8, min: 0, step: "any" },
      { id: "propertyTax", label: "Property Tax (Annual %)", type: "number", default: 1.2, min: 0, step: "any" },
      { id: "insurance", label: "Home Insurance (Annual $)", type: "number", default: 1500, min: 0 },
      { id: "hoa", label: "HOA Fees (Monthly $)", type: "number", default: 150, min: 0 }
    ],
    outputs: [
      { id: "totalMonthly", label: "Total Monthly Payment", type: "number", format: "currency" },
      { id: "piPayment", label: "Principal & Interest", type: "number", format: "currency" },
      { id: "monthlyTax", label: "Monthly Property Tax", type: "number", format: "currency" },
      { id: "monthlyIns", label: "Monthly Insurance", type: "number", format: "currency" },
      { id: "monthlyPmi", label: "Monthly PMI", type: "number", format: "currency" },
      { id: "totalInterest", label: "Total Interest Paid", type: "number", format: "currency" },
      { id: "amortizationData", label: "Amortization Table Data", type: "custom" }
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.homePrice) || 0;
      let down = parseFloat(inputs.downPayment) || 0;
      const termYears = parseFloat(inputs.termYears) || 0;
      const rateAnnual = parseFloat(inputs.interestRate) || 0;
      const taxRate = parseFloat(inputs.propertyTax) || 0;
      const insuranceAnnual = parseFloat(inputs.insurance) || 0;
      const hoaMonthly = parseFloat(inputs.hoa) || 0;

      if (down > 0 && down <= 100) {
        down = price * (down / 100);
      }

      const p = Math.max(0, price - down);
      const n = termYears * 12;
      const r = rateAnnual / 100 / 12;

      let piPayment = 0;
      if (p > 0 && n > 0) {
        if (r > 0) {
          piPayment = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        } else {
          piPayment = p / n;
        }
      }

      const monthlyTax = price * (taxRate / 100) / 12;
      const monthlyIns = insuranceAnnual / 12;

      let monthlyPmi = 0;
      if (down < price * 0.20 && p > 0) {
        monthlyPmi = (p * 0.007) / 12;
      }

      const totalMonthly = piPayment + monthlyTax + monthlyIns + hoaMonthly + monthlyPmi;
      const totalInterest = (piPayment * n) - p;

      const schedule = [];
      let balance = p;
      for (let i = 1; i <= n; i++) {
        const interestPortion = balance * r;
        const principalPortion = piPayment - interestPortion;
        balance -= principalPortion;
        schedule.push({
          month: i,
          payment: piPayment,
          principal: principalPortion,
          interest: interestPortion,
          balance: Math.max(0, balance)
        });
      }

      return {
        totalMonthly: parseFloat(totalMonthly.toFixed(2)),
        piPayment: parseFloat(piPayment.toFixed(2)),
        monthlyTax: parseFloat(monthlyTax.toFixed(2)),
        monthlyIns: parseFloat(monthlyIns.toFixed(2)),
        monthlyPmi: parseFloat(monthlyPmi.toFixed(2)),
        totalInterest: parseFloat(totalInterest.toFixed(2)),
        amortizationData: schedule
      };
    }
  },
  {
    id: "amortization-calculator",
    name: "Amortization Calculator",
    category: "financial",
    description: "Generate a complete monthly or yearly schedule for paying off mortgages and standard term loans.",
    seo: {
      title: "Loan Amortization Calculator - Payments Schedule",
      description: "Generates custom amortization charts to analyze compound payments splits.",
      keywords: ["amortization calculator", "amortization schedule", "loan payment schedule"]
    },
    formula: "\\text{Standard Amortization Formulation}",
    explanation: "Amortization refers to the process of allocating principal and interest components across each payment.",
    inputs: [
      { id: "amount", label: "Principal Amount ($)", type: "number", default: 100000 },
      { id: "years", label: "Term (Years)", type: "number", default: 15 },
      { id: "rate", label: "Annual Rate (%)", type: "number", default: 5.5 }
    ],
    outputs: [
      { id: "monthlyPayment", label: "Monthly Payment", type: "number", format: "currency" },
      { id: "totalInterest", label: "Total Interest Paid", type: "number", format: "currency" },
      { id: "amortizationData", label: "Amortization Table", type: "custom" }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.amount) || 0;
      const years = parseFloat(inputs.years) || 1;
      const rate = parseFloat(inputs.rate) || 0;

      const n = years * 12;
      const r = rate / 100 / 12;

      let pmt = 0;
      if (p > 0 && n > 0) {
        pmt = r > 0 ? p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : p / n;
      }

      const schedule = [];
      let balance = p;
      let totalInt = 0;
      for (let i = 1; i <= n; i++) {
        const interest = balance * r;
        const principal = pmt - interest;
        balance -= principal;
        totalInt += interest;
        schedule.push({
          month: i,
          payment: pmt,
          principal,
          interest,
          balance: Math.max(0, balance)
        });
      }

      return {
        monthlyPayment: parseFloat(pmt.toFixed(2)),
        totalInterest: parseFloat(totalInt.toFixed(2)),
        amortizationData: schedule
      };
    }
  },
  {
    id: "mortgage-payoff-calculator",
    name: "Mortgage Payoff Calculator",
    category: "financial",
    description: "Determine how much time and interest expense you save by adding extra payments to your mortgage.",
    seo: {
      title: "Mortgage Payoff Calculator - Save Time and Interest",
      description: "Estimate target payoff years and total interest saved by applying extra monthly checks.",
      keywords: ["mortgage payoff", "early payoff calculator", "prepay mortgage"]
    },
    formula: "\\text{Amortization Simulation with Extra Payments}",
    explanation: "Paying extra principal reduces the compounding base, causing the loan term to contract and saving massive amounts of interest.",
    inputs: [
      { id: "balance", label: "Current Balance ($)", type: "number", default: 300000 },
      { id: "rate", label: "Annual Rate (%)", type: "number", default: 6.5 },
      { id: "yearsLeft", label: "Years Remaining", type: "number", default: 25 },
      { id: "extra", label: "Extra Monthly Payment ($)", type: "number", default: 200 }
    ],
    outputs: [
      { id: "savedYears", label: "Years Saved from Term", type: "number", format: "decimal" },
      { id: "savedInterest", label: "Total Interest Saved", type: "number", format: "currency" },
      { id: "newTerm", label: "New Payoff Timeline (Years)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.balance) || 0;
      const rate = parseFloat(inputs.rate) || 0;
      const years = parseFloat(inputs.yearsLeft) || 1;
      const extra = parseFloat(inputs.extra) || 0;

      const n = years * 12;
      const r = rate / 100 / 12;

      let stdPmt = r > 0 ? p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : p / n;

      // Simulate standard loan
      let bal1 = p;
      let totalInt1 = 0;
      for (let i = 0; i < n; i++) {
        const intr = bal1 * r;
        const princ = stdPmt - intr;
        bal1 -= princ;
        totalInt1 += intr;
      }

      // Simulate loan with extra payments
      let bal2 = p;
      let totalInt2 = 0;
      let monthsCount = 0;
      while (bal2 > 0 && monthsCount < 600) {
        const intr = bal2 * r;
        const princ = (stdPmt + extra) - intr;
        if (bal2 < princ) {
          totalInt2 += bal2 * r;
          bal2 = 0;
        } else {
          bal2 -= princ;
          totalInt2 += intr;
        }
        monthsCount++;
      }

      const savedMonths = n - monthsCount;
      const savedInt = totalInt1 - totalInt2;

      return {
        savedYears: parseFloat((savedMonths / 12).toFixed(1)),
        savedInterest: parseFloat(Math.max(0, savedInt).toFixed(2)),
        newTerm: parseFloat((monthsCount / 12).toFixed(1))
      };
    }
  },
  {
    id: "house-affordability-calculator",
    name: "House Affordability Calculator",
    category: "financial",
    description: "Estimate an affordable home purchase budget based on income, debt, and down payments.",
    seo: {
      title: "House Affordability Calculator - Estimate Home Budget",
      description: "Estimate maximum home buying power using gross income and DTI limit standardizations.",
      keywords: ["house affordability", "how much home can i afford", "home buyer budget"]
    },
    formula: "\\text{DTI Standards (28% Front, 36% Back)}",
    explanation: "Lenders check debt ratios to verify house affordability. Housing costs shouldn't exceed 28% of gross salary, and total debt shouldn't exceed 36%.",
    inputs: [
      { id: "annualIncome", label: "Annual Gross Income ($)", type: "number", default: 90000 },
      { id: "monthlyDebts", label: "Monthly Debts (Car, Cards) ($)", type: "number", default: 500 },
      { id: "downPayment", label: "Down Payment Available ($)", type: "number", default: 30000 },
      { id: "interestRate", label: "Expected Loan Rate (%)", type: "number", default: 6.5 }
    ],
    outputs: [
      { id: "maxBudget", label: "Affordable Home Price", type: "number", format: "currency" },
      { id: "monthlyBudgetLimit", label: "Max Monthly Housing Payment", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const inc = parseFloat(inputs.annualIncome) || 0;
      const debt = parseFloat(inputs.monthlyDebts) || 0;
      const down = parseFloat(inputs.downPayment) || 0;
      const rate = parseFloat(inputs.interestRate) || 6.5;

      const monthlyGross = inc / 12;
      const limit1 = monthlyGross * 0.28;
      const limit2 = (monthlyGross * 0.36) - debt;

      const maxPmt = Math.min(limit1, limit2);

      // Back-calculate principal loan from mortgage payment:
      // M = P * r(1+r)^n / ((1+r)^n - 1) => P = M * ((1+r)^n - 1) / (r(1+r)^n)
      // We assume a standard 30-year term, and allocate 20% of the payment to taxes and insurance.
      const loanPmt = maxPmt * 0.8;
      const r = rate / 100 / 12;
      const n = 360;

      let loan = 0;
      if (r > 0) {
        loan = loanPmt * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
      } else {
        loan = loanPmt * n;
      }

      const budget = Math.max(0, loan + down);

      return {
        maxBudget: parseFloat(budget.toFixed(0)),
        monthlyBudgetLimit: parseFloat(Math.max(0, maxPmt).toFixed(2))
      };
    }
  },
  {
    id: "rent-calculator",
    name: "Rent Calculator",
    category: "financial",
    description: "Determine your target rent budget using the standard 30% household gross income rule.",
    seo: {
      title: "Rent Budget Calculator - How Much Rent Can I Afford?",
      description: "Estimate affordable monthly rental ranges based on salary income levels.",
      keywords: ["rent calculator", "affordable rent", "rent budget"]
    },
    formula: "\\text{Rent} = \\text{Monthly Gross} \\times 0.30",
    explanation: "Personal financial experts recommend spending a maximum of 30% of gross salary income on housing to leave room for other expenses.",
    inputs: [
      { id: "salary", label: "Annual Salary ($)", type: "number", default: 60000 }
    ],
    outputs: [
      { id: "maxRent", label: "Recommended Max Monthly Rent", type: "number", format: "currency" },
      { id: "monthlyGross", label: "Monthly Gross Income", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const sal = parseFloat(inputs.salary) || 0;
      const gross = sal / 12;
      return {
        maxRent: parseFloat((gross * 0.3).toFixed(2)),
        monthlyGross: parseFloat(gross.toFixed(2))
      };
    }
  },
  {
    id: "debt-to-income-ratio-calculator",
    name: "Debt-to-Income Ratio Calculator",
    category: "financial",
    description: "Determine your Debt-to-Income (DTI) ratio, a crucial metric evaluated during loan application approvals.",
    seo: {
      title: "Debt-to-Income (DTI) Ratio Calculator",
      description: "Calculate your DTI percentage relative to gross monthly earnings.",
      keywords: ["dti calculator", "debt to income ratio", "loan qualifying metric"]
    },
    formula: "\\text{DTI} = \\frac{\\text{Total Monthly Debts}}{\\text{Gross Monthly Income}} \\times 100",
    explanation: "A DTI of 36% or less is preferred by most lenders. Above 43% may disqualify you for qualified mortgages.",
    inputs: [
      { id: "grossIncome", label: "Gross Monthly Income ($)", type: "number", default: 6000 },
      { id: "rentMortgage", label: "Monthly Rent / Mortgage ($)", type: "number", default: 1800 },
      { id: "otherDebts", label: "Other Monthly Debts (Car, Cards, Loans) ($)", type: "number", default: 400 }
    ],
    outputs: [
      { id: "dti", label: "DTI Ratio (%)", type: "number", format: "decimal" },
      { id: "rating", label: "Evaluation", type: "text" }
    ],
    calculate: (inputs) => {
      const inc = parseFloat(inputs.grossIncome) || 1;
      const rent = parseFloat(inputs.rentMortgage) || 0;
      const debts = parseFloat(inputs.otherDebts) || 0;

      const dti = ((rent + debts) / inc) * 100;
      let rating = "Excellent (Under 36%)";
      if (dti > 43) rating = "Dangerous (Over 43% - Hard to qualify)";
      else if (dti > 36) rating = "Moderate (36% to 43%)";

      return {
        dti: parseFloat(dti.toFixed(2)),
        rating
      };
    }
  },
  {
    id: "real-estate-calculator",
    name: "Real Estate Calculator",
    category: "financial",
    description: "Evaluate property investment deals including capitalization rates, cash flow projections, and ROI metrics.",
    seo: {
      title: "Real Estate Investment Calculator - Cap Rate & Cash Flow",
      description: "Check cap rates and cash-on-cash returns of properties.",
      keywords: ["real estate calculator", "cap rate calculator", "cash flow rental", "property investment"]
    },
    formula: "\\text{Cap Rate} = \\frac{\\text{NOI}}{\\text{Purchase Price}} \\times 100",
    explanation: "Cap rate defines unleveraged return rate. Net Operating Income (NOI) represents revenues minus operational upkeep expenses.",
    inputs: [
      { id: "price", label: "Purchase Price ($)", type: "number", default: 250000 },
      { id: "rent", label: "Monthly Rental Income ($)", type: "number", default: 2000 },
      { id: "expenses", label: "Monthly Operating Expenses ($)", type: "number", default: 800 }
    ],
    outputs: [
      { id: "noi", label: "Annual Net Operating Income (NOI)", type: "number", format: "currency" },
      { id: "capRate", label: "Capitalization Rate (%)", type: "number", format: "decimal" },
      { id: "cashFlow", label: "Monthly Cash Flow", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.price) || 1;
      const rent = parseFloat(inputs.rent) || 0;
      const exp = parseFloat(inputs.expenses) || 0;

      const cashFlow = rent - exp;
      const noi = cashFlow * 12;
      const capRate = (noi / price) * 100;

      return {
        noi: parseFloat(noi.toFixed(2)),
        capRate: parseFloat(capRate.toFixed(2)),
        cashFlow: parseFloat(cashFlow.toFixed(2))
      };
    }
  },
  {
    id: "refinance-calculator",
    name: "Refinance Calculator",
    category: "financial",
    description: "Determine the financial benefits and break-even timeline of refinancing an existing mortgage.",
    seo: {
      title: "Mortgage Refinance Calculator - Break-Even Timeline",
      description: "Check refinance interest savings and close cost recovery schedules.",
      keywords: ["refinance calculator", "refi break even", "mortgage refinance savings"]
    },
    formula: "\\text{Break-Even} = \\frac{\\text{Closing Costs}}{\\text{Monthly Savings}}",
    explanation: "Refinancing incurs closing fees. The calculator determines how many months of interest savings are needed to recover those fees.",
    inputs: [
      { id: "currentPmt", label: "Current Monthly Payment ($)", type: "number", default: 2100 },
      { id: "newPmt", label: "New Monthly Payment ($)", type: "number", default: 1850 },
      { id: "closingCosts", label: "Total Closing Costs ($)", type: "number", default: 5000 }
    ],
    outputs: [
      { id: "monthlySavings", label: "Monthly Payment Savings", type: "number", format: "currency" },
      { id: "breakEven", label: "Break-Even Point (Months)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const cur = parseFloat(inputs.currentPmt) || 0;
      const nPmt = parseFloat(inputs.newPmt) || 0;
      const cost = parseFloat(inputs.closingCosts) || 0;

      const monthlySavings = cur - nPmt;
      const breakEven = monthlySavings > 0 ? cost / monthlySavings : Infinity;

      return {
        monthlySavings: parseFloat(monthlySavings.toFixed(2)),
        breakEven: parseFloat(isFinite(breakEven) ? breakEven.toFixed(1) : 0)
      };
    }
  },
  {
    id: "rental-property-calculator",
    name: "Rental Property Calculator",
    category: "financial",
    description: "Detailed analysis of rental property investments, including financing, income, expenses, and returns.",
    seo: {
      title: "Rental Property Calculator - Investment Analyzer",
      description: "Evaluate cash-on-cash return, ROI, and debt service coverage for rentals.",
      keywords: ["rental property calculator", "real estate rental ROI", "cash on cash return"]
    },
    formula: "\\text{Cash-on-Cash Return} = \\frac{\\text{Annual Cash Flow}}{\\text{Cash Invested}} \\times 100",
    explanation: "Rental property calculators help investors evaluate cash returns relative to direct cash investments.",
    inputs: [
      { id: "price", label: "Purchase Price ($)", type: "number", default: 200000 },
      { id: "down", label: "Down Payment ($)", type: "number", default: 40000 },
      { id: "monthlyRent", label: "Expected Monthly Rent ($)", type: "number", default: 1600 },
      { id: "mortgagePmt", label: "Monthly Mortgage Payment ($)", type: "number", default: 900 },
      { id: "expenses", label: "Monthly Upkeep, Taxes & Ins ($)", type: "number", default: 400 }
    ],
    outputs: [
      { id: "monthlyCashFlow", label: "Monthly Cash Flow", type: "number", format: "currency" },
      { id: "annualCashFlow", label: "Annual Cash Flow", type: "number", format: "currency" },
      { id: "cashOnCash", label: "Cash-on-Cash Return (%)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.price) || 1;
      const down = parseFloat(inputs.down) || 0;
      const rent = parseFloat(inputs.monthlyRent) || 0;
      const mort = parseFloat(inputs.mortgagePmt) || 0;
      const exp = parseFloat(inputs.expenses) || 0;

      const monthlyCashFlow = rent - mort - exp;
      const annualCashFlow = monthlyCashFlow * 12;
      const coc = down > 0 ? (annualCashFlow / down) * 100 : 0;

      return {
        monthlyCashFlow: parseFloat(monthlyCashFlow.toFixed(2)),
        annualCashFlow: parseFloat(annualCashFlow.toFixed(2)),
        cashOnCash: parseFloat(coc.toFixed(2))
      };
    }
  },
  {
    id: "apr-calculator",
    name: "APR Calculator",
    category: "financial",
    description: "Calculate the Annual Percentage Rate (APR) of a loan including fees and closing costs.",
    seo: {
      title: "APR Calculator - True Annual Percentage Rate Solver",
      description: "Determine the true annual cost of credit accounting for upfront fees.",
      keywords: ["apr calculator", "annual percentage rate", "interest rate vs apr"]
    },
    formula: "\\text{APR} = \\left( \\left( \\frac{\\text{Fees} + \\text{Interest}}{\\text{Principal}} \\right) / t \\right) \\times 365 \\times 100",
    explanation: "The APR reflects the true cost of borrowing, incorporating upfront lender fees and interest rate charges.",
    inputs: [
      { id: "amount", label: "Principal Loan Amount ($)", type: "number", default: 10000 },
      { id: "fees", label: "Upfront Fees ($)", type: "number", default: 400 },
      { id: "rate", label: "Nominal Interest Rate (%)", type: "number", default: 7 },
      { id: "termMonths", label: "Term (Months)", type: "number", default: 36 }
    ],
    outputs: [
      { id: "apr", label: "True Loan APR (%)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.amount) || 1;
      const fees = parseFloat(inputs.fees) || 0;
      const rate = parseFloat(inputs.rate) || 0;
      const months = parseFloat(inputs.termMonths) || 1;

      // Approximate APR: add fees to total interest, then run standard rate calculation
      const r = rate / 100 / 12;
      let pmt = r > 0 ? p * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1) : p / months;
      const totalInt = (pmt * months) - p;
      const totalCost = totalInt + fees;

      // Recalculate PMT with fees added to nominal principal
      const netPrincipal = p - fees;
      // We seek r_apr such that PMT is the same
      // Let's approximate:
      const totalCostAnnualRatio = (totalCost / p) / (months / 12);
      const aprVal = rate + (totalCostAnnualRatio * 10); // Standard approximation fallback

      // Linear search for exact IRR APR
      let targetPmt = pmt;
      let low = 0.0, high = 1.0;
      let resolvedApr = rate;
      for (let i = 0; i < 50; i++) {
        let mid = (low + high) / 2;
        let testPmt = mid > 0 ? netPrincipal * (mid * Math.pow(1 + mid, months)) / (Math.pow(1 + mid, months) - 1) : netPrincipal / months;
        if (testPmt > targetPmt) {
          high = mid;
        } else {
          low = mid;
        }
      }
      resolvedApr = low * 12 * 100;

      return {
        apr: parseFloat((isNaN(resolvedApr) ? aprVal : resolvedApr).toFixed(3))
      };
    }
  },
  {
    id: "fha-loan-calculator",
    name: "FHA Loan Calculator",
    category: "financial",
    description: "Calculate payments for FHA government home loans including upfront and annual MIP charges.",
    seo: {
      title: "FHA Loan Calculator - Payments and MIP Checker",
      description: "Estimate FHA mortgage expenses incorporating standard government MIP premiums.",
      keywords: ["fha loan calculator", "fha mip", "government home loan"]
    },
    formula: "\\text{FHA Standard MIP Rules}",
    explanation: "FHA loans require an Upfront Mortgage Insurance Premium (MIP) of 1.75% and an annual MIP (usually 0.85%) paid monthly.",
    inputs: [
      { id: "price", label: "Home Price ($)", type: "number", default: 250000 },
      { id: "down", label: "Down Payment ($ - Min 3.5%)", type: "number", default: 8750 },
      { id: "rate", label: "Interest Rate (%)", type: "number", default: 6.2 },
      { id: "term", label: "Term (Years)", type: "number", default: 30 }
    ],
    outputs: [
      { id: "monthlyPmt", label: "Total FHA Payment", type: "number", format: "currency" },
      { id: "upfrontMip", label: "Upfront FHA MIP Added to Loan", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.price) || 0;
      const down = parseFloat(inputs.down) || 0;
      const rate = parseFloat(inputs.rate) || 0;
      const term = parseFloat(inputs.term) || 30;

      const baseLoan = Math.max(0, price - down);
      const upfrontMip = baseLoan * 0.0175;
      const totalLoan = baseLoan + upfrontMip;

      const r = rate / 100 / 12;
      const n = term * 12;
      const pi = r > 0 ? totalLoan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : totalLoan / n;

      const monthlyMip = (totalLoan * 0.0085) / 12;

      return {
        monthlyPmt: parseFloat((pi + monthlyMip).toFixed(2)),
        upfrontMip: parseFloat(upfrontMip.toFixed(2))
      };
    }
  },
  {
    id: "va-mortgage-calculator",
    name: "VA Mortgage Calculator",
    category: "financial",
    description: "Calculate military VA home loan payments including VA funding fees.",
    seo: {
      title: "VA Mortgage Calculator - Military Home Loans",
      description: "Estimate payments on zero down payment VA mortgages.",
      keywords: ["va loan calculator", "va funding fee", "military home loan"]
    },
    formula: "\\text{VA Funding Fee Adjustment}",
    explanation: "VA loans do not require monthly mortgage insurance but charge an upfront funding fee (often 2.3% for first-time use with zero down).",
    inputs: [
      { id: "price", label: "Home Price ($)", type: "number", default: 300000 },
      { id: "down", label: "Down Payment ($ - Often 0)", type: "number", default: 0 },
      { id: "fundingFee", label: "VA Funding Fee (%)", type: "number", default: 2.3 },
      { id: "rate", label: "Interest Rate (%)", type: "number", default: 6.0 }
    ],
    outputs: [
      { id: "monthlyPmt", label: "Monthly Principal & Interest", type: "number", format: "currency" },
      { id: "totalLoan", label: "Total Loan with Funding Fee", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.price) || 0;
      const down = parseFloat(inputs.down) || 0;
      const feePct = parseFloat(inputs.fundingFee) || 0;
      const rate = parseFloat(inputs.rate) || 0;

      const baseLoan = Math.max(0, price - down);
      const fee = baseLoan * (feePct / 100);
      const totalLoan = baseLoan + fee;

      const r = rate / 100 / 12;
      const n = 360;
      const pi = r > 0 ? totalLoan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : totalLoan / n;

      return {
        monthlyPmt: parseFloat(pi.toFixed(2)),
        totalLoan: parseFloat(totalLoan.toFixed(2))
      };
    }
  },
  {
    id: "home-equity-loan-calculator",
    name: "Home Equity Loan Calculator",
    category: "financial",
    description: "Determine your maximum available home equity borrowing limit based on LTV bounds.",
    seo: {
      title: "Home Equity Loan Calculator - Estimate Borrowing Limit",
      description: "Check available equity cash outs based on home values and LTV rules.",
      keywords: ["home equity loan", "heloc calculator", "ltv calculator"]
    },
    formula: "\\text{Equity Limit} = (\\text{Value} \\times \\text{LTV Limit}) - \\text{Current Balance}",
    explanation: "Lenders typically cap combined loan-to-value (CLTV) ratios at 80% to 85% of the appraised home value.",
    inputs: [
      { id: "value", label: "Home Market Value ($)", type: "number", default: 500000 },
      { id: "mortgageBalance", label: "Current First Mortgage Balance ($)", type: "number", default: 300000 },
      { id: "ltvLimit", label: "Max LTV Limit (%)", type: "number", default: 80 }
    ],
    outputs: [
      { id: "maxEquity", label: "Maximum Available Home Equity", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.value) || 0;
      const bal = parseFloat(inputs.mortgageBalance) || 0;
      const ltv = parseFloat(inputs.ltvLimit) || 80;

      const limit = val * (ltv / 100);
      const avail = limit - bal;

      return { maxEquity: parseFloat(Math.max(0, avail).toFixed(2)) };
    }
  },
  {
    id: "heloc-calculator",
    name: "HELOC Calculator",
    category: "financial",
    description: "Estimate monthly interest-only payments during the draw period of a HELOC line of credit.",
    seo: {
      title: "HELOC Calculator - Estimate HELOC Line Payments",
      description: "Calculate draw period interest-only payments for lines of credit.",
      keywords: ["heloc calculator", "interest only payment", "equity credit line"]
    },
    formula: "\\text{Interest-Only Payment} = \\frac{\\text{Balance} \\times \\text{Rate}}{12}",
    explanation: "Home Equity Lines of Credit (HELOCs) often allow interest-only payments during a 5 to 10 year draw period.",
    inputs: [
      { id: "drawAmount", label: "Target HELOC Draw ($)", type: "number", default: 50000 },
      { id: "rate", label: "HELOC Variable Rate (%)", type: "number", default: 8.5 }
    ],
    outputs: [
      { id: "interestOnlyPmt", label: "Monthly Interest-Only Payment", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const draw = parseFloat(inputs.drawAmount) || 0;
      const rate = parseFloat(inputs.rate) || 0;

      const pmt = (draw * (rate / 100)) / 12;
      return { interestOnlyPmt: parseFloat(pmt.toFixed(2)) };
    }
  },
  {
    id: "down-payment-calculator",
    name: "Down Payment Calculator",
    category: "financial",
    description: "Calculate how much down payment you need based on target percentages, and how long to save for it.",
    seo: {
      title: "Down Payment Calculator - Savings Goal Planner",
      description: "Plan down payment goals and monthly savings timelines for buying property.",
      keywords: ["down payment", "home savings goal", "house downpayment"]
    },
    formula: "\\text{Target} = \\text{Price} \\times \\text{Percent}",
    explanation: "A standard down payment is 3% to 20% of the home price. Plan monthly targets to meet these milestones.",
    inputs: [
      { id: "price", label: "Target Home Price ($)", type: "number", default: 350000 },
      { id: "percent", label: "Target Down Payment (%)", type: "number", default: 10 },
      { id: "monthlySavings", label: "Monthly Savings Allocation ($)", type: "number", default: 1000 }
    ],
    outputs: [
      { id: "targetAmount", label: "Target Down Payment Goal", type: "number", format: "currency" },
      { id: "monthsNeeded", label: "Months Needed to Save", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.price) || 0;
      const pct = parseFloat(inputs.percent) || 0;
      const save = parseFloat(inputs.monthlySavings) || 1;

      const target = price * (pct / 100);
      const months = target / save;

      return {
        targetAmount: parseFloat(target.toFixed(2)),
        monthsNeeded: parseFloat(months.toFixed(1))
      };
    }
  },
  {
    id: "rent-vs-buy-calculator",
    name: "Rent vs. Buy Calculator",
    category: "financial",
    description: "Compare the total financial cost of renting vs buying a home over a specified time horizon.",
    seo: {
      title: "Rent vs. Buy Calculator - Compare Housing Costs",
      description: "Compare total cost of buying (with equity growth) vs rent over long terms.",
      keywords: ["rent vs buy", "buying vs renting", "home ownership cost"]
    },
    formula: "\\text{Housing Cost Comparisons over Time}",
    explanation: "Buying builds equity and incurs closing costs and taxes. Renting is flexible but builds no long-term assets.",
    inputs: [
      { id: "homePrice", label: "Home Price ($)", type: "number", default: 300000 },
      { id: "monthlyRent", label: "Monthly Rent Option ($)", type: "number", default: 1800 },
      { id: "years", label: "Comparison Horizon (Years)", type: "number", default: 7 }
    ],
    outputs: [
      { id: "buyCost", label: "Total Cost of Buying (Net of Equity)", type: "number", format: "currency" },
      { id: "rentCost", label: "Total Cost of Renting", type: "number", format: "currency" },
      { id: "verdict", label: "Financial Verdict", type: "text" }
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.homePrice) || 0;
      const rent = parseFloat(inputs.monthlyRent) || 0;
      const years = parseFloat(inputs.years) || 5;

      // Simple model:
      // Rent increases at 3% annually
      let totalRent = 0;
      let currentRent = rent;
      for (let y = 0; y < years; y++) {
        totalRent += currentRent * 12;
        currentRent *= 1.03;
      }

      // Buying:
      // Interest and payments: assume 30-year amortized mortgage on 80% loan
      const loan = price * 0.8;
      const r = 0.065 / 12;
      const n = 360;
      const pi = r > 0 ? loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loan / n;

      const totalPi = pi * 12 * years;
      const taxAndIns = price * 0.02 * years; // 2% annually for taxes/insurance/upkeep
      const totalBuyExpenses = totalPi + taxAndIns;

      // Equity built (approximation: 2.5% home price appreciation annually)
      const finalHomeValue = price * Math.pow(1.025, years);
      const equityGain = finalHomeValue - price;

      const netBuyCost = totalBuyExpenses - equityGain;

      let verdict = netBuyCost < totalRent ? "Buying is more financial sound." : "Renting is more financial sound.";

      return {
        buyCost: parseFloat(netBuyCost.toFixed(2)),
        rentCost: parseFloat(totalRent.toFixed(2)),
        verdict
      };
    }
  },
  {
    id: "auto-loan-calculator",
    name: "Auto Loan Calculator",
    category: "financial",
    description: "Calculate monthly payments and total interest for a car loan, including taxes and trade-ins.",
    seo: {
      title: "Auto Loan Calculator - Estimate Car Payments",
      description: "Estimate monthly auto loan payments incorporating trade-in values and dealer fees.",
      keywords: ["auto loan calculator", "car payment calculator", "auto finance"]
    },
    formula: "\\text{Amortized Auto Payment}",
    explanation: "Car loans typically range from 36 to 72 months. Shorter terms yield lower interest rates and faster equity accumulation.",
    inputs: [
      { id: "vehiclePrice", label: "Vehicle Price ($)", type: "number", default: 25000 },
      { id: "downPayment", label: "Down Payment ($)", type: "number", default: 3000 },
      { id: "tradeIn", label: "Trade-in Value ($)", type: "number", default: 2000 },
      { id: "termMonths", label: "Term (Months)", type: "number", default: 60 },
      { id: "rate", label: "Interest Rate (%)", type: "number", default: 5.8 }
    ],
    outputs: [
      { id: "monthlyPayment", label: "Monthly Payment", type: "number", format: "currency" },
      { id: "totalCost", label: "Total Cost of Loan", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.vehiclePrice) || 0;
      const down = parseFloat(inputs.downPayment) || 0;
      const trade = parseFloat(inputs.tradeIn) || 0;
      const term = parseFloat(inputs.termMonths) || 12;
      const rate = parseFloat(inputs.rate) || 0;

      const principal = Math.max(0, price - down - trade);
      const r = rate / 100 / 12;

      let pmt = 0;
      if (principal > 0 && term > 0) {
        pmt = r > 0 ? principal * (r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1) : principal / term;
      }

      return {
        monthlyPayment: parseFloat(pmt.toFixed(2)),
        totalCost: parseFloat((pmt * term).toFixed(2))
      };
    }
  },
  {
    id: "cash-back-or-low-interest-calculator",
    name: "Cash Back or Low Interest Calculator",
    category: "financial",
    description: "Compare taking auto manufacturer cash rebates vs low interest financing promotions.",
    seo: {
      title: "Cash Back vs. Low Interest - Car Loan Calculator",
      description: "Compare dealer rebate checks against special financing interest rates.",
      keywords: ["cash back vs low interest", "car dealer rebate", "auto financing rebate comparison"]
    },
    formula: "\\text{Loan Comparison of Rebates vs Rates}",
    explanation: "Dealer cash rebates lower your initial borrowing base, whereas promotional interest rates lower the cost of capital over the term.",
    inputs: [
      { id: "price", label: "Vehicle Price ($)", type: "number", default: 30000 },
      { id: "cashRebate", label: "Dealer Cash Back Rebate ($)", type: "number", default: 3000 },
      { id: "rebateRate", label: "Standard Rate (with Rebate) (%)", type: "number", default: 6.5 },
      { id: "promoRate", label: "Promotional Low Rate (no Rebate) (%)", type: "number", default: 1.9 },
      { id: "termMonths", label: "Term (Months)", type: "number", default: 60 }
    ],
    outputs: [
      { id: "rebatePmt", label: "Payment with Cash Back", type: "number", format: "currency" },
      { id: "promoPmt", label: "Payment with Promo Rate", type: "number", format: "currency" },
      { id: "savings", label: "Best Option Total Savings", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.price) || 0;
      const rebate = parseFloat(inputs.cashRebate) || 0;
      const stdRate = parseFloat(inputs.rebateRate) || 0;
      const lowRate = parseFloat(inputs.promoRate) || 0;
      const term = parseFloat(inputs.termMonths) || 12;

      // Option A: Take rebate
      const loanA = Math.max(0, price - rebate);
      const rA = stdRate / 100 / 12;
      const pmtA = rA > 0 ? loanA * (rA * Math.pow(1 + rA, term)) / (Math.pow(1 + rA, term) - 1) : loanA / term;
      const costA = pmtA * term;

      // Option B: Take low rate
      const loanB = price;
      const rB = lowRate / 100 / 12;
      const pmtB = rB > 0 ? loanB * (rB * Math.pow(1 + rB, term)) / (Math.pow(1 + rB, term) - 1) : loanB / term;
      const costB = pmtB * term;

      const diff = Math.abs(costA - costB);

      return {
        rebatePmt: parseFloat(pmtA.toFixed(2)),
        promoPmt: parseFloat(pmtB.toFixed(2)),
        savings: parseFloat(diff.toFixed(2))
      };
    }
  },
  {
    id: "auto-lease-calculator",
    name: "Auto Lease Calculator",
    category: "financial",
    description: "Determine monthly payments for auto leases including depreciation and finance money factors.",
    seo: {
      title: "Auto Lease Calculator - Estimate Monthly Leases",
      description: "Check lease pricing based on capitalized cost, residual percentages, and money factor rates.",
      keywords: ["auto lease calculator", "car lease payment", "money factor lease"]
    },
    formula: "\\text{Monthly Lease} = \\text{Depreciation Fee} + \\text{Finance Fee}",
    explanation: "A lease payment pays for the vehicle's depreciation plus interest (expressed as a money factor multiplier).",
    inputs: [
      { id: "msrp", label: "Vehicle MSRP / Cap Cost ($)", type: "number", default: 35000 },
      { id: "residual", label: "Residual Value (e.g. 60%) ($ or %)", type: "number", default: 21000 },
      { id: "moneyFactor", label: "Money Factor (e.g. 0.0025)", type: "number", default: 0.0025, step: "any" },
      { id: "termMonths", label: "Lease Term (Months)", type: "number", default: 36 }
    ],
    outputs: [
      { id: "monthlyLease", label: "Estimated Monthly Lease Payment", type: "number", format: "currency" },
      { id: "totalDepreciation", label: "Total Depreciation Cost", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const cap = parseFloat(inputs.msrp) || 0;
      let res = parseFloat(inputs.residual) || 0;
      const mf = parseFloat(inputs.moneyFactor) || 0;
      const term = parseFloat(inputs.termMonths) || 12;

      // Handle residual percentage
      if (res > 0 && res <= 100) {
        res = cap * (res / 100);
      }

      const totalDeprec = Math.max(0, cap - res);
      const monthlyDeprec = totalDeprec / term;
      const monthlyFinance = (cap + res) * mf;

      const totalLease = monthlyDeprec + monthlyFinance;

      return {
        monthlyLease: parseFloat(totalLease.toFixed(2)),
        totalDepreciation: parseFloat(totalDeprec.toFixed(2))
      };
    }
  },
  {
    id: "interest-calculator",
    name: "Interest Calculator",
    category: "financial",
    description: "Calculate simple or compound interest returns over time on basic principal deposits.",
    seo: {
      title: "Interest Calculator - Simple & Compound Returns",
      description: "Quickly solve simple and compounded growth interest returns.",
      keywords: ["interest calculator", "earn interest", "deposit yield calculator"]
    },
    formula: "A = P(1 + rt)",
    explanation: "Interest represents paid returns for the usage of capital over time, computed linearly or exponentially.",
    inputs: [
      { id: "principal", label: "Principal Capital ($)", type: "number", default: 5000 },
      { id: "rate", label: "Annual Interest Rate (%)", type: "number", default: 5 },
      { id: "years", label: "Time Horizon (Years)", type: "number", default: 3 }
    ],
    outputs: [
      { id: "simpleInterest", label: "Simple Interest Earned", type: "number", format: "currency" },
      { id: "compoundInterest", label: "Compound Interest Earned (Annual)", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.principal) || 0;
      const r = (parseFloat(inputs.rate) || 0) / 100;
      const t = parseFloat(inputs.years) || 1;

      const simple = p * r * t;
      const compound = p * Math.pow(1 + r, t) - p;

      return {
        simpleInterest: parseFloat(simple.toFixed(2)),
        compoundInterest: parseFloat(compound.toFixed(2))
      };
    }
  },
  {
    id: "investment-calculator",
    name: "Investment Calculator",
    category: "financial",
    description: "Model the future value of investments incorporating recurring contributions and interest rates.",
    seo: {
      title: "Investment Calculator - Forecast Growth of Capital",
      description: "Check the future growth value of portfolios over standard years periods.",
      keywords: ["investment calculator", "stock portfolio growth", "future savings value"]
    },
    formula: "\\text{Investment growth simulation}",
    explanation: "Consistent regular savings combined with average historical stock returns yields massive compounded portfolios.",
    inputs: [
      { id: "initial", label: "Starting Portfolio Value ($)", type: "number", default: 10000 },
      { id: "contribution", label: "Monthly Deposit ($)", type: "number", default: 500 },
      { id: "rate", label: "Expected Annual Return (%)", type: "number", default: 8 },
      { id: "years", label: "Horizon Period (Years)", type: "number", default: 20 }
    ],
    outputs: [
      { id: "finalValue", label: "Estimated Ending Value", type: "number", format: "currency" },
      { id: "contributionsTotal", label: "Total Cash Saved", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const start = parseFloat(inputs.initial) || 0;
      const dep = parseFloat(inputs.contribution) || 0;
      const rate = parseFloat(inputs.rate) || 0;
      const yrs = parseFloat(inputs.years) || 1;

      const r = rate / 100 / 12;
      const n = yrs * 12;

      let value = start;
      let totalDep = start;
      for (let i = 0; i < n; i++) {
        value += dep;
        totalDep += dep;
        value *= (1 + r);
      }

      return {
        finalValue: parseFloat(value.toFixed(2)),
        contributionsTotal: parseFloat(totalDep.toFixed(2))
      };
    }
  },
  {
    id: "finance-calculator",
    name: "Finance Calculator",
    category: "financial",
    description: "Solve Time Value of Money (TVM) formulas, calculating present values or investment payments.",
    seo: {
      title: "TVM Finance Calculator - Time Value of Money",
      description: "Solve TVM equations representing present and future cash value flows.",
      keywords: ["tvm calculator", "finance calculator", "present value of annuity"]
    },
    formula: "\\text{TVM Equation solver}",
    explanation: "Money has time utility. A dollar today is worth more than a dollar tomorrow due to standard interest potential.",
    inputs: [
      { id: "pv", label: "Present Value (PV) ($)", type: "number", default: -10000 },
      { id: "pmt", label: "Payment (PMT) ($)", type: "number", default: 200 },
      { id: "rate", label: "Rate (Nper Annual %) (%)", type: "number", default: 6 },
      { id: "nper", label: "Periods (Years)", type: "number", default: 10 }
    ],
    outputs: [
      { id: "fv", label: "Solved Future Value (FV)", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const pv = parseFloat(inputs.pv) || 0;
      const pmt = parseFloat(inputs.pmt) || 0;
      const rate = parseFloat(inputs.rate) || 0;
      const nper = parseFloat(inputs.nper) || 1;

      const r = rate / 100;
      // FV = -PV*(1+r)^n - PMT * (((1+r)^n - 1) / r)
      const compoundFactor = Math.pow(1 + r, nper);
      let annuityFactor = r > 0 ? (compoundFactor - 1) / r : nper;

      const fv = -pv * compoundFactor - pmt * annuityFactor;

      return { fv: parseFloat(fv.toFixed(2)) };
    }
  },
  {
    id: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    category: "financial",
    description: "Determine the future value of your investments using starting capital, interest compounding, and periodic contributions.",
    seo: {
      title: "Compound Interest Calculator - Future Value Growth",
      description: "Estimate final balances and interest accruals. Compare how starting capital and periodic deposits grow under various compounding schedules.",
      keywords: ["compound interest", "investment calculator", "future value calculator", "growth calculator"]
    },
    formula: "A = P(1 + \\frac{r}{n})^{nt} + PMT \\frac{(1 + \\frac{r}{n})^{nt} - 1}{\\frac{r}{n}} (1 + \\frac{r}{n})",
    explanation: "Compound interest is calculated on the initial principal as well as the accumulated interest from previous periods. Regular contributions significantly accelerate wealth growth.",
    inputs: [
      { id: "principal", label: "Initial Investment ($)", type: "number", default: 10000, min: 0 },
      { id: "monthlyDeposit", label: "Monthly Contribution ($)", type: "number", default: 200, min: 0 },
      { id: "interestRate", label: "Annual Interest Rate (%)", type: "number", default: 7.5, min: 0, step: "any" },
      { id: "years", label: "Horizon (Years)", type: "number", default: 20, min: 1 },
      {
        id: "compounding",
        label: "Compounding Interval",
        type: "select",
        default: "monthly",
        options: [
          { value: "annually", label: "Annually (1/yr)" },
          { value: "semiannually", label: "Semi-Annually (2/yr)" },
          { value: "quarterly", label: "Quarterly (4/yr)" },
          { value: "monthly", label: "Monthly (12/yr)" },
          { value: "daily", label: "Daily (365/yr)" }
        ]
      }
    ],
    outputs: [
      { id: "futureValue", label: "Future Balance", type: "number", format: "currency" },
      { id: "totalContributions", label: "Total Contributions", type: "number", format: "currency" },
      { id: "totalInterest", label: "Total Interest Earned", type: "number", format: "currency" },
      { id: "growthData", label: "Growth Schedule", type: "custom" }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.principal) || 0;
      const deposit = parseFloat(inputs.monthlyDeposit) || 0;
      const rAnnual = parseFloat(inputs.interestRate) || 0;
      const termYears = parseFloat(inputs.years) || 0;
      const compounding = inputs.compounding;

      let n = 12;
      if (compounding === "annually") n = 1;
      else if (compounding === "semiannually") n = 2;
      else if (compounding === "quarterly") n = 4;
      else if (compounding === "daily") n = 365;

      const rateCompounded = rAnnual / 100 / n;
      const totalPeriods = termYears * 12;

      let balance = p;
      let totalDeposited = p;
      const schedule = [{ year: 0, balance: p, principal: p, interest: 0 }];

      let interestEarnedAccum = 0;
      for (let m = 1; m <= totalPeriods; m++) {
        balance += deposit;
        totalDeposited += deposit;

        if (compounding === "monthly") {
          balance *= (1 + rateCompounded);
        } else if (compounding === "annually" && m % 12 === 0) {
          balance *= (1 + rateCompounded);
        } else if (compounding === "quarterly" && m % 3 === 0) {
          balance *= (1 + rateCompounded);
        } else if (compounding === "semiannually" && m % 6 === 0) {
          balance *= (1 + rateCompounded);
        } else if (compounding === "daily") {
          balance *= Math.pow(1 + rateCompounded, 365 / 12);
        }

        interestEarnedAccum = balance - totalDeposited;

        if (m % 12 === 0) {
          schedule.push({
            year: m / 12,
            balance: Math.round(balance),
            principal: Math.round(totalDeposited),
            interest: Math.round(interestEarnedAccum)
          });
        }
      }

      return {
        futureValue: parseFloat(balance.toFixed(2)),
        totalContributions: parseFloat(totalDeposited.toFixed(2)),
        totalInterest: parseFloat(interestEarnedAccum.toFixed(2)),
        growthData: schedule
      };
    }
  },
  {
    id: "interest-rate-calculator",
    name: "Interest Rate Calculator",
    category: "financial",
    description: "Determine the exact annual rate required to grow capital to a target amount over time.",
    seo: {
      title: "Interest Rate Calculator - Solve Required APY",
      description: "Find the compound growth rate needed to meet investment goals.",
      keywords: ["interest rate finder", "apy calculator", "compound rate solver"]
    },
    formula: "r = \\left( \\frac{A}{P} \\right)^{\\frac{1}{t}} - 1",
    explanation: "This formula solves for the compound interest rate needed to grow a principal sum to a target value.",
    inputs: [
      { id: "principal", label: "Starting Principal ($)", type: "number", default: 10000 },
      { id: "target", label: "Target Amount ($)", type: "number", default: 20000 },
      { id: "years", label: "Investment Term (Years)", type: "number", default: 10 }
    ],
    outputs: [
      { id: "rate", label: "Required Annual Rate (%)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.principal) || 1;
      const a = parseFloat(inputs.target) || 0;
      const t = parseFloat(inputs.years) || 1;

      const r = Math.pow(a / p, 1 / t) - 1;
      return { rate: parseFloat((r * 100).toFixed(2)) };
    }
  },
  {
    id: "savings-calculator",
    name: "Savings Calculator",
    category: "financial",
    description: "Determine the monthly savings required to accumulate a specific future target.",
    seo: {
      title: "Savings Calculator - Meet Financial Target Goals",
      description: "Calculate necessary monthly savings amounts based on target values.",
      keywords: ["savings calculator", "savings target", "monthly deposit goal"]
    },
    formula: "\\text{Payment} = \\text{FV} \\frac{r}{(1+r)^n - 1}",
    explanation: "Compounding interest reduces the monthly savings needed because interest earnings contribute to the goal.",
    inputs: [
      { id: "target", label: "Target Savings Goal ($)", type: "number", default: 50000 },
      { id: "interestRate", label: "Expected Interest Rate (%)", type: "number", default: 5 },
      { id: "years", label: "Timeframe (Years)", type: "number", default: 10 }
    ],
    outputs: [
      { id: "monthlyDeposit", label: "Required Monthly Deposit", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const fv = parseFloat(inputs.target) || 0;
      const rate = parseFloat(inputs.interestRate) || 0;
      const term = parseFloat(inputs.years) || 1;

      const r = rate / 100 / 12;
      const n = term * 12;

      let deposit = 0;
      if (fv > 0 && n > 0) {
        deposit = r > 0 ? fv * r / (Math.pow(1 + r, n) - 1) : fv / n;
      }
      return { monthlyDeposit: parseFloat(deposit.toFixed(2)) };
    }
  },
  {
    id: "simple-interest-calculator",
    name: "Simple Interest Calculator",
    category: "financial",
    description: "Calculate basic linear simple interest earnings using standard P-R-T equations.",
    seo: {
      title: "Simple Interest Calculator - Linear Return Solver",
      description: "Compute simple interest without compounding.",
      keywords: ["simple interest", "prt calculator", "interest calculator"]
    },
    formula: "I = P \\times r \\times t",
    explanation: "Simple interest is calculated solely on the original principal amount, with no compounding effects.",
    inputs: [
      { id: "principal", label: "Principal ($)", type: "number", default: 1000 },
      { id: "rate", label: "Annual Rate (%)", type: "number", default: 6 },
      { id: "years", label: "Time (Years)", type: "number", default: 5 }
    ],
    outputs: [
      { id: "interest", label: "Interest Earned", type: "number", format: "currency" },
      { id: "total", label: "Total Ending Balance", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.principal) || 0;
      const r = parseFloat(inputs.rate) || 0;
      const t = parseFloat(inputs.years) || 0;

      const interest = p * (r / 100) * t;
      const total = p + interest;

      return {
        interest: parseFloat(interest.toFixed(2)),
        total: parseFloat(total.toFixed(2))
      };
    }
  },
  {
    id: "cd-calculator",
    name: "CD Calculator",
    category: "financial",
    description: "Estimate Certificates of Deposit (CD) future values and APY earnings.",
    seo: {
      title: "CD Calculator - Certificate of Deposit Yield",
      description: "Check ending cash yields on banking CD certificates.",
      keywords: ["cd calculator", "certificate of deposit", "apy yield cd"]
    },
    formula: "A = P(1 + \\text{APY})^t",
    explanation: "A CD is a time deposit that offers a fixed interest rate in exchange for keeping money locked up for a set term.",
    inputs: [
      { id: "deposit", label: "Initial CD Deposit ($)", type: "number", default: 10000 },
      { id: "apy", label: "Annual Percentage Yield (APY) (%)", type: "number", default: 4.5 },
      { id: "termMonths", label: "Term Length (Months)", type: "number", default: 24 }
    ],
    outputs: [
      { id: "finalValue", label: "Ending CD Balance", type: "number", format: "currency" },
      { id: "interestEarned", label: "Interest Earned", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.deposit) || 0;
      const apy = parseFloat(inputs.apy) || 0;
      const m = parseFloat(inputs.termMonths) || 12;

      const t = m / 12;
      const final = p * Math.pow(1 + apy / 100, t);
      const interest = final - p;

      return {
        finalValue: parseFloat(final.toFixed(2)),
        interestEarned: parseFloat(interest.toFixed(2))
      };
    }
  },
  {
    id: "bond-calculator",
    name: "Bond Calculator",
    category: "financial",
    description: "Calculate bond values, coupon payments, and yield to maturity (YTM) rates.",
    seo: {
      title: "Bond Calculator - Yield to Maturity & Valuations",
      description: "Estimate bond prices and current yields.",
      keywords: ["bond calculator", "bond yield", "ytm calculator", "coupon bond price"]
    },
    formula: "\\text{Price} = \\sum \\frac{C}{(1+r)^t} + \\frac{F}{(1+r)^N}",
    explanation: "Bonds pay regular interest (coupons) and return the principal at maturity. Prices move inversely to market interest rates.",
    inputs: [
      { id: "faceValue", label: "Face Value (Par) ($)", type: "number", default: 1000 },
      { id: "couponRate", label: "Annual Coupon Rate (%)", type: "number", default: 5 },
      { id: "marketRate", label: "Required Yield (Discount Rate) (%)", type: "number", default: 6 },
      { id: "years", label: "Years to Maturity", type: "number", default: 10 }
    ],
    outputs: [
      { id: "bondPrice", label: "Bond Price", type: "number", format: "currency" },
      { id: "annualCoupon", label: "Annual Coupon Payment", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const f = parseFloat(inputs.faceValue) || 1000;
      const cr = (parseFloat(inputs.couponRate) || 0) / 100;
      const mr = (parseFloat(inputs.marketRate) || 0) / 100;
      const yrs = parseFloat(inputs.years) || 1;

      const coupon = f * cr;
      let price = 0;

      if (mr > 0) {
        for (let t = 1; t <= yrs; t++) {
          price += coupon / Math.pow(1 + mr, t);
        }
        price += f / Math.pow(1 + mr, yrs);
      } else {
        price = coupon * yrs + f;
      }

      return {
        bondPrice: parseFloat(price.toFixed(2)),
        annualCoupon: parseFloat(coupon.toFixed(2))
      };
    }
  },
  {
    id: "mutual-fund-calculator",
    name: "Mutual Fund Calculator",
    category: "financial",
    description: "Project future mutual fund investment values while subtracting expense ratios and fees.",
    seo: {
      title: "Mutual Fund Calculator - Estimate Net Growth",
      description: "Estimate portfolio returns after fees and expense deductions.",
      keywords: ["mutual fund", "expense ratio calculator", "portfolio growth fee"]
    },
    formula: "A = P(1 + r - f)^t",
    explanation: "Expense ratios represent annual mutual fund management fees, which reduce your compound growth over time.",
    inputs: [
      { id: "initial", label: "Initial Investment ($)", type: "number", default: 10000 },
      { id: "monthly", label: "Monthly Deposit ($)", type: "number", default: 300 },
      { id: "returnRate", label: "Expected Annual Return (%)", type: "number", default: 8 },
      { id: "expenseRatio", label: "Expense Ratio (%)", type: "number", default: 0.75 },
      { id: "years", label: "Horizon (Years)", type: "number", default: 20 }
    ],
    outputs: [
      { id: "valueWithFees", label: "Ending Value (with Fees)", type: "number", format: "currency" },
      { id: "valueWithoutFees", label: "Ending Value (no Fees)", type: "number", format: "currency" },
      { id: "feesPaid", label: "Total Cost of Fees", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.initial) || 0;
      const m = parseFloat(inputs.monthly) || 0;
      const ret = parseFloat(inputs.returnRate) || 0;
      const exp = parseFloat(inputs.expenseRatio) || 0;
      const yrs = parseFloat(inputs.years) || 1;

      const rNet = (ret - exp) / 100 / 12;
      const rGross = ret / 100 / 12;
      const periods = yrs * 12;

      let netVal = p;
      let grossVal = p;

      for (let i = 0; i < periods; i++) {
        netVal += m;
        netVal *= (1 + rNet);

        grossVal += m;
        grossVal *= (1 + rGross);
      }

      return {
        valueWithFees: parseFloat(netVal.toFixed(2)),
        valueWithoutFees: parseFloat(grossVal.toFixed(2)),
        feesPaid: parseFloat(Math.max(0, grossVal - netVal).toFixed(2))
      };
    }
  },
  {
    id: "average-return-calculator",
    name: "Average Return Calculator",
    category: "financial",
    description: "Calculate the arithmetic and geometric average returns of a series of annual returns.",
    seo: {
      title: "Average Return Calculator - Geometric & Arithmetic",
      description: "Compute averages on annual return listings.",
      keywords: ["average return", "geometric mean return", "investment averages"]
    },
    formula: "R_g = \\left( \\prod (1 + R_i) \\right)^{\\frac{1}{n}} - 1",
    explanation: "Geometric returns account for compounding effects, offering a more accurate measure of portfolio growth than simple arithmetic averages.",
    inputs: [
      { id: "returnsList", label: "Annual Returns (%, Comma Separated)", type: "text", default: "10, -5, 15, 20, -2" }
    ],
    outputs: [
      { id: "arithmeticAverage", label: "Arithmetic Average Return (%)", type: "number", format: "decimal" },
      { id: "geometricAverage", label: "Geometric Average Return (%)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const parts = (inputs.returnsList || "").split(",");
      const rates = parts.map(p => parseFloat(p.trim()) / 100).filter(n => !isNaN(n));

      if (rates.length === 0) {
        return { arithmeticAverage: 0, geometricAverage: 0 };
      }

      const sum = rates.reduce((a, b) => a + b, 0);
      const arith = (sum / rates.length) * 100;

      let geoProd = 1;
      rates.forEach(r => {
        geoProd *= (1 + r);
      });

      const geom = (Math.pow(Math.abs(geoProd), 1 / rates.length) * Math.sign(geoProd) - 1) * 100;

      return {
        arithmeticAverage: parseFloat(arith.toFixed(2)),
        geometricAverage: parseFloat(geom.toFixed(2))
      };
    }
  },
  {
    id: "irr-calculator",
    name: "IRR Calculator",
    category: "financial",
    description: "Calculate the Internal Rate of Return (IRR) for cash flows over time.",
    seo: {
      title: "IRR Calculator - Internal Rate of Return",
      description: "Find project IRR percentages based on series cash inputs.",
      keywords: ["irr calculator", "internal rate of return", "npv calculator", "capital budgeting"]
    },
    formula: "\\sum \\frac{C_t}{(1+\\text{IRR})^t} = 0",
    explanation: "IRR is the discount rate that makes the net present value (NPV) of all cash flows equal to zero.",
    inputs: [
      { id: "initialInvestment", label: "Initial Outlay ($)", type: "number", default: -10000 },
      { id: "cashFlows", label: "Cash Flows (Years 1-5, Comma Separated) ($)", type: "text", default: "3000, 3000, 3000, 3000, 3000" }
    ],
    outputs: [
      { id: "irr", label: "Internal Rate of Return (IRR) (%)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const init = parseFloat(inputs.initialInvestment) || -10000;
      const flows = (inputs.cashFlows || "").split(",").map(p => parseFloat(p.trim())).filter(n => !isNaN(n));

      const allFlows = [init, ...flows];
      
      // Solver for IRR using Newton's method
      let guess = 0.1;
      const maxIterations = 100;
      const precision = 1e-7;

      for (let i = 0; i < maxIterations; i++) {
        let npv = 0;
        let dNpv = 0; // derivative
        for (let t = 0; t < allFlows.length; t++) {
          npv += allFlows[t] / Math.pow(1 + guess, t);
          dNpv -= t * allFlows[t] / Math.pow(1 + guess, t + 1);
        }
        
        if (Math.abs(dNpv) < 1e-10) break;
        
        const nextGuess = guess - npv / dNpv;
        if (Math.abs(nextGuess - guess) < precision) {
          guess = nextGuess;
          break;
        }
        guess = nextGuess;
      }

      return { irr: parseFloat((guess * 100).toFixed(2)) };
    }
  },
  {
    id: "roi-calculator",
    name: "ROI Calculator",
    category: "financial",
    description: "Determine the Return on Investment (ROI) and annualized ROI for arbitrary assets.",
    seo: {
      title: "ROI Calculator - Return on Investment Tracker",
      description: "Solve basic percentage ROI and annualized growth yields.",
      keywords: ["roi calculator", "return on investment", "annualized ROI"]
    },
    formula: "\\text{ROI} = \\frac{\\text{Gain} - \\text{Investment}}{\\text{Investment}} \\times 100",
    explanation: "ROI measures the efficiency of an investment by comparing the gain relative to the initial cost.",
    inputs: [
      { id: "cost", label: "Amount Invested ($)", type: "number", default: 5000 },
      { id: "gain", label: "Ending Amount ($)", type: "number", default: 6500 },
      { id: "years", label: "Investment Duration (Years)", type: "number", default: 2 }
    ],
    outputs: [
      { id: "roi", label: "Total ROI (%)", type: "number", format: "decimal" },
      { id: "annualizedRoi", label: "Annualized ROI (%)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const cost = parseFloat(inputs.cost) || 1;
      const gain = parseFloat(inputs.gain) || 0;
      const yrs = parseFloat(inputs.years) || 1;

      const roi = ((gain - cost) / cost) * 100;
      const ann = (Math.pow(gain / cost, 1 / yrs) - 1) * 100;

      return {
        roi: parseFloat(roi.toFixed(2)),
        annualizedRoi: parseFloat(ann.toFixed(2))
      };
    }
  },
  {
    id: "payback-period-calculator",
    name: "Payback Period Calculator",
    category: "financial",
    description: "Determine how long it takes for an investment to recover its initial cost.",
    seo: {
      title: "Payback Period Calculator - Break-Even Target",
      description: "Find capital payback durations for business project financing.",
      keywords: ["payback period", "breakeven calculator", "capital budgeting"]
    },
    formula: "\\text{Payback} = \\frac{\\text{Initial Cost}}{\\text{Annual Cash Flow}}",
    explanation: "The payback period is the time required to recover the cost of an investment, ignoring the time value of money.",
    inputs: [
      { id: "cost", label: "Initial Project Cost ($)", type: "number", default: 25000 },
      { id: "annualRevenue", label: "Annual Net Cash Inflow ($)", type: "number", default: 6000 }
    ],
    outputs: [
      { id: "payback", label: "Payback Period (Years)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const cost = parseFloat(inputs.cost) || 0;
      const rev = parseFloat(inputs.annualRevenue) || 1;

      const payback = cost / rev;
      return { payback: parseFloat(payback.toFixed(2)) };
    }
  },
  {
    id: "present-value-calculator",
    name: "Present Value Calculator",
    category: "financial",
    description: "Calculate the present value (PV) of a future cash amount based on discount rates.",
    seo: {
      title: "Present Value Calculator - Discount Future Cash",
      description: "Discount future payouts back to today's cash values.",
      keywords: ["present value", "pv calculator", "discount rate calculator"]
    },
    formula: "\\text{PV} = \\frac{\\text{FV}}{(1+r)^n}",
    explanation: "Present Value calculates what a future sum of money is worth today, discounted by a specific rate of return.",
    inputs: [
      { id: "fv", label: "Future Value (FV) ($)", type: "number", default: 10000 },
      { id: "rate", label: "Annual Discount Rate (%)", type: "number", default: 6 },
      { id: "years", label: "Time Horizon (Years)", type: "number", default: 5 }
    ],
    outputs: [
      { id: "pv", label: "Present Value (PV)", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const fv = parseFloat(inputs.fv) || 0;
      const r = (parseFloat(inputs.rate) || 0) / 100;
      const t = parseFloat(inputs.years) || 1;

      const pv = fv / Math.pow(1 + r, t);
      return { pv: parseFloat(pv.toFixed(2)) };
    }
  },
  {
    id: "future-value-calculator",
    name: "Future Value Calculator",
    category: "financial",
    description: "Determine the future value (FV) of a present investment growing at a constant interest rate.",
    seo: {
      title: "Future Value Calculator - Compounded Sum Planner",
      description: "Estimate terminal value sheets on deposits held over terms.",
      keywords: ["future value", "fv solver", "compounded value"]
    },
    formula: "\\text{FV} = \\text{PV}(1+r)^n",
    explanation: "Future Value measures the nominal value of a current asset at a future date based on expected interest growth.",
    inputs: [
      { id: "pv", label: "Present Principal (PV) ($)", type: "number", default: 5000 },
      { id: "rate", label: "Annual Rate (%)", type: "number", default: 7 },
      { id: "years", label: "Duration (Years)", type: "number", default: 10 }
    ],
    outputs: [
      { id: "fv", label: "Future Value (FV)", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const pv = parseFloat(inputs.pv) || 0;
      const r = (parseFloat(inputs.rate) || 0) / 100;
      const t = parseFloat(inputs.years) || 1;

      const fv = pv * Math.pow(1 + r, t);
      return { fv: parseFloat(fv.toFixed(2)) };
    }
  },
  {
    id: "retirement-calculator",
    name: "Retirement Calculator",
    category: "financial",
    description: "Project your retirement nest egg and determine if your current savings rate will meet your target expenses.",
    seo: {
      title: "Retirement Savings Calculator - Nest Egg Planner",
      description: "Estimate if savings will cover post-work retirement monthly expenditures.",
      keywords: ["retirement calculator", "retire goal calculator", "nest egg planner"]
    },
    formula: "\\text{Nest Egg Compounding Simulation}",
    explanation: "Retirement planning estimates savings needed to replace pre-retirement income, assuming standard post-work drawdown rates.",
    inputs: [
      { id: "currentAge", label: "Current Age", type: "number", default: 30 },
      { id: "retireAge", label: "Target Retirement Age", type: "number", default: 65 },
      { id: "savings", label: "Current Savings ($)", type: "number", default: 50000 },
      { id: "monthlySave", label: "Monthly Savings Addition ($)", type: "number", default: 500 },
      { id: "returnRate", label: "Pre-Retirement Annual Return (%)", type: "number", default: 7 }
    ],
    outputs: [
      { id: "nestEgg", label: "Estimated Nest Egg at Retirement", type: "number", format: "currency" },
      { id: "annualIncome", label: "Sustainable Annual Draw (4% Rule)", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const curAge = parseFloat(inputs.currentAge) || 30;
      const retAge = parseFloat(inputs.retireAge) || 65;
      const start = parseFloat(inputs.savings) || 0;
      const monthly = parseFloat(inputs.monthlySave) || 0;
      const rate = parseFloat(inputs.returnRate) || 0;

      const years = Math.max(0, retAge - curAge);
      const r = rate / 100 / 12;
      const periods = years * 12;

      let value = start;
      for (let i = 0; i < periods; i++) {
        value += monthly;
        value *= (1 + r);
      }

      // 4% Rule drawdown estimation
      const draw = value * 0.04;

      return {
        nestEgg: parseFloat(value.toFixed(2)),
        annualIncome: parseFloat(draw.toFixed(2))
      };
    }
  },
  {
    id: "401k-calculator",
    name: "401K Calculator",
    category: "financial",
    description: "Estimate the growth of your 401(k) retirement account, incorporating employer match contributions.",
    seo: {
      title: "401k Growth Calculator - Employer Matching Solver",
      description: "Estimate terminal balances incorporating salary employer matches.",
      keywords: ["401k calculator", "employer match 401k", "retirement savings"]
    },
    formula: "\\text{401k growth model}",
    explanation: "A 401(k) allows pre-tax contributions. Employer matching provides immediate, risk-free returns on matching tiers.",
    inputs: [
      { id: "salary", label: "Annual Salary ($)", type: "number", default: 75000 },
      { id: "contribution", label: "Your Contribution (%)", type: "number", default: 6 },
      { id: "matchLimit", label: "Employer Match Max (%)", type: "number", default: 3 },
      { id: "currentBalance", label: "Current Balance ($)", type: "number", default: 20000 },
      { id: "years", label: "Years to Grow", type: "number", default: 25 },
      { id: "growthRate", label: "Annual Return (%)", type: "number", default: 7.5 }
    ],
    outputs: [
      { id: "finalBalance", label: "Estimated 401(k) Balance", type: "number", format: "currency" },
      { id: "employerMatches", label: "Accumulated Employer Matches", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const sal = parseFloat(inputs.salary) || 0;
      const contrib = parseFloat(inputs.contribution) || 0;
      const matchLim = parseFloat(inputs.matchLimit) || 0;
      const start = parseFloat(inputs.currentBalance) || 0;
      const yrs = parseFloat(inputs.years) || 1;
      const rate = parseFloat(inputs.growthRate) || 0;

      const monthlySalary = sal / 12;
      const userMonthly = monthlySalary * (contrib / 100);
      const matchMonthly = monthlySalary * (Math.min(contrib, matchLim) / 100);

      const r = rate / 100 / 12;
      const periods = yrs * 12;

      let bal = start;
      let totalMatch = 0;
      for (let i = 0; i < periods; i++) {
        bal += userMonthly + matchMonthly;
        totalMatch += matchMonthly;
        bal *= (1 + r);
      }

      return {
        finalBalance: parseFloat(bal.toFixed(2)),
        employerMatches: parseFloat(totalMatch.toFixed(2))
      };
    }
  },
  {
    id: "pension-calculator",
    name: "Pension Calculator",
    category: "financial",
    description: "Estimate defined pension benefits based on service tenure and salary metrics.",
    seo: {
      title: "Pension Benefit Calculator - Defined Retirement Payouts",
      description: "Estimate yearly pension yields based on work tenure formulas.",
      keywords: ["pension calculator", "defined benefit pension", "retirement pension"]
    },
    formula: "\\text{Benefit} = \\text{Years} \\times \\text{Multiplier} \\times \\text{Final Salary}",
    explanation: "Defined benefit pension plans pay monthly retirement sums based on employee work tenure and career earnings averages.",
    inputs: [
      { id: "serviceYears", label: "Years of Service", type: "number", default: 25 },
      { id: "multiplier", label: "Pension Multiplier (%)", type: "number", default: 2 },
      { id: "salary", label: "Average Career/Final Salary ($)", type: "number", default: 80000 }
    ],
    outputs: [
      { id: "annualPayout", label: "Estimated Annual Pension Payout", type: "number", format: "currency" },
      { id: "monthlyPayout", label: "Monthly Pension Payment", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const yrs = parseFloat(inputs.serviceYears) || 0;
      const mult = (parseFloat(inputs.multiplier) || 2) / 100;
      const sal = parseFloat(inputs.salary) || 0;

      const annual = yrs * mult * sal;
      return {
        annualPayout: parseFloat(annual.toFixed(2)),
        monthlyPayout: parseFloat((annual / 12).toFixed(2))
      };
    }
  },
  {
    id: "social-security-calculator",
    name: "Social Security Calculator",
    category: "financial",
    description: "Estimate Social Security retirement benefits based on birth year and historical average earnings.",
    seo: {
      title: "Social Security Benefits Calculator",
      description: "Project monthly Social Security retirement benefits.",
      keywords: ["social security", "retirement benefit calculator", "ssa estimator"]
    },
    formula: "\\text{SSA primary insurance formula (approximate)}",
    explanation: "Social Security benefits are computed from your highest 35 years of earnings, adjusted for inflation.",
    inputs: [
      { id: "birthYear", label: "Year of Birth", type: "number", default: 1980 },
      { id: "earnings", label: "Current Annual Income ($)", type: "number", default: 70000 },
      {
        id: "claimAge",
        label: "Target Claiming Age",
        type: "select",
        default: "67",
        options: [
          { value: "62", label: "Age 62 (Early - Reduced)" },
          { value: "67", label: "Age 67 (Full Retirement)" },
          { value: "70", label: "Age 70 (Delayed - Maximum)" }
        ]
      }
    ],
    outputs: [
      { id: "monthlyBenefit", label: "Estimated Monthly Benefit", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const salary = parseFloat(inputs.earnings) || 0;
      const age = inputs.claimAge;

      // SSA approximation base:
      // AIME (Average Indexed Monthly Earnings) is roughly salary / 12 (capped at standard ceiling)
      const aime = Math.min(salary / 12, 13000); 
      
      // Bend points calculations for PIA (Primary Insurance Amount)
      // 90% of first $1115, 32% of amount between $1115 and $6721, 15% of amount over $6721
      let pia = 0;
      if (aime <= 1115) {
        pia = aime * 0.9;
      } else if (aime <= 6721) {
        pia = (1115 * 0.9) + (aime - 1115) * 0.32;
      } else {
        pia = (1115 * 0.9) + (6721 - 1115) * 0.32 + (aime - 6721) * 0.15;
      }

      // Early / Late claiming adjustments
      let benefit = pia;
      if (age === "62") benefit *= 0.70; // 30% reduction
      else if (age === "70") benefit *= 1.24; // 24% increase

      return { monthlyBenefit: parseFloat(benefit.toFixed(2)) };
    }
  },
  {
    id: "annuity-calculator",
    name: "Annuity Calculator",
    category: "financial",
    description: "Calculate the future value of an annuity with regular premium deposits.",
    seo: {
      title: "Annuity Calculator - Future Value of Payouts",
      description: "Estimate terminal values of ordinary and due annuity funds.",
      keywords: ["annuity calculator", "future value annuity", "fixed annuity growth"]
    },
    formula: "FV = PMT \\frac{(1+r)^n - 1}{r}",
    explanation: "An annuity represents a sequence of equal periodic payments made over a specified term.",
    inputs: [
      { id: "payment", label: "Periodic Payment ($)", type: "number", default: 1000 },
      { id: "rate", label: "Annual Return Rate (%)", type: "number", default: 6 },
      { id: "years", label: "Annuity Duration (Years)", type: "number", default: 15 },
      {
        id: "type",
        label: "Annuity Type",
        type: "select",
        default: "ordinary",
        options: [
          { value: "ordinary", label: "Ordinary (End of Period)" },
          { value: "due", label: "Annuity Due (Start of Period)" }
        ]
      }
    ],
    outputs: [
      { id: "futureValue", label: "Annuity Future Value", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const pmt = parseFloat(inputs.payment) || 0;
      const rate = parseFloat(inputs.rate) || 0;
      const yrs = parseFloat(inputs.years) || 1;
      const type = inputs.type;

      const r = rate / 100;
      let fv = r > 0 ? pmt * (Math.pow(1 + r, yrs) - 1) / r : pmt * yrs;

      if (type === "due" && r > 0) {
        fv *= (1 + r);
      }

      return { futureValue: parseFloat(fv.toFixed(2)) };
    }
  },
  {
    id: "annuity-payout-calculator",
    name: "Annuity Payout Calculator",
    category: "financial",
    description: "Determine how long your retirement savings will last under regular withdrawal schedules.",
    seo: {
      title: "Annuity Payout Calculator - Fund Drawdown Planner",
      description: "Find how long savings balances sustain periodic withdrawals.",
      keywords: ["annuity payout", "capital drawdown", "retire withdrawal term"]
    },
    formula: "\\text{Capital drawdown math}",
    explanation: "Annuity payouts liquidate principal alongside earning interest, establishing a finite lifespan for the funds.",
    inputs: [
      { id: "principal", label: "Annuity Principal ($)", type: "number", default: 200000 },
      { id: "monthlyPayout", label: "Desired Monthly Payout ($)", type: "number", default: 1500 },
      { id: "rate", label: "Expected Annual Yield (%)", type: "number", default: 5 }
    ],
    outputs: [
      { id: "monthsLast", label: "Duration Supported (Months)", type: "number" },
      { id: "yearsLast", label: "Duration Supported (Years)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.principal) || 0;
      const pay = parseFloat(inputs.monthlyPayout) || 1;
      const rate = parseFloat(inputs.rate) || 0;

      const r = rate / 100 / 12;

      let balance = p;
      let months = 0;
      while (balance > 0 && months < 1200) {
        const interest = balance * r;
        balance = balance + interest - pay;
        if (balance + interest <= 0) {
          break;
        }
        months++;
      }

      return {
        monthsLast: months,
        yearsLast: parseFloat((months / 12).toFixed(1))
      };
    }
  },
  {
    id: "roth-ira-calculator",
    name: "Roth IRA Calculator",
    category: "financial",
    description: "Project your Roth IRA growth, showing tax-free retirement withdrawal benefits.",
    seo: {
      title: "Roth IRA Growth Calculator - Tax-Free Payouts",
      description: "Estimate Roth IRA growth. Plan tax-free wealth accumulation limits.",
      keywords: ["roth ira calculator", "tax free retirement", "ira growth"]
    },
    formula: "\\text{Compounded tax-free growth}",
    explanation: "Roth IRAs use post-tax contributions, meaning all interest growth and retirement withdrawals are 100% tax-free.",
    inputs: [
      { id: "age", label: "Current Age", type: "number", default: 25 },
      { id: "retireAge", label: "Target Retirement Age", type: "number", default: 65 },
      { id: "monthly", label: "Monthly Contribution ($ - Max $583/mo)", type: "number", default: 400 },
      { id: "rate", label: "Annual Rate of Return (%)", type: "number", default: 8 }
    ],
    outputs: [
      { id: "finalBalance", label: "Estimated Roth IRA Nest Egg", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const age = parseFloat(inputs.age) || 25;
      const retAge = parseFloat(inputs.retireAge) || 65;
      const monthly = parseFloat(inputs.monthly) || 0;
      const rate = parseFloat(inputs.rate) || 0;

      const yrs = Math.max(0, retAge - age);
      const r = rate / 100 / 12;
      const periods = yrs * 12;

      let value = 0;
      for (let i = 0; i < periods; i++) {
        value += monthly;
        value *= (1 + r);
      }

      return { finalBalance: parseFloat(value.toFixed(2)) };
    }
  },
  {
    id: "ira-calculator",
    name: "IRA Calculator",
    category: "financial",
    description: "Project traditional pre-tax IRA retirement growth and estimate upfront tax deduction savings.",
    seo: {
      title: "Traditional IRA Calculator - Pre-Tax Growth Planner",
      description: "Estimate traditional IRA value sheets based on pre-tax savings.",
      keywords: ["traditional ira", "ira growth calculator", "tax deduction savings"]
    },
    formula: "\\text{Pre-tax compound growth}",
    explanation: "Traditional IRAs allow tax-deductible contributions. Withdrawals are taxed as regular income during retirement.",
    inputs: [
      { id: "age", label: "Current Age", type: "number", default: 25 },
      { id: "retireAge", label: "Retirement Age", type: "number", default: 65 },
      { id: "monthly", label: "Monthly Contribution ($)", type: "number", default: 450 },
      { id: "taxRate", label: "Current Tax Bracket (%)", type: "number", default: 22 },
      { id: "rate", label: "Annual Return (%)", type: "number", default: 7.5 }
    ],
    outputs: [
      { id: "finalBalance", label: "Traditional IRA Balance", type: "number", format: "currency" },
      { id: "taxSavings", label: "Total Tax Deductions Saved", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const age = parseFloat(inputs.age) || 25;
      const ret = parseFloat(inputs.retireAge) || 65;
      const monthly = parseFloat(inputs.monthly) || 0;
      const tax = parseFloat(inputs.taxRate) || 0;
      const rate = parseFloat(inputs.rate) || 0;

      const yrs = Math.max(0, ret - age);
      const r = rate / 100 / 12;
      const periods = yrs * 12;

      let value = 0;
      let savings = 0;
      for (let i = 0; i < periods; i++) {
        value += monthly;
        value *= (1 + r);
        savings += monthly * (tax / 100);
      }

      return {
        finalBalance: parseFloat(value.toFixed(2)),
        taxSavings: parseFloat(savings.toFixed(2))
      };
    }
  },
  {
    id: "rmd-calculator",
    name: "RMD Calculator",
    category: "financial",
    description: "Determine your IRS Required Minimum Distribution (RMD) based on account balances and age thresholds.",
    seo: {
      title: "RMD Calculator - IRS Required Minimum Distributions",
      description: "Find traditional IRA RMD limits using the IRS Uniform Lifetime Table.",
      keywords: ["rmd calculator", "required minimum distribution", "irs rmd table"]
    },
    formula: "\\text{RMD} = \\frac{\\text{Account Balance}}{\\text{Distribution Period Factor}}",
    explanation: "The IRS requires traditional IRA and 401(k) owners to withdraw minimum amounts annually starting at age 73.",
    inputs: [
      { id: "balance", label: "Traditional IRA / 401(k) Balance ($)", type: "number", default: 500000 },
      { id: "age", label: "Your Age (Must be 73+)", type: "number", default: 75 }
    ],
    outputs: [
      { id: "rmd", label: "This Year's RMD Amount", type: "number", format: "currency" },
      { id: "factor", label: "IRS Distribution Factor", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const bal = parseFloat(inputs.balance) || 0;
      const age = parseInt(inputs.age) || 73;

      // Approximate IRS Uniform Lifetime Table factors:
      // Age 73: 26.5, Age 74: 25.5, Age 75: 24.6, Age 80: 20.2, Age 85: 16.0, Age 90: 12.2
      let factor = 26.5;
      if (age >= 90) factor = 12.2;
      else if (age >= 85) factor = 16.0;
      else if (age >= 80) factor = 20.2;
      else if (age >= 75) factor = 24.6;
      else if (age >= 74) factor = 25.5;

      const rmd = bal / factor;

      return {
        rmd: parseFloat((age < 73 ? 0 : rmd).toFixed(2)),
        factor
      };
    }
  },
  {
    id: "income-tax-calculator",
    name: "Income Tax Calculator",
    category: "financial",
    description: "Estimate your federal progressive income tax liabilities and net take-home earnings.",
    seo: {
      title: "US Income Tax Calculator - Estimate IRS bracket taxes",
      description: "Estimate federal income tax obligations using progressive bracket rates.",
      keywords: ["income tax", "federal tax brackets", "take home pay"]
    },
    formula: "\\text{Progressive Bracket Tax Calculations}",
    explanation: "Federal taxes use a progressive bracket system where higher earnings are taxed at progressively higher rates.",
    inputs: [
      { id: "grossSalary", label: "Gross Annual Income ($)", type: "number", default: 85000 },
      {
        id: "filingStatus",
        label: "Filing Status",
        type: "select",
        default: "single",
        options: [
          { value: "single", label: "Single Filer" },
          { value: "married", label: "Married Jointly Filer" }
        ]
      }
    ],
    outputs: [
      { id: "taxAmount", label: "Estimated Federal Income Tax", type: "number", format: "currency" },
      { id: "effectiveRate", label: "Effective Tax Rate (%)", type: "number", format: "decimal" },
      { id: "netIncome", label: "Net Post-Tax Income", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const sal = parseFloat(inputs.grossSalary) || 0;
      const status = inputs.filingStatus;

      // Single standard deduction (approximate: $14,600)
      // Married jointly standard deduction (approximate: $29,200)
      const deduction = status === "single" ? 14600 : 29200;
      const taxable = Math.max(0, sal - deduction);

      // Simplistic brackets (2024 approximation)
      // Single: 10% up to $11,600, 12% to $47,150, 22% to $100,525, 24% over
      const brackets = status === "single" 
        ? [
            { limit: 11600, rate: 0.10 },
            { limit: 47150, rate: 0.12 },
            { limit: 100525, rate: 0.22 },
            { limit: Infinity, rate: 0.24 }
          ]
        : [
            { limit: 23200, rate: 0.10 },
            { limit: 94300, rate: 0.12 },
            { limit: 201050, rate: 0.22 },
            { limit: Infinity, rate: 0.24 }
          ];

      let tax = 0;
      let remaining = taxable;
      let prevLimit = 0;

      for (let i = 0; i < brackets.length; i++) {
        const limit = brackets[i].limit;
        const rate = brackets[i].rate;
        const span = limit - prevLimit;

        if (remaining > span) {
          tax += span * rate;
          remaining -= span;
        } else {
          tax += remaining * rate;
          remaining = 0;
          break;
        }
        prevLimit = limit;
      }

      const eff = sal > 0 ? (tax / sal) * 100 : 0;

      return {
        taxAmount: parseFloat(tax.toFixed(2)),
        effectiveRate: parseFloat(eff.toFixed(2)),
        netIncome: parseFloat((sal - tax).toFixed(2))
      };
    }
  },
  {
    id: "salary-calculator",
    name: "Salary Calculator",
    category: "financial",
    description: "Convert hourly pay wages to weekly, bi-weekly, monthly, and annual salaries.",
    seo: {
      title: "Salary Calculator - Convert Hourly Wages",
      description: "Convert wage structures. Find equivalent annual salary from hourly pay metrics.",
      keywords: ["salary converter", "hourly to salary", "wages calculator"]
    },
    formula: "\\text{Annual Salary} = \\text{Hourly Rate} \\times \\text{Hours/Week} \\times 52",
    explanation: "Assuming standard work weeks, annual salary equals hourly rates multiplied by weekly hours over 52 weeks.",
    inputs: [
      { id: "hourlyRate", label: "Hourly Pay Rate ($)", type: "number", default: 25 },
      { id: "hoursPerWeek", label: "Hours Worked Per Week", type: "number", default: 40 }
    ],
    outputs: [
      { id: "annual", label: "Annual Equivalent Salary", type: "number", format: "currency" },
      { id: "monthly", label: "Monthly Gross Equivalent", type: "number", format: "currency" },
      { id: "weekly", label: "Weekly Gross Pay", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const rate = parseFloat(inputs.hourlyRate) || 0;
      const hrs = parseFloat(inputs.hoursPerWeek) || 40;

      const weekly = rate * hrs;
      const annual = weekly * 52;
      const monthly = annual / 12;

      return {
        annual: parseFloat(annual.toFixed(2)),
        monthly: parseFloat(monthly.toFixed(2)),
        weekly: parseFloat(weekly.toFixed(2))
      };
    }
  },
  {
    id: "marriage-tax-calculator",
    name: "Marriage Tax Calculator",
    category: "financial",
    description: "Determine if filing jointly with a spouse results in a marriage tax penalty or bonus.",
    seo: {
      title: "Marriage Tax Penalty & Bonus Calculator",
      description: "Compare filing taxes jointly vs filing single returns.",
      keywords: ["marriage tax", "joint filing tax bonus", "marriage penalty"]
    },
    formula: "\\text{Joint Filing Tax Comparison}",
    explanation: "The marriage bonus or penalty occurs when a couple's combined tax liability is lower or higher filed jointly than separately.",
    inputs: [
      { id: "spouse1Income", label: "Spouse 1 Gross Income ($)", type: "number", default: 60000 },
      { id: "spouse2Income", label: "Spouse 2 Gross Income ($)", type: "number", default: 45000 }
    ],
    outputs: [
      { id: "jointTax", label: "Tax Filed Jointly", type: "number", format: "currency" },
      { id: "separateTaxSum", label: "Combined Separate Taxes", type: "number", format: "currency" },
      { id: "difference", label: "Marriage Penalty / (Bonus)", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const s1 = parseFloat(inputs.spouse1Income) || 0;
      const s2 = parseFloat(inputs.spouse2Income) || 0;

      // Simple 15% flat tax estimation for separate vs joint bracket mapping
      const taxSingle = (income) => {
        const taxable = Math.max(0, income - 14600);
        return taxable * 0.15;
      };
      
      const taxJoint = (income) => {
        const taxable = Math.max(0, income - 29200);
        return taxable * 0.15;
      };

      const t1 = taxSingle(s1);
      const t2 = taxSingle(s2);
      const joint = taxJoint(s1 + s2);
      const diff = joint - (t1 + t2);

      return {
        jointTax: parseFloat(joint.toFixed(2)),
        separateTaxSum: parseFloat((t1 + t2).toFixed(2)),
        difference: parseFloat(diff.toFixed(2))
      };
    }
  },
  {
    id: "estate-tax-calculator",
    name: "Estate Tax Calculator",
    category: "financial",
    description: "Estimate estate tax obligations on asset transfers exceeding threshold exclusions.",
    seo: {
      title: "Estate Tax Calculator - Inheritance Asset Taxes",
      description: "Find tax limits on inherited estates.",
      keywords: ["estate tax", "inheritance tax", "death tax calculator"]
    },
    formula: "\\text{Estate Tax} = (\\text{Value} - \\text{Exclusion}) \\times 0.40",
    explanation: "Federal estate tax applies to the transfer of property at death, subject to significant lifetime exclusion limits (e.g. $13.6M).",
    inputs: [
      { id: "estateValue", label: "Total Gross Estate Assets ($)", type: "number", default: 15000000 },
      { id: "exclusion", label: "Exclusion Threshold ($)", type: "number", default: 13610000 }
    ],
    outputs: [
      { id: "taxableValue", label: "Taxable Estate Value", type: "number", format: "currency" },
      { id: "estimatedTax", label: "Estimated Federal Estate Tax (40%)", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.estateValue) || 0;
      const excl = parseFloat(inputs.exclusion) || 13610000;

      const taxable = Math.max(0, val - excl);
      const tax = taxable * 0.40;

      return {
        taxableValue: parseFloat(taxable.toFixed(2)),
        estimatedTax: parseFloat(tax.toFixed(2))
      };
    }
  },
  {
    id: "take-home-paycheck-calculator",
    name: "Take-Home-Paycheck Calculator",
    category: "financial",
    description: "Determine your net take-home salary paycheck after FICA and tax withholdings.",
    seo: {
      title: "Net Take-Home Paycheck Calculator",
      description: "Check FICA tax and standard withholding payouts on paychecks.",
      keywords: ["paycheck calculator", "take home pay", "tax withholdings"]
    },
    formula: "\\text{Net} = \\text{Gross} - \\text{Taxes} - \\text{FICA}",
    explanation: "FICA deductions consist of 6.2% Social Security and 1.45% Medicare taxes withheld from employee earnings.",
    inputs: [
      { id: "salary", label: "Annual Gross Salary ($)", type: "number", default: 65000 },
      { id: "withholdingRate", label: "Income Tax Withholding (%)", type: "number", default: 12 }
    ],
    outputs: [
      { id: "annualNet", label: "Annual Net Pay", type: "number", format: "currency" },
      { id: "biweeklyNet", label: "Bi-Weekly Net Check (26/yr)", type: "number", format: "currency" },
      { id: "monthlyNet", label: "Monthly Net Check (12/yr)", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const sal = parseFloat(inputs.salary) || 0;
      const withh = parseFloat(inputs.withholdingRate) || 0;

      const fica = sal * 0.0765; // FICA 7.65%
      const incomeTax = sal * (withh / 100);
      const net = Math.max(0, sal - fica - incomeTax);

      return {
        annualNet: parseFloat(net.toFixed(2)),
        biweeklyNet: parseFloat((net / 26).toFixed(2)),
        monthlyNet: parseFloat((net / 12).toFixed(2))
      };
    }
  },
  {
    id: "loan-calculator",
    name: "Loan Calculator",
    category: "financial",
    description: "Determine your monthly payment, interest expense, and view a complete amortization schedule for standard loans.",
    seo: {
      title: "Loan Calculator - Payments & Amortization Schedule",
      description: "Estimate monthly personal or auto loan payments. View dynamic amortization tables showing compound schedules.",
      keywords: ["loan calculator", "monthly loan payment", "amortization table", "personal loan calculator"]
    },
    formula: "\\text{Payment} = P \\times \\frac{r(1+r)^n}{(1+r)^n - 1}",
    explanation: "This calculator determines the monthly payment required to fully pay off a loan principal by the end of its term, utilizing compound interest rates.",
    inputs: [
      { id: "amount", label: "Loan Amount ($)", type: "number", default: 20000, min: 0 },
      { id: "termYears", label: "Term (Years)", type: "number", default: 5, min: 1 },
      { id: "interestRate", label: "Interest Rate (Annual %)", type: "number", default: 6.5, min: 0, step: "any" }
    ],
    outputs: [
      { id: "monthlyPayment", label: "Monthly Payment", type: "number", format: "currency" },
      { id: "totalInterest", label: "Total Interest Paid", type: "number", format: "currency" },
      { id: "totalPayments", label: "Total Cost of Loan", type: "number", format: "currency" },
      { id: "amortizationData", label: "Amortization Table Data", type: "custom" }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.amount) || 0;
      const termYears = parseFloat(inputs.termYears) || 0;
      const rateAnnual = parseFloat(inputs.interestRate) || 0;

      const n = termYears * 12;
      const r = rateAnnual / 100 / 12;

      let monthlyPayment = 0;
      let totalInterest = 0;
      let totalPayments = 0;
      const schedule = [];

      if (p > 0 && n > 0) {
        if (r > 0) {
          monthlyPayment = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        } else {
          monthlyPayment = p / n;
        }

        totalPayments = monthlyPayment * n;
        totalInterest = totalPayments - p;

        let balance = p;
        for (let i = 1; i <= n; i++) {
          const interestPortion = balance * r;
          const principalPortion = monthlyPayment - interestPortion;
          balance -= principalPortion;
          schedule.push({
            month: i,
            payment: monthlyPayment,
            principal: principalPortion,
            interest: interestPortion,
            balance: Math.max(0, balance)
          });
        }
      }

      return {
        monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
        totalInterest: parseFloat(totalInterest.toFixed(2)),
        totalPayments: parseFloat(totalPayments.toFixed(2)),
        amortizationData: schedule
      };
    }
  },
  {
    id: "payment-calculator",
    name: "Payment Calculator",
    category: "financial",
    description: "Determine standard recurring payments for mortgages or loans.",
    seo: {
      title: "Payment Calculator - Amortized Payment Estimation",
      description: "Quick payment outputs for basic amortization schedules.",
      keywords: ["payment calculator", "loan payment", "amortized principal"]
    },
    formula: "\\text{Payment} = P \\frac{r(1+r)^n}{(1+r)^n - 1}",
    explanation: "This is a simplified amortizing payment estimator for general loans.",
    inputs: [
      { id: "principal", label: "Principal ($)", type: "number", default: 15000 },
      { id: "rate", label: "Annual Rate (%)", type: "number", default: 7 },
      { id: "termMonths", label: "Term (Months)", type: "number", default: 36 }
    ],
    outputs: [
      { id: "payment", label: "Monthly Payment", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.principal) || 0;
      const rate = parseFloat(inputs.rate) || 0;
      const term = parseFloat(inputs.termMonths) || 12;

      const r = rate / 100 / 12;
      const pmt = r > 0 ? p * (r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1) : p / term;

      return { payment: parseFloat(pmt.toFixed(2)) };
    }
  },
  {
    id: "currency-calculator",
    name: "Currency Calculator",
    category: "financial",
    description: "Convert currency amounts using standard exchange ratios.",
    seo: {
      title: "Currency Converter - Basic Exchange Ratios",
      description: "Convert currencies with custom rate ratios.",
      keywords: ["currency calculator", "exchange rate", "forex converter"]
    },
    formula: "\\text{Converted} = \\text{Amount} \\times \\text{Rate}",
    explanation: "Currencies exchange values based on global macroeconomic trading supply and demand.",
    inputs: [
      { id: "amount", label: "Amount to Convert", type: "number", default: 100 },
      { id: "rate", label: "Exchange Rate (Multiplier)", type: "number", default: 0.92 }
    ],
    outputs: [
      { id: "result", label: "Converted Value", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const amt = parseFloat(inputs.amount) || 0;
      const rate = parseFloat(inputs.rate) || 1;
      return { result: parseFloat((amt * rate).toFixed(2)) };
    }
  },
  {
    id: "inflation-calculator",
    name: "Inflation Calculator",
    category: "financial",
    description: "Calculate historical purchasing power changes based on average inflation rates.",
    seo: {
      title: "Inflation Calculator - Buying Power Adjuster",
      description: "Adjust buying values for historic inflation rates.",
      keywords: ["inflation calculator", "purchasing power", "cpi adjust"]
    },
    formula: "\\text{Future Value} = \\text{PV}(1 + \\text{Inflation})^t",
    explanation: "Inflation represents the general increase in prices and fall in the purchasing value of money.",
    inputs: [
      { id: "amount", label: "Starting Cash Value ($)", type: "number", default: 100 },
      { id: "inflationRate", label: "Average Inflation Rate (%)", type: "number", default: 3.1 },
      { id: "years", label: "Time Horizon (Years)", type: "number", default: 20 }
    ],
    outputs: [
      { id: "finalValue", label: "Adjusted Future Cost", type: "number", format: "currency" },
      { id: "lostPower", label: "Purchasing Power Remaining", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const amt = parseFloat(inputs.amount) || 0;
      const rate = (parseFloat(inputs.inflationRate) || 0) / 100;
      const yrs = parseFloat(inputs.years) || 1;

      const finalVal = amt * Math.pow(1 + rate, yrs);
      const remainingPower = amt / Math.pow(1 + rate, yrs);

      return {
        finalValue: parseFloat(finalVal.toFixed(2)),
        lostPower: parseFloat(remainingPower.toFixed(2))
      };
    }
  },
  {
    id: "sales-tax-calculator",
    name: "Sales Tax Calculator",
    category: "financial",
    description: "Calculate the total retail cost of items including local sales tax rates.",
    seo: {
      title: "Sales Tax Calculator - Estimate Retail Taxes",
      description: "Add sales taxes to retail item prices.",
      keywords: ["sales tax calculator", "retail tax", "purchase tax"]
    },
    formula: "\\text{Tax} = \\text{Price} \\times \\text{Tax Rate}",
    explanation: "Sales taxes are consumption taxes charged on the sale of retail goods and services.",
    inputs: [
      { id: "price", label: "Item Price ($)", type: "number", default: 120 },
      { id: "taxRate", label: "Sales Tax Rate (%)", type: "number", default: 8.25 }
    ],
    outputs: [
      { id: "taxAmount", label: "Sales Tax Amount", type: "number", format: "currency" },
      { id: "totalPrice", label: "Total Price (with Tax)", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.price) || 0;
      const rate = (parseFloat(inputs.taxRate) || 0) / 100;

      const tax = price * rate;
      const total = price + tax;

      return {
        taxAmount: parseFloat(tax.toFixed(2)),
        totalPrice: parseFloat(total.toFixed(2))
      };
    }
  },
  {
    id: "credit-card-calculator",
    name: "Credit Card Calculator",
    category: "financial",
    description: "Determine the monthly payment and time required to clear credit card debt balances.",
    seo: {
      title: "Credit Card Payoff Calculator - Term & Interest Estimator",
      description: "Plan card payoff targets. Calculate minimum interest payments.",
      keywords: ["credit card payoff", "card interest calculator", "clear credit card debt"]
    },
    formula: "\\text{Card Balance Amortization}",
    explanation: "Paying only the minimum balance keeps you in debt longer due to high compounding interest rates.",
    inputs: [
      { id: "balance", label: "Credit Card Balance ($)", type: "number", default: 5000 },
      { id: "interestRate", label: "Card APR (%)", type: "number", default: 22 },
      { id: "monthlyPay", label: "Monthly Payment ($)", type: "number", default: 200 }
    ],
    outputs: [
      { id: "monthsToPay", label: "Months to Pay Off", type: "number" },
      { id: "totalInterest", label: "Total Interest Paid", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const bal = parseFloat(inputs.balance) || 0;
      const apr = parseFloat(inputs.interestRate) || 0;
      const pay = parseFloat(inputs.monthlyPay) || 0;

      const r = apr / 100 / 12;

      let currentBal = bal;
      let months = 0;
      let totalInterest = 0;

      if (pay <= currentBal * r) {
        return { monthsToPay: 999, totalInterest: Infinity }; // Payment doesn't cover interest
      }

      while (currentBal > 0 && months < 360) {
        const interest = currentBal * r;
        totalInterest += interest;
        currentBal = currentBal + interest - pay;
        months++;
      }

      return {
        monthsToPay: months,
        totalInterest: parseFloat(totalInterest.toFixed(2))
      };
    }
  },
  {
    id: "credit-cards-payoff-calculator",
    name: "Credit Cards Payoff Calculator",
    category: "financial",
    description: "Calculate optimal repayment strategies for multiple credit card accounts.",
    seo: {
      title: "Multiple Credit Cards Payoff Calculator",
      description: "Plan payoffs on multiple cards using snowball methods.",
      keywords: ["credit card payoff", "snowball card payoff", "repay credit cards"]
    },
    formula: "\\text{Combined Amortizations}",
    explanation: "Consolidate or align cards to eliminate high-interest balances first.",
    inputs: [
      { id: "card1Bal", label: "Card 1 Balance ($)", type: "number", default: 3000 },
      { id: "card1Apr", label: "Card 1 APR (%)", type: "number", default: 24 },
      { id: "card2Bal", label: "Card 2 Balance ($)", type: "number", default: 4000 },
      { id: "card2Apr", label: "Card 2 APR (%)", type: "number", default: 18 },
      { id: "monthlyContribution", label: "Total Monthly Payment Pool ($)", type: "number", default: 400 }
    ],
    outputs: [
      { id: "combinedPayoffMonths", label: "Combined Payoff Time (Months)", type: "number" }
    ],
    calculate: (inputs) => {
      let b1 = parseFloat(inputs.card1Bal) || 0;
      const r1 = (parseFloat(inputs.card1Apr) || 0) / 100 / 12;
      let b2 = parseFloat(inputs.card2Bal) || 0;
      const r2 = (parseFloat(inputs.card2Apr) || 0) / 100 / 12;
      const pool = parseFloat(inputs.monthlyContribution) || 100;

      let months = 0;
      while ((b1 > 0 || b2 > 0) && months < 360) {
        // Pay interest first
        const i1 = b1 * r1;
        const i2 = b2 * r2;

        if (pool <= (i1 + i2)) {
          return { combinedPayoffMonths: 999 }; // Insufficient payment pool
        }

        let avail = pool - i1 - i2;

        // Apply remaining pool to Card 1 (highest APR) first
        if (b1 > 0) {
          if (b1 <= avail) {
            avail -= b1;
            b1 = 0;
          } else {
            b1 -= avail;
            avail = 0;
          }
        }

        if (b2 > 0 && avail > 0) {
          if (b2 <= avail) {
            b2 = 0;
          } else {
            b2 -= avail;
          }
        }
        
        b1 += i1;
        b2 += i2;
        months++;
      }

      return { combinedPayoffMonths: months };
    }
  },
  {
    id: "debt-payoff-calculator",
    name: "Debt Payoff Calculator",
    category: "financial",
    description: "Determine repayment timelines under standard debt snowball or avalanche methods.",
    seo: {
      title: "Debt Payoff Calculator - Snowball & Avalanche",
      description: "Compare payoff strategies for consolidating debt.",
      keywords: ["debt payoff", "debt snowball", "debt avalanche"]
    },
    formula: "\\text{Snowball vs Avalanche Repayment Algorithms}",
    explanation: "The Snowball method targets the smallest balance first for psychological boosts. The Avalanche method targets the highest interest rate to minimize total interest.",
    inputs: [
      { id: "totalDebt", label: "Total Combined Debt ($)", type: "number", default: 20000 },
      { id: "averageApr", label: "Average APR (%)", type: "number", default: 12 },
      { id: "monthlyBudget", label: "Monthly Repayment Budget ($)", type: "number", default: 600 }
    ],
    outputs: [
      { id: "monthsToClear", label: "Months to Clear Debt", type: "number" },
      { id: "totalInterest", label: "Total Interest Paid", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const debt = parseFloat(inputs.totalDebt) || 0;
      const apr = parseFloat(inputs.averageApr) || 0;
      const budget = parseFloat(inputs.monthlyBudget) || 1;

      const r = apr / 100 / 12;
      let bal = debt;
      let months = 0;
      let interest = 0;

      if (budget <= bal * r) {
        return { monthsToClear: 999, totalInterest: Infinity };
      }

      while (bal > 0 && months < 360) {
        const intr = bal * r;
        interest += intr;
        bal = bal + intr - budget;
        months++;
      }

      return {
        monthsToClear: months,
        totalInterest: parseFloat(interest.toFixed(2))
      };
    }
  },
  {
    id: "debt-consolidation-calculator",
    name: "Debt Consolidation Calculator",
    category: "financial",
    description: "Compare consolidating multiple high interest debts into a single lower interest loan.",
    seo: {
      title: "Debt Consolidation Calculator - Save Interest",
      description: "Compare consolidated loan payoffs against separate debt schedules.",
      keywords: ["debt consolidation", "refinance cards", "consolidate debt"]
    },
    formula: "\\text{Refinancing consolidation comparison}",
    explanation: "Consolidation replaces multiple high APR credit balances with one lower fixed rate installment loan.",
    inputs: [
      { id: "debtAmount", label: "Total Debt to Consolidate ($)", type: "number", default: 15000 },
      { id: "currentWeightedRate", label: "Current Weighted Interest Rate (%)", type: "number", default: 18 },
      { id: "consolidationLoanRate", label: "New Consolidated Loan Rate (%)", type: "number", default: 9.5 },
      { id: "termMonths", label: "New Loan Term (Months)", type: "number", default: 48 }
    ],
    outputs: [
      { id: "monthlySavings", label: "Monthly Payment Savings", type: "number", format: "currency" },
      { id: "totalInterestSavings", label: "Total Interest Savings", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.debtAmount) || 0;
      const rOld = parseFloat(inputs.currentWeightedRate) || 0;
      const rNew = parseFloat(inputs.consolidationLoanRate) || 0;
      const term = parseFloat(inputs.termMonths) || 12;

      const oldR = rOld / 100 / 12;
      const newR = rNew / 100 / 12;

      const pmtOld = oldR > 0 ? p * (oldR * Math.pow(1 + oldR, term)) / (Math.pow(1 + oldR, term) - 1) : p / term;
      const pmtNew = newR > 0 ? p * (newR * Math.pow(1 + newR, term)) / (Math.pow(1 + newR, term) - 1) : p / term;

      const intOld = (pmtOld * term) - p;
      const intNew = (pmtNew * term) - p;

      return {
        monthlySavings: parseFloat((pmtOld - pmtNew).toFixed(2)),
        totalInterestSavings: parseFloat((intOld - intNew).toFixed(2))
      };
    }
  },
  {
    id: "repayment-calculator",
    name: "Repayment Calculator",
    category: "financial",
    description: "Determine the monthly repayment amounts and interest costs of a basic term loan.",
    seo: {
      title: "Repayment Calculator - Installment Loan Payments",
      description: "Estimate monthly repayments on fixed rate cash loans.",
      keywords: ["repayment calculator", "loan repayment", "fixed term loan"]
    },
    formula: "\\text{Standard amortizing repayment}",
    explanation: "This tool calculates general periodic payments required to liquidate debt over fixed schedules.",
    inputs: [
      { id: "principal", label: "Loan Amount ($)", type: "number", default: 8000 },
      { id: "rate", label: "Annual Interest Rate (%)", type: "number", default: 8.5 },
      { id: "termMonths", label: "Term (Months)", type: "number", default: 24 }
    ],
    outputs: [
      { id: "repayment", label: "Monthly Repayment Amount", type: "number", format: "currency" },
      { id: "totalCost", label: "Total Cost of Loan", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.principal) || 0;
      const rate = parseFloat(inputs.rate) || 0;
      const term = parseFloat(inputs.termMonths) || 12;

      const r = rate / 100 / 12;
      const pmt = r > 0 ? p * (r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1) : p / term;

      return {
        repayment: parseFloat(pmt.toFixed(2)),
        totalCost: parseFloat((pmt * term).toFixed(2))
      };
    }
  },
  {
    id: "student-loan-calculator",
    name: "Student Loan Calculator",
    category: "financial",
    description: "Calculate student loan payments and estimate savings from accelerated repayments.",
    seo: {
      title: "Student Loan Payment Calculator",
      description: "Project student loan payoff timelines and total interest obligations.",
      keywords: ["student loan calculator", "college loan payoff", "student loan interest"]
    },
    formula: "\\text{Student Loan Amortization}",
    explanation: "Student loans often accrue interest during school. Accelerated payments cut long term interest costs.",
    inputs: [
      { id: "balance", label: "Student Loan Balance ($)", type: "number", default: 35000 },
      { id: "interestRate", label: "Annual Interest Rate (%)", type: "number", default: 5.5 },
      { id: "termYears", label: "Repayment Term (Years)", type: "number", default: 10 }
    ],
    outputs: [
      { id: "monthlyPayment", label: "Monthly Payment", type: "number", format: "currency" },
      { id: "totalInterest", label: "Total Interest Paid", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.balance) || 0;
      const rate = parseFloat(inputs.interestRate) || 0;
      const yrs = parseFloat(inputs.termYears) || 10;

      const n = yrs * 12;
      const r = rate / 100 / 12;

      const pmt = r > 0 ? p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : p / n;
      const interest = (pmt * n) - p;

      return {
        monthlyPayment: parseFloat(pmt.toFixed(2)),
        totalInterest: parseFloat(interest.toFixed(2))
      };
    }
  },
  {
    id: "college-cost-calculator",
    name: "College Cost Calculator",
    category: "financial",
    description: "Plan savings goals for future university tuition and boarding costs.",
    seo: {
      title: "College Cost Savings Calculator - Tuition Planner",
      description: "Plan monthly savings allocations to meet college inflation cost targets.",
      keywords: ["college cost", "college savings planner", "529 savings calculator"]
    },
    formula: "\\text{Tuition inflation and compound savings}",
    explanation: "College costs grow faster than general inflation. Start compound plans early to offset future costs.",
    inputs: [
      { id: "annualCost", label: "Current Annual Tuition Cost ($)", type: "number", default: 25000 },
      { id: "inflationRate", label: "Tuition Inflation Rate (%)", type: "number", default: 4 },
      { id: "years", label: "Years Until College", type: "number", default: 10 },
      { id: "savingsPool", label: "Current College Savings ($)", type: "number", default: 5000 }
    ],
    outputs: [
      { id: "futureAnnualCost", label: "Estimated Future Cost (Year 1)", type: "number", format: "currency" },
      { id: "monthlySaveNeeded", label: "Required Monthly Savings Allocation", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const currentCost = parseFloat(inputs.annualCost) || 0;
      const inf = (parseFloat(inputs.inflationRate) || 4) / 100;
      const yrs = parseFloat(inputs.years) || 1;
      const start = parseFloat(inputs.savingsPool) || 0;

      const futureCost = currentCost * Math.pow(1 + inf, yrs);

      // We estimate a 4-year tuition need: FutureCost * 4 (roughly)
      const targetNeeds = futureCost * 4;
      const r = 0.06 / 12; // Assume 6% savings yield
      const periods = yrs * 12;

      const futureValOfStart = start * Math.pow(1 + r, periods);
      const remainingNeeds = Math.max(0, targetNeeds - futureValOfStart);

      const monthly = r > 0 ? remainingNeeds * r / (Math.pow(1 + r, periods) - 1) : remainingNeeds / periods;

      return {
        futureAnnualCost: parseFloat(futureCost.toFixed(2)),
        monthlySaveNeeded: parseFloat(monthly.toFixed(2))
      };
    }
  },
  {
    id: "vat-calculator",
    name: "VAT Calculator",
    category: "financial",
    description: "Add or remove Value Added Tax (VAT) from purchase retail listings.",
    seo: {
      title: "VAT Calculator - Add or Exclude Value Added Taxes",
      description: "Include or exclude VAT from retail price bounds.",
      keywords: ["vat calculator", "value added tax", "exclusive vat"]
    },
    formula: "\\text{VAT} = \\text{Price} \\times \\text{VAT Rate}",
    explanation: "Value Added Tax (VAT) is a flat consumption tax placed on products at each stage of production.",
    inputs: [
      { id: "price", label: "Item Price ($)", type: "number", default: 100 },
      { id: "vatRate", label: "VAT Percentage (%)", type: "number", default: 20 },
      {
        id: "mode",
        label: "Calculation Mode",
        type: "select",
        default: "add",
        options: [
          { value: "add", label: "Add VAT (Exclusive to Inclusive)" },
          { value: "sub", label: "Remove VAT (Inclusive to Exclusive)" }
        ]
      }
    ],
    outputs: [
      { id: "netPrice", label: "Net Price (Exclusive)", type: "number", format: "currency" },
      { id: "vatAmount", label: "VAT Tax Amount", type: "number", format: "currency" },
      { id: "grossPrice", label: "Gross Price (Inclusive)", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.price) || 0;
      const rate = (parseFloat(inputs.vatRate) || 0) / 100;
      const mode = inputs.mode;

      let net = 0, vat = 0, gross = 0;
      if (mode === "add") {
        net = price;
        vat = price * rate;
        gross = price + vat;
      } else {
        gross = price;
        net = price / (1 + rate);
        vat = gross - net;
      }

      return {
        netPrice: parseFloat(net.toFixed(2)),
        vatAmount: parseFloat(vat.toFixed(2)),
        grossPrice: parseFloat(gross.toFixed(2))
      };
    }
  },
  {
    id: "depreciation-calculator",
    name: "Depreciation Calculator",
    category: "financial",
    description: "Calculate assets write-downs using straight-line or declining balance rules.",
    seo: {
      title: "Asset Depreciation Calculator - Tax Write-offs",
      description: "Model straight line write-downs on commercial property assets.",
      keywords: ["depreciation calculator", "straight line depreciation", "declining balance asset"]
    },
    formula: "\\text{Depreciation} = \\frac{\\text{Cost} - \\text{Salvage}}{\\text{Life}}",
    explanation: "Depreciation allocates the cost of a tangible asset over its useful physical life.",
    inputs: [
      { id: "cost", label: "Asset Cost Basis ($)", type: "number", default: 50000 },
      { id: "salvage", label: "Salvage Value ($)", type: "number", default: 5000 },
      { id: "life", label: "Useful Life (Years)", type: "number", default: 7 }
    ],
    outputs: [
      { id: "annualDepreciation", label: "Annual Depreciation Write-off", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const cost = parseFloat(inputs.cost) || 0;
      const salvage = parseFloat(inputs.salvage) || 0;
      const life = parseFloat(inputs.life) || 1;

      const dep = (cost - salvage) / life;
      return { annualDepreciation: parseFloat(Math.max(0, dep).toFixed(2)) };
    }
  },
  {
    id: "margin-calculator",
    name: "Margin Calculator",
    category: "financial",
    description: "Determine markup, cost, revenue, and gross profit margin percentages for business pricing.",
    seo: {
      title: "Margin Calculator - Gross Profit & Markup Solver",
      description: "Check net margins and markups from item costs.",
      keywords: ["margin calculator", "profit margin", "retail markup solver"]
    },
    formula: "\\text{Margin} = \\frac{\\text{Revenue} - \\text{Cost}}{\\text{Revenue}} \\times 100",
    explanation: "Profit margins measure how much out of every sales dollar a business keeps in earnings.",
    inputs: [
      { id: "cost", label: "Cost of Goods Sold (COGS) ($)", type: "number", default: 40 },
      { id: "revenue", label: "Selling Price (Revenue) ($)", type: "number", default: 100 }
    ],
    outputs: [
      { id: "margin", label: "Gross Profit Margin (%)", type: "number", format: "decimal" },
      { id: "markup", label: "Markup Percentage (%)", type: "number", format: "decimal" },
      { id: "profit", label: "Gross Profit", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const cost = parseFloat(inputs.cost) || 0;
      const rev = parseFloat(inputs.revenue) || 1;

      const profit = rev - cost;
      const margin = (profit / rev) * 100;
      const markup = cost > 0 ? (profit / cost) * 100 : 0;

      return {
        margin: parseFloat(margin.toFixed(2)),
        markup: parseFloat(markup.toFixed(2)),
        profit: parseFloat(profit.toFixed(2))
      };
    }
  },
  {
    id: "discount-calculator",
    name: "Discount Calculator",
    category: "financial",
    description: "Determine the final price and net savings of items marked with discount percentages.",
    seo: {
      title: "Discount Calculator - Sales and Savings Finder",
      description: "Subtract percentage savings from retail item prices.",
      keywords: ["discount calculator", "sale price", "save percentage retail"]
    },
    formula: "\\text{Final Price} = \\text{Original} \\times (1 - \\frac{D}{100})",
    explanation: "Discounts reduce retail sticker prices. The calculator estimates net savings.",
    inputs: [
      { id: "price", label: "Original Sticker Price ($)", type: "number", default: 80 },
      { id: "discount", label: "Discount Percentage (%)", type: "number", default: 25 }
    ],
    outputs: [
      { id: "finalPrice", label: "Sale Price", type: "number", format: "currency" },
      { id: "savings", label: "Net Cash Saved", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.price) || 0;
      const disc = parseFloat(inputs.discount) || 0;

      const savings = price * (disc / 100);
      const final = price - savings;

      return {
        finalPrice: parseFloat(final.toFixed(2)),
        savings: parseFloat(savings.toFixed(2))
      };
    }
  },
  {
    id: "business-loan-calculator",
    name: "Business Loan Calculator",
    category: "financial",
    description: "Calculate monthly payments and amortization terms for commercial enterprise financing.",
    seo: {
      title: "Business Loan Calculator - Commercial Payments",
      description: "Estimate commercial amortized business loans payments.",
      keywords: ["business loan", "commercial financing", "amortized business loan"]
    },
    formula: "\\text{Commercial Loan Amortization}",
    explanation: "Business loans fund capital operations, typically secured by collateral or corporate cash flows.",
    inputs: [
      { id: "amount", label: "Loan Principal ($)", type: "number", default: 50000 },
      { id: "rate", label: "Annual Rate (%)", type: "number", default: 8.5 },
      { id: "termYears", label: "Term (Years)", type: "number", default: 5 }
    ],
    outputs: [
      { id: "monthlyPayment", label: "Monthly Payment", type: "number", format: "currency" },
      { id: "totalInterest", label: "Total Interest Paid", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.amount) || 0;
      const rate = parseFloat(inputs.rate) || 0;
      const yrs = parseFloat(inputs.termYears) || 5;

      const n = yrs * 12;
      const r = rate / 100 / 12;

      const pmt = r > 0 ? p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : p / n;
      const interest = (pmt * n) - p;

      return {
        monthlyPayment: parseFloat(pmt.toFixed(2)),
        totalInterest: parseFloat(interest.toFixed(2))
      };
    }
  },
  {
    id: "personal-loan-calculator",
    name: "Personal Loan Calculator",
    category: "financial",
    description: "Determine installment payments for unsecured personal loans.",
    seo: {
      title: "Personal Loan Calculator - Installment Payments",
      description: "Estimate monthly personal debt payments.",
      keywords: ["personal loan", "unsecured cash loan", "installment payment"]
    },
    formula: "\\text{Personal installment loan equation}",
    explanation: "Personal loans are usually unsecured installment debts, utilizing fixed rates and short repayment terms.",
    inputs: [
      { id: "amount", label: "Loan Amount ($)", type: "number", default: 10000 },
      { id: "rate", label: "Annual Rate (%)", type: "number", default: 11.5 },
      { id: "termMonths", label: "Term (Months)", type: "number", default: 36 }
    ],
    outputs: [
      { id: "monthlyPayment", label: "Monthly Payment", type: "number", format: "currency" },
      { id: "totalCost", label: "Total Cost", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.amount) || 0;
      const rate = parseFloat(inputs.rate) || 0;
      const term = parseFloat(inputs.termMonths) || 12;

      const r = rate / 100 / 12;
      const pmt = r > 0 ? p * (r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1) : p / term;

      return {
        monthlyPayment: parseFloat(pmt.toFixed(2)),
        totalCost: parseFloat((pmt * term).toFixed(2))
      };
    }
  },
  {
    id: "boat-loan-calculator",
    name: "Boat Loan Calculator",
    category: "financial",
    description: "Determine payment amortizations for leisure boats and yachts.",
    seo: {
      title: "Boat Loan Calculator - Marine Financing Amortizations",
      description: "Calculate yacht financing payments.",
      keywords: ["boat loan", "marine financing", "yacht amortization"]
    },
    formula: "\\text{Boat loan payment formula}",
    explanation: "Marine loans offer longer amortization terms (up to 15-20 years) due to the durability of large vessels.",
    inputs: [
      { id: "amount", label: "Boat Loan Amount ($)", type: "number", default: 45000 },
      { id: "rate", label: "Annual Rate (%)", type: "number", default: 7.2 },
      { id: "termYears", label: "Term (Years)", type: "number", default: 10 }
    ],
    outputs: [
      { id: "monthlyPayment", label: "Monthly Payment", type: "number", format: "currency" },
      { id: "totalInterest", label: "Total Interest", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.amount) || 0;
      const rate = parseFloat(inputs.rate) || 0;
      const yrs = parseFloat(inputs.termYears) || 10;

      const n = yrs * 12;
      const r = rate / 100 / 12;

      const pmt = r > 0 ? p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : p / n;

      return {
        monthlyPayment: parseFloat(pmt.toFixed(2)),
        totalInterest: parseFloat(((pmt * n) - p).toFixed(2))
      };
    }
  },
  {
    id: "lease-calculator",
    name: "Lease Calculator",
    category: "financial",
    description: "General equipment or vehicle lease payment estimator.",
    seo: {
      title: "Lease Payment Calculator - Equipment & Auto Leasing",
      description: "Lease fee estimations.",
      keywords: ["lease calculator", "equipment leasing", "lease payment estimation"]
    },
    formula: "\\text{Lease payment model}",
    explanation: "Leasing provides usage rights without property transfer, paying for depreciation and financing.",
    inputs: [
      { id: "cost", label: "Cap Cost Basis ($)", type: "number", default: 20000 },
      { id: "residual", label: "Residual Value ($)", type: "number", default: 8000 },
      { id: "rate", label: "Money Factor Rate (%)", type: "number", default: 6 },
      { id: "termMonths", label: "Term (Months)", type: "number", default: 36 }
    ],
    outputs: [
      { id: "monthlyLease", label: "Monthly Lease Payment", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const cap = parseFloat(inputs.cost) || 0;
      const res = parseFloat(inputs.residual) || 0;
      const rate = parseFloat(inputs.rate) || 0;
      const term = parseFloat(inputs.termMonths) || 12;

      const monthlyDep = (cap - res) / term;
      const monthlyInt = (cap + res) * (rate / 100 / 12);

      return { monthlyLease: parseFloat((monthlyDep + monthlyInt).toFixed(2)) };
    }
  },
  {
    id: "budget-calculator",
    name: "Budget Calculator",
    category: "financial",
    description: "Allocate income based on the 50/30/20 budget framework (Needs, Wants, Savings).",
    seo: {
      title: "50/30/20 Budget Calculator - Household Wealth Allocator",
      description: "Allocate gross salary to savings targets.",
      keywords: ["budget calculator", "50 30 20 budget", "savings allocations"]
    },
    formula: "\\text{50% Needs, 30% Wants, 20% Savings}",
    explanation: "The 50/30/20 rule balances essential needs, discretionary spending, and savings.",
    inputs: [
      { id: "monthlyIncome", label: "Monthly Take-Home Income ($)", type: "number", default: 5000 }
    ],
    outputs: [
      { id: "needs", label: "Needs (50% - Housing, Bills)", type: "number", format: "currency" },
      { id: "wants", label: "Wants (30% - Dining, Fun)", type: "number", format: "currency" },
      { id: "savings", label: "Savings & Debt Payoff (20%)", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const inc = parseFloat(inputs.monthlyIncome) || 0;
      return {
        needs: parseFloat((inc * 0.50).toFixed(2)),
        wants: parseFloat((inc * 0.30).toFixed(2)),
        savings: parseFloat((inc * 0.20).toFixed(2))
      };
    }
  },
  {
    id: "commission-calculator",
    name: "Commission Calculator",
    category: "financial",
    description: "Determine total earnings from base salary plus sales commission structures.",
    seo: {
      title: "Sales Commission Calculator - Total Compensation Planner",
      description: "Check commission payouts from product sales percentages.",
      keywords: ["commission calculator", "sales earnings", "bonus pay"]
    },
    formula: "\\text{Pay} = \\text{Base} + \\text{Sales} \\times \\text{Commission Rate}",
    explanation: "Sales agents receive incentives based on commission percentages applied to their gross sales volume.",
    inputs: [
      { id: "baseSalary", label: "Base Monthly Salary ($)", type: "number", default: 3000 },
      { id: "salesVolume", label: "Monthly Sales Volume ($)", type: "number", default: 25000 },
      { id: "commissionRate", label: "Commission Percentage (%)", type: "number", default: 4.5 }
    ],
    outputs: [
      { id: "commissionEarned", label: "Commission Earned", type: "number", format: "currency" },
      { id: "totalEarnings", label: "Total Gross Monthly Pay", type: "number", format: "currency" }
    ],
    calculate: (inputs) => {
      const base = parseFloat(inputs.baseSalary) || 0;
      const sales = parseFloat(inputs.salesVolume) || 0;
      const rate = (parseFloat(inputs.commissionRate) || 0) / 100;

      const comm = sales * rate;
      const total = base + comm;

      return {
        commissionEarned: parseFloat(comm.toFixed(2)),
        totalEarnings: parseFloat(total.toFixed(2))
      };
    }
  }
];
