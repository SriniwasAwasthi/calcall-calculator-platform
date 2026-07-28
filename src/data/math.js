// Math & Geometry & Statistics Calculators Dataset

// Helper functions for math
const factorial = (num) => {
  if (num < 0) return 0;
  let val = 1;
  for (let i = 2; i <= num; i++) val *= i;
  return val;
};

const getGCD = (a, b) => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
};

const getLCM = (a, b) => {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / getGCD(a, b);
};

export const mathCalculators = [
  {
    id: "scientific-calculator",
    name: "Scientific Calculator",
    category: "math",
    description: "An interactive, fully featured scientific calculator supporting trigonometric functions, logs, exponents, and order of operations.",
    customLayout: "scientific",
    seo: {
      title: "Free Scientific Calculator Online - Evaluate Expressions",
      description: "Perform advanced mathematical, trigonometric, and scientific equations with our easy-to-use scientific calculator. Free and fully responsive.",
      keywords: ["scientific calculator", "math calculator", "online calculator", "trigonometry calculator"]
    },
    formula: "Expression Evaluator (BODMAS / PEMDAS Order of Operations)",
    explanation: "A scientific calculator supports standard arithmetic operations along with algebraic and transcendental functions. It respects the standard mathematical hierarchy: Parentheses first, Exponents next, then Multiplication/Division, and finally Addition/Subtraction.",
    inputs: [],
    outputs: []
  },
  {
    id: "percentage-calculator",
    name: "Percentage Calculator",
    category: "math",
    description: "Quickly calculate percentages, find percentage difference, calculate increases/decreases, and solve percentage fractions.",
    seo: {
      title: "Percentage Calculator - Find Percentage Differences & Changes",
      description: "Quickly solve percentage equations. Calculate percent values, percentage increases/decreases, differences, and fractions instantly.",
      keywords: ["percentage calculator", "percent difference", "percentage increase", "discount calculator"]
    },
    formula: "P = \\frac{X}{100} \\times Y",
    explanation: "Percentages are fractions with a denominator of 100. The calculator resolves common percentage problems, such as finding a discount percentage, a markup rate, or the relative difference between two arbitrary values.",
    inputs: [
      {
        id: "calcType",
        label: "Calculation Type",
        type: "select",
        default: "of",
        options: [
          { value: "of", label: "What is X% of Y?" },
          { value: "isWhatPercent", label: "X is what percent of Y?" },
          { value: "change", label: "What is the % increase/decrease from X to Y?" },
          { value: "addPercent", label: "Add X% to Y" },
          { value: "subPercent", label: "Subtract X% from Y" }
        ]
      },
      { id: "valX", label: "Value X", type: "number", default: 15, step: "any" },
      { id: "valY", label: "Value Y", type: "number", default: 200, step: "any" }
    ],
    outputs: [
      { id: "result", label: "Calculated Result", type: "number", format: "decimal" },
      { id: "breakdown", label: "Explanation Step", type: "text" }
    ],
    calculate: (inputs) => {
      const type = inputs.calcType;
      const x = parseFloat(inputs.valX) || 0;
      const y = parseFloat(inputs.valY) || 0;
      let result = 0;
      let breakdown = "";

      switch (type) {
        case "of":
          result = (x / 100) * y;
          breakdown = `${x}% of ${y} is calculated as: (${x} / 100) × ${y} = ${result}`;
          break;
        case "isWhatPercent":
          result = y !== 0 ? (x / y) * 100 : 0;
          breakdown = `${x} is ${result.toFixed(2)}% of ${y}, calculated as: (${x} / ${y}) × 100 = ${result}%`;
          break;
        case "change":
          if (x === 0) {
            result = 0;
            breakdown = "Cannot calculate percentage change from zero.";
          } else {
            result = ((y - x) / x) * 100;
            const direction = result >= 0 ? "increase" : "decrease";
            breakdown = `The change from ${x} to ${y} is a ${Math.abs(result).toFixed(2)}% ${direction}, calculated as: ((${y} - ${x}) / ${x}) × 100 = ${result.toFixed(2)}%`;
          }
          break;
        case "addPercent":
          result = y * (1 + x / 100);
          breakdown = `Adding ${x}% to ${y} yields ${result}, calculated as: ${y} × (1 + ${x}/100) = ${result}`;
          break;
        case "subPercent":
          result = y * (1 - x / 100);
          breakdown = `Subtracting ${x}% from ${y} yields ${result}, calculated as: ${y} × (1 - ${x}/100) = ${result}`;
          break;
      }
      return { result, breakdown };
    }
  },
  {
    id: "fraction-calculator",
    name: "Fraction Calculator",
    category: "math",
    description: "Add, subtract, multiply, and divide fractions. Supports mixed numbers and simplifies fractions to their simplest form.",
    seo: {
      title: "Fraction Calculator - Simplify, Add & Subtract Fractions",
      description: "Solve fraction arithmetic instantly. Combine fractions or mixed numbers with step-by-step simplification instructions.",
      keywords: ["fraction calculator", "simplifying fractions", "add fractions", "math fractions"]
    },
    formula: "\\frac{a}{b} \\pm \\frac{c}{d} = \\frac{ad \\pm bc}{bd}",
    explanation: "Fractions represent parts of a whole. To perform addition or subtraction, fractions must have a common denominator. For multiplication, multiply numerators and denominators. For division, multiply by the reciprocal.",
    inputs: [
      { id: "num1", label: "Numerator 1", type: "number", default: 1 },
      { id: "den1", label: "Denominator 1", type: "number", default: 2 },
      {
        id: "op",
        label: "Operation",
        type: "select",
        default: "add",
        options: [
          { value: "add", label: "Add (+)" },
          { value: "sub", label: "Subtract (-)" },
          { value: "mul", label: "Multiply (×)" },
          { value: "div", label: "Divide (÷)" }
        ]
      },
      { id: "num2", label: "Numerator 2", type: "number", default: 1 },
      { id: "den2", label: "Denominator 2", type: "number", default: 3 }
    ],
    outputs: [
      { id: "result", label: "Resulting Fraction", type: "text" },
      { id: "decimalVal", label: "Decimal Value", type: "number", format: "decimal" },
      { id: "explanation", label: "Step-by-step Solution", type: "text" }
    ],
    calculate: (inputs) => {
      const n1 = parseInt(inputs.num1) || 0;
      const d1 = parseInt(inputs.den1) || 1;
      const n2 = parseInt(inputs.num2) || 0;
      const d2 = parseInt(inputs.den2) || 1;
      const op = inputs.op;

      if (d1 === 0 || d2 === 0) {
        return { result: "Error", decimalVal: 0, explanation: "Denominators cannot be zero." };
      }

      let resNum = 0;
      let resDen = 1;
      let explanation = "";

      if (op === "add") {
        resNum = n1 * d2 + n2 * d1;
        resDen = d1 * d2;
        explanation = `(${n1}/${d1}) + (${n2}/${d2}) = (${n1}×${d2} + ${n2}×${d1}) / (${d1}×${d2}) = ${resNum}/${resDen}`;
      } else if (op === "sub") {
        resNum = n1 * d2 - n2 * d1;
        resDen = d1 * d2;
        explanation = `(${n1}/${d1}) - (${n2}/${d2}) = (${n1}×${d2} - ${n2}×${d1}) / (${d1}×${d2}) = ${resNum}/${resDen}`;
      } else if (op === "mul") {
        resNum = n1 * n2;
        resDen = d1 * d2;
        explanation = `(${n1}/${d1}) × (${n2}/${d2}) = (${n1}×${n2}) / (${d1}×${d2}) = ${resNum}/${resDen}`;
      } else if (op === "div") {
        if (n2 === 0) {
          return { result: "Error", decimalVal: 0, explanation: "Cannot divide by a fraction of value zero." };
        }
        resNum = n1 * d2;
        resDen = d1 * n2;
        explanation = `(${n1}/${d1}) ÷ (${n2}/${d2}) = (${n1}/${d1}) × (${d2}/${n2}) = ${resNum}/${resDen}`;
      }

      const gcd = getGCD(resNum, resDen);
      const simplifiedNum = resNum / gcd;
      const simplifiedDen = resDen / gcd;
      
      let finalString = `${simplifiedNum}/${simplifiedDen}`;
      if (simplifiedDen === 1) finalString = `${simplifiedNum}`;
      else if (Math.abs(simplifiedNum) > simplifiedDen) {
        const whole = Math.floor(Math.abs(simplifiedNum) / simplifiedDen) * Math.sign(simplifiedNum);
        const rem = Math.abs(simplifiedNum) % simplifiedDen;
        if (rem > 0) {
          finalString = `${whole} ${rem}/${simplifiedDen} (${simplifiedNum}/${simplifiedDen})`;
        }
      }

      explanation += ` => Simplified: ${simplifiedNum}/${simplifiedDen}`;

      return {
        result: finalString,
        decimalVal: resNum / resDen,
        explanation
      };
    }
  },
  {
    id: "random-number-generator",
    name: "Random Number Generator",
    category: "math",
    description: "Generate a truly random number or list of random numbers within a specified range.",
    seo: {
      title: "Random Number Generator - Generate Random Numbers Online",
      description: "Quickly generate random integers or decimals within any range. Generate single numbers or arrays.",
      keywords: ["random number generator", "randomizer", "pick random number", "dice roll"]
    },
    formula: "R = \\text{floor}(r \\times (\\text{Max} - \\text{Min} + 1)) + \\text{Min}",
    explanation: "This generator uses a pseudo-random floating point number algorithm that is uniformly distributed and scales it to the selected bounds.",
    inputs: [
      { id: "min", label: "Minimum Bound", type: "number", default: 1 },
      { id: "max", label: "Maximum Bound", type: "number", default: 100 },
      {
        id: "type",
        label: "Number Type",
        type: "select",
        default: "int",
        options: [
          { value: "int", label: "Integer (Whole Numbers)" },
          { value: "float", label: "Decimal (Float)" }
        ]
      }
    ],
    outputs: [
      { id: "result", label: "Generated Number", type: "number" }
    ],
    calculate: (inputs) => {
      const min = parseFloat(inputs.min) || 0;
      const max = parseFloat(inputs.max) || 0;
      const isInt = inputs.type === "int";

      if (min >= max) {
        return { result: min };
      }

      let result = 0;
      if (isInt) {
        result = Math.floor(Math.random() * (max - min + 1)) + min;
      } else {
        result = Math.random() * (max - min) + min;
      }

      return { result: parseFloat(result.toFixed(isInt ? 0 : 6)) };
    }
  },
  {
    id: "percent-error-calculator",
    name: "Percent Error Calculator",
    category: "math",
    description: "Calculate the percentage error between an experimental/observed value and a theoretical/actual value.",
    seo: {
      title: "Percent Error Calculator - Observed vs. Theoretical",
      description: "Find the percentage error between real experimental measurements and exact target standards.",
      keywords: ["percent error", "percentage error formula", "margin of error", "scientific analysis"]
    },
    formula: "\\text{Percent Error} = \\left| \\frac{\\text{Theoretical} - \\text{Experimental}}{\\text{Theoretical}} \\right| \\times 100",
    explanation: "Percentage error quantifies the accuracy of a measurement relative to its exact true value. Standard laboratories use it to test quality control limits.",
    inputs: [
      { id: "theoretical", label: "Theoretical (True) Value", type: "number", default: 10 },
      { id: "experimental", label: "Experimental (Observed) Value", type: "number", default: 9.5 }
    ],
    outputs: [
      { id: "percentError", label: "Percent Error (%)", type: "number", format: "decimal" },
      { id: "explanation", label: "Steps", type: "text" }
    ],
    calculate: (inputs) => {
      const t = parseFloat(inputs.theoretical) || 0;
      const e = parseFloat(inputs.experimental) || 0;

      if (t === 0) {
        return { percentError: 0, explanation: "Theoretical value cannot be zero." };
      }

      const diff = Math.abs(t - e);
      const error = (diff / Math.abs(t)) * 100;

      return {
        percentError: parseFloat(error.toFixed(4)),
        explanation: `|${t} - ${e}| / |${t}| × 100 = ${diff} / ${Math.abs(t)} × 100 = ${error.toFixed(4)}%`
      };
    }
  },
  {
    id: "exponent-calculator",
    name: "Exponent Calculator",
    category: "math",
    description: "Evaluate exponents, computes powers of any base number raised to any power.",
    seo: {
      title: "Exponent Calculator - Power of Numbers Solver",
      description: "Solve powers and exponent bases instantly. Compute fractional, negative, or positive powers.",
      keywords: ["exponent calculator", "power calculator", "square calculator", "cube number"]
    },
    formula: "Y = X^n",
    explanation: "An exponent tells how many times to multiply a base number by itself. Negative exponents evaluate as division (reciprocal), while fractional powers compute roots.",
    inputs: [
      { id: "base", label: "Base Number (X)", type: "number", default: 2 },
      { id: "exponent", label: "Exponent (n)", type: "number", default: 10 }
    ],
    outputs: [
      { id: "result", label: "Result", type: "number" }
    ],
    calculate: (inputs) => {
      const b = parseFloat(inputs.base) || 0;
      const e = parseFloat(inputs.exponent) || 0;
      return { result: Math.pow(b, e) };
    }
  },
  {
    id: "binary-calculator",
    name: "Binary Calculator",
    category: "math",
    description: "Perform arithmetic operations (addition, subtraction, multiplication, and division) on binary numbers.",
    seo: {
      title: "Binary Calculator - Binary Math Operations Solver",
      description: "Add, subtract, multiply, or divide binary strings. Instantly view calculations with decimal equivalencies.",
      keywords: ["binary calculator", "binary arithmetic", "base 2 math", "computer systems math"]
    },
    formula: "A_{2} \\text{ op } B_{2} = C_{2}",
    explanation: "Computers use binary notation (base-2) representing values using 1 and 0. Operations are computed by aligning place values and shifting carrying flags.",
    inputs: [
      { id: "bin1", label: "Binary Value 1", type: "text", default: "1101" },
      {
        id: "op",
        label: "Operation",
        type: "select",
        default: "add",
        options: [
          { value: "add", label: "Add (+)" },
          { value: "sub", label: "Subtract (-)" },
          { value: "mul", label: "Multiply (×)" },
          { value: "div", label: "Divide (÷)" }
        ]
      },
      { id: "bin2", label: "Binary Value 2", type: "text", default: "101" }
    ],
    outputs: [
      { id: "binResult", label: "Binary Result", type: "text" },
      { id: "decResult", label: "Decimal Value", type: "number" },
      { id: "explanation", label: "Conversion Process", type: "text" }
    ],
    calculate: (inputs) => {
      const b1 = (inputs.bin1 || "").replace(/[^01]/g, "");
      const b2 = (inputs.bin2 || "").replace(/[^01]/g, "");
      const op = inputs.op;

      if (!b1 || !b2) {
        return { binResult: "Error", decResult: 0, explanation: "Please enter valid binary numbers (0s and 1s)." };
      }

      const d1 = parseInt(b1, 2);
      const d2 = parseInt(b2, 2);
      let res = 0;

      switch (op) {
        case "add": res = d1 + d2; break;
        case "sub": res = d1 - d2; break;
        case "mul": res = d1 * d2; break;
        case "div": res = d2 !== 0 ? Math.floor(d1 / d2) : 0; break;
      }

      const binRes = res >= 0 ? res.toString(2) : "-" + Math.abs(res).toString(2);

      return {
        binResult: binRes,
        decResult: res,
        explanation: `${b1} in decimal is ${d1}. ${b2} in decimal is ${d2}. Operation: ${d1} ${op === 'add' ? '+' : op === 'sub' ? '-' : op === 'mul' ? '×' : '÷'} ${d2} = ${res}. Decimal ${res} converts back to binary: ${binRes}.`
      };
    }
  },
  {
    id: "hex-calculator",
    name: "Hex Calculator",
    category: "math",
    description: "Add, subtract, multiply, and divide hexadecimal numbers. Supports conversions to binary and decimal.",
    seo: {
      title: "Hexadecimal Calculator - Base-16 Math Solver",
      description: "Evaluate hex calculations with conversions between base-16, base-10, and base-2 formats.",
      keywords: ["hex calculator", "hexadecimal calculator", "base 16 math", "hex arithmetic"]
    },
    formula: "A_{16} \\text{ op } B_{16} = C_{16}",
    explanation: "Hexadecimal (base-16) uses digits 0-9 and letters A-F to represent 4 binary bits in a single character.",
    inputs: [
      { id: "hex1", label: "Hex Value 1", type: "text", default: "A3" },
      {
        id: "op",
        label: "Operation",
        type: "select",
        default: "add",
        options: [
          { value: "add", label: "Add (+)" },
          { value: "sub", label: "Subtract (-)" },
          { value: "mul", label: "Multiply (×)" },
          { value: "div", label: "Divide (÷)" }
        ]
      },
      { id: "hex2", label: "Hex Value 2", type: "text", default: "F" }
    ],
    outputs: [
      { id: "hexResult", label: "Hex Result", type: "text" },
      { id: "decResult", label: "Decimal Value", type: "number" },
      { id: "binResult", label: "Binary Value", type: "text" }
    ],
    calculate: (inputs) => {
      const h1 = (inputs.hex1 || "").replace(/[^0-9A-Fa-f]/g, "");
      const h2 = (inputs.hex2 || "").replace(/[^0-9A-Fa-f]/g, "");
      const op = inputs.op;

      if (!h1 || !h2) {
        return { hexResult: "Error", decResult: 0, binResult: "Error" };
      }

      const d1 = parseInt(h1, 16);
      const d2 = parseInt(h2, 16);
      let res = 0;

      switch (op) {
        case "add": res = d1 + d2; break;
        case "sub": res = d1 - d2; break;
        case "mul": res = d1 * d2; break;
        case "div": res = d2 !== 0 ? Math.floor(d1 / d2) : 0; break;
      }

      const hexRes = res >= 0 ? res.toString(16).toUpperCase() : "-" + Math.abs(res).toString(16).toUpperCase();

      return {
        hexResult: hexRes,
        decResult: res,
        binResult: res.toString(2)
      };
    }
  },
  {
    id: "half-life-calculator",
    name: "Half-Life Calculator",
    category: "math",
    description: "Solve exponential decay math using the half-life equation. Find remaining quantities, initial quantity, or elapsed time.",
    seo: {
      title: "Half-Life Decay Calculator - Exponential Decay Solver",
      description: "Solve radioactive half-life calculations. Compute elapsed time, initial/final substances, and percent remaining.",
      keywords: ["half life calculator", "exponential decay", "isotope decay", "chemistry decay calculator"]
    },
    formula: "N(t) = N_0 \\left( \\frac{1}{2} \\right)^{\\frac{t}{t_{1/2}}}",
    explanation: "Half-life describes the time required for a quantity to decrease to half of its initial value under exponential decay conditions.",
    inputs: [
      { id: "initial", label: "Initial Quantity (N0)", type: "number", default: 100, min: 0 },
      { id: "halfLife", label: "Half-Life Period (t 1/2)", type: "number", default: 5, min: 0.00001 },
      { id: "time", label: "Elapsed Time (t)", type: "number", default: 15, min: 0 }
    ],
    outputs: [
      { id: "remaining", label: "Remaining Quantity (N)", type: "number", format: "decimal" },
      { id: "percent", label: "Percent Remaining (%)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const n0 = parseFloat(inputs.initial) || 0;
      const hl = parseFloat(inputs.halfLife) || 1;
      const t = parseFloat(inputs.time) || 0;

      const remaining = n0 * Math.pow(0.5, t / hl);
      const percent = (remaining / (n0 || 1)) * 100;

      return {
        remaining: parseFloat(remaining.toFixed(6)),
        percent: parseFloat(percent.toFixed(2))
      };
    }
  },
  {
    id: "quadratic-formula-calculator",
    name: "Quadratic Formula Calculator",
    category: "math",
    description: "Find real and complex roots of a quadratic equation using the quadratic formula solver.",
    seo: {
      title: "Quadratic Equation Calculator - Solve ax^2+bx+c=0",
      description: "Find roots of quadratic equations. Solves real and imaginary coordinates with discriminant indicators.",
      keywords: ["quadratic formula", "solve quadratic equation", "math solver", "discriminant"]
    },
    formula: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    explanation: "A quadratic equation is a second-order polynomial equation. The solutions are coordinates where the curve cuts the X-axis.",
    inputs: [
      { id: "a", label: "Coefficient a (x^2)", type: "number", default: 1 },
      { id: "b", label: "Coefficient b (x)", type: "number", default: -5 },
      { id: "c", label: "Constant c", type: "number", default: 6 }
    ],
    outputs: [
      { id: "root1", label: "Root 1 (x1)", type: "text" },
      { id: "root2", label: "Root 2 (x2)", type: "text" },
      { id: "disc", label: "Discriminant (Δ)", type: "number" },
      { id: "desc", label: "Roots Description", type: "text" }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a);
      const b = parseFloat(inputs.b) || 0;
      const c = parseFloat(inputs.c) || 0;

      if (isNaN(a) || a === 0) {
        return { root1: "Error", root2: "Error", disc: 0, desc: "Coefficient 'a' cannot be zero in quadratic math." };
      }

      const disc = b * b - 4 * a * c;
      let root1 = "";
      let root2 = "";
      let desc = "";

      if (disc > 0) {
        const r1 = (-b + Math.sqrt(disc)) / (2 * a);
        const r2 = (-b - Math.sqrt(disc)) / (2 * a);
        root1 = r1.toFixed(4);
        root2 = r2.toFixed(4);
        desc = "Two distinct real roots.";
      } else if (disc === 0) {
        const r = -b / (2 * a);
        root1 = r.toFixed(4);
        root2 = r.toFixed(4);
        desc = "One repeated real root.";
      } else {
        const real = (-b / (2 * a)).toFixed(4);
        const imag = (Math.sqrt(-disc) / (2 * a)).toFixed(4);
        root1 = `${real} + ${imag}i`;
        root2 = `${real} - ${imag}i`;
        desc = "Two complex imaginary roots.";
      }

      return { root1, root2, disc, desc };
    }
  },
  {
    id: "log-calculator",
    name: "Log Calculator",
    category: "math",
    description: "Calculate logarithm values for any positive base including natural log (ln) and common log (log10).",
    seo: {
      title: "Logarithm Calculator - Compute Log and Ln Values",
      description: "Solve log base b of x values instantly. Compute natural log ln(x) or custom bases.",
      keywords: ["log calculator", "logarithm solver", "natural log", "log base 2"]
    },
    formula: "\\log_{b}(x) = \\frac{\\ln(x)}{\\ln(b)}",
    explanation: "A logarithm is the inverse function of exponentiation. The logarithm of a number x to base b is the exponent to which b must be raised to yield x.",
    inputs: [
      { id: "base", label: "Log Base (b)", type: "number", default: 10, min: 0.00001 },
      { id: "value", label: "Value (x)", type: "number", default: 100, min: 0.00001 }
    ],
    outputs: [
      { id: "result", label: "Resulting Power", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const b = parseFloat(inputs.base) || 10;
      const x = parseFloat(inputs.value) || 1;

      if (b <= 0 || b === 1 || x <= 0) {
        return { result: NaN };
      }
      return { result: parseFloat((Math.log(x) / Math.log(b)).toFixed(8)) };
    }
  },
  {
    id: "ratio-calculator",
    name: "Ratio Calculator",
    category: "math",
    description: "Simplify ratios or solve proportions of equivalent fractions (A : B = C : D).",
    seo: {
      title: "Ratio Calculator - Solve Proportions & Simplify Ratios",
      description: "Solve ratio proportions. Input any three fields to find the fourth missing ratio value.",
      keywords: ["ratio calculator", "simplify ratios", "equivalent fractions", "proportions solver"]
    },
    formula: "\\frac{A}{B} = \\frac{C}{D}",
    explanation: "Proportions state that two ratios are equal. If one of the numbers is unknown, it can be computed using cross-multiplication.",
    inputs: [
      { id: "valA", label: "Value A", type: "number", default: 4 },
      { id: "valB", label: "Value B", type: "number", default: 3 },
      { id: "valC", label: "Value C", type: "number", default: 12 },
      { id: "valD", label: "Value D (Leave 0 to Solve)", type: "number", default: 0 }
    ],
    outputs: [
      { id: "solvedD", label: "Solved Value D", type: "number", format: "decimal" },
      { id: "simplified", label: "Simplified Ratio", type: "text" }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.valA) || 0;
      const b = parseFloat(inputs.valB) || 0;
      const c = parseFloat(inputs.valC) || 0;
      let d = parseFloat(inputs.valD) || 0;

      let solvedD = 0;
      if (d === 0) {
        if (a !== 0) solvedD = (b * c) / a;
      } else {
        solvedD = d;
      }

      // Simplify A : B
      const gcd = getGCD(a, b);
      const simpA = gcd !== 0 ? a / gcd : a;
      const simpB = gcd !== 0 ? b / gcd : b;

      return {
        solvedD: parseFloat(solvedD.toFixed(4)),
        simplified: `${simpA} : ${simpB}`
      };
    }
  },
  {
    id: "root-calculator",
    name: "Root Calculator",
    category: "math",
    description: "Compute square root, cube root, or any n-th root of a positive real number.",
    seo: {
      title: "Root Calculator - Find Square Root or n-th Roots",
      description: "Find the root of any number to any degree. Instant square, cube or custom roots.",
      keywords: ["root calculator", "square root", "cube root", "nth root solver"]
    },
    formula: "Y = \\sqrt[n]{x} = x^{\\frac{1}{n}}",
    explanation: "The n-th root of a number x is a number y such that y^n = x. For even roots, the radicand must be non-negative.",
    inputs: [
      { id: "radicand", label: "Radicand (x)", type: "number", default: 64 },
      { id: "degree", label: "Degree of Root (n)", type: "number", default: 2, min: 1 }
    ],
    outputs: [
      { id: "result", label: "Root Output", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const x = parseFloat(inputs.radicand) || 0;
      const n = parseFloat(inputs.degree) || 2;

      if (x < 0 && n % 2 === 0) {
        return { result: NaN }; // Even root of negative number
      }

      let result = 0;
      if (x < 0) {
        result = -Math.pow(-x, 1 / n);
      } else {
        result = Math.pow(x, 1 / n);
      }
      return { result: parseFloat(result.toFixed(6)) };
    }
  },
  {
    id: "lcm-calculator",
    name: "Least Common Multiple Calculator",
    category: "math",
    description: "Find the Least Common Multiple (LCM) of two or three numbers instantly.",
    seo: {
      title: "Least Common Multiple (LCM) Calculator - Step-by-Step",
      description: "Find the smallest positive integer that is divisible by all inputted numbers.",
      keywords: ["lcm calculator", "least common multiple", "math multiples", "lcd fraction solver"]
    },
    formula: "\\text{LCM}(a, b) = \\frac{|a \\times b|}{\\text{GCD}(a, b)}",
    explanation: "LCM is the smallest multiple shared by a set of integers. It is useful for finding common denominators.",
    inputs: [
      { id: "num1", label: "First Integer", type: "number", default: 12 },
      { id: "num2", label: "Second Integer", type: "number", default: 15 },
      { id: "num3", label: "Third Integer (Optional)", type: "number", default: 0 }
    ],
    outputs: [
      { id: "lcm", label: "LCM Result", type: "number" }
    ],
    calculate: (inputs) => {
      const n1 = Math.abs(parseInt(inputs.num1)) || 0;
      const n2 = Math.abs(parseInt(inputs.num2)) || 0;
      const n3 = Math.abs(parseInt(inputs.num3)) || 0;

      let lcm = getLCM(n1, n2);
      if (n3 > 0) {
        lcm = getLCM(lcm, n3);
      }
      return { lcm };
    }
  },
  {
    id: "gcf-calculator",
    name: "Greatest Common Factor Calculator",
    category: "math",
    description: "Find the Greatest Common Factor (GCF/GCD) of two or three numbers.",
    seo: {
      title: "Greatest Common Factor (GCF) Calculator - Step-by-Step",
      description: "Find the greatest positive integer that divides all input values without remainders.",
      keywords: ["gcf calculator", "gcd calculator", "greatest common factor", "divisors list"]
    },
    formula: "\\text{Euclidean Algorithm for GCD}",
    explanation: "The GCF is the largest integer that divides all input values without a remainder. It is solved recursively via division.",
    inputs: [
      { id: "num1", label: "First Integer", type: "number", default: 24 },
      { id: "num2", label: "Second Integer", type: "number", default: 36 },
      { id: "num3", label: "Third Integer (Optional)", type: "number", default: 0 }
    ],
    outputs: [
      { id: "gcf", label: "GCF Result", type: "number" }
    ],
    calculate: (inputs) => {
      const n1 = Math.abs(parseInt(inputs.num1)) || 0;
      const n2 = Math.abs(parseInt(inputs.num2)) || 0;
      const n3 = Math.abs(parseInt(inputs.num3)) || 0;

      let gcf = getGCD(n1, n2);
      if (n3 > 0) {
        gcf = getGCD(gcf, n3);
      }
      return { gcf };
    }
  },
  {
    id: "factor-calculator",
    name: "Factor Calculator",
    category: "math",
    description: "Find all factor divisors of an integer, checks if it is prime, and lists prime factorizations.",
    seo: {
      title: "Factor Calculator - Find Divisors & Prime Checking",
      description: "Computes every divisor of a number. Shows total factor counts and prime numbers checking.",
      keywords: ["factor calculator", "divisors of number", "prime factor calculator", "factorize number"]
    },
    formula: "N = p_1^{a_1} \\times p_2^{a_2} \\dots",
    explanation: "Factors are positive integers that divide a number completely. Primes only have two factors: 1 and the number itself.",
    inputs: [
      { id: "number", label: "Integer to Factorize", type: "number", default: 120, min: 1 }
    ],
    outputs: [
      { id: "factorsList", label: "All Factors", type: "text" },
      { id: "count", label: "Total Factors Count", type: "number" },
      { id: "isPrime", label: "Is Prime?", type: "text" }
    ],
    calculate: (inputs) => {
      const n = Math.abs(parseInt(inputs.number)) || 1;
      const factors = [];

      for (let i = 1; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
          factors.push(i);
          if (n / i !== i) {
            factors.push(n / i);
          }
        }
      }
      factors.sort((a, b) => a - b);

      const isPrimeNum = factors.length === 2;

      return {
        factorsList: factors.join(", "),
        count: factors.length,
        isPrime: isPrimeNum ? "Yes (Prime Number)" : "No (Composite Number)"
      };
    }
  },
  {
    id: "rounding-calculator",
    name: "Rounding Calculator",
    category: "math",
    description: "Round numbers to decimal places, significant figures, or nearest integer bounds.",
    seo: {
      title: "Rounding Calculator - Significant Figures & Decimals",
      description: "Round values based on standard math, round up (ceiling), or round down (floor).",
      keywords: ["rounding calculator", "significant figures", "sig fig calculator", "decimals rounder"]
    },
    formula: "\\text{Standard Rounding Rules}",
    explanation: "Rounding replaces a number with an approximate value that has a shorter representation. Standard rules round half up.",
    inputs: [
      { id: "number", label: "Input Value", type: "number", default: 12.34567, step: "any" },
      { id: "decimals", label: "Decimal Places (or Sig Figs)", type: "number", default: 2, min: 0 },
      {
        id: "mode",
        label: "Rounding Mode",
        type: "select",
        default: "standard",
        options: [
          { value: "standard", label: "Standard Rounding" },
          { value: "floor", label: "Round Down (Floor)" },
          { value: "ceil", label: "Round Up (Ceiling)" },
          { value: "sigfig", label: "Significant Figures" }
        ]
      }
    ],
    outputs: [
      { id: "result", label: "Rounded Result", type: "number" }
    ],
    calculate: (inputs) => {
      const num = parseFloat(inputs.number) || 0;
      const decimals = parseInt(inputs.decimals) || 0;
      const mode = inputs.mode;

      let result = 0;
      if (mode === "standard") {
        const factor = Math.pow(10, decimals);
        result = Math.round(num * factor) / factor;
      } else if (mode === "floor") {
        const factor = Math.pow(10, decimals);
        result = Math.floor(num * factor) / factor;
      } else if (mode === "ceil") {
        const factor = Math.pow(10, decimals);
        result = Math.ceil(num * factor) / factor;
      } else if (mode === "sigfig") {
        if (num === 0) result = 0;
        else {
          const d = Math.ceil(Math.log10(num < 0 ? -num : num));
          const power = decimals - d;
          const magnitude = Math.pow(10, power);
          const shifted = Math.round(num * magnitude);
          result = shifted / magnitude;
        }
      }
      return { result };
    }
  },
  {
    id: "matrix-calculator",
    name: "Matrix Calculator",
    category: "math",
    description: "Perform addition, subtraction, multiplication, and determinant equations on 2x2 matrices.",
    seo: {
      title: "2x2 Matrix Calculator - Arithmetic & Determinant",
      description: "Solve 2x2 matrices. Perform basic operations and compute determinants.",
      keywords: ["matrix calculator", "matrix determinant", "2x2 matrix multiplication", "algebra matrix"]
    },
    formula: "\\text{Det}(M) = ad - bc",
    explanation: "Matrices are rectangular arrays of numbers. Multiplication uses dot products of rows and columns.",
    inputs: [
      { id: "m11", label: "Matrix A [1,1]", type: "number", default: 2 },
      { id: "m12", label: "Matrix A [1,2]", type: "number", default: 1 },
      { id: "m21", label: "Matrix A [2,1]", type: "number", default: -1 },
      { id: "m22", label: "Matrix A [2,2]", type: "number", default: 3 },
      {
        id: "op",
        label: "Operation",
        type: "select",
        default: "det",
        options: [
          { value: "det", label: "Determinant of A" },
          { value: "add", label: "A + B" },
          { value: "sub", label: "A - B" },
          { value: "mul", label: "A × B" }
        ]
      },
      { id: "n11", label: "Matrix B [1,1]", type: "number", default: 1 },
      { id: "n12", label: "Matrix B [1,2]", type: "number", default: 0 },
      { id: "n21", label: "Matrix B [2,1]", type: "number", default: 4 },
      { id: "n22", label: "Matrix B [2,2]", type: "number", default: 2 }
    ],
    outputs: [
      { id: "r11", label: "Result [1,1]", type: "text" },
      { id: "r12", label: "Result [1,2]", type: "text" },
      { id: "r21", label: "Result [2,1]", type: "text" },
      { id: "r22", label: "Result [2,2]", type: "text" }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.m11) || 0;
      const b = parseFloat(inputs.m12) || 0;
      const c = parseFloat(inputs.m21) || 0;
      const d = parseFloat(inputs.m22) || 0;

      const e = parseFloat(inputs.n11) || 0;
      const f = parseFloat(inputs.n12) || 0;
      const g = parseFloat(inputs.n21) || 0;
      const h = parseFloat(inputs.n22) || 0;

      const op = inputs.op;

      if (op === "det") {
        const determinant = a * d - b * c;
        return {
          r11: `Det = ${determinant}`,
          r12: "-",
          r21: "-",
          r22: "-"
        };
      }

      let r11 = 0, r12 = 0, r21 = 0, r22 = 0;

      if (op === "add") {
        r11 = a + e; r12 = b + f;
        r21 = c + g; r22 = d + h;
      } else if (op === "sub") {
        r11 = a - e; r12 = b - f;
        r21 = c - g; r22 = d - h;
      } else if (op === "mul") {
        r11 = a * e + b * g;
        r12 = a * f + b * h;
        r21 = c * e + d * g;
        r22 = c * f + d * h;
      }

      return {
        r11: r11.toString(),
        r12: r12.toString(),
        r21: r21.toString(),
        r22: r22.toString()
      };
    }
  },
  {
    id: "scientific-notation-calculator",
    name: "Scientific Notation Calculator",
    category: "math",
    description: "Add, subtract, multiply, and divide numbers expressed in scientific notation.",
    seo: {
      title: "Scientific Notation Calculator - Base-10 Exponent Solver",
      description: "Arithmetic operations for numbers in form A x 10^B.",
      keywords: ["scientific notation calculator", "base 10 calculator", "physics calculations"]
    },
    formula: "(A \\times 10^a) \\times (B \\times 10^b) = (A \\times B) \\times 10^{a+b}",
    explanation: "Scientific notation writes very large or small numbers using base-10 powers to make reading calculations simpler.",
    inputs: [
      { id: "coeff1", label: "Coefficient 1", type: "number", default: 3 },
      { id: "exp1", label: "Exponent 1 (10^n)", type: "number", default: 8 },
      {
        id: "op",
        label: "Operation",
        type: "select",
        default: "mul",
        options: [
          { value: "add", label: "Add (+)" },
          { value: "sub", label: "Subtract (-)" },
          { value: "mul", label: "Multiply (×)" },
          { value: "div", label: "Divide (÷)" }
        ]
      },
      { id: "coeff2", label: "Coefficient 2", type: "number", default: 2 },
      { id: "exp2", label: "Exponent 2 (10^n)", type: "number", default: 4 }
    ],
    outputs: [
      { id: "decResult", label: "Standard Decimal Result", type: "text" },
      { id: "sciResult", label: "Scientific Notation Result", type: "text" }
    ],
    calculate: (inputs) => {
      const c1 = parseFloat(inputs.coeff1) || 0;
      const e1 = parseInt(inputs.exp1) || 0;
      const c2 = parseFloat(inputs.coeff2) || 0;
      const e2 = parseInt(inputs.exp2) || 0;
      const op = inputs.op;

      const v1 = c1 * Math.pow(10, e1);
      const v2 = c2 * Math.pow(10, e2);

      let res = 0;
      switch (op) {
        case "add": res = v1 + v2; break;
        case "sub": res = v1 - v2; break;
        case "mul": res = v1 * v2; break;
        case "div": res = v2 !== 0 ? v1 / v2 : 0; break;
      }

      if (res === 0) {
        return { decResult: "0", sciResult: "0.0 x 10^0" };
      }

      const exp = Math.floor(Math.log10(Math.abs(res)));
      const coeff = res / Math.pow(10, exp);

      return {
        decResult: res.toString(),
        sciResult: `${coeff.toFixed(4)} × 10^${exp}`
      };
    }
  },
  {
    id: "big-number-calculator",
    name: "Big Number Calculator",
    category: "math",
    description: "Multiply, divide, add, and subtract extremely large integers without truncation.",
    seo: {
      title: "Big Number Calculator - Large Integers Arithmetic",
      description: "Evaluate numbers of huge digit lengths utilizing javascript precision engines.",
      keywords: ["big number calculator", "arbitrary precision", "huge integer math"]
    },
    formula: "\\text{BigInt precision algorithms}",
    explanation: "Standard computer formats truncate numbers exceeding 15 digits. BigInt representations avoid this truncation.",
    inputs: [
      { id: "num1", label: "Big Integer 1", type: "text", default: "12345678901234567890" },
      {
        id: "op",
        label: "Operation",
        type: "select",
        default: "add",
        options: [
          { value: "add", label: "Add (+)" },
          { value: "sub", label: "Subtract (-)" },
          { value: "mul", label: "Multiply (×)" }
        ]
      },
      { id: "num2", label: "Big Integer 2", type: "text", default: "98765432109876543210" }
    ],
    outputs: [
      { id: "result", label: "Exact Large Result", type: "text" }
    ],
    calculate: (inputs) => {
      try {
        const n1 = BigInt(inputs.num1.replace(/[^0-9\-]/g, ""));
        const n2 = BigInt(inputs.num2.replace(/[^0-9\-]/g, ""));
        const op = inputs.op;
        let res = BigInt(0);

        if (op === "add") res = n1 + n2;
        else if (op === "sub") res = n1 - n2;
        else if (op === "mul") res = n1 * n2;

        return { result: res.toString() };
      } catch (err) {
        return { result: "Error: Invalid inputs or decimals in BigInt fields." };
      }
    }
  },
  {
    id: "standard-deviation-calculator",
    name: "Standard Deviation Calculator",
    category: "math",
    description: "Compute the standard deviation, variance, mean, and count of a dataset.",
    seo: {
      title: "Standard Deviation Calculator - Population & Sample Statistics",
      description: "Find average variance, standard error, and deviations of comma-separated number sets.",
      keywords: ["standard deviation", "variance calculator", "population standard deviation", "math variance"]
    },
    formula: "\\sigma = \\sqrt{\\frac{\\sum(x - \\mu)^2}{N}}",
    explanation: "Standard deviation represents dispersion. A low standard deviation indicates values cluster close to the mean.",
    inputs: [
      { id: "dataset", label: "Dataset (Comma Separated)", type: "text", default: "10, 20, 30, 40, 50" }
    ],
    outputs: [
      { id: "mean", label: "Mean (Average)", type: "number", format: "decimal" },
      { id: "popStdev", label: "Population Std Dev (σ)", type: "number", format: "decimal" },
      { id: "sampleStdev", label: "Sample Std Dev (s)", type: "number", format: "decimal" },
      { id: "popVariance", label: "Population Variance", type: "number", format: "decimal" },
      { id: "sampleVariance", label: "Sample Variance", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const parts = (inputs.dataset || "").split(",");
      const nums = parts.map(p => parseFloat(p.trim())).filter(n => !isNaN(n));

      if (nums.length === 0) {
        return { mean: 0, popStdev: 0, sampleStdev: 0, popVariance: 0, sampleVariance: 0 };
      }

      const sum = nums.reduce((acc, curr) => acc + curr, 0);
      const mean = sum / nums.length;

      const squaredDiffs = nums.map(x => Math.pow(x - mean, 2));
      const sumSquaredDiffs = squaredDiffs.reduce((acc, curr) => acc + curr, 0);

      const popVariance = sumSquaredDiffs / nums.length;
      const sampleVariance = nums.length > 1 ? sumSquaredDiffs / (nums.length - 1) : 0;

      const popStdev = Math.sqrt(popVariance);
      const sampleStdev = Math.sqrt(sampleVariance);

      return {
        mean,
        popStdev: parseFloat(popStdev.toFixed(6)),
        sampleStdev: parseFloat(sampleStdev.toFixed(6)),
        popVariance: parseFloat(popVariance.toFixed(6)),
        sampleVariance: parseFloat(sampleVariance.toFixed(6))
      };
    }
  },
  {
    id: "number-sequence-calculator",
    name: "Number Sequence Calculator",
    category: "math",
    description: "Generate terms and find sums of arithmetic and geometric sequences.",
    seo: {
      title: "Number Sequence Calculator - Arithmetic & Geometric Sums",
      description: "Solve sequences. Computes terms, sums of arithmetic progressions, and geometric series.",
      keywords: ["number sequence", "arithmetic progression", "geometric sequence", "progression sum"]
    },
    formula: "S_n = \\frac{n}{2}(2a_1 + (n-1)d)",
    explanation: "Arithmetic sequences grow via addition, while geometric sequences grow by multiplication.",
    inputs: [
      { id: "a1", label: "First Term (a1)", type: "number", default: 2 },
      { id: "diffRatio", label: "Difference or Common Ratio", type: "number", default: 3 },
      { id: "terms", label: "Number of Terms (n)", type: "number", default: 10, min: 1 },
      {
        id: "type",
        label: "Sequence Type",
        type: "select",
        default: "arithmetic",
        options: [
          { value: "arithmetic", label: "Arithmetic (Add/Sub)" },
          { value: "geometric", label: "Geometric (Multiply)" }
        ]
      }
    ],
    outputs: [
      { id: "nthTerm", label: "N-th Term Value", type: "number" },
      { id: "sum", label: "Sum of First n Terms", type: "number" },
      { id: "termsList", label: "Sequence Terms", type: "text" }
    ],
    calculate: (inputs) => {
      const a1 = parseFloat(inputs.a1) || 0;
      const factor = parseFloat(inputs.diffRatio) || 0;
      const n = parseInt(inputs.terms) || 1;
      const type = inputs.type;

      const list = [];
      let sum = 0;
      let nthTerm = a1;

      if (type === "arithmetic") {
        for (let i = 0; i < n; i++) {
          const val = a1 + i * factor;
          if (i === n - 1) nthTerm = val;
          list.push(val.toFixed(2).replace(/\.00$/, ""));
          sum += val;
        }
      } else {
        for (let i = 0; i < n; i++) {
          const val = a1 * Math.pow(factor, i);
          if (i === n - 1) nthTerm = val;
          list.push(val.toFixed(2).replace(/\.00$/, ""));
          sum += val;
        }
      }

      return {
        nthTerm: parseFloat(nthTerm.toFixed(4)),
        sum: parseFloat(sum.toFixed(4)),
        termsList: list.join(", ")
      };
    }
  },
  {
    id: "sample-size-calculator",
    name: "Sample Size Calculator",
    category: "math",
    description: "Determine the required sample size for a survey based on population size, confidence, and error limits.",
    seo: {
      title: "Sample Size Calculator - Find Required Survey Sizes",
      description: "Compute representative sample sizes for statistics audits.",
      keywords: ["sample size", "statistics sample size", "margin of error", "survey sample size"]
    },
    formula: "n = \\frac{Z^2 \\times p(1-p)}{E^2}",
    explanation: "Sample size determines research validity. Higher confidence levels require larger sample sizes to reduce errors.",
    inputs: [
      { id: "population", label: "Population Size (0 for infinite)", type: "number", default: 100000 },
      {
        id: "confidence",
        label: "Confidence Level",
        type: "select",
        default: "95",
        options: [
          { value: "90", label: "90% (Z = 1.645)" },
          { value: "95", label: "95% (Z = 1.96)" },
          { value: "99", label: "99% (Z = 2.576)" }
        ]
      },
      { id: "marginOfError", label: "Margin of Error (%)", type: "number", default: 5, min: 0.1 }
    ],
    outputs: [
      { id: "sampleSize", label: "Required Sample Size", type: "number" }
    ],
    calculate: (inputs) => {
      const pop = parseFloat(inputs.population) || 0;
      const conf = inputs.confidence;
      const margin = (parseFloat(inputs.marginOfError) || 5) / 100;

      let z = 1.96;
      if (conf === "90") z = 1.645;
      else if (conf === "99") z = 2.576;

      const p = 0.5; // distribution proportion for max variance
      let n = (z * z * p * (1 - p)) / (margin * margin);

      if (pop > 0) {
        // Finite Population Correction
        n = n / (1 + (n - 1) / pop);
      }

      return { sampleSize: Math.ceil(n) };
    }
  },
  {
    id: "probability-calculator",
    name: "Probability Calculator",
    category: "math",
    description: "Calculate standard probability distributions, single event outcomes, or unions/intersections.",
    seo: {
      title: "Probability Calculator - Single and Multiple Events Solver",
      description: "Calculate odds of independent and dependent events happening.",
      keywords: ["probability calculator", "odds solver", "chance calculator", "stats math"]
    },
    formula: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)",
    explanation: "Probability ranges from 0 (impossible) to 1 (certain). Unions measure the chance of at least one event occurring.",
    inputs: [
      { id: "probA", label: "Probability of Event A (0 to 1)", type: "number", default: 0.5 },
      { id: "probB", label: "Probability of Event B (0 to 1)", type: "number", default: 0.3 }
    ],
    outputs: [
      { id: "union", label: "Probability of A or B, P(A ∪ B)", type: "number", format: "decimal" },
      { id: "intersection", label: "Probability of A and B, P(A ∩ B)", type: "number", format: "decimal" },
      { id: "notA", label: "Probability of Not A, P(A')", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const a = Math.max(0, Math.min(1, parseFloat(inputs.probA) || 0));
      const b = Math.max(0, Math.min(1, parseFloat(inputs.probB) || 0));

      const intersection = a * b; // Independent assumption
      const union = a + b - intersection;
      const notA = 1 - a;

      return { union, intersection, notA };
    }
  },
  {
    id: "statistics-calculator",
    name: "Statistics Calculator",
    category: "math",
    description: "Descriptive statistics solver: Mean, Median, Range, Outliers, Variance, and standard graphs.",
    seo: {
      title: "Descriptive Statistics Calculator - Complete Dataset Analyzer",
      description: "Evaluate numbers to find average metrics, quartiles, and statistical variance instantly.",
      keywords: ["statistics calculator", "descriptive statistics", "quartiles calculator", "five number summary"]
    },
    formula: "\\text{Descriptive summary analysis}",
    explanation: "Descriptive statistics summarize a collection of information quantitatively to identify trends.",
    inputs: [
      { id: "dataset", label: "Dataset (Comma Separated)", type: "text", default: "2, 4, 4, 4, 5, 5, 7, 9" }
    ],
    outputs: [
      { id: "count", label: "Total Count (N)", type: "number" },
      { id: "mean", label: "Mean (μ)", type: "number", format: "decimal" },
      { id: "median", label: "Median", type: "number", format: "decimal" },
      { id: "min", label: "Minimum", type: "number" },
      { id: "max", label: "Maximum", type: "number" },
      { id: "range", label: "Range", type: "number" }
    ],
    calculate: (inputs) => {
      const parts = (inputs.dataset || "").split(",");
      const nums = parts.map(p => parseFloat(p.trim())).filter(n => !isNaN(n));

      if (nums.length === 0) {
        return { count: 0, mean: 0, median: 0, min: 0, max: 0, range: 0 };
      }

      nums.sort((a, b) => a - b);
      const min = nums[0];
      const max = nums[nums.length - 1];
      const range = max - min;
      const count = nums.length;

      const sum = nums.reduce((acc, curr) => acc + curr, 0);
      const mean = sum / count;

      let median = 0;
      const mid = Math.floor(count / 2);
      if (count % 2 === 0) {
        median = (nums[mid - 1] + nums[mid]) / 2;
      } else {
        median = nums[mid];
      }

      return { count, mean, median, min, max, range };
    }
  },
  {
    id: "mean-median-mode-range-calculator",
    name: "Mean, Median, Mode, Range Calculator",
    category: "math",
    description: "Dedicated calculator to compute mean, median, mode, and range values of datasets.",
    seo: {
      title: "Mean Median Mode Range Calculator - Find Central Tendencies",
      description: "Quickly compute averages, centers, most-frequent modes, and bounds on lists.",
      keywords: ["mean median mode range", "averages calculator", "central tendencies"]
    },
    formula: "\\text{Mean} = \\frac{\\sum X}{N}",
    explanation: "Mean is the average; median is the middle item; mode is the most common number; range is the difference between high and low.",
    inputs: [
      { id: "dataset", label: "Numbers (Comma Separated)", type: "text", default: "1, 2, 2, 3, 4, 7, 9" }
    ],
    outputs: [
      { id: "mean", label: "Mean (Average)", type: "number", format: "decimal" },
      { id: "median", label: "Median (Middle)", type: "number", format: "decimal" },
      { id: "mode", label: "Mode (Most Common)", type: "text" },
      { id: "range", label: "Range (Max - Min)", type: "number" }
    ],
    calculate: (inputs) => {
      const parts = (inputs.dataset || "").split(",");
      const nums = parts.map(p => parseFloat(p.trim())).filter(n => !isNaN(n));

      if (nums.length === 0) {
        return { mean: 0, median: 0, mode: "None", range: 0 };
      }

      nums.sort((a, b) => a - b);
      const min = nums[0];
      const max = nums[nums.length - 1];
      const range = max - min;

      const mean = nums.reduce((s, x) => s + x, 0) / nums.length;

      let median = 0;
      const mid = Math.floor(nums.length / 2);
      if (nums.length % 2 === 0) {
        median = (nums[mid - 1] + nums[mid]) / 2;
      } else {
        median = nums[mid];
      }

      // Mode
      const counts = {};
      let maxCount = 0;
      let modes = [];
      nums.forEach(n => {
        counts[n] = (counts[n] || 0) + 1;
        if (counts[n] > maxCount) {
          maxCount = counts[n];
        }
      });

      for (let key in counts) {
        if (counts[key] === maxCount) {
          modes.push(key);
        }
      }

      let modeStr = "";
      if (modes.length === nums.length) {
        modeStr = "No Mode";
      } else {
        modeStr = modes.join(", ");
      }

      return { mean, median, mode: modeStr, range };
    }
  },
  {
    id: "permutation-combination-calculator",
    name: "Permutation and Combination Calculator",
    category: "math",
    description: "Determine the number of permutations (ordered lists) and combinations (unordered subsets) of size r from a set of size n.",
    seo: {
      title: "Permutations & Combinations Calculator - nPr and nCr Solver",
      description: "Solve combinations and permutations math. Fits choices of sizes n and r.",
      keywords: ["permutations", "combinations", "nCr calculator", "nPr calculator"]
    },
    formula: "nCr = \\frac{n!}{r!(n-r)!}, \\quad nPr = \\frac{n!}{(n-r)!}",
    explanation: "Permutations count order (e.g. locks). Combinations ignore ordering configurations (e.g. card hands).",
    inputs: [
      { id: "totalN", label: "Total Set Items (n)", type: "number", default: 10, min: 0 },
      { id: "selectR", label: "Chosen Items (r)", type: "number", default: 3, min: 0 }
    ],
    outputs: [
      { id: "perm", label: "Permutations (nPr)", type: "number" },
      { id: "comb", label: "Combinations (nCr)", type: "number" }
    ],
    calculate: (inputs) => {
      const n = parseInt(inputs.totalN) || 0;
      const r = parseInt(inputs.selectR) || 0;

      if (r > n || n < 0 || r < 0) {
        return { perm: 0, comb: 0 };
      }

      const perm = factorial(n) / factorial(n - r);
      const comb = perm / factorial(r);

      return { perm, comb };
    }
  },
  {
    id: "z-score-calculator",
    name: "Z-score Calculator",
    category: "math",
    description: "Calculate Z-scores from raw scores, population means, and standard deviations.",
    seo: {
      title: "Z-score Calculator - Standard Normal Distribution Solver",
      description: "Find Z values and standard normal percentiles.",
      keywords: ["z score calculator", "standard score", "normal distribution curve", "stats test"]
    },
    formula: "Z = \\frac{x - \\mu}{\\sigma}",
    explanation: "A Z-score indicates how many standard deviations a raw score is above or below the population mean.",
    inputs: [
      { id: "raw", label: "Raw Score (x)", type: "number", default: 85 },
      { id: "mean", label: "Population Mean (μ)", type: "number", default: 70 },
      { id: "stdev", label: "Std Deviation (σ)", type: "number", default: 10, min: 0.0001 }
    ],
    outputs: [
      { id: "zscore", label: "Z-Score", type: "number", format: "decimal" },
      { id: "percentile", label: "Percentile (Probability)", type: "text" }
    ],
    calculate: (inputs) => {
      const x = parseFloat(inputs.raw) || 0;
      const m = parseFloat(inputs.mean) || 0;
      const s = parseFloat(inputs.stdev) || 1;

      const z = (x - m) / s;

      // Error function approximation for standard normal CDF
      const errorFn = (val) => {
        const t = 1.0 / (1.0 + 0.5 * Math.abs(val));
        const ans = 1 - t * Math.exp(-val * val - 1.26551223 +
          t * (1.00002368 +
          t * (0.37409196 +
          t * (0.09678418 +
          t * (-0.18628806 +
          t * (0.27886807 +
          t * (-1.13520398 +
          t * (1.48851587 +
          t * (-0.82215223 +
          t * 0.17087277)))))))));
        return val >= 0 ? ans : -ans;
      };

      const cdf = 0.5 * (1 + errorFn(z / Math.sqrt(2)));
      const pct = (cdf * 100).toFixed(2) + "%";

      return {
        zscore: parseFloat(z.toFixed(4)),
        percentile: pct
      };
    }
  },
  {
    id: "confidence-interval-calculator",
    name: "Confidence Interval Calculator",
    category: "math",
    description: "Determine confidence intervals of population means given sample variables.",
    seo: {
      title: "Confidence Interval Calculator - Standard Error Bounds",
      description: "Evaluate upper and lower confidence intervals.",
      keywords: ["confidence interval", "margin of error stats", "z interval", "standard error bounds"]
    },
    formula: "\\text{CI} = \\bar{x} \\pm Z^* \\left( \\frac{s}{\\sqrt{n}} \\right)",
    explanation: "Confidence intervals outline bounds where a population mean likely falls based on a sample subset.",
    inputs: [
      { id: "sampleMean", label: "Sample Mean (x̄)", type: "number", default: 100 },
      { id: "sampleSize", label: "Sample Size (n)", type: "number", default: 50, min: 1 },
      { id: "stdev", label: "Sample Std Dev (s)", type: "number", default: 15, min: 0.0001 },
      {
        id: "confidence",
        label: "Confidence Interval Level",
        type: "select",
        default: "95",
        options: [
          { value: "90", label: "90% (Z = 1.645)" },
          { value: "95", label: "95% (Z = 1.960)" },
          { value: "99", label: "99% (Z = 2.576)" }
        ]
      }
    ],
    outputs: [
      { id: "margin", label: "Margin of Error", type: "number", format: "decimal" },
      { id: "lowerBound", label: "Lower Bound", type: "number", format: "decimal" },
      { id: "upperBound", label: "Upper Bound", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const mean = parseFloat(inputs.sampleMean) || 0;
      const n = parseFloat(inputs.sampleSize) || 1;
      const s = parseFloat(inputs.stdev) || 0;
      const conf = inputs.confidence;

      let z = 1.96;
      if (conf === "90") z = 1.645;
      else if (conf === "99") z = 2.576;

      const se = s / Math.sqrt(n);
      const margin = z * se;
      const lowerBound = mean - margin;
      const upperBound = mean + margin;

      return {
        margin,
        lowerBound,
        upperBound
      };
    }
  },
  {
    id: "triangle-calculator",
    name: "Triangle Calculator",
    category: "math",
    description: "Solve all sides and angles of a triangle based on partially entered measurements.",
    seo: {
      title: "Triangle Calculator - Solve Sides, Angles & Area",
      description: "Solve side lengths and angles using Law of Sines and Cosines.",
      keywords: ["triangle calculator", "sides and angles triangle", "heron's area", "law of sines"]
    },
    formula: "\\text{Law of Cosines: } a^2 = b^2 + c^2 - 2bc\\cos(A)",
    explanation: "Triangles have three sides and angles summing to 180 degrees. Heron's formula solves areas from side lengths.",
    inputs: [
      { id: "sideA", label: "Side a", type: "number", default: 3 },
      { id: "sideB", label: "Side b", type: "number", default: 4 },
      { id: "sideC", label: "Side c", type: "number", default: 5 }
    ],
    outputs: [
      { id: "angleA", label: "Angle A (Degrees)", type: "number", format: "decimal" },
      { id: "angleB", label: "Angle B (Degrees)", type: "number", format: "decimal" },
      { id: "angleC", label: "Angle C (Degrees)", type: "number", format: "decimal" },
      { id: "area", label: "Area", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.sideA) || 0;
      const b = parseFloat(inputs.sideB) || 0;
      const c = parseFloat(inputs.sideC) || 0;

      if (a + b <= c || a + c <= b || b + c <= a) {
        return { angleA: 0, angleB: 0, angleC: 0, area: 0 }; // Triangle inequality violation
      }

      // Cosine rule
      const radA = Math.acos((b * b + c * c - a * a) / (2 * b * c));
      const radB = Math.acos((a * a + c * c - b * b) / (2 * a * c));
      const radC = Math.acos((a * a + b * b - c * c) / (2 * a * b));

      const degA = (radA * 180) / Math.PI;
      const degB = (radB * 180) / Math.PI;
      const degC = (radC * 180) / Math.PI;

      // Heron's Area
      const s = (a + b + c) / 2;
      const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));

      return {
        angleA: degA,
        angleB: degB,
        angleC: degC,
        area
      };
    }
  },
  {
    id: "volume-calculator",
    name: "Volume Calculator",
    category: "math",
    description: "Calculate the volumes of common solid shapes including sphere, cylinder, cone, and rectangular prism.",
    seo: {
      title: "Volume Calculator - Spheres, Cylinders & Cones Solver",
      description: "Find the volume of 3D geometric solid structures.",
      keywords: ["volume calculator", "cylinder volume", "sphere volume", "cube volume"]
    },
    formula: "V_{\\text{cylinder}} = \\pi r^2 h",
    explanation: "Volume quantifies the capacity of three-dimensional spaces, defined in cubic units.",
    inputs: [
      {
        id: "shape",
        label: "Solid Shape",
        type: "select",
        default: "cylinder",
        options: [
          { value: "sphere", label: "Sphere" },
          { value: "cylinder", label: "Cylinder" },
          { value: "cone", label: "Cone" },
          { value: "cube", label: "Cube / Box" }
        ]
      },
      { id: "dim1", label: "Radius (or Width)", type: "number", default: 5 },
      { id: "dim2", label: "Height (or Length)", type: "number", default: 10 },
      { id: "dim3", label: "Depth (Cube Box Only)", type: "number", default: 4 }
    ],
    outputs: [
      { id: "volume", label: "Volume (cubic units)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const shape = inputs.shape;
      const r = parseFloat(inputs.dim1) || 0;
      const h = parseFloat(inputs.dim2) || 0;
      const d = parseFloat(inputs.dim3) || 0;

      let volume = 0;
      if (shape === "sphere") {
        volume = (4 / 3) * Math.PI * Math.pow(r, 3);
      } else if (shape === "cylinder") {
        volume = Math.PI * r * r * h;
      } else if (shape === "cone") {
        volume = (1 / 3) * Math.PI * r * r * h;
      } else if (shape === "cube") {
        volume = r * h * d;
      }

      return { volume };
    }
  },
  {
    id: "slope-calculator",
    name: "Slope Calculator",
    category: "math",
    description: "Calculate slopes, linear distances, and line angles between two coordinates.",
    seo: {
      title: "Slope Calculator - Find Line Slopes & Angles",
      description: "Solve coordinates to determine line slopes.",
      keywords: ["slope calculator", "find slope", "line angle", "coordinates solver"]
    },
    formula: "m = \\frac{y_2 - y_1}{x_2 - x_1}",
    explanation: "Slope measures the steepness and direction of a line connecting two Cartesian points.",
    inputs: [
      { id: "x1", label: "Coordinate x1", type: "number", default: 1 },
      { id: "y1", label: "Coordinate y1", type: "number", default: 2 },
      { id: "x2", label: "Coordinate x2", type: "number", default: 4 },
      { id: "y2", label: "Coordinate y2", type: "number", default: 8 }
    ],
    outputs: [
      { id: "slope", label: "Slope (m)", type: "number", format: "decimal" },
      { id: "angle", label: "Angle (Degrees)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const x1 = parseFloat(inputs.x1) || 0;
      const y1 = parseFloat(inputs.y1) || 0;
      const x2 = parseFloat(inputs.x2) || 0;
      const y2 = parseFloat(inputs.y2) || 0;

      if (x2 - x1 === 0) {
        return { slope: Infinity, angle: 90 };
      }

      const m = (y2 - y1) / (x2 - x1);
      const angle = (Math.atan(m) * 180) / Math.PI;

      return { slope: m, angle };
    }
  },
  {
    id: "area-calculator",
    name: "Area Calculator",
    category: "math",
    description: "Solve the surface area size of 2D shapes including circles, rectangles, triangles, and ellipses.",
    seo: {
      title: "Area Calculator - 2D Shapes Area Solver",
      description: "Find standard circle, square, or triangle flat dimensions.",
      keywords: ["area calculator", "circle area", "triangle area", "geometric space"]
    },
    formula: "A = L \\times W",
    explanation: "Area defines the metric size enclosed inside a flat boundary profile.",
    inputs: [
      {
        id: "shape",
        label: "2D Profile Shape",
        type: "select",
        default: "rectangle",
        options: [
          { value: "circle", label: "Circle" },
          { value: "rectangle", label: "Rectangle / Square" },
          { value: "triangle", label: "Triangle" }
        ]
      },
      { id: "dim1", label: "Dimension 1 (Radius / Width / Base)", type: "number", default: 5 },
      { id: "dim2", label: "Dimension 2 (Height / Length)", type: "number", default: 10 }
    ],
    outputs: [
      { id: "area", label: "Area (square units)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const shape = inputs.shape;
      const d1 = parseFloat(inputs.dim1) || 0;
      const d2 = parseFloat(inputs.dim2) || 0;

      let area = 0;
      if (shape === "circle") {
        area = Math.PI * d1 * d1;
      } else if (shape === "rectangle") {
        area = d1 * d2;
      } else if (shape === "triangle") {
        area = 0.5 * d1 * d2;
      }

      return { area };
    }
  },
  {
    id: "distance-calculator",
    name: "Distance Calculator",
    category: "math",
    description: "Find the straight-line Cartesian distance between two coordinates.",
    seo: {
      title: "Distance Calculator - Cartesian Coordinate Solver",
      description: "Find linear spans between spatial coordinates.",
      keywords: ["distance calculator", "linear space distance", "cartesian coordinates"]
    },
    formula: "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}",
    explanation: "Euclidean distance evaluates the shortest segment connecting two discrete grid points.",
    inputs: [
      { id: "x1", label: "x1", type: "number", default: 0 },
      { id: "y1", label: "y1", type: "number", default: 0 },
      { id: "x2", label: "x2", type: "number", default: 3 },
      { id: "y2", label: "y2", type: "number", default: 4 }
    ],
    outputs: [
      { id: "distance", label: "Distance", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const x1 = parseFloat(inputs.x1) || 0;
      const y1 = parseFloat(inputs.y1) || 0;
      const x2 = parseFloat(inputs.x2) || 0;
      const y2 = parseFloat(inputs.y2) || 0;

      const d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      return { distance: d };
    }
  },
  {
    id: "circle-calculator",
    name: "Circle Calculator",
    category: "math",
    description: "Calculate radius, diameter, circumference, and area of a circle from any single known dimension.",
    seo: {
      title: "Circle Calculator - Area & Circumference Solver",
      description: "Solve circle dimensions. Compute perimeter outputs from simple radius inputs.",
      keywords: ["circle calculator", "circumference circle", "diameter solver", "radius area"]
    },
    formula: "C = 2\\pi r, \\quad A = \\pi r^2",
    explanation: "A circle is all points equidistant from the center. Its ratio of circumference to diameter is defined as Pi.",
    inputs: [
      { id: "radius", label: "Radius (r)", type: "number", default: 5 }
    ],
    outputs: [
      { id: "diameter", label: "Diameter", type: "number", format: "decimal" },
      { id: "circumference", label: "Circumference (Perimeter)", type: "number", format: "decimal" },
      { id: "area", label: "Area", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const r = parseFloat(inputs.radius) || 0;

      return {
        diameter: r * 2,
        circumference: 2 * Math.PI * r,
        area: Math.PI * r * r
      };
    }
  },
  {
    id: "surface-area-calculator",
    name: "Surface Area Calculator",
    category: "math",
    description: "Calculate the surface areas of spheres, cylinders, cones, and boxes.",
    seo: {
      title: "Surface Area Calculator - Solid Geometric Solvers",
      description: "Compute surface parameters for three-dimensional models.",
      keywords: ["surface area", "cylinder area", "sphere surface area", "cube box dimensions"]
    },
    formula: "SA_{\\text{sphere}} = 4\\pi r^2",
    explanation: "Surface area evaluates the sum total area of all exposed facets of an object.",
    inputs: [
      {
        id: "shape",
        label: "Solid Shape",
        type: "select",
        default: "sphere",
        options: [
          { value: "sphere", label: "Sphere" },
          { value: "cylinder", label: "Cylinder" },
          { value: "cube", label: "Cube / Box" }
        ]
      },
      { id: "dim1", label: "Radius (or Width)", type: "number", default: 5 },
      { id: "dim2", label: "Height (or Length)", type: "number", default: 10 },
      { id: "dim3", label: "Depth (Cube Box Only)", type: "number", default: 4 }
    ],
    outputs: [
      { id: "area", label: "Surface Area (sq units)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const shape = inputs.shape;
      const r = parseFloat(inputs.dim1) || 0;
      const h = parseFloat(inputs.dim2) || 0;
      const d = parseFloat(inputs.dim3) || 0;

      let area = 0;
      if (shape === "sphere") {
        area = 4 * Math.PI * r * r;
      } else if (shape === "cylinder") {
        area = 2 * Math.PI * r * (r + h);
      } else if (shape === "cube") {
        area = 2 * (r * h + h * d + r * d);
      }
      return { area };
    }
  },
  {
    id: "pythagorean-theorem-calculator",
    name: "Pythagorean Theorem Calculator",
    category: "math",
    description: "Calculate hypotenuse or side lengths of a right triangle using the Pythagorean theorem solver.",
    seo: {
      title: "Pythagorean Theorem Calculator - Solve Right Triangles",
      description: "Compute hypotenuse side lengths easily.",
      keywords: ["pythagorean theorem", "right triangle hypotenuse", "geometry solver", "triangle sides"]
    },
    formula: "a^2 + b^2 = c^2",
    explanation: "For right-angled triangles, the square of the hypotenuse equals the sum of the squares of the other two sides.",
    inputs: [
      { id: "sideA", label: "Side a", type: "number", default: 3 },
      { id: "sideB", label: "Side b", type: "number", default: 4 },
      { id: "sideC", label: "Hypotenuse c (Leave 0 to Solve)", type: "number", default: 0 }
    ],
    outputs: [
      { id: "solvedC", label: "Resulting Side Value", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.sideA) || 0;
      const b = parseFloat(inputs.sideB) || 0;
      let c = parseFloat(inputs.sideC) || 0;

      if (c === 0) {
        c = Math.sqrt(a * a + b * b);
      } else {
        if (c > a) {
          c = Math.sqrt(c * c - a * a); // Solved b
        }
      }
      return { solvedC: c };
    }
  },
  {
    id: "right-triangle-calculator",
    name: "Right Triangle Calculator",
    category: "math",
    description: "Dedicated right triangle solver using trigonometry relationships (SOH CAH TOA).",
    seo: {
      title: "Right Triangle Calculator - Trigonometry solver",
      description: "Calculate right triangle sides and angles with standard trigonometric functions.",
      keywords: ["right triangle", "trigonometry calculator", "sine cosine solver", "soh cah toa"]
    },
    formula: "\\sin(\\theta) = \\frac{\\text{opposite}}{\\text{hypotenuse}}",
    explanation: "Right triangle calculators determine missing properties from a side and an angle or two sides.",
    inputs: [
      { id: "sideA", label: "Opposite Side (a)", type: "number", default: 3 },
      { id: "angleA", label: "Angle A (Degrees, Leave 0 to use Side b)", type: "number", default: 0 },
      { id: "sideB", label: "Adjacent Side (b)", type: "number", default: 4 }
    ],
    outputs: [
      { id: "hypotenuse", label: "Hypotenuse (c)", type: "number", format: "decimal" },
      { id: "solvedAngle", label: "Angle A (Degrees)", type: "number", format: "decimal" },
      { id: "angleB", label: "Angle B (Degrees)", type: "number", format: "decimal" }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.sideA) || 0;
      const angA = parseFloat(inputs.angleA) || 0;
      const b = parseFloat(inputs.sideB) || 0;

      let hyp = 0;
      let solvedAngA = 0;

      if (angA > 0 && angA < 90) {
        solvedAngA = angA;
        const rad = (angA * Math.PI) / 180;
        hyp = a / Math.sin(rad);
      } else {
        hyp = Math.sqrt(a * a + b * b);
        solvedAngA = (Math.atan(a / (b || 1)) * 180) / Math.PI;
      }

      return {
        hypotenuse: hyp,
        solvedAngle: solvedAngA,
        angleB: 90 - solvedAngA
      };
    }
  }
];
