function calculateBMI2() {
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value / 100; // Convert to meters
    if (weight && height) {
        const bmi = (weight / (height * height)).toFixed(2);
        document.getElementById('bmi-result').textContent = `Your BMI is: ${bmi}`;
    } else {
        document.getElementById('bmi-result').textContent = "Please enter valid inputs.";
    }
}

function searchCalories2() {
    const foodItem = document.getElementById('food-item').value;
    if (foodItem) {
        window.open(`https://www.google.com/search?q=calories+in+${foodItem}`, '_blank');
    } else {
        document.getElementById('calorie-result').textContent = "Enter a food item to search.";
    }
}



// Function to calculate BMI
function calculateBMI() {
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;

    if (weight && height) {
        const bmi = (weight / (height * height)).toFixed(2);
        let status = '';

        if (bmi < 18.5) {
            status = 'Underweight';
        } else if (bmi >= 18.5 && bmi < 24.9) {
            status = 'Normal weight';
        } else if (bmi >= 25 && bmi < 29.9) {
            status = 'Overweight';
        } else {
            status = 'Obesity';
        }

        document.getElementById('bmi-result').innerText = `Your BMI is ${bmi} (${status}).`;
    } else {
        document.getElementById('bmi-result').innerText = 'Please enter both weight and height.';
    }
}

// Function to search for calories of a food item
async function searchCalories1() {
    const foodItem = document.getElementById('food-item').value.trim();

    if (foodItem) {
        try {
            const response = await fetch(`https://api.edamam.com/api/food-database/v2/parser?ingr=${foodItem}&app_id=YOUR_APP_ID&app_key=YOUR_APP_KEY`);
            const data = await response.json();

            if (data.hints && data.hints.length > 0) {
                const calories = data.hints[0].food.nutrients.ENERC_KCAL;
                document.getElementById('calorie-result').innerText = `Calories for 100g of ${foodItem}: ${calories} kcal.`;
            } else {
                document.getElementById('calorie-result').innerText = `No calorie data found for "${foodItem}".`;
            }
        } catch (error) {
            console.error('Error fetching calorie data:', error);
            document.getElementById('calorie-result').innerText = 'Error fetching calorie data. Please try again.';
        }
    } else {
        document.getElementById('calorie-result').innerText = 'Please enter a food item.';
    }
}


async function searchCalories() {
    const foodItem = document.getElementById('food-item').value.trim();

    if (foodItem) {
        try {
            const response = await fetch(`http://localhost:3000/calories?food=${encodeURIComponent(foodItem)}`);
            const data = await response.json();

            if (data.calories) {
                document.getElementById('calorie-result').innerText = `Calories for 100g of ${foodItem}: ${data.calories}.`;
            } else {
                document.getElementById('calorie-result').innerText = `No data found for "${foodItem}".`;
            }
        } catch (error) {
            console.error('Error fetching calorie data:', error);
            document.getElementById('calorie-result').innerText = 'Error fetching calorie data. Please try again.';
        }
    } else {
        document.getElementById('calorie-result').innerText = 'Please enter a food item.';
    }
}
