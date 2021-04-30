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
const lastTimer = document.getElementById('last-timer');
const audioElement = document.getElementById('speech');
// const speechaudio = document.getElementById('speech');

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
var nowdate;
var lastStoredDistance;
var audiointerval;

// Define time values for each unit
const second = 1000;
const minute = second*60;
const hour = minute*60;
const day = hour*24;


// Get NOW date
const getNowDate = () => {
    now = new Date().getTime();
    return nowdate = now;
}

// Calculate day, hour, minute and second
const calculateDaysHoursMinutesSeconds = (distance) => {
    const days = Math.floor(distance/day);
    const hours = Math.floor((distance % day)/hour);
    const minutes = Math.floor((distance % hour)/minute);
    const seconds = Math.floor((distance % minute)/second);
    return (returnedTimeElements = [days, hours, minutes, seconds]);
};

// Check local storage for stored timer data
const checkLocalStorage = () => {
    const checkTimerExist = localStorage.getItem('countdownStorage');
    if (checkTimerExist) {
        storageData = JSON.parse(checkTimerExist);
        countdownTitle = storageData.title;
        countdownDate = storageData.date;
        countdownTime = storageData.time;
        updateCountdown(countdownTitle, countdownDate, countdownTime);
    }
    if (localStorage.getItem('lastStoredTimeDuration')) {
        lastStoredDistance = localStorage.getItem('lastStoredTimeDuration');
        lastTimer.textContent = `Use the last duration: ${Math.floor((lastStoredDistance - 3600000)/60000)} minutes`;
    }
    calculateDaysHoursMinutesSeconds(lastStoredDistance);
};

// When countdown finished
const finishedCountdown = (countdownTitle) => {
    console.log(`from finished ${countdownTitle}`)
    clearInterval(countdownActive);
    inputContainer.hidden = true;
    countdownEl.hidden = true;
    complete.hidden = false;
    countdownDate = '';
    PlayAudios(countdownTitle);
    countdownTitle = '';
}

// Say out loud the title after finish with audio sound as well
const PlayAudios = (countdownTitle) => {
    console.log('countdownltitle is:',countdownTitle);
    audiointerval = setInterval(() => {
        audio.play();
        setTimeout(() => sendToSpeech(countdownTitle), 1500);
    }, audioElement.duration);
};

// Send Title to speech API
sendToSpeech = (countdownTitle) => {
    console.log('sending to speech,', countdownTitle);
    VoiceRSS.speech({
        key: 'd4bb3b3e69504439b7518ca9b6f461c7',
        src: countdownTitle,
        hl: 'en-us',
        v: 'Amy',
        r: 0,
        c: 'mp3',
        f: '44khz_16bit_stereo',
        ssml: false
    });
}

// set the date and time input minimum values to use when selecting
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);
setInterval(() => {
    // Get the current time value in miliseconds
    timeNow = String(new Date).substring(16,21);
    distandceTimeEl = timeNow.substring(0,2)*3600000 + timeNow.substring(3,5)*60000;
}, 2000);
timeEl.setAttribute('min', timeNow)

// populate Countdown / Complete UI
function updateValuesForDOM(distance,countdownTitle ) {
    if (distance) {
        distance = distance - 3600000;
        countdownActive = setInterval(() => {
            // Set time for Europe time zone
            // const now = new Date().getTime() + 3600000;
            distance = distance -1000;
            calculateDaysHoursMinutesSeconds(distance);
            populateTheDOM(returnedTimeElements[0], returnedTimeElements[1], returnedTimeElements[2], returnedTimeElements[3], countdownTitle);
            if (distance < 0) {
                finishedCountdown(countdownTitle);
            }
        }, 1000);
    } else {
        countdownActive = setInterval(() => {
            // Set time for Europe time zone
            const now = new Date().getTime() + 3600000;
            const distance = (countdownValue + countdownTimeMsValue) - now;
            calculateDaysHoursMinutesSeconds(distance);
            populateTheDOM(returnedTimeElements[0], returnedTimeElements[1], returnedTimeElements[2], returnedTimeElements[3], countdownTitle);
            if (distance < 0) {
                finishedCountdown(countdownTitle);
            }
        }, 1000);
    }
}

// Populate the DOM elements
const populateTheDOM = (days, hours, minutes, seconds, countdownTitle) => {
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
}

// Let me know if change in form field happened
const liveCheckForm = (e) => {
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

// Set timer values afte form submit
const setTimerValues = (e) => {
    e.preventDefault();
    if(e.srcElement[0].value) {
        countdownTitle = e.srcElement[0].value;
    }
    if (e.srcElement[3].checked === true) {
        distance = localStorage.getItem('lastStoredTimeDuration');
        countdownTitle = e.srcElement[0].value;
        updateValuesForDOM(distance, countdownTitle);
    } else {
        countdownTitle = e.srcElement[0].value;
        countdownDate = e.srcElement[1].value;
        countdownTime = e.srcElement[2].value;
        countdownStorage = {
            title: countdownTitle,
            date: countdownDate,
            time: countdownTime,
        }
        countdownStorage = JSON.stringify(countdownStorage);
        localStorage.setItem('countdownStorage', countdownStorage);
        updateCountdown(countdownTitle, countdownDate, countdownTime, e);
        lastTimer.textContent = `Use the last duration: ${Math.floor((distance - 3600000)/60000)} minutes`;
    }
}

// Update Las timer stored value and DOM value for it
const updateLastStoredValue = (countdownValue, countdownTimeMsValue) => {
    getNowDate();
    distance = (countdownValue + countdownTimeMsValue) - nowdate;
    localStorage.setItem('lastStoredTimeDuration', distance);
    return distance;
}

// update the countdown time
function updateCountdown(countdownTitle, countdownDate, countdownTime, e, ) {
    // evaluate if date and time fields are filled or not
    if (countdownDate && countdownTime) {
        // Get number version of current date
        countdownValue = new Date(countdownDate).getTime();
        // Calculate values based on the date selected
        if (formSetDate === today) {
            countdownTimeMsValue = (countdownTime.substring(0,2)*3600000 + countdownTime.substring(3,5)*60000) - distandceTimeEl;
            getNowDate();
            // Set time for Europe time zone
            countdownValue = nowdate + 3600000;
        } else {
            countdownTimeMsValue = countdownTime.substring(0,2)*3600000 + countdownTime.substring(3,5)*60000;
            nowdate = getNowDate();
            const distance = (countdownValue + countdownTimeMsValue) - nowdate;
        }
        updateValuesForDOM();
        // Store the value for the last stored timer duration
        if (!localStorage.getItem('lastStoredTimeDuration')) {
            getNowDate();
            updateLastStoredValue(countdownValue, countdownTimeMsValue);
        } else if (e) {
            getNowDate();
            updateLastStoredValue(countdownValue, countdownTimeMsValue);
        }
    } else {
        info.hidden = false;
        setTimeout(() => info.hidden = true, 2000)}
}

// Resest form
const resetForm = () => {
    clearInterval(audiointerval);
    clearInterval(countdownActive);
    inputContainer.hidden = false;
    countdownEl.hidden = true;
    complete.hidden = true;
    countdownDate = '';
    countdownTitle = '';
    localStorage.removeItem('countdownStorage');
    audio.pause();
    countdownForm.reset();
}

// Event lstener
countdownForm.addEventListener('submit', setTimerValues);
countdownForm.addEventListener('change', liveCheckForm);
countdownBtn.addEventListener('click', resetForm);
completeBtn.addEventListener('click', resetForm);

// On Load
checkLocalStorage();
