/* jshint -W117 */

window.onkeypress = validateKeyPress;

// Remove last step (number or space-operator-space) on backspace or delete.
window.onkeydown = function() {
    console.log("keyCode: " + event.keyCode);
    if (event.keyCode === 8 || event.keyCode === 46) { // Backspace or delete keys.
        var str = document.getElementById("output").textContent;
        if (str[str.length - 1] === " ") {
            str = str.slice(0, -3);
        } else {
            str = str.slice(0, -1);
        }
        document.getElementById("output").textContent = str;
    }
};

// Allows only valid numbers and symbols.
function validateKeyPress() {
    var keyPress = event.charCode;
    if (keyPress >= 48 && keyPress <= 57) { // 0-9
        keyInput(String.fromCharCode(keyPress));
    } else {
        switch (keyPress) {
            case 42: // *
            case 43: // +
            case 45: // -
            case 46: // .
            case 47: // /
                keyInput(String.fromCharCode(keyPress));
                break;
            case 13: // Numpad Enter
            case 61: // =
                keyInput('=');
                break;
            default:
                break;
        }
    }
}

function keyInput(key) {
    var digitRegex = /\d|\./; // 0-9 digits.
    var operatorRegex = /\/|\*|-|\+/; // Basic math operator symbols.
    var invalidEquationRegex = /\D \D/; // Two consecutive math operators separated by a space (invalid equation).
    var output = document.getElementById("output");
    output.classList.remove("errorFlash");
    
    
    // Validates the equation, evaluates, handles errors, and displays output.
    function calculate() {
        var result;
        
        if (invalidEquationRegex.test(output.textContent)) {
            error();
        } else {
            try {
                result = eval(output.textContent);
            } catch (err) {
                error();
                return;
            }
            
            equation.textContent = output.textContent;
            output.textContent = result;
        }
    }
    
    function error() {
        output.classList.add("errorFlash");

        setTimeout(function() {
            output.classList.remove("errorFlash");
        }, 1000);
    }
    
    
    if (digitRegex.test(key)) {
        output.textContent += key;
    } else if (operatorRegex.test(key)) {
        output.textContent += " " + key + " ";
    } else if (key === '=') {
        if (operatorRegex.test(output.textContent)) {
            calculate();
        } else {
            error();
        }
        
    } else if (key === 'c') {
        output.textContent = "";
        equation.textContent = "";
    }
}

