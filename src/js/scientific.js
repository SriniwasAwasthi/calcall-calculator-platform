// Scientific Calculator Engine (Zero-Dependency Parser)

let angleMode = 'rad'; // 'rad' or 'deg'
let currentExpression = '';
let displayExpr = ''; // Human-friendly display string

export function initScientificCalculator() {
  const exprEl = document.getElementById('sci-expr');
  const valEl = document.getElementById('sci-val');
  const keypad = document.querySelector('.scientific-keypad');

  if (!exprEl || !valEl || !keypad) return;

  // Bind Rad/Deg active state styling
  updateAngleModeUI();

  // Listen to virtual keypad clicks
  keypad.addEventListener('click', (e) => {
    const btn = e.target.closest('.sci-btn');
    if (!btn) return;

    const val = btn.getAttribute('data-val');
    handleInput(val, exprEl, valEl);
  });

  // Listen to keyboard inputs
  document.addEventListener('keydown', (e) => {
    // Prevent interfering if user is searching
    if (document.activeElement.tagName === 'INPUT') return;

    let key = e.key;
    if (key >= '0' && key <= '9') {
      handleInput(key, exprEl, valEl);
    } else if (key === '.' || key === '+' || key === '-' || key === '*' || key === '/' || key === '^' || key === '(' || key === ')') {
      handleInput(key, exprEl, valEl);
    } else if (key === 'Enter' || key === '=') {
      e.preventDefault();
      handleInput('=', exprEl, valEl);
    } else if (key === 'Backspace') {
      handleInput('DEL', exprEl, valEl);
    } else if (key === 'Escape') {
      handleInput('C', exprEl, valEl);
    }
  });
}

function updateAngleModeUI() {
  const btn = document.getElementById('btn-angle-mode');
  if (btn) {
    btn.textContent = angleMode === 'rad' ? 'Rad' : 'Deg';
    btn.style.backgroundColor = angleMode === 'deg' ? 'var(--primary)' : '';
    btn.style.color = angleMode === 'deg' ? '#ffffff' : '';
  }
}

