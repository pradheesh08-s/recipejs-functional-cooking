// Recipe data - Foundation for all 4 parts
const recipes = [
    {
        id: 1,
        title: "Classic Spaghetti Carbonara",
        time: 25,
        difficulty: "easy",
        description: "A creamy Italian pasta dish made with eggs, cheese, pancetta, and black pepper.",
        category: "pasta"
    },
    {
        id: 2,
        title: "Chicken Tikka Masala",
        time: 45,
        difficulty: "medium",
        description: "Tender chicken pieces in a creamy, spiced tomato sauce.",
        category: "curry"
    },
    {
        id: 3,
        title: "Homemade Croissants",
        time: 180,
        difficulty: "hard",
        description: "Buttery, flaky French pastries that require patience but deliver amazing results.",
        category: "baking"
    },
    {
        id: 4,
        title: "Greek Salad",
        time: 15,
        difficulty: "easy",
        description: "Fresh vegetables, feta cheese, and olives tossed in olive oil and herbs.",
        category: "salad"
    },
    {
        id: 5,
        title: "Beef Wellington",
        time: 120,
        difficulty: "hard",
        description: "Tender beef fillet coated with mushroom duxelles and wrapped in puff pastry.",
        category: "meat"
    },
    {
        id: 6,
        title: "Vegetable Stir Fry",
        time: 20,
        difficulty: "easy",
        description: "Colorful mixed vegetables cooked quickly in a savory sauce.",
        category: "vegetarian"
    },
    {
        id: 7,
        title: "Pad Thai",
        time: 30,
        difficulty: "medium",
        description: "Thai stir-fried rice noodles with shrimp, peanuts, and tangy tamarind sauce.",
        category: "noodles"
    },
    {
        id: 8,
        title: "Margherita Pizza",
        time: 60,
        difficulty: "medium",
        description: "Classic Italian pizza with fresh mozzarella, tomatoes, and basil.",
        category: "pizza"
    }
];

// DOM Selection - Get the container where recipes will be displayed
const recipeContainer = document.querySelector('#recipe-container');

// Function to create HTML for a single recipe card
const createRecipeCard = (recipe) => {
  const isFavorite = favorites.includes(recipe.id);
  return `
    <div class="recipe-card" data-id="${recipe.id}" style="position:relative;">
      <button class="favorite-btn" data-favid="${recipe.id}" title="Toggle Favorite">${isFavorite ? '❤️' : '🤍'}</button>
      <h3>${recipe.title}</h3>
      <div class="recipe-meta">
        <span>⏱️ ${recipe.time} min</span>
        <span class="difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
      </div>
      <p>${recipe.description}</p>
    </div>
  `;
};

// Function to render recipes to the DOM
const renderRecipes = (recipesToRender) => {
  const recipeCardsHTML = recipesToRender.map(createRecipeCard).join('');
  recipeContainer.innerHTML = recipeCardsHTML;
  // Attach favorite button listeners
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = Number(btn.getAttribute('data-favid'));
      toggleFavorite(id);
    });
  });
};

// Initialize: Render all recipes when page loads
renderRecipes(recipes);
// -----------------------------
// State Management
// -----------------------------
let currentFilter = "all";
let currentSort = null;

// -----------------------------
// DOM Selection
// -----------------------------
const filterButtons = document.querySelectorAll('[data-filter]');
const sortButtons = document.querySelectorAll('[data-sort]');

// -----------------------------
// Pure Filter Function
// -----------------------------
const filterRecipes = (recipesArray, filterType) => {

    if (filterType === "easy" || 
        filterType === "medium" || 
        filterType === "hard") {
        return recipesArray.filter(recipe => recipe.difficulty === filterType);
    }

    if (filterType === "quick") {
        return recipesArray.filter(recipe => recipe.time < 30);
    }

    return recipesArray; // "all"
};

// -----------------------------
// Pure Sort Function
// -----------------------------
const sortRecipes = (recipesArray, sortType) => {

    if (!sortType) return recipesArray;

    const sorted = [...recipesArray]; // copy to avoid mutation

    if (sortType === "name") {
        return sorted.sort((a, b) =>
            a.title.localeCompare(b.title)
        );
    }

    if (sortType === "time") {
        return sorted.sort((a, b) =>
            a.time - b.time
        );
    }

    return recipesArray;
};

// -----------------------------
// Central Update Function
// -----------------------------
let currentSearch = '';
let showFavoritesOnly = false;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

const filterBySearch = (recipesArray, searchValue) => {
  if (!searchValue) return recipesArray;
  const normalized = searchValue.toLowerCase();
  return recipesArray.filter(recipe =>
    recipe.title.toLowerCase().includes(normalized) ||
    (recipe.description && recipe.description.toLowerCase().includes(normalized))
  );
};

const filterByFavorites = (recipesArray) => {
  if (!showFavoritesOnly) return recipesArray;
  return recipesArray.filter(recipe => favorites.includes(recipe.id));
};

const updateDisplay = () => {
  let filtered = filterRecipes(recipes, currentFilter);
  filtered = filterBySearch(filtered, currentSearch);
  filtered = filterByFavorites(filtered);
  const sorted = sortRecipes(filtered, currentSort);
  renderRecipes(sorted);
  updateRecipeCounter(sorted.length, recipes.length);
};

// -----------------------------
// Event Listeners
// -----------------------------
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;
        updateDisplay();
    });
});

sortButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentSort = button.dataset.sort;
        updateDisplay();
    });
});

// Initial Load
updateDisplay();

// Debounce utility
function debounce(callback, delay = 400) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

// Search bar event
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', debounce(e => {
    currentSearch = e.target.value;
    updateDisplay();
  }, 400));
}

// Toggle favorite
function toggleFavorite(recipeId) {
  if (favorites.includes(recipeId)) {
    favorites = favorites.filter(id => id !== recipeId);
  } else {
    favorites.push(recipeId);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateDisplay();
}

// Favorites filter button
const favoritesFilterBtn = document.getElementById('favoritesFilter');
if (favoritesFilterBtn) {
  favoritesFilterBtn.addEventListener('click', () => {
    showFavoritesOnly = !showFavoritesOnly;
    favoritesFilterBtn.textContent = showFavoritesOnly ? 'Show All' : 'Show Favorites';
    updateDisplay();
  });
}

// Recipe counter
function updateRecipeCounter(visible, total) {
  const counter = document.getElementById('recipeCounter');
  if (counter) {
    counter.textContent = `Showing ${visible} of ${total} recipes`;
  }
}
