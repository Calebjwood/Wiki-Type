let timerArea = $("#timeClock");
let theBigRedButton = $("#startBtn");
var highscoreEl = $('#highscores');
var highscoreBtn = $('#highscoreBtn')
var theGame = $("#theGame");
var secondsSlider = 60;
var secondsLeft = 60;
var currentLetter = 0;
let scorePlus = 0;

var timerRunning = false;

var sliderPar = $('#secondLbl');

sliderPar.text('Seconds: ' + secondsLeft)
// Begin timer when click start button.
theBigRedButton.click(function () {
    if (!timerRunning) {
        setTime();
        timerRunning = true;
    }
});

var gameOverPage = $("#gameOverPage")
// deactivates the "START TEST" button until the timer reaches zero
// Set on the game/challenge timer.
function setTime() {
    timerRunning = true;
    secondsLeft = secondsSlider;
    $("#startBtn").css("display", 'none');
    let timerInterval = setInterval(function() {
        secondsLeft--;
        timerArea.text(secondsLeft);
        if(secondsLeft === 0) {
            clearInterval(timerInterval);
            $("#startBtn").css('display', 'block');
            timerArea.text(secondsSlider);
            // timerRunning = false
            gameOver()
            return;
        }
    }, 1000);
}

var paragraphEl = $('#test-paragraph')
var currentLetter = 0;
// array used for the div letters
var letterArray = []
var promptArray = []

// Cleans the input text by removing references, non-alphanumeric characters, and converting to lowercase.
function formatText(text) {
    if (text.length < 10) {
        return;
    }
    
// removes any source link from the text such as [1] or [123]
  var tempText = text.trim();

  while (tempText.includes("[")) {
    var i = tempText.indexOf("[");
    var j = tempText.indexOf("]") + 1;
    tempText = tempText.replace(tempText.substring(i, j), "");
  }

  //splits into array
  var textArray = tempText.split(" ");
  var finalText = "";

  for (var i = 0; i < textArray.length; i++) {
    // uses a regex pattern to remove all unwanted characters
    textArray[i] = textArray[i].replace(/[^A-Za-z0-9]/g, "");
    textArray[i] = textArray[i].toLowerCase();
  }

  for (var i = 0; i < textArray.length; i++) {
    if (textArray[i]) {
      finalText += textArray[i] + " ";
    }
  }

    finalText = finalText.trim()
    return(finalText);
}
// Splits the input text into words and letters.
function showText(text) {
  if (!text) {
    return;
  }

  var textArray = text.split(" ");

  for (var j = 0; j < textArray.length; j++) {
    var wordEl = $("<div>");
    wordEl.addClass("word");
    // word class to be able to use flexbox
    for (var i = 0; i <= textArray[j].length; i++) {
      // makes a letter div and adds each letter or a space to the element
      var letterEl = $("<div>");
      var letter = textArray[j][i] || "&nbsp;";

      letterEl.addClass("letter");

      letterEl.append(letter);
      wordEl.append(letterEl);
    }

    paragraphEl.append(wordEl);

    }
    letterArray = paragraphEl.children().children()

//     paragraphEl.append(wordEl);
//   }
//   letterArray = paragraphEl.children().children();
}
// Trigger the game and timer!
function onKeyPress(event) {
    
    if (!timerRunning) {
        setTime();
        timerRunning = true;
    }

    var letter = $(letterArray[currentLetter])
    
    letter.addClass('current');
    
    if (event.key === letter.text()){
        letter.addClass('correct')
        $(letterArray[currentLetter+1]).addClass('current')
        currentLetter++;
        letter.removeClass('current');
        //   
        scorePlus++;
        wPm(scorePlus);
        //
    } else if (event.key === 'Backspace') {
        letter.removeClass('current correct wrong');
        currentLetter--;
        letter = $(letterArray[currentLetter]);
        letter.addClass('current')
        letter.removeClass('correct wrong');
    }   
    else {
        letter.addClass('wrong')
        $(letterArray[currentLetter+1]).addClass('current')
        currentLetter++;
        letter.removeClass('current');
    }
    
    if (currentLetter <= 0) {
        currentLetter = 0;
    }
    else if (currentLetter > letterArray.length) {
        currentLetter = letterArray.length
    }
    }

// Display a wikipedia article in the test paragraph
function init(){
    gameOverPage.css("display", "none")
    highscoreEl.css('display', 'none')
    paragraphEl.css("display", "flex")
    theGame.css('display', 'block')
//Random fetch
 var url = "https://en.wikipedia.org/w/api.php"; 

var params = {
          
        action: "query",
        format: "json",
        list: "random",
        rnnamespace: '0',
        rnlimit: "1"
    }
    
    
    url = url + "?origin=*";
    Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});
    console
    
    fetch(url)
    .then(function(response)
    {return response.json();})
    .then(function(response) {
        var randoms = response.query.random;
        // console.log(randoms)
        var promptTitle = randoms[0].title
        wikiSearch(promptTitle)
    })

