let timerArea = $("#timeClock");
let theBigRedButton = $("#startBtn");
var highscoreEl = $('#highscores');
var theGame = $("#theGame");
var gameSwitch = $("#gameSwitch")
var siteLogo = $('#siteLogo')
var sliderPar = $('#secondLbl');
//typing
var currentLetter = 0;
let scorePlus = 0;
var wpm = 0
//timer
var timerRunning = false;
var timerInterval;
var secondsSlider = 60;
var secondsLeft = 60;

var gameOverFlag = false

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
    timerInterval = setInterval(function() {
        secondsLeft--;
        timerArea.text(secondsLeft);
        if(secondsLeft === 0) {
            clearInterval(timerInterval);
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

}
// Trigger the game and timer!
function onKeyPress(event) {
    
    if (!timerRunning && !gameOverFlag) {
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
function wikiApiStart(){
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
                
                wikiApiStart()
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
       wikiApiStart()
    } 
}

addEventListener('keydown', onKeyPress);

var artistNameArray = []
lyricPrompt = ""
var spotifykey = "831eec012dmshe433cc703128157p1c4d7ejsn9479fdf98d6b"



function getArtistId(artistNameArray){
  var index = Math.floor((Math.random()*artistNameArray.length))
  var artistName = artistNameArray[index].split(" ").join("20%")

    const settings = {
        async: true,
        crossDomain: true,
        url: 'https://spotify23.p.rapidapi.com/search/?q=' + artistName + '&type=multi&offset=0&limit=10&numberOfTopResults=5',
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': spotifykey,
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
};

$.ajax(settings).done(function (response) {
  var index = Math.floor((Math.random()*response.tracks.items.length))
	var trackId = response.tracks.items[index].data.id;
  
  getLyrics(trackId)
})};

function getLyrics(trackId){
  const settings = {
    async: true,
    crossDomain: true,
    url: 'https://spotify23.p.rapidapi.com/track_lyrics/?id=' + trackId,
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': spotifykey,
      'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
    }
  };
  
  $.ajax(settings).always(function (response, jqXHR) {
    
    if (jqXHR === "error"){
      spotifyApi()
      return
    }
    var lyricsArry =  response.lyrics.lines
    console.log(lyricsArry);
    for( var i = 0;i < lyricsArry.length; i++){
        lyricPrompt = lyricPrompt + lyricsArry[i].words
      
    }
    showText(formatText(lyricPrompt))
    console.log(lyricPrompt)
  });

}


function spotifyApi(){
    gameOverPage.css("display", "none")
    highscoreEl.css('display', 'none')
    paragraphEl.css("display", "flex")
    theGame.css('display', 'block')
    paragraphEl.html("");

    const settings = {
        async: true,
        crossDomain: true,
        url: 'https://spotify23.p.rapidapi.com/playlist_tracks/?id=37i9dQZF1EQpjs4F0vUZ1x&offset=0&limit=5',
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': spotifykey,
            'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
        }
    };

    $.ajax(settings).done(function (response) {
    var playlistArray = response.items
        for(var i = 0; i < playlistArray.length; i++){
        artistNameArray.push(playlistArray[i].track.artists[0].name)
        }
    
        getArtistId(artistNameArray)
    })
};

var musixCheckBox = $("#lyricsCheckBox");
musixCheckBox.on("change", function () {
    if ($(this).is(":checked")) {
            spotifyApi()
        ;
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


gameSwitch.on("click", function(){
    console.log()
    
    if(gameSwitch[0].attributes.game.textContent === "Wiki"){
        gameSwitch[0].attributes.game.textContent = "Spotify"
        init()
    }else{
        gameSwitch[0].attributes.game.textContent = "Wiki"
        init()
    }
})

function HighScores() {
    const savedScores = localStorage.getItem('highscore') || '[]' // get the score, or the initial value if empty
    const highscores = [...JSON.parse(savedScores)]

    //removes any unwanted elements from the dom and sets some styling
    theGame.css('display', 'none')
    highscoreEl.css('display', 'flex')

    $('#hsList').html('')

    clearInterval(timerInterval);
    secondsLeft = secondsSlider;
    scorePlus = 0;

    for (var i = 0; i < highscores.length; i++){
        var j = i+1
        $('#hsList').append('<p class="highscore">'+ j + ". " + highscores[i].score + " WPM")
    }
    
    $("#goBack").on("click", init)
    paragraphEl.html('')
}


function addHighscore(score) {
    if (!score) {
        return
    } 
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
    timerArea.text(evt.target.value);
})

// Game/timer is over shows the score and calls again the Init function to start again.

$('#root').on('click', "#highscoreBtn", HighScores);

$('#clearHighscores').on('click', function() {
    localStorage.clear();
    HighScores()
})


 function gameOver(){
        gameOverPage.css("background", "#5e6974")
        paragraphEl.css("display", "none")
        gameOverPage.css("display", "block")

        gameOverFlag = true
         
        clearInterval(timerInterval);
        timerRunning = false
        // words per minute calculation
        wpm = Math.floor(scorePlus / 4.7 * 60 / secondsSlider);
        scorePlus = 0;
        $('#score').text("WPM:  " + wpm)
        addHighscore(wpm)

        paragraphEl.html("");
        currentLetter = 0

        $("#restartGame").on("click", init)
       }

function init(){
    
    $("#startBtn").css('display', 'block');
    timerArea.text(secondsSlider);
    gameOverFlag = false;
    timerRunning = false
    currentLetter = 0;

    if(gameSwitch[0].attributes.game.textContent === "Wiki"){
        siteLogo.text("Wiki-Type")
        wikiApiStart()
    }
    else if(gameSwitch[0].attributes.game.textContent === "Spotify" ){
        siteLogo.text("Spotify-Type")
        spotifyApi()
    }
}
init()  