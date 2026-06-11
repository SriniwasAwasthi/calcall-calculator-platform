// Recently Used Calculators Manager

const MAX_RECENTS = 5;

export function getRecents() {
  try {
    return JSON.parse(localStorage.getItem('calculator_recents')) || [];
  } catch (e) {
    return [];
  }
}

export function addRecent(calculatorId) {
  let recents = getRecents();
  // Filter out existing occurrence to move it to top
  recents = recents.filter(id => id !== calculatorId);
  recents.unshift(calculatorId);
  
  if (recents.length > MAX_RECENTS) {
    recents = recents.slice(0, MAX_RECENTS);
  }
  
  localStorage.setItem('calculator_recents', JSON.stringify(recents));
}

export function renderRecentsContainer(containerId, calculatorsDataset) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const recentIds = getRecents();
  const recentCalculators = recentIds
    .map(id => calculatorsDataset.find(c => c.id === id))
    .filter(Boolean); // Filter out undefined entries in case dataset changed

  if (recentCalculators.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <h3 class="empty-title">No Recent Activity</h3>
        <p class="empty-desc">Your recently visited calculators will show up here for fast access.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = recentCalculators.map(c => `
    <div class="card hover-lift">
      <div class="cat-card-header">
        <h3 class="cat-title"><a href="/${c.category}/${c.id}/">${c.name}</a></h3>
      </div>
      <p>${c.description}</p>
      <div class="text-right">
        <a href="/${c.category}/${c.id}/" class="btn btn-secondary">Open Calculator</a>
      </div>
    </div>
  `).join('');
}
