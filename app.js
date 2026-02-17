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
    return `
        <div class="recipe-card" data-id="${recipe.id}">
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
    // Transform each recipe object into an HTML string using map
    const recipeCardsHTML = recipesToRender.map(createRecipeCard).join('');
    
    // Inject the combined HTML strings into the DOM container
    recipeContainer.innerHTML = recipeCardsHTML;
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
const updateDisplay = () => {

    const filteredRecipes = filterRecipes(recipes, currentFilter);
    const sortedRecipes = sortRecipes(filteredRecipes, currentSort);

    renderRecipes(sortedRecipes);
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
const recipe = [
  {
    id: 1,
    name: "Pasta",
    category: "Italian",
    ingredients: [
      "Pasta",
      "Salt",
      "Tomato Sauce",
      "Olive Oil"
    ],
    steps: [
      "Boil water",
      {
        step: "Cook pasta",
        substeps: [
          "Add pasta to boiling water",
          "Cook for 8–10 minutes",
          "Drain water"
        ]
      },
      "Add sauce and mix well"
    ]
  },
  {
    id: 2,
    name: "Fried Rice",
    category: "Chinese",
    ingredients: [
      "Rice",
      "Vegetables",
      "Soy Sauce",
      "Oil"
    ],
    steps: [
      "Heat oil in pan",
      {
        step: "Add vegetables",
        substeps: [
          "Chop vegetables",
          {
            step: "Saute vegetables",
            substeps: [
              "Cook for 5 minutes",
              "Add salt"
            ]
          }
        ]
      },
      "Add rice and mix",
      "Add soy sauce and cook for 2 minutes"
    ]
  }
];
const RecipeApp = (function () {

  let recipeData = [];

  function init(data) {
    recipeData = data;
    renderRecipes(recipeData);
    attachEvents();
  }

  function renderRecipes(recipes) {
    const container = document.getElementById("recipeContainer");
    container.innerHTML = "";

    recipes.forEach(recipe => {
      container.innerHTML += `
        <div class="card">
          <h3>${recipe.name}</h3>
          <button class="toggle-steps" data-id="${recipe.id}">
            Show Steps
          </button>
          <button class="toggle-ingredients" data-id="${recipe.id}">
            Show Ingredients
          </button>
          <div class="steps hidden" id="steps-${recipe.id}"></div>
          <div class="ingredients hidden" id="ingredients-${recipe.id}">
            <ul>
              ${recipe.ingredients.map(item => `<li>${item}</li>`).join("")}
            </ul>
          </div>
        </div>
      `;
    });
  }

  // 🔁 Recursive Function
  function renderSteps(steps) {
    let html = "<ul>";

    steps.forEach(step => {
      if (typeof step === "string") {
        html += `<li>${step}</li>`;
      } else {
        html += `<li>${step.step}`;
        html += renderSteps(step.substeps); // recursion here
        html += `</li>`;
      }
    });

    html += "</ul>";
    return html;
  }

  function attachEvents() {
    document
      .getElementById("recipeContainer")
      .addEventListener("click", function (e) {

        if (e.target.classList.contains("toggle-steps")) {
          const id = e.target.dataset.id;
          const stepDiv = document.getElementById(`steps-${id}`);

          const recipe = recipeData.find(r => r.id == id);

          if (stepDiv.innerHTML === "") {
            stepDiv.innerHTML = renderSteps(recipe.steps);
          }

          stepDiv.classList.toggle("hidden");
        }

        if (e.target.classList.contains("toggle-ingredients")) {
          const id = e.target.dataset.id;
          const ingDiv = document.getElementById(`ingredients-${id}`);
          ingDiv.classList.toggle("hidden");
        }
      });
  }

  return {
    init
  };

})();
RecipeApp.init(recipes);
