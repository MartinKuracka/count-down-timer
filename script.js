const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = Date;
let countdownActive;

const second = 1000;
const minute = second*60;
const hour = minute*60;
const day = hour*24;

// Count down function
let countdownRunning = () => {
    setInterval(updateDOM(), 1000)
}
// populate Countdown / Complete UI
function updateDOM() {
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;

        const days = Math.floor(distance/day);
        const hours = Math.floor((distance % day)/hour) - 1;
        const minutes = Math.floor((distance % hour)/minute);
        const seconds = Math.floor((distance % minute)/second);

        //  Populate time elements
        countdownElTitle.textContent = `${countdownTitle}`;
        timeElements[0].textContent = days;
        timeElements[1].textContent = hours;
        timeElements[2].textContent = minutes;
        timeElements[3].textContent = seconds;
        // Hide input field
        inputContainer.hidden = true;
        // Show Countdown
        countdownEl.hidden = false;
    }, 1000);
}

// set the date input minimum with today's date
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

function updateCountdown(e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    // Get number version of current date
    countdownValue = new Date(countdownDate).getTime();
    console.log(countdownValue);
    updateDOM();
}

// Event lstener
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', () => {
    clearInterval(countdownActive);
    //  Show input field
    inputContainer.hidden = false;
    // Hide countdown field
    countdownEl.hidden = true;
})