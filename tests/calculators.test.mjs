import test from 'node:test';
import assert from 'node:assert/strict';

// Mathematical & Financial core calculator functions
function compoundInterest(principal, ratePercent, timesPerYear, years) {
  const r = ratePercent / 100;
  const amount = principal * Math.pow(1 + r / timesPerYear, timesPerYear * years);
  return Math.round(amount * 100) / 100;
}

function calculateLoanEMI(principal, annualRatePercent, tenureMonths) {
  const monthlyRate = annualRatePercent / 12 / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi * 100) / 100;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

test('Finance: Compound Interest calculates correctly', () => {
  // $1000 at 5% compounded quarterly for 2 years
  const total = compoundInterest(1000, 5, 4, 2);
  assert.equal(total, 1104.49);
});

test('Finance: Loan EMI calculates accurately', () => {
  // $10,000 at 12% for 12 months
  const emi = calculateLoanEMI(10000, 12, 12);
  assert.equal(emi, 888.49);
});

test('Mathematics: Greatest Common Divisor (GCD)', () => {
  assert.equal(gcd(48, 18), 6);
  assert.equal(gcd(101, 103), 1);
});
