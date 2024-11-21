document.addEventListener('DOMContentLoaded', () => {
    const stressForm = document.getElementById('stressForm');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('errorMessage');
    const resultContainer = document.getElementById('resultContainer');
    const stressLevelElement = document.getElementById('stressLevel');
    const suggestionsElement = document.getElementById('suggestions');
    const stressIndicator = document.getElementById('stressIndicator');

    stressForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateStressLevel();
    });

    function calculateStressLevel() {
        // Reset UI
        loading.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        resultContainer.classList.add('hidden');

        // Get form data
        const sleep = parseFloat(document.getElementById('sleep').value);
        const work = parseFloat(document.getElementById('work').value);
        const exercise = parseFloat(document.getElementById('exercise').value);
        const mood = document.getElementById('mood').value;

        try {
            const result = calculateLocalStressLevel({ sleep, work, exercise, mood });
            updateUI(result);
        } catch (error) {
            showError(error.message);
        }
    }

    function calculateLocalStressLevel(formData) {
        let stressScore = 0;

        // Sleep impact
        if (formData.sleep < 6) stressScore += 30;
        else if (formData.sleep < 7) stressScore += 20;
        else if (formData.sleep < 8) stressScore += 10;

        // Work impact
        if (formData.work > 10) stressScore += 25;
        else if (formData.work > 8) stressScore += 15;
        else if (formData.work > 6) stressScore += 5;

        // Exercise impact
        if (formData.exercise < 2) stressScore += 25;
        else if (formData.exercise < 4) stressScore += 15;
        else if (formData.exercise < 5) stressScore += 5;

        // Mood impact
        const moodScores = {
            'irritated': 20,
            'anxious': 15,
            'neutral': 10,
            'happy': 0
        };
        stressScore += moodScores[formData.mood] || 0;

        const finalScore = Math.min(100, stressScore);

        return {
            score: finalScore,
            level: finalScore < 30 ? 'Low' : finalScore < 60 ? 'Moderate' : 'High',
            suggestions: getDefaultSuggestions(finalScore)
        };
    }

    function getDefaultSuggestions(score) {
        if (score < 30) {
            return [
                'Keep maintaining your healthy routine',
                'Continue regular exercise',
                'Maintain good sleep habits'
            ];
        } else if (score < 60) {
            return [
                'Consider incorporating meditation',
                'Take regular breaks during work',
                'Ensure 7-8 hours of sleep',
                'Try stress-relief exercises'
            ];
        } else {
            return [
                'Consider consulting a healthcare professional',
                'Prioritize sleep and rest',
                'Reduce workload if possible',
                'Practice deep breathing exercises',
                'Make time for relaxation activities'
            ];
        }
    }

    function updateUI(data) {
        loading.classList.add('hidden');
        resultContainer.classList.remove('hidden');

        // Set stress level text
        stressLevelElement.textContent = `Stress Level: ${data.level} (${data.score}%)`;

        // Update stress meter/indicator
        stressIndicator.style.width = `${data.score}%`;
        stressIndicator.classList.remove('low', 'moderate', 'high');
        stressIndicator.classList.add(
            data.score < 30 ? 'low' : data.score < 60 ? 'moderate' : 'high'
        );

        // Add suggestions
        suggestionsElement.innerHTML = data.suggestions
            .map(suggestion => `<p>${suggestion}</p>`)
            .join('');
    }

    function showError(message) {
        loading.classList.add('hidden');
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }
});