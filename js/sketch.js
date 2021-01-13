let steamStats;
let maxCurrentPlayers = 0;

let topNumber = 10;
let circleMargin = 50;
let circleWeight = 10;


let beginColor;
let endColor;

let fontDINOTBold;


function preload() {

    steamStats = loadJSON('js/steam-stats.json');
    fontDINOTBold = loadFont('assets/DINOT-Bold.otf');
}

function setup() {

    createCanvas(windowWidth, windowHeight);

    textAlign(CENTER, CENTER);
    textSize(24);
    textFont(fontDINOTBold);

    // random color
    beginColor = color(random(123, 200), random(123, 200), random(123, 200));
    // darker end color based on random begincolor
    endColor = color(red(beginColor) / 2, green(beginColor) / 2, blue(beginColor) / 2);

    let centerX = width / 2;
    let centerY = height / 2;
 
    //determin max current players
    if (steamStats && steamStats.data && steamStats.data.length > 0) {

        
        for(let i = 0; i < steamStats.data.length; i++) {
            if (steamStats.data[i].currentPlayers > maxCurrentPlayers) 
            {
                maxCurrentPlayers = steamStats.data[i].currentPlayers;
            }
        }
        maxCurrentPlayers = getMaxUpRound(maxCurrentPlayers);
    }


    //noLoop();
}
  
function draw() {

    background(15);

    noStroke();
    fill(240);

    let title = "STEAM - Top " + topNumber + " games by current player count";

    //set html document title
    document.title = title;

    text(title, 0, 0, width, 100);

    let centerX = width / 2;
    let centerY = height / 2;

    let activeDataIndex = -1;
 
    if (steamStats && steamStats.data && steamStats.data.length > 0) {

        strokeWeight(circleWeight);
        noFill();

        for(let i = 0; i < topNumber; i++) {

            let rectColorR = floor(map(i, 0, topNumber, red(beginColor), red(endColor)));
            let rectColorG = floor(map(i, 0, topNumber, green(beginColor), green(endColor)));
            let rectColorB = floor(map(i, 0, topNumber, blue(beginColor), blue(endColor)));

            let diameter = map(topNumber - i, 0, topNumber, 0, topNumber * circleMargin);
            let length = steamStats.data[i].currentPlayers / maxCurrentPlayers / 10 * PI;

            console.log(steamStats.data[i].currentPlayers / maxCurrentPlayers / 10, length);


            // dark background full circle
            stroke(20);
            arc(centerX, centerY, diameter, diameter, -PI, PI);

            // use distance function to determine mouse position is in current circle
            // https://www.youtube.com/watch?v=TaN5At5RWH8&ab_channel=TheCodingTrain
            let showToolTip = false;
            let d = dist(mouseX, mouseY, centerX, centerY);
            if (d > diameter / 2 - circleWeight / 2 && d < diameter / 2 + circleWeight / 2) {
                stroke(240);
                activeDataIndex = i;
            }
            else{
                stroke(rectColorR, rectColorG, rectColorB);
            }

            //draw actual stats arc
            arc(centerX, centerY, diameter, diameter, -PI, length);
        }

        //draw optional tooltip for active data
        if (activeDataIndex >= 0) {

            let activeGame = steamStats.data[activeDataIndex];
            let activeGameInfo = activeGame.game.toUpperCase() + ' (' + activeGame.currentPlayers + ')';

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

    let maxNumberText = String(maxNumber);
    let firstNumber =  parseInt(maxNumberText.charAt(0));
    let numberOfZeros = maxNumberText.length;

    if (firstNumber != 1) {
        firstNumber += 1;
        numberOfZeros -= 2;
    }

    let maxUpRoundNumber = String(firstNumber);
    for(let i = 0; i < numberOfZeros; i++) maxUpRoundNumber += "0";

console.log(maxUpRoundNumber);

    return parseInt(maxUpRoundNumber);
}
  