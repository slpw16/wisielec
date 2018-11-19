$(document).ready(function() {   
    game();

    function game() {
        var chooseOptionGame = 1;
        if(chooseOptionGame === 0) {
            var file = 'haslo.txt';
        } else {
            var file = 'hasla.txt';
        }
            jQuery.get(file, function(data) {
            var sentence = data.split(";"); // rozdzielenie haseł z pliku i zapisanie ich do tablicy
            if(chooseOptionGame === 0) {
                randomWord = 0;
            } else if(chooseOptionGame === 1) {
                var randomWord = Math.floor(Math.random() * sentence.length ); // losowanie id z przedziału od 0 do liczby elementów w tablicy
            }
            var sentenceWithCategory = sentence[randomWord].split("|"); // rozdzielenie hasła od kategorii
            var seperateWords = sentenceWithCategory[1].split(" "); // rozdzielone wyrazy w zdaniu
            var wordsTableLength = seperateWords.length; // liczba wyrazów w zdaniu
            var lettersInWords = 0;
            var contentGame = $('.contentGame');
            var letterTable = ["q", "w", "e", "ę", "r", "t", "y", "u", "i", "o", "ó", "p", "a", "ą", "s", "ś", "d", "f", "g", "h", "j", "k", "l", "ł", "z", "ż", "ź", "c", "ć", "v", "b", "n", "ń", "m"];
            var sectionKeyboard = $('.sectionKeyboard');
            var idLetter = 0;
            var countLetter = 0;
            var scoreLetter = 0;
            var prevScoreLetter = 0;
            var missLetter = 8;
            var result = "";
            
            contentGame.html("").append('<div class="score">Kategoria: <p class="category">' + sentenceWithCategory[0] + '</p></div> <div class="score">Pozostało ruchów: <p class="move"> ' + missLetter + '</p></div>');
            sectionKeyboard.html("");
            $('.mainGame .startButton').css('visibility', 'hidden');
            console.log(sentence);
            for(var i=0; i<wordsTableLength; i++) {
                contentGame.append('<div class="word" data-word="' + i + '">');
                lettersInWords = seperateWords[i].length; // licba liter w wyrazie
                    for(var j=0; j<lettersInWords; j++) {
                        if(seperateWords[i][j] === "," || seperateWords[i][j] === "-" || seperateWords[i][j] === '"' || seperateWords[i][j] === ":" || seperateWords[i][j] === "." || seperateWords[i][j] === "!") {
                            $('div[data-word^="' + i + '"]').append('<span class="comma">' + seperateWords[i][j] + "</span>");
                        } else {
                            $('div[data-word^="' + i + '"]').append('<p class="letter" letter-content="' + seperateWords[i][j] + '">' + seperateWords[i][j] + "</p>");
                        countLetter += 1;
                        }
                    }
                contentGame.append('</div>');
            }
            for(var k=0; k<=2; k++) {
                sectionKeyboard.append('<div class="letterRow" data-keyboard=' + k + '">');
                for(var l=0; l<=10; l++) {
                    if(k === 0) {
                        idLetter = l;
                    }
                    else if(k === 1) {
                        idLetter = l + 11;
                    } else if(k === 2) {
                        idLetter = l + 22;
                        if(l === 10) {
                            $('div[data-keyboard^="' + k + '"]').append('<button type="button" class="letter btn btn-light">' + letterTable[idLetter + 1] + '</button>');
                        }
                    }
                    $('div[data-keyboard^="' + k + '"]').append('<button type="button" class="letter btn btn-light">' + letterTable[idLetter] + '</button>');
                }
                sectionKeyboard.append('</div>');
            }

            $('.word .letter').html("");

            $('.letterRow button').click(function() {
                var clickedLetter = $(this).text();
                $(this).prop("disabled", true);
                $('.word .letter').each(function() {
                    var checkLetter = $(this).attr("letter-content");
                    if( checkLetter === clickedLetter) {
                        scoreLetter += 1;
                        missClick = 0;
                        $(this).html(clickedLetter);
                    }
                });
                if(scoreLetter === countLetter) {
                    result = "winner";
                    end_game(result, sentenceWithCategory[1] );
                }

                if(prevScoreLetter === scoreLetter) {
                    missLetter -= 1;
                    $('.contentGame .score .move').html(missLetter);
                    if(missLetter === 0) {
                        result = "looser";
                        end_game(result, sentenceWithCategory[1]);
                    }
                }
                prevScoreLetter = scoreLetter;
            });
        });
    }
    
    function end_game(result, sentences) {
        var com = "";
        if(result === "winner") {
            $(".letterRow .letter").prop("disabled", "true");
            $(".mainGame .startButton").css("position", "relative").css("visibility", "visible");
            com = "Wygrałeś/aś, gratuluję";
        } else if(result === "looser") {
            $(".letterRow .letter").prop("disabled", "true");
            $(".mainGame .startButton").css("position", "relative").css("visibility", "visible");
            com = "Niestety przegrałeś/aś. <br> Hasło, które było do odgadnięcia to: " + sentences;
        }

        $('.contentGame .word').html("");
        $('.contentGame .word[data-word^="0"]').html(com);
    }

    $('.mainGame .startButton').click(game);
    
});