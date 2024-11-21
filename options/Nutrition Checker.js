const nutritionCache = new Map();

async function getNutritionInfoUSDA() {
    const foodInput = document.getElementById("nutrition-food");
    const food = foodInput.value.trim();
    
    if (!food) {
        showError("Please enter a valid food item.");
        return;
    }

    // Show loading spinner
    toggleLoading(true);
    
    // Check cache first
    if (nutritionCache.has(food)) {
        displayNutritionData(nutritionCache.get(food));
        toggleLoading(false);
        return;
    }

    const apiKey = "fTSSoxLakf1CjCkjuGgYnmkNbTV646JciVWIJcHq"; // Replace with your USDA API key
    const searchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(food)}&pageSize=1&dataType=Survey (FNDDS)`;

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (data.foods && data.foods.length > 0) {
            const foodItem = data.foods[0];
            const nutritionData = processNutritionData(foodItem);
            
            // Cache the results
            nutritionCache.set(food, nutritionData);
            
            // Display the results
            displayNutritionData(nutritionData);
        } else {
            showError(`No nutritional information found for "${food}".`);
        }
    } catch (error) {
        console.error("Error fetching data from USDA API:", error);
        showError("Failed to fetch data. Please try again later.");
    } finally {
        toggleLoading(false);
    }
}

function processNutritionData(foodItem) {
    const getNutrientValue = (nutrientName) => {
        const nutrient = foodItem.foodNutrients.find(n => n.nutrientName === nutrientName);
        return nutrient ? {
            value: nutrient.value,
            unit: nutrient.unitName
        } : null;
    };

    return {
        description: foodItem.description,
        servingSize: foodItem.servingSize ? `${foodItem.servingSize} ${foodItem.servingSizeUnit}` : "100g",
        nutrients: {
            calories: getNutrientValue("Energy"),
            protein: getNutrientValue("Protein"),
            carbs: getNutrientValue("Carbohydrate, by difference"),
            fat: getNutrientValue("Total lipid (fat)"),
            fiber: getNutrientValue("Fiber, total dietary"),
            sugar: getNutrientValue("Sugars, total including NLEA"),
            sodium: getNutrientValue("Sodium, Na"),
            potassium: getNutrientValue("Potassium, K"),
            calcium: getNutrientValue("Calcium, Ca"),
            iron: getNutrientValue("Iron, Fe"),
            vitaminC: getNutrientValue("Vitamin C, total ascorbic acid"),
            vitaminD: getNutrientValue("Vitamin D (D2 + D3)")
        }
    };
}

function displayNutritionData(data) {
    // Clear any existing errors
    hideError();
    
    // Show results container
    document.getElementById("nutrition-results").classList.remove("hidden");
    
    // Update food title
    document.getElementById("food-title").textContent = data.description;
    
    // Update main nutrition cards
    document.getElementById("calories-value").textContent = formatNutrientValue(data.nutrients.calories);
    document.getElementById("protein-value").textContent = formatNutrientValue(data.nutrients.protein);
    document.getElementById("carbs-value").textContent = formatNutrientValue(data.nutrients.carbs);
    document.getElementById("fat-value").textContent = formatNutrientValue(data.nutrients.fat);
    
    // Update additional nutrients
    const additionalNutrientsHtml = generateAdditionalNutrientsHtml(data.nutrients);
    document.getElementById("additional-nutrients").innerHTML = additionalNutrientsHtml;
    
    // Update serving information
    document.getElementById("serving-size").textContent = `Serving size: ${data.servingSize}`;
    
    // Generate and update dietary guidelines
    document.getElementById("dietary-guidelines").innerHTML = generateDietaryGuidelines(data.nutrients);
}

function formatNutrientValue(nutrient) {
    if (!nutrient) return "-";
    return `${nutrient.value.toFixed(1)} ${nutrient.unit}`;
}

function generateAdditionalNutrientsHtml(nutrients) {
    const additionalNutrients = {
        fiber: "Dietary Fiber",
        sugar: "Sugar",
        sodium: "Sodium",
        potassium: "Potassium",
        calcium: "Calcium",
        iron: "Iron",
        vitaminC: "Vitamin C",
        vitaminD: "Vitamin D"
    };
    
    return Object.entries(additionalNutrients)
        .filter(([key]) => nutrients[key])
        .map(([key, label]) => `
            <div class="nutrient-item">
                <span class="nutrient-label">${label}:</span>
                <span class="nutrient-value">${formatNutrientValue(nutrients[key])}</span>
            </div>
        `).join("");
}

function generateDietaryGuidelines(nutrients) {
    let guidelines = [];
    
    if (nutrients.protein && nutrients.protein.value > 20) {
        guidelines.push("High in protein - good for muscle building and recovery");
    }
    
    if (nutrients.fiber && nutrients.fiber.value > 5) {
        guidelines.push("Good source of fiber - aids in digestion and promotes satiety");
    }
    
    if (nutrients.vitaminC && nutrients.vitaminC.value > 20) {
        guidelines.push("Rich in Vitamin C - supports immune system function");
    }
    
    return guidelines.length > 0 
        ? guidelines.join("<br>") 
        : "Basic nutritional food item - can be part of a balanced diet";
}

function toggleLoading(show) {
    document.getElementById("loading-spinner").classList.toggle("hidden", !show);
    document.getElementById("nutrition-results").classList.toggle("hidden", show);
}

function showError(message) {
    const errorDiv = document.getElementById("error-message");
    const errorText = errorDiv.querySelector(".error-text");
    errorText.textContent = message;
    errorDiv.classList.remove("hidden");
    document.getElementById("nutrition-results").classList.add("hidden");
}

function hideError() {
    document.getElementById("error-message").classList.add("hidden");
}