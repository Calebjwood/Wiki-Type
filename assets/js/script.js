let timerArea = $("#timeClock");
let theBigRedButton = $("#startBtn");
let secondsLeft = 60;

theBigRedButton.click(setTime);

// deactivates the "START TEST" button until the timer reaches zero
function setTime() {
    $("#startBtn").attr("disabled", true);
    let timerInterval = setInterval(function() {
    secondsLeft--;
    timerArea.text(secondsLeft);
        if(secondsLeft === 0) {
            clearInterval(timerInterval);
            $("#startBtn").attr("disabled",false);
            timerArea.text(60);
            return;
        }
    }, 1000);
}