// author: Luc van Soest

// global variables for settings used for tweaking the visualisation
let topNumber = 10; // show top 10 of popular games from larger dataset
let circleMargin = 50; // spacing between arc's visualising the data
let circleWeight = 10; // strokeWeight of arc's visualising the data

// global variables for storing values for use in multiple functions
let steamStats; // variable for storing the dataset
let maxCurrentPlayers = 0; // variable for storing the maximum for the currentPlayers variable from the dataset
let beginColor; // variable for storing begin color for visualisation
let endColor; // variable for storing end color based on beginColor
let fontDINOTBold; // variable for storing custom font
let title; // variable for storing the title for multiple use

function preload() {

    // preload json dataset in global variable
    steamStats = loadJSON('js/steam-stats.json');

    // preload custom font
    fontDINOTBold = loadFont('assets/DINOT-Bold.otf');
}

function setup() {

    //create canvas based on size of browser window
    createCanvas(windowWidth, windowHeight);

    // set global text properties
    textAlign(CENTER, CENTER);
    textSize(24);
    textFont(fontDINOTBold);

    // determine colors for use in the visualisation
    beginColor = color(random(123, 200), random(123, 200), random(123, 200));
    // darker end color based on random generated begin color
    endColor = color(red(beginColor) / 2, green(beginColor) / 2, blue(beginColor) / 2);

    // compile title bases on setting
    title = "STEAM - Top " + topNumber + " games by current player count";

    // set html document title (standard Javascript) nice-to-have
    document.title = title;
 
    // determine max current players
    // loop trough array to find the largest value for currentPlayers
    if (steamStats && steamStats.data && steamStats.data.length > 0) {

        // check if number of items in dataset is not smaller then the topNumber-setting
        if (steamStats.data.length < topNumber) {
            topNumber = steamStats.data.length;
        }

        for(let i = 0; i < steamStats.data.length; i++) {
            //check if the current value is greater then the previously set max
            if (steamStats.data[i].currentPlayers > maxCurrentPlayers) 
            {
                // If so, set new maximum
                maxCurrentPlayers = steamStats.data[i].currentPlayers;
            }
        }
        // after determing the maximum value for currentPlayers, use this to calculate a nice round maximum value for your chart
        maxCurrentPlayers = getMaxUpRound(maxCurrentPlayers);
    }
}
  
function draw() {

    // set dark background color
    background(15);

    // draw title on visualisation
    noStroke();
    fill(240);
    text(title, 0, 0, width, 100);

    // determine the center of your canvas for drawing your visualisation
    let centerX = width / 2;
    let centerY = height / 2;

    // variable for storing the index of the active object in your dataset based on mouseover
    // variable is later used to generate a tool tip
    let activeDataIndex = -1;
 
    // check if dataset is defined and has a value
    if (steamStats) {

        // set stroke weight based on your global variable setting
        strokeWeight(circleWeight);
        noFill();

        // loop trough dataset. Notice the variable 'topNumber' instead of steamStats.data.length. 
        // We are only showing the top 10 items from the dataset
        for(let i = 0; i < topNumber; i++) {

            // determine the r,g,b-values of fillcolor based on the index and the previously defined begin and endcolor in the setup-function
            let rectColorR = floor(map(i, 0, topNumber, red(beginColor), red(endColor)));
            let rectColorG = floor(map(i, 0, topNumber, green(beginColor), green(endColor)));
            let rectColorB = floor(map(i, 0, topNumber, blue(beginColor), blue(endColor)));

            // calculate the arc's diameter based on the index from the for loop
            let diameter = map(topNumber - i, 0, topNumber, 0, topNumber * circleMargin);

            // calculate the arc's end position based on the currentPlayers-value from the current object (steamStats.data[i])
            let endPosition = map(steamStats.data[i].currentPlayers, 0, maxCurrentPlayers, -PI, PI);

            // draw dark background full circle, no function, just nice visuals
            stroke(20);
            arc(centerX, centerY, diameter, diameter, -PI, PI);

            // use distance function to determine mouse position is in current circle
            // https://www.youtube.com/watch?v=TaN5At5RWH8&ab_channel=TheCodingTrain
            let d = dist(mouseX, mouseY, centerX, centerY);
            if (d > diameter / 2 - circleWeight / 2 && d < diameter / 2 + circleWeight / 2) {
                // if mouse is hovering over current arc, hightlight this arc and set the activeDataIndex for generating a tooltip later 
                stroke(240);
                activeDataIndex = i;
            }
            else{
                // user standard color
                stroke(rectColorR, rectColorG, rectColorB);
            }

            //draw actual stats arc based on previously calculated values
            arc(centerX, centerY, diameter, diameter, -PI, endPosition);
        }

        //draw optional tooltip for active data
        if (activeDataIndex >= 0) {

            // get active object from dataset and compile tool tip text
            let activeGameInfo = steamStats.data[activeDataIndex].game.toUpperCase() + ' (' + activeGame.currentPlayers + ')';

            // show nice tool tip with rounder corners. Size of tool tip is calculated by using the textBounds function
            push();

            // https://p5js.org/reference/#/p5.Font/textBounds
            let textBoundsBox = fontDINOTBold.textBounds(activeGameInfo, mouseX, mouseY - 50, 12, CENTER, CENTER);
            fill(240);
            noStroke();

            rect(textBoundsBox.x, textBoundsBox.y, textBoundsBox.w + 20, textBoundsBox.h + 20, 7);
            fill(0);
          
            textSize(12);
            textAlign(CENTER, CENTER);
            text(activeGameInfo, textBoundsBox.x, textBoundsBox.y, textBoundsBox.w + 20, textBoundsBox.h + 16);
            
            pop();
        }
    }
}

function getMaxUpRound(maxNumber) {

    // some math magic ;-) to determine a nice round number based on the input 
    return Math.ceil(maxNumber / Math.pow(10, String(maxNumber).length - 1)) * Math.pow(10, String(maxNumber).length - 1);
}

function windowResized() {

    //resize canvas when browser windows is resized
    resizeCanvas(windowWidth, windowHeight);
}
  