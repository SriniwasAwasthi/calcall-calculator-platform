// Favorites Manager

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem('calculator_favorites')) || [];
  } catch (e) {
    return [];
  }
}

export function isFavorite(calculatorId) {
  const favs = getFavorites();
  return favs.includes(calculatorId);
}

export function toggleFavorite(calculatorId) {
  let favs = getFavorites();
  if (favs.includes(calculatorId)) {
    favs = favs.filter(id => id !== calculatorId);
  } else {
    favs.push(calculatorId);
  }
  localStorage.setItem('calculator_favorites', JSON.stringify(favs));
  
  // Custom event to trigger updates across tabs or homepage lists
  window.dispatchEvent(new CustomEvent('favoriteschanged', { detail: { id: calculatorId, favorites: favs } }));
  return favs.includes(calculatorId);
}

// Dynamically populates favorite list on page containers
export function renderFavoritesContainer(containerId, calculatorsDataset) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const favIds = getFavorites();
  const favoriteCalculators = calculatorsDataset.filter(c => favIds.includes(c.id));

  if (favoriteCalculators.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        <h3 class="empty-title">No Favorites Yet</h3>
        <p class="empty-desc">Mark calculators with a heart to access them quickly from your homepage.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = favoriteCalculators.map(c => `
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
