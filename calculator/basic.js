let operator_value;
let pre_value = [];
let x = ""; // Initialize x for storing the current expression.
let display_x = "";
let bool_1 = false;
let solution;
let historyItem;
let openParenthesesCount =0;
let point_counter = false;


function output() {
    if (bool_1) {
        try {
            let expression = x
                .replace(/\(?(\d+(\.\d+)?)\)?%\(?(\d+(\.\d+)?)\)?/g, "($1*$3)/100")
                .replace(/(\d+(\.\d+)?)%/g, "($1/100)")
                .replace(/\)(?=\d)/g, ")*"); 
            console.log(expression)// Fix: Insert '*' after closing parenthesis when followed by a number

            solution = eval(expression); // Evaluate modified expression
            document.getElementById("result").value = solution;
            bool_1 = false;
            point_counter=false;
            // Store history as "1+2 = 3"
            historyItem = `${display_x} = ${solution}`;
            pre_value.push(historyItem);
            x = solution.toString(); // Set x to the result for further calculations
            display_x = solution.toString(); // Update display_x as well
        } catch (e) {
            document.getElementById("result").value = "Error";
            x = "";
            display_x = "";
        }
    } else {
        if (x.length === 0) {
            document.getElementById("result").value = 0;
        } else {
            if( x.match(/\((\d+)[+\-*\/]?(\d+)?/)){
                x = x.replace(/\)(?=\d)/g, ")*");
            }
            try {
                solution = eval(x); // Evaluate the expression
                document.getElementById("result").value = solution;
                point_counter=false;
                // Store history as "1+2 = 3"
                historyItem = `${display_x} = ${solution}`;
                pre_value.push(historyItem);
                x = solution.toString(); // Set x to the result for further calculations
                display_x = solution.toString(); // Update display_x as well
            } catch (e) {
                document.getElementById("result").value = "Error";
                x = "";
                display_x = "";
            }
        }
    }
}


function history_1() {
    let preElement = document.getElementById("pre");

    // Clear any existing content in the "pre" element
    preElement.innerHTML = '';
    // Loop through the array and append each item as a paragraph
    for (let i = pre_value.length - 1; i >= 0; i--) {
        let p = document.createElement("p");
        p.innerText = pre_value[i];
        preElement.appendChild(p);
    }
}


//clear all at time 
function clear() {
    if (x.length === 0) {
        document.getElementById("result").value = 0;
    }
    else {
    document.getElementById("result").value ="";
    x = "";
    display_x = "";
    }
}

//clear sigle digit at a time
function back_1() {
    if (x.length === 0) {
        document.getElementById("result").value = 0;
    }
    else{
    x = x.substring(0,x.length - 1);
    display_x = display_x.substring(0,display_x.length - 1);
    document.getElementById("result").value = display_x;
    }

}

function delete_1() {
    pre_value=[];
    document.getElementById("pre").innerHTML = "";
}

//Queryloop for selection of number
// Query loop for number & operator selection
document.querySelectorAll(".box").forEach((box) => {
    box.addEventListener("click", function (event) {
        let key = event.target.innerHTML;

        // Handle number inputs
        if (event.target.classList.contains("number")) {
            x += key;
            display_x += key;
            document.getElementById("result").value = display_x;
        }

        // Handle operator inputs
        if (event.target.classList.contains("operators")) {
            operator_value = key;

            if(operator_value==="%"){
                bool_1=true;
            }            

            // Handle opening bracket `(`
            if (operator_value === "(") {
                if(openParenthesesCount >=0){
                    if (x.length > 0 && x[x.length - 1].match(/[0-9)]/)) {
                        x += "*(";  // Implicit multiplication added in the background
                        display_x += "("; // Only show `(` on screen
                    } else {
                        x += "(";
                        display_x += "(";
                    }
                    openParenthesesCount++;
                    document.getElementById("result").value = display_x;
                }
                return;
            }

            if (operator_value === ")") {
                if (openParenthesesCount > 0 && x[x.length - 1].match(/[0-9)]/)) {
                    x += ")";
                    display_x += ")";
                    openParenthesesCount--; // Decrement the open parentheses counter
                    document.getElementById("result").value = display_x;
                }
                return;
            }

            // Prevent consecutive operators (`++`, `--`, `**`, etc.)
            if (x.length > 0 && x[x.length - 1].match(/[+\-*/%]/)) {
                x = x.slice(0, -1);
                display_x = display_x.slice(0, -1);
            }

                x += operator_value;
                display_x+=operator_value;
                document.getElementById("result").value = display_x; 

        }

        if (event.target.classList.contains("pointer")) {

            if(x.length === 0 || x[x.length-1].match(/[+/-/*%]/)){
                let digit = "0"+key;
                x+=digit;
                display_x+=digit;
                document.getElementById("result").value = display_x;

            }
            else {
            x+=key;
            display_x+=key;
            document.getElementById("result").value = display_x;
            }
        }
    });
});


//! x.match(/(\d+)?(\.)(\d+)?/) )

//call for output
document.getElementById("equal").addEventListener("click" , output);

//call for all clear
document.getElementById("all-clear").addEventListener("click" , clear);

//call for single clear at a time 
document.getElementById("clear").addEventListener("click" , back_1);

//history
document.getElementById("history").addEventListener("click" , history_1);
document.getElementById("delete").addEventListener("click" , delete_1);

function openNav() {
    document.getElementById("mySidenav").style.width = "200px";
  }
  
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }