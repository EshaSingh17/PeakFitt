const DAILY_GOAL = 10000;
let dailySteps = 0;
let history = [];

document.addEventListener('DOMContentLoaded', () => {
    // Load saved data on page load
    const savedSteps = localStorage.getItem('dailySteps');
    const savedHistory = localStorage.getItem('stepHistory');
    
    if (savedSteps) {
        dailySteps = parseInt(savedSteps);
    }
    
    if (savedHistory) {
        history = JSON.parse(savedHistory);
    }
    
    updateDisplay();
    displayHistory();
});

function addSteps() {
    const stepsInput = document.getElementById('steps');
    const steps = parseInt(stepsInput.value);
    
    if (isNaN(steps) || steps < 0) {
        alert('Please enter a valid number of steps');
        return;
    }
    
    dailySteps += steps;
    updateDisplay();
    addToHistory(steps);
    stepsInput.value = '';
    
    // Save to local storage
    localStorage.setItem('dailySteps', dailySteps);
}

function updateDisplay() {
    const progress = (dailySteps / DAILY_GOAL) * 100;
    const progressElement = document.getElementById('progress');
    const currentStepsElement = document.getElementById('current-steps');
    const remainingStepsElement = document.getElementById('remaining-steps');
    
    progressElement.style.width = `${Math.min(100, progress)}%`;
    currentStepsElement.textContent = dailySteps.toLocaleString();
    remainingStepsElement.textContent = 
        Math.max(0, DAILY_GOAL - dailySteps).toLocaleString();
}

function addToHistory(steps) {
    const now = new Date();
    const entry = {
        steps,
        timestamp: now.toISOString(),
        total: dailySteps
    };
    
    history.unshift(entry);
    if (history.length > 10) history.pop();
    
    localStorage.setItem('stepHistory', JSON.stringify(history));
    displayHistory();
}

function displayHistory() {
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = history.map(entry => `
        <div class="history-item">
            <span>${new Date(entry.timestamp).toLocaleTimeString()}</span>
            <span>+${entry.steps} steps</span>
            <span>Total: ${entry.total}</span>
        </div>
    `).join('');
}

// Reset steps daily at midnight
function resetStepsDaily() {
    const now = new Date();
    const lastResetTime = localStorage.getItem('lastResetTime');
    
    if (!lastResetTime || !isSameDay(new Date(lastResetTime), now)) {
        dailySteps = 0;
        history = [];
        localStorage.setItem('dailySteps', '0');
        localStorage.setItem('stepHistory', '[]');
        localStorage.setItem('lastResetTime', now.toISOString());
        updateDisplay();
        displayHistory();
    }
}

function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
}

// Check for daily reset on page load and every hour
document.addEventListener('DOMContentLoaded', resetStepsDaily);
setInterval(resetStepsDaily, 3600000); // Check every hour