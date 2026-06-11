// Instant Autocomplete Search Controller

export function initSearch(calculatorsDataset) {
  // Listen for search trigger buttons
  document.querySelectorAll('.trigger-search').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openSearchOverlay(calculatorsDataset);
    });
  });

  // Global Keyboard Shortcut: '/' to open search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      openSearchOverlay(calculatorsDataset);
    }
  });
}

function openSearchOverlay(calculatorsDataset) {
  // Check if overlay already exists in DOM
  let overlay = document.getElementById('global-search-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'global-search-overlay';
    overlay.className = 'search-overlay';
    overlay.innerHTML = `
      <div class="search-modal modal-zoom">
        <div class="search-input-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="global-search-input" class="search-text-input" placeholder="Search calculators (Press Esc to close)..." autofocus autocomplete="off">
        </div>
        <ul id="global-search-results" class="search-results-list"></ul>
      </div>
    `;
    document.body.appendChild(overlay);

    // Setup input listeners
    const input = overlay.querySelector('#global-search-input');
    const resultsList = overlay.querySelector('#global-search-results');

    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      renderSearchResults(query, calculatorsDataset, resultsList);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = input.value.trim();
        if (query) {
          window.location.href = `/search/?q=${encodeURIComponent(query)}`;
        }
      }
    });

    // Handle Escape and click outside to close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeSearchOverlay(overlay);
      }
    });

    document.addEventListener('keydown', function escListener(e) {
      if (e.key === 'Escape') {
        closeSearchOverlay(overlay);
        document.removeEventListener('keydown', escListener);
      }
    });
  }

  overlay.classList.remove('hidden');
  const input = overlay.querySelector('#global-search-input');
  input.value = '';
  input.focus();
  renderSearchResults('', calculatorsDataset, overlay.querySelector('#global-search-results'));
}

function closeSearchOverlay(overlay) {
  overlay.classList.add('hidden');
}

function renderSearchResults(query, dataset, container) {
  if (!query) {
    // Show popular calculators as suggestions when input is empty
    const popularIds = ['scientific-calculator', 'mortgage-calculator', 'bmi-calculator'];
    const popular = dataset.filter(c => popularIds.includes(c.id));
    container.innerHTML = `
      <li style="padding: var(--space-sm) var(--space-lg); font-size: 0.8rem; font-weight: 600; text-transform: uppercase; color: var(--text-muted);">Popular Calculators</li>
      ${popular.map(c => renderItemHTML(c)).join('')}
    `;
    return;
  }

  const results = dataset.filter(c => 
    c.name.toLowerCase().includes(query) || 
    c.description.toLowerCase().includes(query) || 
    c.category.toLowerCase().includes(query) ||
    (c.seo && c.seo.keywords && c.seo.keywords.some(k => k.toLowerCase().includes(query)))
  );

  if (results.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="border: none; background: none; padding: var(--space-xl);">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 48px; height: 48px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <h3 class="empty-title" style="font-size: 1.1rem;">No matching calculators</h3>
        <p class="empty-desc" style="font-size: 0.85rem;">Try checking your spelling or searching for a different keyword.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = results.map(c => renderItemHTML(c)).join('');
}

function renderItemHTML(c) {
  const categoryNames = {
    financial: "Financial",
    health: "Fitness & Health",
    math: "Math",
    other: "Other"
  };
  return `
    <li class="search-result-item">
      <a href="/${c.category}/${c.id}/">
        <div class="search-result-name">
          <span>${c.name}</span>
          <span class="search-result-cat">${categoryNames[c.category] || c.category}</span>
        </div>
        <div class="search-result-desc">${c.description}</div>
      </a>
    </li>
  `;
}
