let focusTime = 1500; // 25 minutes in seconds
let shortBreakTime = 300; // 5 minutes in seconds
let longBreakTime = 1200; // 20 minutes in seconds
let timer = focusTime;
let interval;
let cycleCount = 0; // Track cycles for breaks
let isRunning = false;
let isPaused = false;

const timerDisplay = document.getElementById('timer-display');
const controlBtn = document.getElementById('control');
const resetBtn = document.getElementById('reset');
const heading = document.querySelector('h1'); // Heading for the status
const progressBar = document.getElementById('progress-bar'); 
const skipBtn = document.getElementById('skip');
const endSound = document.getElementById("timer-end-sound");

function updateTimerDisplay() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function startTimer() {
    interval = setInterval(() => {
        if (timer > 0) {
            timer--;
            updateTimerDisplay();
            updateProgressBar();
        } else {
            clearInterval(interval);
            handleCycleEnd();
        }
    }, 1000);
}

function handleControlButton() {
    if (!isRunning && !isPaused) {
        startTimer();
        controlBtn.textContent = 'Stop';
        updateHeading();
        isRunning = true;
    } else if (isRunning) {
        clearInterval(interval);
        controlBtn.textContent = 'Resume';
        heading.textContent = 'Pomodoro'; // Revert heading when paused
        isRunning = false;
        isPaused = true;
    } else if (isPaused) {
        startTimer();
        controlBtn.textContent = 'Stop';
        updateHeading();
        isPaused = false;
        isRunning = true;
    }
}

function resetTimer() {
    clearInterval(interval);
    timer = focusTime;
    updateTimerDisplay();
    progressBar.style.width = '0%';
    heading.textContent = 'Pomodoro'; // Reset heading
    controlBtn.textContent = 'Start';
    isRunning = false;
    isPaused = false;
    cycleCount = 0; // Reset cycle count
}

function skipCycle() {
    clearInterval(interval); // Stop the current timer
    
    handleCycleEnd(); // Skip to the next phase (work/break)
    
    // Update the timer display immediately to show the new phase
    updateTimerDisplay();
    updateProgressBar();
}

function handleCycleEnd() {
    endSound.play();
    alert('Time’s up!');
    
    cycleCount++;
    if (cycleCount % 4 === 0) {
        timer = longBreakTime;
        heading.textContent = 'Long Break';
    } else if (cycleCount % 2 === 0) {
        timer = focusTime;
        heading.textContent = 'Focus';
    } else {
        timer = shortBreakTime;
        heading.textContent = 'Short Break';
    }
    startTimer(); // Automatically start the next session
}

function updateHeading() {
    if (cycleCount % 4 === 0) {
        heading.textContent = 'Focus';
    } else {
        heading.textContent = cycleCount % 2 === 0 ? 'Focus' : 'Short Break';
    }
}
/*
function updateProgressBar() {
    let totalDuration = cycleCount % 4 === 0 ? longBreakTime : (cycleCount % 2 === 0 ? focusTime : shortBreakTime);
    const progressPercentage = ((totalDuration - timer) / totalDuration) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}
*/
controlBtn.addEventListener('click', handleControlButton);
resetBtn.addEventListener('click', resetTimer);
skipBtn.addEventListener('click', skipCycle);

updateTimerDisplay(); // Initial display