function handleInput(val, exprEl, valEl) {
  if (!val) return;

  if (val === 'toggle-angle') {
    angleMode = angleMode === 'rad' ? 'deg' : 'rad';
    updateAngleModeUI();
    return;
  }

  if (val === 'C') {
    currentExpression = '';
    displayExpr = '';
  } else if (val === 'DEL') {
    if (currentExpression.length > 0) {
      // If we are deleting a function like "sin(", delete all of it
      const matchFn = currentExpression.match(/(sin\(|cos\(|tan\(|log\(|ln\(|sqrt\()$/);
      if (matchFn) {
        currentExpression = currentExpression.substring(0, currentExpression.length - matchFn[0].length);
        displayExpr = displayExpr.substring(0, displayExpr.length - matchFn[0].length);
      } else {
        currentExpression = currentExpression.slice(0, -1);
        displayExpr = displayExpr.slice(0, -1);
      }
    }
  } else if (val === '=') {
    try {
      const res = evaluateMathExpression(currentExpression);
      valEl.textContent = Number.isInteger(res) ? res : parseFloat(res.toFixed(8));
    } catch (err) {
      valEl.textContent = 'Error';
    }
    return;
  } else {
    // Prevent multiple decimals in a single number sequence
    if (val === '.') {
      const lastNum = currentExpression.split(/[\+\-\*\/\^\(\)]/).pop();
      if (lastNum.includes('.')) return;
    }
    
    currentExpression += val;
    displayExpr += (btnLabels[val] || val);
  }

  exprEl.textContent = displayExpr || '0';
}

const btnLabels = {
  'sin(': 'sin(',
  'cos(': 'cos(',
  'tan(': 'tan(',
  'log(': 'log(',
  'ln(': 'ln(',
  'sqrt(': '√(',
  'pi': 'π',
  'e': 'e'
};

// Safe Tokenizer and Recursive Descent Mathematical Expression Parser
function evaluateMathExpression(exprStr) {
  if (!exprStr.trim()) return 0;
  
  // Clean up implicit multiplication, e.g., 2pi -> 2*pi, (2+3)(4) -> (2+3)*(4), etc.
  let cleaned = exprStr
    .replace(/(\d+)(pi|e)/g, '$1*$2')
    .replace(/(pi|e)(\d+)/g, '$1*$2')
    .replace(/(\))(\()/g, '$1*$2')
    .replace(/(\d+)(\()/g, '$1*$2')
    .replace(/(\))(sin|cos|tan|log|ln|sqrt|pi|e)/g, '$1*$2');

  const tokens = tokenize(cleaned);
  let tokenIndex = 0;

  function peek() {
    return tokens[tokenIndex];
  }

  function consume(expectedValue) {
    const token = tokens[tokenIndex];
    if (!token || (expectedValue && token.value !== expectedValue)) {
      throw new Error(`Unexpected token at index ${tokenIndex}`);
    }
    tokenIndex++;
    return token;
  }

  // Parsing Grammar
  // expression -> term ( ( '+' | '-' ) term )*
  // term -> factor ( ( '*' | '/' ) factor )*
  // factor -> base ( '^' factor )?   (right-associative power)
  // base -> [unary sign] ( Number | Constant | '(' expression ')' | Function '(' expression ')' )

  function parseExpression() {
    let node = parseTerm();
    while (peek() && (peek().value === '+' || peek().value === '-')) {
      const op = consume().value;
      const right = parseTerm();
      if (op === '+') node += right;
      else node -= right;
    }
    return node;
  }

  function parseTerm() {
    let node = parseFactor();
    while (peek() && (peek().value === '*' || peek().value === '/')) {
      const op = consume().value;
      const right = parseFactor();
      if (op === '*') {
        node *= right;
      } else {
        if (right === 0) throw new Error('Division by zero');
        node /= right;
      }
    }
    return node;
  }

  function parseFactor() {
    let node = parseBase();
    if (peek() && peek().value === '^') {
      consume(); // consume '^'
      const right = parseFactor(); // power is right-associative
      node = Math.pow(node, right);
    }
    return node;
  }

  function parseBase() {
    let token = peek();
    if (!token) throw new Error('Unexpected end of expression');

    // Handle Unary signs
    let sign = 1;
    if (token.value === '+' || token.value === '-') {
      sign = token.value === '-' ? -1 : 1;
      consume();
      token = peek();
    }

    if (token.type === 'NUMBER') {
      consume();
      return parseFloat(token.value) * sign;
    }

    if (token.type === 'CONSTANT') {
      consume();
      const val = token.value === 'pi' ? Math.PI : Math.E;
      return val * sign;
    }

    if (token.value === '(') {
      consume(); // consume '('
      const val = parseExpression();
      if (peek() && peek().value === ')') {
        consume(); // consume ')'
      }
      return val * sign;
    }

    // Function calls
    if (token.type === 'FUNCTION') {
      const fnName = consume().value;
      consume('('); // consume '('
      let val = parseExpression();
      if (peek() && peek().value === ')') {
        consume(); // consume ')'
      }

      // Trignometric Radian vs Degree conversions
      if (fnName === 'sin' || fnName === 'cos' || fnName === 'tan') {
        if (angleMode === 'deg') {
          val = (val * Math.PI) / 180;
        }
      }

      let res = 0;
      switch (fnName) {
        case 'sin': res = Math.sin(val); break;
        case 'cos': res = Math.cos(val); break;
        case 'tan': res = Math.tan(val); break;
        case 'log': res = Math.log10(val); break;
        case 'ln': res = Math.log(val); break;
        case 'sqrt':
          if (val < 0) throw new Error('Negative root');
          res = Math.sqrt(val);
          break;
      }
      return res * sign;
    }

    throw new Error(`Unexpected token: ${token.value}`);
  }

  return parseExpression();
}

function tokenize(str) {
  const tokens = [];
  let i = 0;

  while (i < str.length) {
    const char = str[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Operators and brackets
    if ('+-*/^()'.includes(char)) {
      tokens.push({ type: 'OPERATOR', value: char });
      i++;
      continue;
    }

    // Numbers
    if (/\d/.test(char) || char === '.') {
      let numStr = '';
      while (i < str.length && (/[0-9.]/.test(str[i]))) {
        numStr += str[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }

    // Alphabetic tokens (Constants and functions)
    if (/[a-zA-Z]/.test(char)) {
      let word = '';
      while (i < str.length && /[a-zA-Z]/.test(str[i])) {
        word += str[i];
        i++;
      }

      if (word === 'pi' || word === 'e') {
        tokens.push({ type: 'CONSTANT', value: word });
      } else if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'].includes(word)) {
        tokens.push({ type: 'FUNCTION', value: word });
      } else {
        throw new Error(`Unknown keyword: ${word}`);
      }
      continue;
    }

    throw new Error(`Unexpected character: ${char}`);
  }

  return tokens;
}
