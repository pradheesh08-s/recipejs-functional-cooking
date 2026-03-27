const RecipeApp = (() => {
  const STORAGE_KEY = 'favorites';
  const INGREDIENTS_STORAGE_KEY = 'ingredientOverrides';
  const INGREDIENTS_LOCKS_STORAGE_KEY = 'ingredientLocks';
  const THEME_STORAGE_KEY = 'recipeThemeColors';
  const DEVELOPER_ACCESS_CODE = '18zneb';
  const DEFAULT_FILTER = 'all';
  const DEFAULT_SORT = 'name';
  const SEARCH_DEBOUNCE_MS = 350;
  const DEFAULT_THEME = {
    primary: '#5eead4',
    accent: '#818cf8',
    bg: '#0a1022',
    card: '#172449'
  };

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
    },
    // South Indian A-Z
    { id: 9, title: 'Appam', time: 30, difficulty: 'medium', description: 'Soft, lacy rice pancakes from Kerala, perfect with stew or coconut milk.', category: 'south indian' },
    { id: 10, title: 'Bisi Bele Bath', time: 50, difficulty: 'medium', description: 'Karnataka rice-lentil dish with vegetables and spices.', category: 'south indian' },
    { id: 11, title: 'Chettinad Chicken', time: 60, difficulty: 'hard', description: 'Spicy chicken curry from Chettinad, Tamil Nadu, with roasted spices.', category: 'south indian' },
    { id: 12, title: 'Dosa', time: 20, difficulty: 'easy', description: 'Crispy fermented rice-lentil crepes, a breakfast staple.', category: 'south indian' },
    { id: 13, title: 'Elaneer Payasam', time: 25, difficulty: 'easy', description: 'Chilled tender coconut milk dessert from Kerala.', category: 'south indian' },
    { id: 14, title: 'Filter Coffee', time: 10, difficulty: 'easy', description: 'Strong, aromatic South Indian drip-brewed coffee.', category: 'south indian' },
    { id: 15, title: 'Gongura Pachadi', time: 15, difficulty: 'easy', description: 'Andhra-style tangy chutney made with gongura leaves.', category: 'south indian' },
    { id: 16, title: 'Hyderabadi Biryani', time: 90, difficulty: 'hard', description: 'Fragrant rice and meat biryani from Hyderabad, South India style.', category: 'south indian' },
    { id: 17, title: 'Idli', time: 15, difficulty: 'easy', description: 'Steamed rice-lentil cakes, soft and fluffy, served with chutney and sambar.', category: 'south indian' },
    { id: 18, title: 'Jackfruit Curry', time: 40, difficulty: 'medium', description: 'Kerala-style curry with tender jackfruit pieces in coconut gravy.', category: 'south indian' },
    { id: 19, title: 'Kootu', time: 35, difficulty: 'easy', description: 'Tamil Nadu mixed vegetable and lentil stew.', category: 'south indian' },
    { id: 20, title: 'Lemon Rice', time: 20, difficulty: 'easy', description: 'Tangy, yellow rice flavored with lemon juice and spices.', category: 'south indian' },
    { id: 21, title: 'Medu Vada', time: 30, difficulty: 'medium', description: 'Crispy, savory lentil doughnuts, deep-fried and served with chutney.', category: 'south indian' },
    { id: 22, title: 'Neer Dosa', time: 20, difficulty: 'easy', description: 'Thin, soft rice crepes from Karnataka.', category: 'south indian' },
    { id: 23, title: 'Olan', time: 25, difficulty: 'easy', description: 'Kerala stew of ash gourd and red beans in coconut milk.', category: 'south indian' },
    { id: 24, title: 'Pesarattu', time: 25, difficulty: 'easy', description: 'Andhra Pradesh green gram crepes, protein-rich and healthy.', category: 'south indian' },
    { id: 25, title: 'Quinoa Upma', time: 30, difficulty: 'easy', description: 'Modern upma with quinoa and vegetables, South Indian style.', category: 'south indian' },
    { id: 26, title: 'Rasam', time: 20, difficulty: 'easy', description: 'Spicy, tangy South Indian soup with tamarind and tomatoes.', category: 'south indian' },
    { id: 27, title: 'Sambar', time: 35, difficulty: 'easy', description: 'Lentil and vegetable stew with tamarind, a South Indian staple.', category: 'south indian' },
    { id: 28, title: 'Thayir Sadam', time: 10, difficulty: 'easy', description: 'Curd rice, a cooling comfort food from Tamil Nadu.', category: 'south indian' },
    { id: 29, title: 'Uthappam', time: 25, difficulty: 'easy', description: 'Thick, soft rice-lentil pancakes topped with onions and veggies.', category: 'south indian' },
    { id: 30, title: 'Vangi Bath', time: 30, difficulty: 'medium', description: 'Brinjal (eggplant) rice from Karnataka, spiced and flavorful.', category: 'south indian' },
    { id: 31, title: 'Wheat Halwa', time: 45, difficulty: 'medium', description: 'Rich, glossy halwa made from wheat flour, ghee, and sugar.', category: 'south indian' },
    { id: 32, title: 'Xacuti', time: 60, difficulty: 'hard', description: 'Goan coconut-based curry, sometimes included in South Indian cuisine.', category: 'south indian' },
    { id: 33, title: 'Yellu Bella', time: 15, difficulty: 'easy', description: 'Karnataka festive mix of sesame, jaggery, coconut, and peanuts.', category: 'south indian' },
    { id: 34, title: 'Zucchini Kootu', time: 25, difficulty: 'easy', description: 'Modern kootu with zucchini and lentils, South Indian style.', category: 'south indian' }
  ];

  const state = {
    filter: DEFAULT_FILTER,
    sort: DEFAULT_SORT,
    search: '',
    favoritesOnly: false,
    favorites: readFavorites(),
    currentRecipeId: null,
    isEditingIngredients: false,
    hasDeveloperAccess: false,
    ingredientOverrides: readStoredMap(INGREDIENTS_STORAGE_KEY),
    ingredientLocks: readStoredMap(INGREDIENTS_LOCKS_STORAGE_KEY)
  };

  const dom = {
    recipeContainer: document.querySelector('#recipe-container'),
    recipeIngredientsContainer: document.querySelector('#recipe-ingredients'),
    ingredientEditor: document.querySelector('#ingredientEditor'),
    editIngredientsButton: document.querySelector('#editIngredients'),
    saveIngredientsButton: document.querySelector('#saveIngredients'),
    cancelIngredientsButton: document.querySelector('#cancelIngredients'),
    toggleLockButton: document.querySelector('#toggleIngredientLock'),
    ingredientStatus: document.querySelector('#ingredientStatus'),
    recipeProcessContainer: document.querySelector('#recipe-process'),
    recipeTitle: document.querySelector('#recipeTitle'),
    recipeMeta: document.querySelector('#recipeMeta'),
    recipeDescription: document.querySelector('#recipeDescription'),
    backToRecipesButton: document.querySelector('#backToRecipes'),
    openThemeEditorButton: document.querySelector('#openThemeEditor'),
    themeEditorPanel: document.querySelector('#themeEditorPanel'),
    themePrimaryInput: document.querySelector('#themePrimary'),
    themeAccentInput: document.querySelector('#themeAccent'),
    themeBackgroundInput: document.querySelector('#themeBackground'),
    themeCardInput: document.querySelector('#themeCard'),
    resetThemeColorsButton: document.querySelector('#resetThemeColors'),
    recipeCounter: document.querySelector('#recipeCounter'),
    searchInput: document.querySelector('#searchInput'),
    clearSearchButton: document.querySelector('#clearSearch'),
    resetControlsButton: document.querySelector('#resetControls'),
    favoritesFilterButton: document.querySelector('#favoritesFilter'),
    filterButtons: document.querySelectorAll('[data-filter]'),
    sortButtons: document.querySelectorAll('[data-sort]')
  };

  function init() {
    applySavedTheme();

    if (dom.recipeProcessContainer) {
      bindRecipePageEvents();
      renderRecipePage();
      return;
    }

    bindEvents();
    bindThemeControls();
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
        if (favoriteButton) {
          event.stopPropagation();
          const recipeId = Number(favoriteButton.dataset.favid);
          toggleFavorite(recipeId);
          return;
        }

        const recipeCard = event.target.closest('.recipe-card');
        if (!recipeCard) return;

        navigateToRecipe(Number(recipeCard.dataset.id));
      });

      dom.recipeContainer.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;

        const recipeCard = event.target.closest('.recipe-card');
        if (!recipeCard) return;

        event.preventDefault();
        navigateToRecipe(Number(recipeCard.dataset.id));
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
      <article
        class="recipe-card"
        data-id="${recipe.id}"
        tabindex="0"
        role="button"
        aria-label="View how to make ${recipe.title}"
      >
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

  function bindRecipePageEvents() {
    if (dom.backToRecipesButton) {
      dom.backToRecipesButton.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }

    if (dom.editIngredientsButton) {
      dom.editIngredientsButton.addEventListener('click', () => {
        const recipe = getCurrentRecipe();
        if (!recipe || isRecipeLocked(recipe.id)) return;

        state.isEditingIngredients = true;
        renderRecipeContent(recipe);
      });
    }

    if (dom.cancelIngredientsButton) {
      dom.cancelIngredientsButton.addEventListener('click', () => {
        const recipe = getCurrentRecipe();
        if (!recipe) return;

        state.isEditingIngredients = false;
        renderRecipeContent(recipe);
      });
    }

    if (dom.saveIngredientsButton) {
      dom.saveIngredientsButton.addEventListener('click', () => {
        const recipe = getCurrentRecipe();
        if (!recipe || !dom.ingredientEditor) return;
        if (isRecipeLocked(recipe.id)) return;

        const editedIngredients = dom.ingredientEditor.value
          .split('\n')
          .map(line => line.trim())
          .filter(Boolean);

        if (!editedIngredients.length) {
          window.alert('Please add at least one ingredient before saving.');
          return;
        }

        setIngredientOverride(recipe.id, editedIngredients);
        state.isEditingIngredients = false;
        renderRecipeContent(recipe);
      });
    }

    if (dom.toggleLockButton) {
      dom.toggleLockButton.addEventListener('click', () => {
        const recipe = getCurrentRecipe();
        if (!recipe) return;

        if (!state.hasDeveloperAccess) {
          const code = window.prompt('Developer code required to lock or unlock ingredient editing:');
          if (code !== DEVELOPER_ACCESS_CODE) {
            window.alert('Access denied. Only developer can change lock status.');
            return;
          }
          state.hasDeveloperAccess = true;
        }

        const nextLockedState = !isRecipeLocked(recipe.id);
        setRecipeLock(recipe.id, nextLockedState);

        if (nextLockedState) {
          state.isEditingIngredients = false;
        }

        renderRecipeContent(recipe);
      });
    }
  }

  function bindThemeControls() {
    if (!dom.openThemeEditorButton || !dom.themeEditorPanel) return;

    syncThemeInputs();

    dom.openThemeEditorButton.addEventListener('click', () => {
      const isHidden = dom.themeEditorPanel.hasAttribute('hidden');
      if (isHidden) {
        dom.themeEditorPanel.removeAttribute('hidden');
      } else {
        dom.themeEditorPanel.setAttribute('hidden', '');
      }
      dom.openThemeEditorButton.setAttribute('aria-expanded', String(isHidden));
    });

    const themeInputs = [
      dom.themePrimaryInput,
      dom.themeAccentInput,
      dom.themeBackgroundInput,
      dom.themeCardInput
    ].filter(Boolean);

    themeInputs.forEach(input => {
      input.addEventListener('input', () => {
        const theme = readThemeFromInputs();
        applyTheme(theme);
        saveTheme(theme);
      });
    });

    if (dom.resetThemeColorsButton) {
      dom.resetThemeColorsButton.addEventListener('click', () => {
        applyTheme(DEFAULT_THEME);
        saveTheme(DEFAULT_THEME);
        syncThemeInputs();
      });
    }
  }

  function renderRecipePage() {
    const params = new URLSearchParams(window.location.search);
    const recipeId = Number(params.get('id'));
    const recipe = recipes.find(item => item.id === recipeId);
    state.currentRecipeId = recipeId;

    if (!recipe) {
      dom.recipeProcessContainer.innerHTML = '<p class="recipe-details-empty">Recipe not found. Go back and choose another recipe.</p>';
      if (dom.recipeIngredientsContainer) {
        dom.recipeIngredientsContainer.innerHTML = '';
      }
      if (dom.ingredientStatus) {
        dom.ingredientStatus.textContent = '';
      }
      if (dom.recipeTitle) {
        dom.recipeTitle.textContent = 'Recipe Not Found';
      }
      if (dom.recipeMeta) {
        dom.recipeMeta.textContent = '';
      }
      if (dom.recipeDescription) {
        dom.recipeDescription.textContent = '';
      }
      return;
    }

    renderRecipeContent(recipe);
  }

  function renderRecipeContent(recipe) {
    const ingredients = getEffectiveIngredients(recipe);

    if (dom.recipeTitle) {
      dom.recipeTitle.textContent = recipe.title;
    }

    if (dom.recipeMeta) {
      dom.recipeMeta.textContent = `${capitalize(recipe.difficulty)} | ${recipe.time} minutes | ${recipe.category}`;
    }

    if (dom.recipeDescription) {
      dom.recipeDescription.textContent = recipe.description;
    }

    renderIngredientsSection(recipe, ingredients);

    const stepsMarkup = createHowToSteps(recipe, ingredients)
      .map(step => `<li>${step}</li>`)
      .join('');

    dom.recipeProcessContainer.innerHTML = `<ol class="recipe-steps">${stepsMarkup}</ol>`;
    syncIngredientButtons(recipe);
  }

  function navigateToRecipe(recipeId) {
    window.location.href = `recipe.html?id=${recipeId}`;
  }

  function createHowToSteps(recipe, ingredients = createIngredients(recipe)) {
    const technique = pickTechnique(recipe.category);
    const [mainA, mainB, mainC] = ingredients;

    return [
      `Gather all ingredients and keep these ready first: ${ingredients.join(', ')}.`,
      `Prep and add the base ingredients in order: ${mainA}, then ${mainB}, followed by ${mainC}.`,
      `${technique}. Add remaining ingredients gradually and mix after each addition for even flavor.`,
      `Plate hot, add a final garnish, and serve immediately for best flavor.`
    ];
  }

  function renderIngredientsSection(recipe, ingredients) {
    if (!dom.recipeIngredientsContainer) return;

    if (state.isEditingIngredients && !isRecipeLocked(recipe.id)) {
      const editableList = ingredients.join('\n');
      dom.recipeIngredientsContainer.innerHTML = `
        <label for="ingredientEditor" class="ingredients-editor-label">One ingredient per line</label>
        <textarea id="ingredientEditor" class="ingredients-editor" rows="8">${editableList}</textarea>
      `;
      dom.ingredientEditor = document.querySelector('#ingredientEditor');
      return;
    }

    const ingredientsMarkup = ingredients
      .map(item => `<li>${item}</li>`)
      .join('');

    dom.recipeIngredientsContainer.innerHTML = `<ul class="ingredients-list">${ingredientsMarkup}</ul>`;
    dom.ingredientEditor = null;
  }

  function syncIngredientButtons(recipe) {
    const isLocked = isRecipeLocked(recipe.id);

    if (dom.editIngredientsButton) {
      dom.editIngredientsButton.style.display = state.isEditingIngredients ? 'none' : 'inline-flex';
      dom.editIngredientsButton.disabled = isLocked;
      dom.editIngredientsButton.title = isLocked
        ? 'Ingredient editing is locked by developer'
        : 'Edit ingredient details';
    }

    if (dom.saveIngredientsButton) {
      dom.saveIngredientsButton.style.display = state.isEditingIngredients ? 'inline-flex' : 'none';
      dom.saveIngredientsButton.disabled = isLocked;
    }

    if (dom.cancelIngredientsButton) {
      dom.cancelIngredientsButton.style.display = state.isEditingIngredients ? 'inline-flex' : 'none';
    }

    if (dom.toggleLockButton) {
      dom.toggleLockButton.textContent = isLocked ? 'Unlock (Developer)' : 'Lock (Developer)';
    }

    if (dom.ingredientStatus) {
      dom.ingredientStatus.textContent = isLocked
        ? 'Ingredients are locked by developer. Editing is disabled.'
        : 'Ingredients can be edited by user.';
    }
  }

  function getCurrentRecipe() {
    if (!state.currentRecipeId) return null;
    return recipes.find(recipe => recipe.id === state.currentRecipeId) || null;
  }

  function getEffectiveIngredients(recipe) {
    const override = state.ingredientOverrides[String(recipe.id)];
    if (Array.isArray(override) && override.length) {
      return override;
    }

    return createIngredients(recipe);
  }

  function isRecipeLocked(recipeId) {
    return Boolean(state.ingredientLocks[String(recipeId)]);
  }

  function setRecipeLock(recipeId, isLocked) {
    state.ingredientLocks[String(recipeId)] = isLocked;
    localStorage.setItem(INGREDIENTS_LOCKS_STORAGE_KEY, JSON.stringify(state.ingredientLocks));
  }

  function setIngredientOverride(recipeId, ingredients) {
    state.ingredientOverrides[String(recipeId)] = ingredients;
    localStorage.setItem(INGREDIENTS_STORAGE_KEY, JSON.stringify(state.ingredientOverrides));
  }

  function createIngredients(recipe) {
    const ingredientsByCategory = {
      pasta: ['200 g pasta', '2 tbsp olive oil', '3 garlic cloves (minced)', '1 cup sauce', 'Salt and black pepper'],
      curry: ['400 g protein or vegetables', '2 tbsp oil or ghee', '1 onion (sliced)', '2 tomatoes (chopped)', '1 tbsp spice blend', '1/2 cup cream or coconut milk'],
      baking: ['2 cups flour', '1/2 cup butter', '1/2 cup sugar', '1 tsp baking powder', 'Pinch of salt'],
      salad: ['2 cups mixed vegetables', '1/4 cup olives', '1/4 cup cheese', '2 tbsp olive oil', '1 tbsp lemon juice', 'Salt and pepper'],
      meat: ['500 g meat', '2 tbsp oil', '1 onion (chopped)', '1 tbsp garlic-ginger paste', 'Spices to taste', '1 cup stock'],
      vegetarian: ['3 cups mixed vegetables', '1 tbsp oil', '2 garlic cloves', '1 tbsp soy sauce', '1 tsp chili flakes', 'Salt to taste'],
      noodles: ['200 g noodles', '1 tbsp oil', '1 cup mixed vegetables/protein', '2 tbsp sauce', '1 tsp sugar', '1 tbsp peanuts or garnish'],
      pizza: ['1 pizza dough base', '1/2 cup tomato sauce', '1 cup mozzarella', 'Fresh basil leaves', '1 tbsp olive oil'],
      'south indian': ['1 cup rice or lentils (as needed)', '1 tbsp oil or ghee', '1 tsp mustard seeds', 'Curry leaves', '2 dried red chilies', 'Salt to taste']
    };

    const recipeOverrides = {
      'Classic Spaghetti Carbonara': ['200 g spaghetti', '100 g pancetta', '2 eggs', '1/2 cup parmesan', 'Black pepper and salt'],
      Dosa: ['1 cup dosa batter', '1 tsp oil or ghee', 'Salt as needed', 'Chutney for serving'],
      Idli: ['2 cups idli batter', '1 tsp oil for greasing', 'Salt as needed', 'Chutney and sambar for serving'],
      'Hyderabadi Biryani': ['2 cups basmati rice', '500 g chicken or mutton', '1 cup yogurt', '2 onions (fried)', '1 tbsp biryani masala', 'Saffron milk and mint']
    };

    return recipeOverrides[recipe.title] || ingredientsByCategory[recipe.category] || ['Fresh ingredients as needed', 'Salt to taste', 'Oil for cooking'];
  }

  function pickTechnique(category) {
    const techniqueByCategory = {
      pasta: 'Boil the base ingredients, then finish with a gentle toss in sauce',
      curry: 'Saute aromatics, simmer the gravy, and cook until rich and balanced',
      baking: 'Mix and fold carefully, then bake until golden and cooked through',
      salad: 'Combine fresh ingredients and toss just before serving',
      meat: 'Sear for color, then cook slowly until tender and juicy',
      vegetarian: 'Stir fry on high heat to keep the vegetables crisp and bright',
      noodles: 'Cook quickly over high heat and coat evenly with sauce',
      pizza: 'Bake on high heat until the crust is crisp and cheese is bubbling',
      'south indian': 'Temper whole spices first, then simmer with the prepared base'
    };

    return techniqueByCategory[category] || 'Cook over medium heat until texture and flavor are fully developed';
  }

  function capitalize(value) {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1);
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

  function readStoredMap(storageKey) {
    try {
      const rawValue = localStorage.getItem(storageKey);
      const parsedValue = rawValue ? JSON.parse(rawValue) : {};
      return parsedValue && typeof parsedValue === 'object' ? parsedValue : {};
    } catch {
      return {};
    }
  }

  function applySavedTheme() {
    const storedTheme = readStoredMap(THEME_STORAGE_KEY);
    const theme = {
      primary: normalizeColorValue(storedTheme.primary, DEFAULT_THEME.primary),
      accent: normalizeColorValue(storedTheme.accent, DEFAULT_THEME.accent),
      bg: normalizeColorValue(storedTheme.bg, DEFAULT_THEME.bg),
      card: normalizeColorValue(storedTheme.card, DEFAULT_THEME.card)
    };

    applyTheme(theme);
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--primary-dark', theme.primary);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--bg', theme.bg);
    root.style.setProperty('--card', theme.card);
  }

  function syncThemeInputs() {
    const computed = getComputedStyle(document.documentElement);

    if (dom.themePrimaryInput) {
      dom.themePrimaryInput.value = toHexColor(computed.getPropertyValue('--primary')) || DEFAULT_THEME.primary;
    }
    if (dom.themeAccentInput) {
      dom.themeAccentInput.value = toHexColor(computed.getPropertyValue('--accent')) || DEFAULT_THEME.accent;
    }
    if (dom.themeBackgroundInput) {
      dom.themeBackgroundInput.value = toHexColor(computed.getPropertyValue('--bg')) || DEFAULT_THEME.bg;
    }
    if (dom.themeCardInput) {
      dom.themeCardInput.value = toHexColor(computed.getPropertyValue('--card')) || DEFAULT_THEME.card;
    }
  }

  function readThemeFromInputs() {
    return {
      primary: normalizeColorValue(dom.themePrimaryInput && dom.themePrimaryInput.value, DEFAULT_THEME.primary),
      accent: normalizeColorValue(dom.themeAccentInput && dom.themeAccentInput.value, DEFAULT_THEME.accent),
      bg: normalizeColorValue(dom.themeBackgroundInput && dom.themeBackgroundInput.value, DEFAULT_THEME.bg),
      card: normalizeColorValue(dom.themeCardInput && dom.themeCardInput.value, DEFAULT_THEME.card)
    };
  }

  function saveTheme(theme) {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  }

  function normalizeColorValue(value, fallback) {
    if (typeof value !== 'string') return fallback;
    const trimmed = value.trim();
    return /^#[0-9a-fA-F]{6}$/.test(trimmed) ? trimmed.toLowerCase() : fallback;
  }

  function toHexColor(value) {
    const normalized = normalizeColorValue(value, '');
    return normalized || null;
  }

  return {
    init
  };
})();

RecipeApp.init();
