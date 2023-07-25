let startEl = $('#startBtn');
let test = $('<p>');
let timer;
let timerCount = $('#play-area');


$(function () {
    $(startEl).on('click', function () {
        $('#startBtn').prop('disabled', true);
        timer = $('<div>')
        timer = $('#play-area').append(timer);
        console.log();
        // timer.attr('id', 'timer');
        timer = setInterval(function () {
                timerCount = 30;
                timerCount--; 
                console.log("wOWeeeee"); 
            }, 1000)
        }
    )
})
    
