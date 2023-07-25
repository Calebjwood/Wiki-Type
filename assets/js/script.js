var testParagraph = `Some toilet roll holders or dispensers allow the toilet paper to hang in front of (over) or behind (under) the roll when it is placed parallel to the wall. This divides opinions about which orientation is better. Arguments range from aesthetics, hospitality, ease of access, and cleanliness, to paper conservation, ease of detaching sheets, and compatibility with pets. 
The US advice column Ask Ann Landers reported that the subject was the most controversial issue in the column's history and, at 15,000 letters in 1986, provoked the highest number of responses.[1]
The case study of "toilet paper orientation" has been used as a teaching tool in instructing sociology students in the practice of social constructionism.`

var paragraphEl = $('#test-paragraph')



function formatText(text) {
    //splits into array
    textArray = text.split(' ')
    finalText = ''

    for (var i = 0; i < textArray.length; i++){
        // console.log(textArray[i])
        // uses a regex pattern to remove all unwanted characters
        textArray[i] = textArray[i].replace(/[^A-Za-z]/g, "");
        //joins them back together with a space
        finalText += textArray[i].toLowerCase() + " ";
    }

    return(finalText);
}



function showText(text) {
    
    textArray = text.split(' ');
    console.log(textArray)
    for (var j = 0; j < textArray.length; j++){
        var wordEl = $('<div>');
        wordEl.addClass('word');

        for (var i = 0; i <= textArray[j].length; i++){
        
            var letterEl =  $('<div>');
            var letter = textArray[j][i] || '&nbsp;';
            // if (letter === ' ') {
            //     letter = '&nbsp;';
            // }
            letterEl.addClass('letter');
    
            letterEl.append(letter);
            console.log(letterEl, letter)
            wordEl.append(letterEl);
        }

        paragraphEl.append(wordEl);
    }

    console.log(paragraphEl)
}
showText(formatText(testParagraph));