var myPomodoroApp = {
    timer: "pomodoro",
    paused: true,
    pomodoroCount: 0,
    breakCount: 0,
    taskCount: 1,
    duration: null,
    countdownDisplay: document.getElementById("countdown"),
    stepDisplay: document.getElementById("step"),
    fractionOfHeightPerSecond: 0,
    fillHeight: 300,
    table: document.getElementById("historyTable"),
    task: "",
    alarm: new Audio('https://notificationsounds.com/soundfiles/0bb4aec1710521c12ee76289d9440817/file-dc_oringz-pack-nine-09.mp3'),
    muted: false
};

function dismiss() {
    document.getElementById("info").className += "collapse";
}

function updateLengths(elementID) {
    var pomodoroLength = document.getElementById("pomodoroLength");
    var breakLength = document.getElementById("breakLength");
    var longBreakLength = document.getElementById("longBreakLength");
    switch (elementID) {
        case "pomodoroMinus":
            if (pomodoroLength.textContent !== "1") { // Prevent times <= 0.
                pomodoroLength.textContent = pomodoroLength.textContent - 1;
            }
            break;
        case "pomodoroPlus":
            pomodoroLength.textContent = parseInt(pomodoroLength.textContent, 10) + 1; // parseInt is required because '+' is also the concatenation operator for strings.
            break;
        case "breakMinus":
            if (breakLength.textContent !== "1") {
                breakLength.textContent = breakLength.textContent - 1;
            }
            break;
        case "breakPlus":
            breakLength.textContent = parseInt(breakLength.textContent, 10) + 1;
            break;
        case "longBreakMinus":
            if (longBreakLength.textContent !== "1") {
                longBreakLength.textContent = longBreakLength.textContent - 1;
            }
            break;
        case "longBreakPlus":
            longBreakLength.textContent = parseInt(longBreakLength.textContent, 10) + 1;
            break;
    }
    
    // If we are updating the length of the current timer, reset and pause it. Otherwise, keep the timer running and update it for next time.
    if (elementID.includes(myPomodoroApp.timer)) {
        myPomodoroApp.countdownDisplay.textContent = eval(myPomodoroApp.timer + "Length").textContent + ":00";
        myPomodoroApp.paused = true;
        clearInterval(window.interval);
        countdown();
    }
}

function determineNextTimer() {
    if (myPomodoroApp.timer === "pomodoro") {
        if (myPomodoroApp.breakCount > 0 && myPomodoroApp.breakCount % 2 === 0) {
            myPomodoroApp.timer = "longBreak";
            document.getElementById("timerDisplay").textContent = "Long Break";
        } else {
            myPomodoroApp.timer = "break";
            document.getElementById("timerDisplay").textContent = "Break";
        }
    } else if (myPomodoroApp.timer === "longBreak") {
        myPomodoroApp.setCount += 1;
        myPomodoroApp.breakCount = 0;
        myPomodoroApp.pomodoroCount = 0;
        myPomodoroApp.timer = "pomodoro";
        document.getElementById("timerDisplay").textContent = "Work";
    } else {
        myPomodoroApp.timer = "pomodoro";
        document.getElementById("timerDisplay").textContent = "Work";
    }
}

function displayCountdown(seconds, minutes) {
    if (seconds < 10) {
         myPomodoroApp.countdownDisplay.textContent = minutes + ":0" + seconds;
    } else {
        myPomodoroApp.countdownDisplay.textContent = minutes + ":" + seconds;
    }
    if (minutes < 0) { // This prevents negative minutes and delayed second countdown when calling countdown() after minutes < 0 (because setInterval will wait another 1000 milliseconds) I hope that makes sense.
        minutes = document.getElementById(myPomodoroApp.timer + "Length").textContent;
        myPomodoroApp.countdownDisplay.textContent = minutes + ":00";
    }
}

