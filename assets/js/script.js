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

var paragraphEl = $('#test-paragraph')
var currentLetter = 0;
// array used for the div letters
var letterArray = []

function formatText(text) {
    // removes any source link from the text such as [1] or [123]

    tempText = text;

    while (tempText.includes('[')) {
        var i = tempText.indexOf('[');
        var j = tempText.indexOf(']') + 1;
        tempText = tempText.replace(tempText.substring(i, j), '');
    }

    //splits into array
    textArray = tempText.split(' ')
    finalText = ''


    for (var i = 0; i < textArray.length; i++){

        // uses a regex pattern to remove all unwanted characters
        textArray[i] = textArray[i].replace(/[^A-Za-z0-9]/g, "");
        //joins them back together with a space
        finalText += textArray[i].toLowerCase() + " ";
    }

    return(finalText);
}

function showText(text) {
    
    textArray = text.split(' ');

    for (var j = 0; j < textArray.length; j++){
        var wordEl = $('<div>');
        wordEl.addClass('word');
        // word class to be able to use flexbox

        for (var i = 0; i <= textArray[j].length; i++){
            // makes a letter div and adds each letter or a space to the element
            var letterEl =  $('<div>');
            var letter = textArray[j][i] || '&nbsp;';
            
            letterEl.addClass('letter');
    

            letterEl.append(letter);
            wordEl.append(letterEl);
        }

        paragraphEl.append(wordEl);
    }
    letterArray = paragraphEl.children().children()
}

function onKeyPress(event) {
    // need to start timer here

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
    console.log(currentLetter)
}

function init(){
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
        console.log($(i).find('p')[0]);
		var prompt = $(i).find('p')[0].innerText 
        console.log($(i).find('p')[0].className)
        if ($(i).find('p')[0].className === "mw-empty-elt"){
            init()
        }
            showText(formatText(prompt));
    }
});
}}



init()

addEventListener('keydown', onKeyPress);


