// Client-side Calculator Runtime Engine
import { getRecents, addRecent } from './recent.js';

export function initCalculatorRuntime(calculatorId, calculatorsDataset) {
  const calc = calculatorsDataset.find(c => c.id === calculatorId);
  if (!calc) return;

  const form = document.getElementById('calculator-inputs-form');
  const resultsWrapper = document.getElementById('calculator-results-wrapper');
  if (!form || !resultsWrapper) return;

  // Setup GPA Dynamic Input Fields if it's the GPA calculator
  if (calculatorId === 'gpa-calculator') {
    // Ensure container is created
    let container = document.getElementById('gpa-courses-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'gpa-courses-container';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = 'var(--space-md)';
      container.style.marginTop = 'var(--space-md)';
      form.appendChild(container);
    }
    // Read numCourses from URL query or default value of the element
    const params = new URLSearchParams(window.location.search);
    let numCourses = parseInt(params.get('numCourses'));
    const numCoursesEl = form.querySelector('[data-key="numCourses"]');
    if (!numCourses) {
      numCourses = numCoursesEl ? parseInt(numCoursesEl.value) : 4;
    } else if (numCoursesEl) {
      numCoursesEl.value = numCourses;
    }
    // Render rows
    updateGPACourseRows(container, numCourses);
  }

  // Hydrate inputs from URL search parameters if present (Sharing Hydration)
  hydrateInputsFromURL(form);

  // Auto-populate empty date fields with today's local date (timezone-safe)
  const dateInputs = form.querySelectorAll('input[type="date"]');
  const tzOffset = new Date().getTimezoneOffset() * 60000;
  const localISOTime = new Date(Date.now() - tzOffset).toISOString().slice(0, 10);
  dateInputs.forEach(input => {
    if (!input.value) {
      input.value = localISOTime;
    }
  });

  // Initial Calculation Run
  runCalculation(calc, form);

  // Bind input listeners to trigger calculations on value adjustments
  form.addEventListener('input', (e) => {
    runCalculation(calc, form);
    updateURLParams(form);
  });

  form.addEventListener('change', (e) => {
    runCalculation(calc, form);
    updateURLParams(form);
  });

  // Sharing binds: Copy Link
  const copyBtn = document.getElementById('btn-copy-link');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const shareUrl = window.location.href;
      navigator.clipboard.writeText(shareUrl).then(() => {
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2.5" style="width: 16px; height: 16px;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        copyBtn.style.borderColor = 'var(--success)';
        setTimeout(() => {
          copyBtn.innerHTML = originalHTML;
          copyBtn.style.borderColor = '';
        }, 1500);
      });
    });
  }

  // Sharing binds: Web Share API
  const shareBtn = document.getElementById('btn-share');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const shareUrl = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: calc.name + ' - CalcAll',
          text: calc.description,
          url: shareUrl
        }).catch(err => console.log('Share canceled'));
      } else {
        // Fallback: trigger copy link highlight
        if (copyBtn) copyBtn.click();
      }
    });
  }
}

function runCalculation(calc, form) {
  if (calc.id === 'gpa-calculator') {
    const numCoursesEl = form.querySelector('[data-key="numCourses"]');
    const container = document.getElementById('gpa-courses-container');
    if (numCoursesEl && container) {
      const val = parseInt(numCoursesEl.value) || 1;
      updateGPACourseRows(container, val);
    }
  }

  // Read inputs from DOM elements matching data-key attributes
  const inputs = {};
  const elements = form.querySelectorAll('.form-input, .form-select');
  
  elements.forEach(el => {
    const key = el.getAttribute('data-key');
    if (!key) return;

    if (el.tagName === 'SELECT') {
      inputs[key] = el.value;
    } else if (el.getAttribute('type') === 'date' || el.getAttribute('type') === 'text') {
      inputs[key] = el.value;
    } else {
      inputs[key] = parseFloat(el.value) || 0;
    }
  });

  // Calculate results using standard logic function
  if (typeof calc.calculate === 'function') {
    try {
      const outputs = calc.calculate(inputs);
      renderResults(calc, outputs);
    } catch (err) {
      console.error('Calculation Error:', err);
    }
  }
}

