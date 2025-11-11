// Navbar toggle for mobile
const toggler = document.getElementById('navbar-toggler');
const menu = document.getElementById('navbar-menu');
toggler.addEventListener('click', () => {
  menu.classList.toggle('show');
});

// Navbar smooth scroll
document.querySelectorAll('.navbar-menu a').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if(href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({behavior: 'smooth'});
      menu.classList.remove('show');
    }
  });
});

// Clock
function updateClock() {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, '0');
  const s = now.getSeconds().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  document.getElementById('clock-display').textContent = `${h.toString().padStart(2, '0')}:${m}:${s} ${ampm}`;
  document.getElementById('date-display').textContent = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
setInterval(updateClock, 1000);
updateClock();

// Stopwatch
let stopwatchInterval, stopwatchTime = 0, stopwatchRunning = false;
const swDisplay = document.getElementById('stopwatch-display');
const swStartBtn = document.getElementById('stopwatch-start');
const swStopBtn = document.getElementById('stopwatch-stop');
const swResetBtn = document.getElementById('stopwatch-reset');

function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function beep(frequency, duration = 130) {
  // Simple beep using Web Audio API
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.16;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      ctx.close();
    }, duration);
  } catch(e) { /* Safari iOS may block sound. */ }
}

swStartBtn.onclick = function() {
  if (!stopwatchRunning) {
    beep(900, 150);
    stopwatchRunning = true;
    swStartBtn.disabled = true;
    swStopBtn.disabled = false;
    stopwatchInterval = setInterval(() => {
      stopwatchTime++;
      swDisplay.textContent = formatTime(stopwatchTime);
    }, 1000);
  }
};
swStopBtn.onclick = function() {
  if (stopwatchRunning) {
    beep(600, 190);
    stopwatchRunning = false;
    swStartBtn.disabled = false;
    swStopBtn.disabled = true;
    clearInterval(stopwatchInterval);
  }
};
swResetBtn.onclick = function() {
  stopwatchTime = 0;
  swDisplay.textContent = "00:00:00";
  clearInterval(stopwatchInterval);
  stopwatchRunning = false;
  swStartBtn.disabled = false;
  swStopBtn.disabled = true;
};

// Timer
let timerInterval, timerRunning = false, remainingSecs = 0;
const th = document.getElementById('timer-hours');
const tm = document.getElementById('timer-minutes');
const ts = document.getElementById('timer-seconds');
const timerDisplay = document.getElementById('timer-display');
const timerStartBtn = document.getElementById('timer-start');
const timerPauseBtn = document.getElementById('timer-pause');
const timerResetBtn = document.getElementById('timer-reset');
const timerAlert = document.getElementById('timer-alert');

function timerAlarm(times = 4) {
  let n = 0;
  function alarmBeep() {
    beep(1700, 290);
    setTimeout(() => { beep(550, 190); }, 170);
  }
  const alarm = setInterval(() => {
    alarmBeep();
    n++;
    if (n >= times) clearInterval(alarm);
  }, 600);
}

timerStartBtn.onclick = function() {
  const hours = parseInt(th.value, 10) || 0;
  const mins = parseInt(tm.value, 10) || 0;
  const secs = parseInt(ts.value, 10) || 0;
  remainingSecs = hours * 3600 + mins * 60 + secs;
  if (remainingSecs > 0 && !timerRunning) {
    timerRunning = true;
    timerStartBtn.disabled = true;
    timerPauseBtn.disabled = false;
    timerResetBtn.disabled = false;
    th.disabled = tm.disabled = ts.disabled = true;
    timerInterval = setInterval(() => {
      if (remainingSecs > 0) {
        remainingSecs--;
        timerDisplay.textContent = formatTime(remainingSecs);
      } else {
        clearInterval(timerInterval);
        timerDisplay.textContent = "00:00:00";
        timerRunning = false;
        timerStartBtn.disabled = false;
        timerPauseBtn.disabled = true;
        th.disabled = tm.disabled = ts.disabled = false;
        timerAlert.textContent = "⏰ Time's up!";
        timerAlert.classList.add('show');
        timerAlarm(5);
        setTimeout(() => timerAlert.classList.remove('show'), 3500);
      }
    }, 1000);
    timerDisplay.textContent = formatTime(remainingSecs);
    timerAlert.classList.remove('show');
  }
};
timerPauseBtn.onclick = function() {
  if (timerRunning) {
    timerRunning = false;
    clearInterval(timerInterval);
    timerPauseBtn.textContent = "Resume";
    beep(850, 130);
  } else if (remainingSecs > 0) {
    timerRunning = true;
    timerInterval = setInterval(() => {
      if (remainingSecs > 0) {
        remainingSecs--;
        timerDisplay.textContent = formatTime(remainingSecs);
      } else {
        clearInterval(timerInterval);
        timerDisplay.textContent = "00:00:00";
        timerRunning = false;
        timerPauseBtn.disabled = true;
        th.disabled = tm.disabled = ts.disabled = false;
        timerAlert.textContent = "⏰ Time's up!";
        timerAlert.classList.add('show');
        timerAlarm(5);
        setTimeout(() => timerAlert.classList.remove('show'), 3500);
      }
    }, 1000);
    timerPauseBtn.textContent = "Pause";
  }
};
timerResetBtn.onclick = function() {
  timerRunning = false;
  clearInterval(timerInterval);
  th.disabled = tm.disabled = ts.disabled = false;
  timerStartBtn.disabled = false;
  timerPauseBtn.disabled = true;
  timerPauseBtn.textContent = "Pause";
  timerResetBtn.disabled = false;
  timerDisplay.textContent = "00:00:00";
  timerAlert.classList.remove('show');
};
[th, tm, ts].forEach(input => {
  input.addEventListener('input', function() {
    if (this.value.length > 2) this.value = this.value.slice(0, 2);
    timerDisplay.textContent = formatTime(
      (parseInt(th.value, 10) || 0) * 3600 +
      (parseInt(tm.value, 10) || 0) * 60 +
      (parseInt(ts.value, 10) || 0)
    );
  });
});
// Form Handling (Dummy)
document.getElementById('contact-form').onsubmit = function(e) {
  e.preventDefault();
  this.style.display = 'none';
  document.getElementById('contact-success').style.display = 'block';
};