//Search fetch
function wikiSearch(promptTitle){
    
    $.ajax({
        url: url,
        data: {
            format: "json",
            action: "parse",
            page: promptTitle,
            prop:"text",
            section:0,
        },
        
        success: function (data) {
            // console.log(data)
            
            var markup = data.parse.text["*"];
            var i = $('<div></div>').html(markup);
            
            // remove links as they will not work
            i.find('a').each(function() { $(this).replaceWith($(this).html()); });
            
            // remove any references
            i.find('sup').remove();
            
            // remove cite error
            i.find('.mw-ext-cite-error').remove();
            
            // console.log($(i).find('p')[0]);
            var prompt = $(i).find('p')[0].innerText 
            // console.log($(i).find('p')[0].className)
            if ($(i).find('p')[0].className === "mw-empty-elt"){
                
                init()
            }
            
            showText(formatText(prompt));
            promptStack(prompt)
        }
    });
}}
// Calls the Init funciton based on the prompt.
function promptStack(prompt){
    promptArray.push(prompt)
    // change num for more prompt
    if (promptArray.length < 3){
        init()
    } 
}

init()

addEventListener('keydown', onKeyPress);

var apiMusix = 	"bfcb58e90eb355678c80ee8f0ffc9c50";

function wPm (scorePlus) {
    console.log(scorePlus);
    if (secondsLeft === 0) {
        localStorage.setItem("wpm", Math.floor(scorePlus / 4.7));
        gameOver();
    }
}
// API MusixMatch Code
var apiMusix = "bfcb58e90eb355678c80ee8f0ffc9c50";
function ApiClient(apiKey) {
    apiNodes = [];

    var callback = function (error, data, response, method) {
        console.log({ error, data, response, method })
    };

    var defaultClient = MusixmatchApi.ApiClient.instance;
    var key = defaultClient.authentications['key'];
    key.apiKey = apiKey;

    var opt;
    var trackId, albumId, artistId;
    

    opts = {
        format: "jsonp", // {String} output format: json, jsonp, xml.
        callback: "callback", // {String} jsonp callback
        page: 1, // {number}
        pageSize: 2,  // {number}
        country: 'us', // {String}
        fHasLyrics: 1 // {number}
    };

    (new MusixmatchApi.TrackApi()).chartTracksGetGet(opts, (error, data, response) => {
        callback(error, data, response, "chartTracksGetGet")
    })
}
// Call the Musix API just when checked in settings
var musixCheckBox = $("#lyricsCheckBox");
musixCheckBox.on("change", function () {
    if ($(this).is(":checked")) {        
        ApiClient(apiMusix);
    } 
} );
// safe the musix checked event target in the local storage
function getMusixChecked () {
    var storedMusixValue = localStorage.getItem("checked");
    return Boolean(storedMusixValue);
}
function setMusixChecked (state) {
    if (typeof state === "boolean") {
        localStorage.setItem("checked", state);
    }
}
const checkBoxEl = $("#lyricsCheckBox");
checkBoxEl.checked = getMusixChecked();

checkBoxEl.on("change", function(event) {
    const musixChecked = event.target.checked;
    setMusixChecked(musixChecked);
    console.log(event.target);
});

function HighScores() {
    const savedScores = localStorage.getItem('highscore') || '[]' // get the score, or the initial value if empty
    const highscores = [...JSON.parse(savedScores)]

    //removes any unwanted elements from the dom and sets some styling
    theGame.css('display', 'none')
    highscoreEl.css('display', 'flex')


    // clearInterval(timerInterval);

    for (var i = 0; i < highscores.length; i++){
        var j = i+1
        rootEl.append('<p class="highscore">'+ j + ". " + highscores[i].score + " WPM")
    }
    
    $("#goBack").on("click", init)
    paragraphEl.html('')
}


function addHighscore(score) {
    evt.preventDefault()
    //
    const result = {score: score};

    const savedScores = localStorage.getItem('highscore') || '[]' // get the score, or the initial value if empty
    // sorts and appends the new results to local storage
    const highscores = [...JSON.parse(savedScores), result] // add the result
    .sort((a, b) => b.score- a.score) // sort descending

    localStorage.setItem('highscore', JSON.stringify(highscores))
}
//settings popup

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
  });
       
//setting slider event listener

var slider = $('#secondRange');
slider.val(secondsLeft)


slider.on('input', function(evt) {
    sliderPar.text(`Seconds: ${evt.target.value}`);
    secondsSlider = evt.target.value;
    timerArea.text(evt.target.value)
})

// Game/timer is over shows the score and calls again the Init function to start again.

highscoreBtn.on('click', HighScores);

var placeHolder = "placeHolder"
 function gameOver(){
        gameOverPage.css("background", "#5e6974")
        paragraphEl.css("display", "none")
        gameOverPage.css("display", "block")

        $('#score').text("your words-per-min score is " + localStorage.getItem("wpm"))

        paragraphEl.html("");
        timerRunning = false
        currentLetter = 0

        $("#restartGame").on("click", init)
       }
       