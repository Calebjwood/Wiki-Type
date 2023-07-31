let timerArea = $("#timeClock");
let theBigRedButton = $("#startBtn");
var secondsSlider = 60;
var secondsLeft = 60;

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
            timerArea.text(60);
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
  // removes any source link from the text such as [1] or [123]
  if (text.length < 10) {
    return;
  }

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

  return finalText;
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
  letterArray = paragraphEl.children().children();
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
    }
    else if (event.key === 'Backspace') {
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
paragraphEl.css("display", "flex")
//Random fetch
 var url = "https://en.wikipedia.org/w/api.php"; 

var params = {
    
    action: "query",
    format: "json",
    list: "random",
    rnnamespace: '0',
    rnlimit: "1"
};


url = url + "?origin=*";
Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

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


// API MusixMatch Code
var apiMusix = "bfcb58e90eb355678c80ee8f0ffc9c50";
function ApiClient(apiKey) {
    apiNodes = [];

    var callback = function (error, data, response, method) {
        console.log({ error, data, response, method })
    };

    var defaultClient = MusixmatchApi.ApiClient.instance;
    var key = defaultClient.authentications['key'];
    key.apiKey = "bfcb58e90eb355678c80ee8f0ffc9c50";

    var opt;
    var trackId, albumId, artistId;
    

    opts = {
        format: "jsonp", // {String} output format: json, jsonp, xml.
        callback: "callback", // {String} jsonp callback
        page: 1, // {number}
        pageSize: 100,  // {number}
        country: 'us', // {String}
        fHasLyrics: 1 // {number}
    };

    (new MusixmatchApi.TrackApi()).chartTracksGetGet(opts, (error, data, response) => {
        callback(error, data, response, "chartTracksGetGet")
    })

}
ApiClient(apiMusix);

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
var theGame = $("#theGame")
var placeHolder = "placeHolder"
 function gameOver(){
        gameOverPage.css("background", "#5e6974")
        paragraphEl.css("display", "none")
        gameOverPage.css("display", "block")
        $('#score').text("your Words per-min is " + placeHolder)
        $("#restartGame").on("click", init)
       }