function renderResults(calc, outputs) {
  // Map standard outputs
  calc.outputs.forEach(out => {
    const el = document.getElementById(`result-${out.id}`);
    if (!el) return;

    const val = outputs[out.id];

    if (out.type === 'custom') {
      if (out.id === 'amortizationData') {
        renderAmortizationTable(el, val);
      } else if (out.id === 'growthData') {
        renderGrowthTableAndChart(el, val);
      }
    } else {
      // Format number display
      if (out.format === 'currency') {
        el.textContent = formatCurrency(val);
      } else if (out.format === 'decimal') {
        el.textContent = formatDecimal(val);
      } else {
        el.textContent = val;
      }
    }
  });

  // Handle specialized widget actions: BMI gauge positioning
  if (calc.id === 'bmi-calculator' && outputs.gaugePosition !== undefined) {
    let pin = document.getElementById('bmi-gauge-pin');
    if (!pin) {
      const bar = document.querySelector('.bmi-gauge-bar');
      if (bar) {
        pin = document.createElement('div');
        pin.id = 'bmi-gauge-pin';
        pin.className = 'bmi-gauge-pin';
        bar.appendChild(pin);
      }
    }
    if (pin) {
      pin.style.left = `${outputs.gaugePosition}%`;
    }

    // Set success/warning alert color on BMI card based on classification
    const categoryCard = document.getElementById('card-category');
    if (categoryCard) {
      categoryCard.className = 'result-card'; // Reset
      if (outputs.category === 'Normal Weight') {
        categoryCard.classList.add('success');
      } else {
        categoryCard.classList.add('alert');
      }
    }
  }
}

