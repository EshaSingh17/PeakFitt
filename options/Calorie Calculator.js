const USDA_API_KEY = "fTSSoxLakf1CjCkjuGgYnmkNbTV646JciVWIJcHq";
        let foodItems = [];
        let totalCalories = 0;

        const foodInput = document.getElementById('food-input');
        const addFoodBtn = document.getElementById('add-food-btn');
        const foodList = document.getElementById('food-list');
        const totalCaloriesDisplay = document.getElementById('total-calories');
        const errorMessage = document.getElementById('error-message');

        async function fetchNutritionData(food) {
            addFoodBtn.disabled = true;
            addFoodBtn.innerHTML = '<div class="spinner"></div>Searching...';
            errorMessage.textContent = '';

            try {
                const searchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(food)}&pageSize=1&dataType=Survey (FNDDS)`;
                const response = await fetch(searchUrl);
                const data = await response.json();

                if (data.foods && data.foods.length > 0) {
                    const foodItem = data.foods[0];
                    const calories = foodItem.foodNutrients.find(n => n.nutrientName === "Energy")?.value || 0;
                    
                    return {
                        name: foodItem.description,
                        calories: calories,
                        servingSize: foodItem.servingSize || 100,
                        servingUnit: foodItem.servingSizeUnit || 'g',
                        id: Date.now()
                    };
                } else {
                    throw new Error(`No nutritional information found for "${food}"`);
                }
            } catch (error) {
                throw new Error("Failed to fetch nutrition data. Please try again.");
            } finally {
                addFoodBtn.disabled = false;
                addFoodBtn.textContent = 'Add Food';
            }
        }

        function updateTotalCalories() {
            totalCalories = foodItems.reduce((sum, item) => sum + item.calories, 0);
            totalCaloriesDisplay.textContent = `Total Calories: ${totalCalories.toFixed(1)} kcal`;
        }

        function createFoodItemElement(foodItem) {
            const div = document.createElement('div');
            div.className = 'food-item';
            div.innerHTML = `
                <div class="food-details">
                    <div class="food-name">${foodItem.name}</div>
                    <div class="food-serving">${foodItem.servingSize} ${foodItem.servingUnit}</div>
                </div>
                <div class="food-calories">${foodItem.calories.toFixed(1)} kcal</div>
                <button class="remove-btn" data-id="${foodItem.id}">Remove</button>
            `;
            return div;
        }

        function removeFoodItem(id) {
            foodItems = foodItems.filter(item => item.id !== id);
            updateTotalCalories();
            renderFoodList();
        }

        function renderFoodList() {
            foodList.innerHTML = '';
            foodItems.forEach(item => {
                foodList.appendChild(createFoodItemElement(item));
            });
        }

        addFoodBtn.addEventListener('click', async () => {
            const food = foodInput.value.trim();
            
            if (!food) {
                errorMessage.textContent = 'Please enter a food item';
                return;
            }

            try {
                const nutritionData = await fetchNutritionData(food);
                foodItems.push(nutritionData);
                updateTotalCalories();
                renderFoodList();
                foodInput.value = '';
                errorMessage.textContent = '';
            } catch (err) {
                errorMessage.textContent = err.message;
            }
        });

        foodList.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-btn')) {
                const id = parseInt(e.target.dataset.id);
                removeFoodItem(id);
            }
        });

        foodInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addFoodBtn.click();
            }
        });