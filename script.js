const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');
const timeEl = document.getElementById('time-picker');
const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');
const info = document.getElementById('submit-info');
const complete = document.getElementById('complete');
const completeBtn = document.getElementById('complete-btn');
const audio = document.getElementById('audio');

var countdownTitle = '';
var countdownDate = '';
var countdownTime = '';
var countdownValue = Date;
var formPickedDate = Date;
var countdownTimePicked;
var formSetDate
var countdownActive;
var timeNow;
var distandceTimeEl;
var timeToAddToCountdown;
var now;
var storeLastDistance;

// Define time values for each unit
const second = 1000;
const minute = second*60;
const hour = minute*60;
const day = hour*24;

// set the date and time input minimum with values from NOW
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);
setInterval(() => {
    // Get the current time value in miliseconds
    timeNow = String(new Date).substring(16,21);
    distandceTimeEl = timeNow.substring(0,2)*3600000 + timeNow.substring(3,5)*60000;
}, 2000);
timeEl.setAttribute('min', timeNow)

// populate Countdown / Complete UI
function updateDOM() {    
    countdownActive = setInterval(() => {
        // Set time for Europe time zone
        const now = new Date().getTime() + 3600000;
        const distance = (countdownValue + countdownTimeMsValue) - now;
        const days = Math.floor(distance/day);
        const hours = Math.floor((distance % day)/hour);
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
        if (distance < 0) {
            clearInterval(countdownActive);
            inputContainer.hidden = true;
            countdownEl.hidden = true;
            complete.hidden = false;
            countdownDate = '';
            countdownTitle = '';
            audio.play();
        }
    }, 1000);
}

// Let me know if chage in form field happened
const checkForm = (e) => {
    if (e.srcElement.attributes[0].ownerElement.id === "date-picker") {
        formSetDate = e.srcElement.value;
        let minimumMinutes = Number(timeNow.substring(3)) + 1;
        let minMinutesToForm;
        minimumMinutes < 10 ? minMinutesToForm = `0${minimumMinutes}` : minMinutesToForm = minimumMinutes;
        if (formSetDate === today) {
            timeEl.setAttribute('min', `${timeNow.substring(0,2)}:${minMinutesToForm}`);
        } else {
            timeEl.removeAttribute('min')
        }
    }
}

function updateCountdown(e) {
    const checkTimerExist = localStorage.getItem('storedDate');
    if (checkTimerExist) {
        countdownTitle = localStorage.getItem('storedTitle');
        countdownDate = checkTimerExist;
        countdownTime = localStorage.getItem('storedTime');
    } else if (e) {
        e.preventDefault();
        countdownTitle = e.srcElement[0].value;
        countdownDate = e.srcElement[1].value;
        countdownTime = e.srcElement[2].value;
    } else return
    // evaluate if date and time fields are filled or not
    if (countdownDate && countdownTime) {
        // Get number version of current date
        countdownValue = new Date(countdownDate).getTime();
        // Check for dates and conditional
        if (formSetDate === today) {
            countdownTimeMsValue = (countdownTime.substring(0,2)*3600000 + countdownTime.substring(3,5)*60000) - distandceTimeEl;
            now = new Date().getTime();
            // Set time for Europe time zone
            countdownValue = now + 3600000;
        } else {
            countdownTimeMsValue = countdownTime.substring(0,2)*3600000 + countdownTime.substring(3,5)*60000;
            const distance = (countdownValue + countdownTimeMsValue) - now;
        }
        updateDOM();
        localStorage.setItem('storedTitle', countdownTitle);
        localStorage.setItem('storedDate', countdownDate);
        localStorage.setItem('storedTime', countdownTime);
    } else {
        info.hidden = false;
        setTimeout(() => info.hidden = true, 2000)}
}

// Resest form
const resetForm = () => {
    clearInterval(countdownActive);
    inputContainer.hidden = false;
    countdownEl.hidden = true;
    complete.hidden = true;
    countdownDate = '';
    countdownTitle = '';
    localStorage.removeItem('storedTitle');
    localStorage.removeItem('storedDate');
    localStorage.removeItem('storedTime');
    audio.pause();
}

// Event lstener
countdownForm.addEventListener('submit', updateCountdown);
countdownForm.addEventListener('change', checkForm);
countdownBtn.addEventListener('click', resetForm);
completeBtn.addEventListener('click', resetForm);

// On Load
updateCountdown();