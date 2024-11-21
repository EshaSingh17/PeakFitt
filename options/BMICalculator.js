function calculateBMI() {
    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value) / 100;
  
    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
      alert("Please enter valid positive values for weight and height.");
      return;
    }
  
    const bmi = (weight / (height * height)).toFixed(2);
    document.getElementById("bmi-output").textContent = `Your BMI is: ${bmi}`;
  
    let category = "";
    let suggestion = "";
  
    if (bmi < 18.5) {
      category = "Underweight";
      suggestion = "Increase your calorie intake with nutrient-dense foods like nuts, seeds, whole grains, lean meats, and dairy products.";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      category = "Normal weight";
      suggestion = "Maintain your current diet and exercise routine. Stay hydrated and eat balanced meals.";
    } else if (bmi >= 25 && bmi <= 29.9) {
      category = "Overweight";
      suggestion = "Adopt a balanced diet low in refined carbs and sugars. Include regular physical activity like walking or jogging.";
    } else if (bmi >= 30 && bmi <= 39.9) {
      category = "Obese";
      suggestion = "Focus on a high-fiber diet, lean proteins, and avoid processed foods. Consult a healthcare provider for a personalized plan.";
    } else if (bmi >= 40) {
      category = "Severe Obesity";
      suggestion = "Seek medical advice for a comprehensive weight management plan. Focus on portion control and eliminate sugary drinks.";
    }
  
    document.getElementById("category-output").textContent = `Category: ${category}`;
    document.getElementById("suggestion-output").textContent = `Suggestion: ${suggestion}`;
  }
  