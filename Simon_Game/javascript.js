var app = {
    strict: null,
    buttonSequence: [],
    greenSound: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
    redSound: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
    yellowSound: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
    blueSound: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
    blockPlayerInput: true,
    playerSequence: []
}

var i = 0;

$("#start button").click(function() {
    if (this.id === "startButton") {
        app.strict = false;
    } else {
        app.strict = true;
    }
    toggleVisibility("#start");
    setTimeout(function() {
        toggleVisibility("#display");
        if (app.strict === true) {
            toggleVisibility("#strictHeading");
        }
    }, 500);
    addStep();
    i = 0;
    playSequence();
});

$("#resetButton").click(function() {
    app.buttonSequence = [];
    addStep();
    displayStepCount();
    playSequence();
});

function toggleVisibility(elementID) {
    if ($(elementID).css("visibility") === "visible") {
        $(elementID).fadeTo(500, 0, function() {
            $(elementID).css("visibility", "hidden");
        });
    } else {
        $(elementID).css("visibility", "visible");
        $(elementID).fadeTo(500, 1);
    }
}

function displayStepCount() {
    $("#stepCount").text(app.buttonSequence.length + "/20");
}

function addStep() {
    switch(Math.floor(Math.random() * 4)) {
        case 0:
            app.buttonSequence.push("green");
            break;
        case 1:
            app.buttonSequence.push("red");
            break;
        case 2:
            app.buttonSequence.push("yellow");
            break;
        case 3:
            app.buttonSequence.push("blue");
            break;
    }
}

function playSequence() {
    app.blockPlayerInput = true;
    setTimeout(function() {
        if (i < app.buttonSequence.length) {
            pulseColour(app.buttonSequence[i]);
            eval("app." + app.buttonSequence[i] + "Sound.play();");
            i++;
            playSequence();
       } else {
           app.blockPlayerInput = false;
       }
    }, 750);
   
}

function pulseColour(colour) {
    $("#" + colour).toggleClass("hovered");
    setTimeout(function() {
        $("#" + colour).toggleClass("hovered");
    }, 700);
}

$(".colourButton").click(function() {
    if (app.blockPlayerInput === false) {
        if (this.id === app.buttonSequence[app.playerSequence.length]) {
            eval("app." + this.id + "Sound.play();");
            app.playerSequence.push(this.id);
            if (app.playerSequence.length === app.buttonSequence.length) {
                displayStepCount();
                app.playerSequence = [];
                addStep();
                if (app.buttonSequence.length > 20) {
                    reset();
                    toggleVisibility("#display");
                    setTimeout(function() {
                        toggleVisibility("#congratulations");
                    }, 500);
                }
                i = 0;
                playSequence();
            }
        } else {
            app.playerSequence = [];
            if (app.strict === true) {
                reset();
                addStep();
                playSequence();
            }
            app.blockPlayerInput = true;
            app.greenSound.play(); app.redSound.play();
            app.yellowSound.play(); app.blueSound.play(); // Good error sound :^)
            setTimeout(function() {
                i = 0;
                playSequence();
            }, 500);
        }
    }
});

function reset() {
    app.buttonSequence = [];
    app.playerSequence = [];
    displayStepCount();
}

$("#againButton").click(function() {
    toggleVisibility("#congratulations");
    setTimeout(function() {
        toggleVisibility("#start");
    }, 500);
    
});

$("#restartButton").click(function() {
    reset();
    toggleVisibility("#display");
    if (app.strict === true) {
        toggleVisibility("#strictHeading");
    }
    setTimeout(function() {
        toggleVisibility("#start");
    }, 500);
})