function setProgress() {
    totalSeconds = myPomodoroApp.duration * 60;
    myPomodoroApp.fractionOfHeightPerSecond = 300 / totalSeconds; // 300 is the height in pixels of progressCover div.
    myPomodoroApp.fillHeight = 295; // -5px for border width.
}

function updateProgress() {
    myPomodoroApp.fillHeight -= myPomodoroApp.fractionOfHeightPerSecond;
    document.getElementById("progressCover").style.height = myPomodoroApp.fillHeight + "px";
}

function history() {
    var row = myPomodoroApp.table.insertRow(1);
    var taskCountCell = row.insertCell(0);
    var taskCell = row.insertCell(1);
    var durationCell = row.insertCell(2);
    var timeCell = row.insertCell(3);
    
    taskCountCell.innerHTML = myPomodoroApp.taskCount;
    myPomodoroApp.taskCount++;
    if (myPomodoroApp.task === "") {
        myPomodoroApp.task = "<i>Unnamed Task</i>";
    }
    taskCell.innerHTML = myPomodoroApp.task;
    durationCell.innerHTML = myPomodoroApp.duration;
    var time = new Date();
    time = time.toString().substr(16, 5);
    timeCell.innerHTML = time;
}

function task() {
    myPomodoroApp.task = document.getElementById("setTaskInput").value;
    document.getElementById("taskCover").classList.remove("taskCoverDown");
    document.getElementById("taskCover").classList.add("taskCoverUp");
    setTimeout(function() {
        document.getElementById("currentTask").innerHTML = myPomodoroApp.task;
        document.getElementById("setTaskText").classList.toggle("invisible");
        document.getElementById("setTaskInput").classList.toggle("invisible");
        document.getElementById("currentTask").classList.toggle("invisible");
        document.getElementById("taskCover").classList.remove("taskCoverUp");
        document.getElementById("taskCover").classList.add("taskCoverDown");
    }, 500)
}

function ringTimer() {
    myPomodoroApp.paused = true;
    myPomodoroApp.alarm.play();
}

function mute() {
    myPomodoroApp.muted = !myPomodoroApp.muted;
    document.getElementById("mute").classList.toggle("fa-volume-up");
    document.getElementById("mute").classList.toggle("fa-volume-off");
}

document.getElementById('mute').addEventListener('click',function (event) {
    event.stopPropagation();
}); // Prevents the mute button from triggering the timer beneath it.

function toggleHistory () {
    document.getElementById("historyAngleArrow").classList.toggle("fa-angle-double-down");
    document.getElementById("historyAngleArrow").classList.toggle("fa-angle-double-up");
    document.getElementById("historyTableDiv").classList.toggle("collapse");
}

function countdown() {
    myPomodoroApp.duration = document.getElementById(myPomodoroApp.timer + "Length").textContent;
    setProgress();
    var minutes = myPomodoroApp.duration;
    var seconds = 0;
    window.interval = setInterval(function () {
        if (!myPomodoroApp.paused) {
            if (seconds < 1) {
                seconds = 60;
                minutes--;
                if (minutes < 0) {
                    myPomodoroApp[myPomodoroApp.timer + "Count"] += 1;
                    if (myPomodoroApp.timer === "pomodoro") {
                        history();
                    }
                    if (!myPomodoroApp.muted) {
                        ringTimer();
                    }
                    determineNextTimer();
                    setProgress();
                    clearInterval(window.interval);
                    countdown();
                }
            }
            seconds--;
            updateProgress();
            displayCountdown(seconds, minutes);
        }
    }, 1000);
}

function pomodoroTimer() {
    if (document.getElementById("timerDisplay").textContent === "") {
        document.getElementById("timerDisplay").textContent = "Work";
    }
    if (myPomodoroApp.paused) {
        myPomodoroApp.paused = false;
        if (!window.interval) { // Prevents multiple setIntervals from running simultaneously.
            countdown();
        }
    } else {
        myPomodoroApp.paused = true;
    }
}
