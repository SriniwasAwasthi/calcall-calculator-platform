import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { categories, calculators } from './src/data/calculators.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, 'dist');
const SRC_DIR = path.join(__dirname, 'src');

// Domain URL for SEO tags and sitemaps (local dev as fallback, production when deployed)
const DOMAIN = 'https://calculist.netlify.app';

// Ensure fresh directories exist
function ensureDirs() {
  const folders = [
    DIST_DIR,
    path.join(DIST_DIR, 'css'),
    path.join(DIST_DIR, 'js'),
    path.join(DIST_DIR, 'all'),
    path.join(DIST_DIR, 'search'),
    path.join(DIST_DIR, 'sitemap')
  ];

  // Add category directories
  Object.keys(categories).forEach(cat => {
    folders.push(path.join(DIST_DIR, cat));
  });

  // Add calculator detail directories
  calculators.forEach(calc => {
    folders.push(path.join(DIST_DIR, calc.category, calc.id));
  });

  folders.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Helper to copy directory files
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Generate HTML Input fields based on configuration schema
function generateInputsFormHTML(calc) {
  if (calc.customLayout === 'scientific') {
    return `
      <div class="scientific-display">
        <div id="sci-expr" class="sci-expression"></div>
        <div id="sci-val" class="sci-output">0</div>
      </div>
      <div class="scientific-keypad">
        <button class="sci-btn btn-action" data-val="C">C</button>
        <button class="sci-btn btn-action" data-val="DEL">DEL</button>
        <button class="sci-btn btn-fn" data-val="(">(</button>
        <button class="sci-btn btn-fn" data-val=")">)</button>
        <button class="sci-btn btn-op" data-val="/">/</button>

        <button class="sci-btn btn-fn" data-val="sin(">sin</button>
        <button class="sci-btn" data-val="7">7</button>
        <button class="sci-btn" data-val="8">8</button>
        <button class="sci-btn" data-val="9">9</button>
        <button class="sci-btn btn-op" data-val="*">*</button>

        <button class="sci-btn btn-fn" data-val="cos(">cos</button>
        <button class="sci-btn" data-val="4">4</button>
        <button class="sci-btn" data-val="5">5</button>
        <button class="sci-btn" data-val="6">6</button>
        <button class="sci-btn btn-op" data-val="-">-</button>

        <button class="sci-btn btn-fn" data-val="tan(">tan</button>
        <button class="sci-btn" data-val="1">1</button>
        <button class="sci-btn" data-val="2">2</button>
        <button class="sci-btn" data-val="3">3</button>
        <button class="sci-btn btn-op" data-val="+">+</button>

        <button class="sci-btn btn-fn" data-val="log(">log</button>
        <button class="sci-btn btn-fn" data-val="ln(">ln</button>
        <button class="sci-btn" data-val="0">0</button>
        <button class="sci-btn" data-val=".">.</button>
        <button class="sci-btn btn-eval" data-val="=">=</button>

        <button class="sci-btn btn-fn" data-val="sqrt(">√</button>
        <button class="sci-btn btn-fn" data-val="^">^</button>
        <button class="sci-btn btn-fn" data-val="pi">π</button>
        <button class="sci-btn btn-fn" data-val="e">e</button>
        <button class="sci-btn btn-fn" data-val="toggle-angle" id="btn-angle-mode">Rad</button>
      </div>
    `;
  }

  return calc.inputs.map(input => {
    let inputHTML = '';
    
    if (input.type === 'select') {
      inputHTML = `
        <select id="input-${input.id}" data-key="${input.id}" class="form-select">
          ${input.options.map(opt => `<option value="${opt.value}" ${opt.value === input.default ? 'selected' : ''}>${opt.label}</option>`).join('')}
        </select>
      `;
    } else if (input.type === 'date') {
      inputHTML = `
        <input type="date" id="input-${input.id}" data-key="${input.id}" class="form-input" value="${input.default || ''}">
      `;
    } else if (input.type === 'text') {
      inputHTML = `
        <input type="text" id="input-${input.id}" data-key="${input.id}" class="form-input" value="${input.default || ''}">
      `;
    } else {
      inputHTML = `
        <input type="number" id="input-${input.id}" data-key="${input.id}" class="form-input" 
          value="${input.default}" 
          step="${input.step || 'any'}" 
          ${input.min !== undefined ? `min="${input.min}"` : ''} 
          ${input.max !== undefined ? `max="${input.max}"` : ''}>
      `;
    }

    return `
      <div class="form-group">
        <label class="form-label" for="input-${input.id}">${input.label}</label>
        ${inputHTML}
      </div>
    `;
  }).join('');
}

// Generate initial placeholder results block to prevent layout shift
function generateInitialResultsHTML(calc) {
  if (calc.customLayout === 'scientific') {
    return `
      <div class="result-card">
        <span class="result-lbl">Formula Evaluator</span>
        <div class="result-val" style="font-size: 1.15rem; font-family: var(--font-mono); margin-top: var(--space-xs); font-weight: 500;">Type an expression in the keypad and press = to calculate.</div>
      </div>
    `;
  }

  return calc.outputs.map(out => {
    if (out.type === 'custom') {
      if (out.id === 'amortizationData') {
        return `
          <div class="result-card" style="border-left: none; padding-left: 0;">
            <span class="result-lbl">${out.label}</span>
            <div id="result-${out.id}" class="table-wrapper">
              <p style="padding: var(--space-md); text-align: center;">Enter positive input values to compute schedule.</p>
            </div>
          </div>
        `;
      }
      if (out.id === 'growthData') {
        return `
          <div class="result-card" style="border-left: none; padding-left: 0;">
            <span class="result-lbl">Investment Growth Chart</span>
            <div class="chart-container" id="result-growthChart-container">
              <p class="text-muted">Fill investment inputs to view compound chart.</p>
            </div>
            <span class="result-lbl" style="margin-top: var(--space-md);">${out.label}</span>
            <div id="result-${out.id}" class="table-wrapper">
              <p style="padding: var(--space-md); text-align: center;">Enter contributions to compute yearly schedule.</p>
            </div>
          </div>
        `;
      }
    }
    return `
      <div class="result-card" id="card-${out.id}">
        <span class="result-lbl">${out.label}</span>
        <div class="result-val" id="result-${out.id}">-</div>
      </div>
    `;
  }).join('');
}

// Generate breadcrumbs HTML string
function renderBreadcrumbHTML(paths) {
  const items = [{ name: 'Home', link: '/' }, ...paths];
  return `
    <nav aria-label="Breadcrumb">
      <ul class="breadcrumb">
        ${items.map((item, index) => {
          if (index === items.length - 1) {
            return `<li class="breadcrumb-item breadcrumb-current" aria-current="page">${item.name}</li>`;
          }
          return `
            <li class="breadcrumb-item">
              <a href="${item.link}" class="breadcrumb-link">${item.name}</a>
            </li>
          `;
        }).join('')}
      </ul>
    </nav>
  `;
}

// Generate Open Graph & Schema SEO blocks
function getSEOMetaHTML(title, description, canonicalUrl, calcName = null) {
  let schema = '';
  if (calcName) {
    schema = `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "${calcName}",
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "description": "${description}",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  }
  </script>`;
  }
  return `
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  ${schema}
  `;
}

function compile() {
  console.log('Compiling templates...');
  ensureDirs();

  // Copy CSS and JS static files
  copyDir(path.join(SRC_DIR, 'css'), path.join(DIST_DIR, 'css'));
  copyDir(path.join(SRC_DIR, 'js'), path.join(DIST_DIR, 'js'));
  // Duplicate master database into serving js directory
  fs.copyFileSync(path.join(SRC_DIR, 'data', 'calculators.js'), path.join(DIST_DIR, 'js', 'calculators.js'));
  fs.copyFileSync(path.join(SRC_DIR, 'data', 'math.js'), path.join(DIST_DIR, 'js', 'math.js'));
  fs.copyFileSync(path.join(SRC_DIR, 'data', 'financial.js'), path.join(DIST_DIR, 'js', 'financial.js'));
  fs.copyFileSync(path.join(SRC_DIR, 'data', 'health.js'), path.join(DIST_DIR, 'js', 'health.js'));
  fs.copyFileSync(path.join(SRC_DIR, 'data', 'other.js'), path.join(DIST_DIR, 'js', 'other.js'));

  // Calculate Statistics
  const totalCount = calculators.length;
  const catCounts = {};
  Object.keys(categories).forEach(cat => {
    catCounts[cat] = calculators.filter(c => c.category === cat).length;
  });

  // Read Base template
  let baseHTML = fs.readFileSync(path.join(SRC_DIR, 'templates', 'base.html'), 'utf8');

  // Replace common global metrics in base template
  baseHTML = baseHTML
    .replace(/{{STATS_TOTAL_COUNT}}/g, totalCount.toString())
    .replace(/{{STATS_COUNT_financial}}/g, (catCounts.financial || 0).toString())
    .replace(/{{STATS_COUNT_health}}/g, (catCounts.health || 0).toString())
    .replace(/{{STATS_COUNT_math}}/g, (catCounts.math || 0).toString())
    .replace(/{{STATS_COUNT_other}}/g, (catCounts.other || 0).toString());

  // 1. Compile Homepage
  let homeContent = fs.readFileSync(path.join(SRC_DIR, 'templates', 'homepage.html'), 'utf8');
  homeContent = homeContent
    .replace(/{{STATS_COUNT_financial}}/g, (catCounts.financial || 0).toString())
    .replace(/{{STATS_COUNT_health}}/g, (catCounts.health || 0).toString())
    .replace(/{{STATS_COUNT_math}}/g, (catCounts.math || 0).toString())
    .replace(/{{STATS_COUNT_other}}/g, (catCounts.other || 0).toString());

  let homeCompiled = baseHTML
    .replace(/{{TITLE}}/g, 'CalcAll - Free Universal Everyday Calculators')
    .replace(/{{META_DESCRIPTION}}/g, 'A next-generation scalable calculator ecosystem offering mortgage, loan, BMI, scientific, and date calculators in a beautiful responsive dark interface.')
    .replace(/{{KEYWORDS}}/g, 'online calculators, mortgage, loan calculator, bmi index, scientific calculator, compound interest')
    .replace(/{{CANONICAL_URL}}/g, DOMAIN + '/')
    .replace(/{{BREADCRUMB}}/g, '')
    .replace(/{{SEO_META}}/g, getSEOMetaHTML('CalcAll - Free Universal Everyday Calculators', 'A next-generation calculations engine for fast, modern, and detailed mathematical analysis.', DOMAIN + '/'))
    .replace(/{{CONTENT}}/g, homeContent)
    .replace(/{{SCRIPTS}}/g, `
      <script type="module">
        import { calculators } from '/js/calculators.js';
        import { renderFavoritesContainer } from '/js/favorites.js';
        import { renderRecentsContainer } from '/js/recent.js';
        
        // Initial render on homepage load
        renderFavoritesContainer('favorites-container', calculators);
        renderRecentsContainer('recent-container', calculators);

        // Listen for favorite clicks to re-render dynamically
        window.addEventListener('favoriteschanged', () => {
          renderFavoritesContainer('favorites-container', calculators);
        });
      </script>
    `);
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), homeCompiled);

  // 2. Compile Category Pages
  Object.keys(categories).forEach(catId => {
    const cat = categories[catId];
    const catCalculators = calculators.filter(c => c.category === catId);
    let catContent = fs.readFileSync(path.join(SRC_DIR, 'templates', 'category.html'), 'utf8');

    // List of calculators in this category
    const listHTML = catCalculators.map(c => `
      <div class="card hover-lift">
        <h3 style="font-size: 1.15rem;"><a href="/${c.category}/${c.id}/">${c.name}</a></h3>
        <p style="font-size: 0.9rem;">${c.description}</p>
        <div style="margin-top: auto; text-align: right;">
          <a href="/${c.category}/${c.id}/" class="btn btn-secondary">Open Calculator</a>
        </div>
      </div>
    `).join('');

    catContent = catContent
      .replace(/{{CATEGORY_NAME}}/g, cat.name)
      .replace(/{{CATEGORY_COUNT}}/g, catCounts[catId].toString())
      .replace(/{{CATEGORY_DESCRIPTION}}/g, cat.description)
      .replace(/{{CATEGORY_CALCULATORS_LIST}}/g, listHTML);

    const catCompiled = baseHTML
      .replace(/{{TITLE}}/g, `${cat.name} - Free Online Calculators`)
      .replace(/{{META_DESCRIPTION}}/g, `${cat.description} Explore our free operational calculator tools.`)
      .replace(/{{KEYWORDS}}/g, `${cat.name.toLowerCase()}, online calculators, tools`)
      .replace(/{{CANONICAL_URL}}/g, `${DOMAIN}/${catId}/`)
      .replace(/{{BREADCRUMB}}/g, renderBreadcrumbHTML([{ name: cat.name, link: `/${catId}/` }]))
      .replace(/{{SEO_META}}/g, getSEOMetaHTML(`${cat.name} - Free Online Calculators`, cat.description, `${DOMAIN}/${catId}/`))
      .replace(/{{CONTENT}}/g, catContent)
      .replace(/{{SCRIPTS}}/g, '');

    fs.writeFileSync(path.join(DIST_DIR, catId, 'index.html'), catCompiled);
  });

  // 3. Compile Calculator Detail Pages
  calculators.forEach(calc => {
    const cat = categories[calc.category];
    let detailContent = fs.readFileSync(path.join(SRC_DIR, 'templates', 'detail.html'), 'utf8');

    // Generate input forms and initial placeholder results
    const inputsHTML = generateInputsFormHTML(calc);
    const resultsHTML = generateInitialResultsHTML(calc);

    // Filter related tools (other calculators in the same category)
    const relatedCalcs = calculators.filter(c => c.category === calc.category && c.id !== calc.id);
    const relatedHTML = relatedCalcs.map(c => `
      <div class="card hover-lift">
        <h3 style="font-size: 1rem;"><a href="/${c.category}/${c.id}/">${c.name}</a></h3>
        <p style="font-size: 0.85rem;">${c.description}</p>
        <div style="margin-top: auto; text-align: right;">
          <a href="/${c.category}/${c.id}/" class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.8rem;">Open</a>
        </div>
      </div>
    `).join('');

    detailContent = detailContent
      .replace(/{{CALCULATOR_CATEGORY_NAME}}/g, cat.name)
      .replace(/{{CALCULATOR_NAME}}/g, calc.name)
      .replace(/{{CALCULATOR_DESCRIPTION}}/g, calc.description)
      .replace(/{{CALCULATOR_INPUTS_FORM}}/g, inputsHTML)
      .replace(/{{CALCULATOR_INITIAL_RESULTS}}/g, resultsHTML)
      .replace(/{{CALCULATOR_FORMULA}}/g, calc.formula)
      .replace(/{{CALCULATOR_EXPLANATION}}/g, `<p>${calc.explanation}</p>`)
      .replace(/{{CALCULATOR_RELATED_LIST}}/g, relatedHTML || '<p class="text-muted">No related tools in this category.</p>');

    const detailCompiled = baseHTML
      .replace(/{{TITLE}}/g, calc.seo.title)
      .replace(/{{META_DESCRIPTION}}/g, calc.seo.description)
      .replace(/{{KEYWORDS}}/g, (calc.seo.keywords || []).join(', '))
      .replace(/{{CANONICAL_URL}}/g, `${DOMAIN}/${calc.category}/${calc.id}/`)
      .replace(/{{BREADCRUMB}}/g, renderBreadcrumbHTML([
        { name: cat.name, link: `/${calc.category}/` },
        { name: calc.name, link: `/${calc.category}/${calc.id}/` }
      ]))
      .replace(/{{SEO_META}}/g, getSEOMetaHTML(calc.seo.title, calc.seo.description, `${DOMAIN}/${calc.category}/${calc.id}/`, calc.name))
      .replace(/{{CONTENT}}/g, detailContent)
      .replace(/{{SCRIPTS}}/g, `
        <script type="module">
          import { addRecent } from '/js/recent.js';
          import { isFavorite, toggleFavorite } from '/js/favorites.js';
          import { calculators } from '/js/calculators.js';

          // Track recently viewed
          addRecent('${calc.id}');

          // Setup Favorite Heart button
          const favBtn = document.getElementById('btn-favorite-toggle');
          if (favBtn) {
            if (isFavorite('${calc.id}')) {
              favBtn.classList.add('active');
            }
            favBtn.addEventListener('click', () => {
              const active = toggleFavorite('${calc.id}');
              favBtn.classList.toggle('active', active);
            });
          }

          // Import runtime and scientific engines
          const currentCalcId = '${calc.id}';
          if ('${calc.customLayout}' === 'scientific') {
            import('/js/scientific.js').then(module => {
              module.initScientificCalculator();
            });
          } else {
            import('/js/calculator-runtime.js').then(module => {
              module.initCalculatorRuntime(currentCalcId, calculators);
            });
          }
        </script>
      `);

    fs.writeFileSync(path.join(DIST_DIR, calc.category, calc.id, 'index.html'), detailCompiled);
  });

  // 4. Compile Directory Page (Alphabetical Index & Category grouping)
  let allContent = fs.readFileSync(path.join(SRC_DIR, 'templates', 'all.html'), 'utf8');

  // Initial listing: Group by Category
  const categoriesListHTML = Object.keys(categories).map(catId => {
    const cat = categories[catId];
    const catCalcs = calculators.filter(c => c.category === catId);
    return `
      <div class="dir-group-section" data-group-cat="${catId}" style="margin-bottom: var(--space-xl);">
        <h3 style="font-size: 1.35rem; border-bottom: 2px solid var(--border-color); padding-bottom: var(--space-xs); margin-bottom: var(--space-md); display: flex; align-items: center; gap: var(--space-sm);">
          ${cat.name}
        </h3>
        <div class="grid-3">
          ${catCalcs.map(c => `
            <div class="card hover-lift dir-calc-card" data-calc-name="${c.name}" data-calc-cat="${c.category}">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <h4 style="font-size: 1.1rem;"><a href="/${c.category}/${c.id}/">${c.name}</a></h4>
                <span class="search-result-cat" style="font-size: 0.7rem;">${cat.name.split(' ')[0]}</span>
              </div>
              <p style="font-size: 0.85rem;">${c.description}</p>
              <div style="margin-top: auto; text-align: right;">
                <a href="/${c.category}/${c.id}/" class="btn btn-secondary" style="padding: 4px 12px; font-size: 0.8rem;">Open</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  allContent = allContent
    .replace(/{{DIRECTORY_INITIAL_CONTENT}}/g, categoriesListHTML)
    .replace(/{{STATS_TOTAL_COUNT}}/g, totalCount.toString());

  const allCompiled = baseHTML
    .replace(/{{TITLE}}/g, 'All Calculators Directory - Search and Browse A-Z')
    .replace(/{{META_DESCRIPTION}}/g, 'View the complete directory of our calculators grouped by categories and alphabetically (A to Z). Filter and search tools instantly.')
    .replace(/{{KEYWORDS}}/g, 'all calculators, calculator directory, alphabetical math tools')
    .replace(/{{CANONICAL_URL}}/g, `${DOMAIN}/all/`)
    .replace(/{{BREADCRUMB}}/g, renderBreadcrumbHTML([{ name: 'All Tools', link: '/all/' }]))
    .replace(/{{SEO_META}}/g, getSEOMetaHTML('All Calculators Directory', 'All Calculators Directory listing.', `${DOMAIN}/all/`))
    .replace(/{{CONTENT}}/g, allContent)
    .replace(/{{SCRIPTS}}/g, `
      <script type="module">
        // Alphabetical A-Z and Category Filter Logic on the All Directory page
        const catButtons = document.querySelectorAll('.filter-cat-btn');
        const letterButtons = document.querySelectorAll('.filter-letter-btn');
        const searchInput = document.getElementById('dir-search-input');
        const sortSelect = document.getElementById('dir-sort-select');
        const countBadge = document.getElementById('total-count-badge');

        const sections = document.querySelectorAll('.dir-group-section');
        const cards = document.querySelectorAll('.dir-calc-card');

        let activeCat = 'all';
        let activeLetter = 'all';
        let searchQuery = '';

        function filter() {
          let visibleCount = 0;
          
          sections.forEach(section => {
            const sectionCat = section.getAttribute('data-group-cat');
            let sectionVisible = false;

            const sectionCards = section.querySelectorAll('.dir-calc-card');
            sectionCards.forEach(card => {
              const name = card.getAttribute('data-calc-name').toLowerCase();
              const cat = card.getAttribute('data-calc-cat');
              const firstLetter = name.charAt(0).toUpperCase();

              const matchesCat = activeCat === 'all' || cat === activeCat;
              const matchesLetter = activeLetter === 'all' || firstLetter === activeLetter;
              const matchesSearch = name.includes(searchQuery);

              if (matchesCat && matchesLetter && matchesSearch) {
                card.style.display = 'flex';
                sectionVisible = true;
                visibleCount++;
              } else {
                card.style.display = 'none';
              }
            });

            // If sorting or letter filter is active, section grouping is secondary.
            // Hide section headers if no elements inside match
            if (sectionVisible && activeLetter === 'all') {
              section.style.display = 'block';
            } else {
              section.style.display = 'none';
              // If letter filter is active, we might want to flat display cards.
              // To handle simply: if section is hidden, but cards match, show container without header.
              if (sectionVisible) {
                section.style.display = 'block';
                section.querySelector('h3').style.display = 'none';
              }
            }

            if (activeLetter === 'all') {
              section.querySelector('h3').style.display = 'flex';
            }
          });

          countBadge.textContent = visibleCount;

          // Re-sort cards in DOM if required
          sortCards();
        }

        function sortCards() {
          const order = sortSelect.value;
          sections.forEach(section => {
            const grid = section.querySelector('.grid-3');
            const cardArray = Array.from(grid.querySelectorAll('.dir-calc-card'));
            cardArray.sort((a, b) => {
              const nameA = a.getAttribute('data-calc-name').toLowerCase();
              const nameB = b.getAttribute('data-calc-name').toLowerCase();
              return order === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
            });
            cardArray.forEach(card => grid.appendChild(card));
          });
        }

        // Cat binds
        catButtons.forEach(btn => {
          btn.addEventListener('click', () => {
            catButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCat = btn.getAttribute('data-cat');
            filter();
          });
        });

        // Letter binds
        letterButtons.forEach(btn => {
          btn.addEventListener('click', () => {
            letterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeLetter = btn.getAttribute('data-letter');
            filter();
          });
        });

        // Search inputs
        searchInput.addEventListener('input', () => {
          searchQuery = searchInput.value.trim().toLowerCase();
          filter();
        });

        // Sort selects
        sortSelect.addEventListener('change', sortCards);
      </script>
    `);

  fs.writeFileSync(path.join(DIST_DIR, 'all', 'index.html'), allCompiled);

  // 5. Compile Dedicated Search Page
  const searchContent = fs.readFileSync(path.join(SRC_DIR, 'templates', 'search.html'), 'utf8');
  const searchCompiled = baseHTML
    .replace(/{{TITLE}}/g, 'Search Results - CalcAll')
    .replace(/{{META_DESCRIPTION}}/g, 'View matching calculators on our dedicated search results landing page.')
    .replace(/{{KEYWORDS}}/g, 'search, calculators')
    .replace(/{{CANONICAL_URL}}/g, `${DOMAIN}/search/`)
    .replace(/{{BREADCRUMB}}/g, renderBreadcrumbHTML([{ name: 'Search', link: '/search/' }]))
    .replace(/{{SEO_META}}/g, getSEOMetaHTML('Search Results', 'Search results.', `${DOMAIN}/search/`))
    .replace(/{{CONTENT}}/g, searchContent)
    .replace(/{{SCRIPTS}}/g, `
      <script type="module">
        import { calculators } from '/js/calculators.js';

        // Parse search query parameter
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q') || '';
        const titleEl = document.getElementById('search-query-subtitle');
        const container = document.getElementById('search-results-container');

        if (query) {
          titleEl.textContent = 'Showing results for "' + query + '"';
          const matches = calculators.filter(c => 
            c.name.toLowerCase().includes(query.toLowerCase()) || 
            c.description.toLowerCase().includes(query.toLowerCase()) ||
            c.category.toLowerCase().includes(query.toLowerCase())
          );

          if (matches.length === 0) {
            container.className = ''; // Remove grid columns for empty state
            container.innerHTML = \\\`
              <div class="empty-state">
                <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <h3 class="empty-title">No Calculators Found</h3>
                <p class="empty-desc">We couldn't find any tools matching your search. Try adjusting terms or browsing all tools.</p>
                <a href="/all/" class="btn btn-primary" style="margin-top: var(--space-sm);">Browse All Directory</a>
              </div>
            \\\`;
          } else {
            container.innerHTML = matches.map(c => \\\`
              <div class="card hover-lift">
                <h3 style="font-size: 1.15rem;"><a href="/\\\\\\\${c.category}/\\\\\\\${c.id}/">\\\\\\\${c.name}</a></h3>
                <p style="font-size: 0.9rem;">\\\\\\\${c.description}</p>
                <div style="margin-top: auto; text-align: right;">
                  <a href="/\${c.category}/\${c.id}/" class="btn btn-secondary">Open</a>
                </div>
              </div>
            \\\`).join('');
          }
        } else {
          titleEl.textContent = 'Enter a search term above.';
          container.className = '';
          container.innerHTML = \\\`
            <div class="empty-state">
              <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <h3 class="empty-title">Search Workspace</h3>
              <p class="empty-desc">Use the search bar at the top or start typing to search across all calculators.</p>
            </div>
          \\\`;
        }
      </script>
    `);
  fs.writeFileSync(path.join(DIST_DIR, 'search', 'index.html'), searchCompiled);

  // 6. Compile HTML Sitemap Page
  let sitemapContent = fs.readFileSync(path.join(SRC_DIR, 'templates', 'sitemap-html.html'), 'utf8');

  // Categories lists with all deep links
  const sitemapCategoriesHTML = Object.keys(categories).map(catId => {
    const cat = categories[catId];
    const catCalcs = calculators.filter(c => c.category === catId);
    return `
      <div>
        <h3 style="font-size: 1.15rem; margin-bottom: var(--space-md); border-bottom: 2px solid var(--border-color); padding-bottom: var(--space-xs);">${cat.name}</h3>
        <ul class="footer-links" style="gap: var(--space-md);">
          <li><a href="/${catId}/" style="font-weight: 700;">Category Main Page</a></li>
          ${catCalcs.map(c => `
            <li><a href="/${c.category}/${c.id}/" class="footer-link">${c.name}</a></li>
          `).join('')}
        </ul>
      </div>
    `;
  }).join('');

  sitemapContent = sitemapContent.replace(/{{SITEMAP_CATEGORIES_BLOCK}}/g, sitemapCategoriesHTML);

  const sitemapCompiled = baseHTML
    .replace(/{{TITLE}}/g, 'Sitemap - All Online Calculators Link Tree')
    .replace(/{{META_DESCRIPTION}}/g, 'Browse the complete link directory of our operational calculator engines. Fast sitemap access.')
    .replace(/{{KEYWORDS}}/g, 'sitemap, link tree, calculator list')
    .replace(/{{CANONICAL_URL}}/g, `${DOMAIN}/sitemap/`)
    .replace(/{{BREADCRUMB}}/g, renderBreadcrumbHTML([{ name: 'Sitemap', link: '/sitemap/' }]))
    .replace(/{{SEO_META}}/g, getSEOMetaHTML('Sitemap Directory', 'Complete link index.', `${DOMAIN}/sitemap/`))
    .replace(/{{CONTENT}}/g, sitemapContent)
    .replace(/{{SCRIPTS}}/g, '');

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap', 'index.html'), sitemapCompiled);

  // 7. Compile XML Sitemap
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${DOMAIN}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${DOMAIN}/all/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${DOMAIN}/sitemap/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
  ${Object.keys(categories).map(catId => `
  <url>
    <loc>${DOMAIN}/${catId}/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  ${calculators.map(c => `
  <url>
    <loc>${DOMAIN}/${c.category}/${c.id}/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`;

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml);

  console.log('Static site compiled successfully into /dist/');
}

compile();