// Render dynamic mortgage / loan amortization schedules
function renderAmortizationTable(container, schedule) {
  if (!schedule || schedule.length === 0) {
    container.innerHTML = '<p style="padding: var(--space-md); text-align: center;">Enter loan details to view table.</p>';
    return;
  }

  // Filter schedule to show yearly summary if terms are long, preventing massive tables
  const showYearly = schedule.length > 24;
  let rows = [];

  if (showYearly) {
    // Group monthly amortizations into annual blocks
    let yearInterest = 0;
    let yearPrincipal = 0;
    let lastBalance = schedule[0].balance + schedule[0].principal; // Start principal
    let yearNum = 1;

    schedule.forEach((m, idx) => {
      yearInterest += m.interest;
      yearPrincipal += m.principal;
      
      if ((idx + 1) % 12 === 0 || idx === schedule.length - 1) {
        rows.push(`
          <tr>
            <td>Year ${yearNum}</td>
            <td>${formatCurrency(yearPrincipal + yearInterest)}</td>
            <td>${formatCurrency(yearPrincipal)}</td>
            <td>${formatCurrency(yearInterest)}</td>
            <td>${formatCurrency(m.balance)}</td>
          </tr>
        `);
        yearInterest = 0;
        yearPrincipal = 0;
        yearNum++;
      }
    });
  } else {
    // Show monthly detail directly
    rows = schedule.map(m => `
      <tr>
        <td>Month ${m.month}</td>
        <td>${formatCurrency(m.payment)}</td>
        <td>${formatCurrency(m.principal)}</td>
        <td>${formatCurrency(m.interest)}</td>
        <td>${formatCurrency(m.balance)}</td>
      </tr>
    `);
  }

  container.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>${showYearly ? 'Year' : 'Month'}</th>
          <th>Total Payment</th>
          <th>Principal Portion</th>
          <th>Interest Portion</th>
          <th>Remaining Balance</th>
        </tr>
      </thead>
      <tbody>
        ${rows.join('')}
      </tbody>
    </table>
  `;
}

// Draw custom high-performance SVG line/area growth charts for compound interest calculations
function renderGrowthTableAndChart(tableContainer, schedule) {
  // Render growth table first
  if (!schedule || schedule.length === 0) {
    tableContainer.innerHTML = '<p style="padding: var(--space-md); text-align: center;">Enter values to view growth list.</p>';
    return;
  }

  const rows = schedule.map(y => `
    <tr>
      <td>Year ${y.year}</td>
      <td>${formatCurrency(y.balance)}</td>
      <td>${formatCurrency(y.principal)}</td>
      <td>${formatCurrency(y.interest)}</td>
    </tr>
  `);

  tableContainer.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Year</th>
          <th>Total Value</th>
          <th>Total Principal</th>
          <th>Interest Earned</th>
        </tr>
      </thead>
      <tbody>
        ${rows.join('')}
      </tbody>
    </table>
  `;

  // Draw SVG Chart
  const chartBox = document.getElementById('result-growthChart-container');
  if (!chartBox) return;

  const width = 500;
  const height = 220;
  const padLeft = 65;
  const padRight = 15;
  const padTop = 20;
  const padBottom = 30;

  const graphWidth = width - padLeft - padRight;
  const graphHeight = height - padTop - padBottom;

  const maxVal = Math.max(...schedule.map(s => s.balance)) || 1000;
  const totalYears = schedule[schedule.length - 1].year || 1; // Prevent division-by-zero if years is 0

  // Convert points to coordinate pairs
  const pointsBalance = [];
  const pointsPrincipal = [];

  schedule.forEach(s => {
    const x = padLeft + (s.year / totalYears) * graphWidth;
    const yBal = height - padBottom - (s.balance / maxVal) * graphHeight;
    const yPrn = height - padBottom - (s.principal / maxVal) * graphHeight;

    pointsBalance.push(`${x},${yBal}`);
    pointsPrincipal.push(`${x},${yPrn}`);
  });

  // Compile path strings
  const balanceAreaPath = `M ${padLeft},${height - padBottom} L ${pointsBalance.join(' L ')} L ${width - padRight},${height - padBottom} Z`;
  const principalAreaPath = `M ${padLeft},${height - padBottom} L ${pointsPrincipal.join(' L ')} L ${width - padRight},${height - padBottom} Z`;

  const balanceLinePath = `M ${pointsBalance.join(' L ')}`;
  const principalLinePath = `M ${pointsPrincipal.join(' L ')}`;

  // Generate grid Y lines
  const gridLines = [];
  const numGridLines = 4;
  for (let i = 0; i <= numGridLines; i++) {
    const val = (maxVal / numGridLines) * i;
    const y = height - padBottom - (i / numGridLines) * graphHeight;
    gridLines.push(`
      <line x1="${padLeft}" y1="${y}" x2="${width - padRight}" y2="${y}" stroke="var(--border-color)" stroke-dasharray="4,4" />
      <text x="${padLeft - 8}" y="${y + 4}" font-size="10" fill="var(--text-secondary)" text-anchor="end">${formatCompactCurrency(val)}</text>
    `);
  }

  // Generate X axis markers (Year ticks)
  const xTicks = [];
  const tickStep = Math.max(1, Math.round(totalYears / 5));
  schedule.forEach(s => {
    if (s.year % tickStep === 0 || s.year === totalYears) {
      const x = padLeft + (s.year / totalYears) * graphWidth;
      xTicks.push(`
        <line x1="${x}" y1="${height - padBottom}" x2="${x}" y2="${height - padBottom + 4}" stroke="var(--border-color)" />
        <text x="${x}" y="${height - padBottom + 18}" font-size="10" fill="var(--text-secondary)" text-anchor="middle">Yr ${s.year}</text>
      `);
    }
  });

  chartBox.innerHTML = `
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Gradients for stacked areas -->
        <linearGradient id="grad-balance" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--success)" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="var(--success)" stop-opacity="0.0"/>
        </linearGradient>
        <linearGradient id="grad-principal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.0"/>
        </linearGradient>
      </defs>

      <!-- Grid and Axes -->
      ${gridLines.join('')}
      ${xTicks.join('')}
      <line x1="${padLeft}" y1="${height - padBottom}" x2="${width - padRight}" y2="${height - padBottom}" stroke="var(--border-color)" stroke-width="1.5" />
      <line x1="${padLeft}" y1="${padTop}" x2="${padLeft}" y2="${height - padBottom}" stroke="var(--border-color)" stroke-width="1.5" />

      <!-- Area Fills -->
      <path d="${balanceAreaPath}" fill="url(#grad-balance)" />
      <path d="${principalAreaPath}" fill="url(#grad-principal)" />

      <!-- Lines -->
      <path d="${balanceLinePath}" fill="none" stroke="var(--success)" stroke-width="2.5" />
      <path d="${principalLinePath}" fill="none" stroke="var(--primary)" stroke-width="2.5" />
    </svg>
  `;
}

