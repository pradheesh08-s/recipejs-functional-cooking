const RecipeApp = (() => {
  const STORAGE_KEY = 'favorites';
  const DEFAULT_FILTER = 'all';
  const DEFAULT_SORT = 'name';
  const SEARCH_DEBOUNCE_MS = 350;

  const recipes = [
    {
      id: 1,
      title: 'Classic Spaghetti Carbonara',
      time: 25,
      difficulty: 'easy',
      description: 'A creamy Italian pasta dish made with eggs, cheese, pancetta, and black pepper.',
      category: 'pasta'
    },
    {
      id: 2,
      title: 'Chicken Tikka Masala',
      time: 45,
      difficulty: 'medium',
      description: 'Tender chicken pieces in a creamy, spiced tomato sauce.',
      category: 'curry'
    },
    {
      id: 3,
      title: 'Homemade Croissants',
      time: 180,
      difficulty: 'hard',
      description: 'Buttery, flaky French pastries that require patience but deliver amazing results.',
      category: 'baking'
    },
    {
      id: 4,
      title: 'Greek Salad',
      time: 15,
      difficulty: 'easy',
      description: 'Fresh vegetables, feta cheese, and olives tossed in olive oil and herbs.',
      category: 'salad'
    },
    {
      id: 5,
      title: 'Beef Wellington',
      time: 120,
      difficulty: 'hard',
      description: 'Tender beef fillet coated with mushroom duxelles and wrapped in puff pastry.',
      category: 'meat'
    },
    {
      id: 6,
      title: 'Vegetable Stir Fry',
      time: 20,
      difficulty: 'easy',
      description: 'Colorful mixed vegetables cooked quickly in a savory sauce.',
      category: 'vegetarian'
    },
    {
      id: 7,
      title: 'Pad Thai',
      time: 30,
      difficulty: 'medium',
      description: 'Thai stir-fried rice noodles with shrimp, peanuts, and tangy tamarind sauce.',
      category: 'noodles'
    },
    {
      id: 8,
      title: 'Margherita Pizza',
      time: 60,
      difficulty: 'medium',
      description: 'Classic Italian pizza with fresh mozzarella, tomatoes, and basil.',
      category: 'pizza'
    }
  ];

  const state = {
    filter: DEFAULT_FILTER,
    sort: DEFAULT_SORT,
    search: '',
    favoritesOnly: false,
    favorites: readFavorites()
  };

  const dom = {
    recipeContainer: document.querySelector('#recipe-container'),
    recipeCounter: document.querySelector('#recipeCounter'),
    searchInput: document.querySelector('#searchInput'),
    clearSearchButton: document.querySelector('#clearSearch'),
    resetControlsButton: document.querySelector('#resetControls'),
    favoritesFilterButton: document.querySelector('#favoritesFilter'),
    filterButtons: document.querySelectorAll('[data-filter]'),
    sortButtons: document.querySelectorAll('[data-sort]')
  };

  function init() {
    bindEvents();
    updateDisplay();
  }

  function bindEvents() {
    dom.filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        state.filter = button.dataset.filter;
        updateDisplay();
      });
    });

    dom.sortButtons.forEach(button => {
      button.addEventListener('click', () => {
        state.sort = button.dataset.sort;
        updateDisplay();
      });
    });

    if (dom.searchInput) {
      const debouncedSearch = debounce((searchText) => {
        state.search = searchText;
        updateDisplay();
      }, SEARCH_DEBOUNCE_MS);

      dom.searchInput.addEventListener(
        'input',
        (event) => {
          debouncedSearch(event.target.value);
        }
      );
    }

    if (dom.clearSearchButton) {
      dom.clearSearchButton.addEventListener('click', () => {
        state.search = '';
        if (dom.searchInput) {
          dom.searchInput.value = '';
          dom.searchInput.focus();
        }
        updateDisplay();
      });
    }

    if (dom.favoritesFilterButton) {
      dom.favoritesFilterButton.addEventListener('click', () => {
        state.favoritesOnly = !state.favoritesOnly;
        updateDisplay();
      });
    }

    if (dom.resetControlsButton) {
      dom.resetControlsButton.addEventListener('click', () => {
        state.filter = DEFAULT_FILTER;
        state.sort = DEFAULT_SORT;
        state.search = '';
        state.favoritesOnly = false;

        if (dom.searchInput) {
          dom.searchInput.value = '';
        }

        updateDisplay();
      });
    }

    if (dom.recipeContainer) {
      dom.recipeContainer.addEventListener('click', (event) => {
        const favoriteButton = event.target.closest('.favorite-btn');
        if (!favoriteButton) return;

        event.stopPropagation();
        const recipeId = Number(favoriteButton.dataset.favid);
        toggleFavorite(recipeId);
      });
    }
  }

  function updateDisplay() {
    const visibleRecipes = applyAllTransforms(recipes);
    renderRecipes(visibleRecipes);
    renderCounter(visibleRecipes.length, recipes.length);
    syncControlStates();
  }

  function applyAllTransforms(recipesArray) {
    let transformed = filterByDifficulty(recipesArray, state.filter);
    transformed = filterBySearch(transformed, state.search);
    transformed = filterByFavorites(transformed, state.favoritesOnly, state.favorites);
    transformed = sortRecipes(transformed, state.sort);
    return transformed;
  }

  function renderRecipes(recipesToRender) {
    if (!dom.recipeContainer) return;

    if (!recipesToRender.length) {
      dom.recipeContainer.innerHTML = '<div class="empty-state">No recipes match your current filters.</div>';
      return;
    }

    dom.recipeContainer.innerHTML = recipesToRender.map(createRecipeCard).join('');
  }

  function createRecipeCard(recipe) {
    const isFavorite = state.favorites.includes(recipe.id);
    const favoriteIcon = isFavorite ? '❤️' : '🤍';

    return `
      <article class="recipe-card" data-id="${recipe.id}">
        <button
          class="favorite-btn"
          data-favid="${recipe.id}"
          type="button"
          aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}"
          title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}"
        >${favoriteIcon}</button>
        <h3>${recipe.title}</h3>
        <div class="recipe-meta">
          <span>⏱️ ${recipe.time} min</span>
          <span class="difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
        </div>
        <p>${recipe.description}</p>
      </article>
    `;
  }

  function renderCounter(visibleCount, totalCount) {
    if (dom.recipeCounter) {
      dom.recipeCounter.textContent = `Showing ${visibleCount} of ${totalCount} recipes`;
    }
  }

  function syncControlStates() {
    setActiveButton(dom.filterButtons, state.filter, 'filter');
    setActiveButton(dom.sortButtons, state.sort, 'sort');

    if (dom.favoritesFilterButton) {
      dom.favoritesFilterButton.classList.toggle('is-active', state.favoritesOnly);
      dom.favoritesFilterButton.setAttribute('aria-pressed', String(state.favoritesOnly));
    }

    if (dom.clearSearchButton) {
      const hasSearchText = state.search.trim().length > 0;
      dom.clearSearchButton.disabled = !hasSearchText;
      dom.clearSearchButton.classList.toggle('is-active', hasSearchText);
    }
  }

  function setActiveButton(buttons, activeValue, dataKey) {
    buttons.forEach(button => {
      const isActive = button.dataset[dataKey] === activeValue;
      button.classList.toggle('is-active', isActive);
    });
  }

  function toggleFavorite(recipeId) {
    if (state.favorites.includes(recipeId)) {
      state.favorites = state.favorites.filter(id => id !== recipeId);
    } else {
      state.favorites = [...state.favorites, recipeId];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.favorites));
    updateDisplay();
  }

  function filterByDifficulty(recipesArray, filterType) {
    if (filterType === 'easy' || filterType === 'medium' || filterType === 'hard') {
      return recipesArray.filter(recipe => recipe.difficulty === filterType);
    }

    if (filterType === 'quick') {
      return recipesArray.filter(recipe => recipe.time < 30);
    }

    return recipesArray;
  }

  function filterBySearch(recipesArray, searchValue) {
    if (!searchValue.trim()) return recipesArray;

    const normalizedSearch = searchValue.toLowerCase();
    return recipesArray.filter(recipe => (
      recipe.title.toLowerCase().includes(normalizedSearch)
      || recipe.description.toLowerCase().includes(normalizedSearch)
      || recipe.category.toLowerCase().includes(normalizedSearch)
    ));
  }

  function filterByFavorites(recipesArray, favoritesOnly, favoriteIds) {
    if (!favoritesOnly) return recipesArray;
    return recipesArray.filter(recipe => favoriteIds.includes(recipe.id));
  }

  function sortRecipes(recipesArray, sortType) {
    const sorted = [...recipesArray];

    if (sortType === 'name') {
      return sorted.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
    }

    if (sortType === 'time') {
      return sorted.sort((a, b) => a.time - b.time);
    }

    return sorted;
  }

  function debounce(callback, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }

  function readFavorites() {
    try {
      const rawValue = localStorage.getItem(STORAGE_KEY);
      const parsedValue = rawValue ? JSON.parse(rawValue) : [];
      return Array.isArray(parsedValue) ? parsedValue : [];
    } catch {
      return [];
    }
  }

  return {
    init
  };
})();

RecipeApp.init();