// Helpers
function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
}

function formatDecimal(val) {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
}

function formatCompactCurrency(val) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);
}

// Hydrate inputs from URL query parameters (Sharing recovery)
function hydrateInputsFromURL(form) {
  const params = new URLSearchParams(window.location.search);
  params.forEach((value, key) => {
    const el = form.querySelector(`[data-key="${key}"]`);
    if (el) {
      if (el.getAttribute('type') === 'checkbox') {
        el.checked = value === 'true';
      } else {
        el.value = value;
      }
    }
  });
}

// Update URL parameters dynamically as forms change
function updateURLParams(form) {
  const params = new URLSearchParams();
  const elements = form.querySelectorAll('.form-input, .form-select');
  
  elements.forEach(el => {
    const key = el.getAttribute('data-key');
    if (!key) return;
    
    if (el.getAttribute('type') === 'checkbox') {
      if (el.checked) params.set(key, 'true');
    } else if (el.value) {
      params.set(key, el.value);
    }
  });

  const newSearch = params.toString();
  const newRelativePathQuery = window.location.pathname + (newSearch ? '?' + newSearch : '');
  window.history.replaceState(null, '', newRelativePathQuery);
}

function updateGPACourseRows(container, count) {
  const currentRows = container.querySelectorAll('.gpa-course-row');
  const currentCount = currentRows.length;
  
  if (count > currentCount) {
    // Append rows
    for (let i = currentCount + 1; i <= count; i++) {
      const row = document.createElement('div');
      row.className = 'gpa-course-row';
      row.setAttribute('data-index', i);
      row.style.borderTop = '1px solid var(--border-color)';
      row.style.paddingTop = 'var(--space-md)';
      row.style.marginTop = 'var(--space-sm)';
      row.style.display = 'grid';
      row.style.gridTemplateColumns = '1fr 1fr';
      row.style.gap = 'var(--space-md)';
      
      row.innerHTML = `
        <div class="form-group">
          <label class="form-label" for="input-c${i}">Course ${i} Credits</label>
          <input type="number" id="input-c${i}" data-key="c${i}" class="form-input" value="3" min="0" step="any">
        </div>
        <div class="form-group">
          <label class="form-label" for="input-g${i}">Course ${i} Grade</label>
          <select id="input-g${i}" data-key="g${i}" class="form-select">
            <option value="4">A (4.0)</option>
            <option value="3.7">A- (3.7)</option>
            <option value="3.3">B+ (3.3)</option>
            <option value="3">B (3.0)</option>
            <option value="2.7">B- (2.7)</option>
            <option value="2.3">C+ (2.3)</option>
            <option value="2">C (2.0)</option>
            <option value="1.7">C- (1.7)</option>
            <option value="1.3">D+ (1.3)</option>
            <option value="1">D (1.0)</option>
            <option value="0">F (0.0)</option>
          </select>
        </div>
      `;
      container.appendChild(row);
    }
  } else if (count < currentCount) {
    // Remove excess rows
    for (let i = currentCount; i > count; i--) {
      const row = container.querySelector(`.gpa-course-row[data-index="${i}"]`);
      if (row) {
        row.remove();
      }
    }
  }
}
