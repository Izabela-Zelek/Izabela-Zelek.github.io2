// Each time this function is called a GameObject
// is create based on the arguments
// In JavaScript you can consider everything an Object
// including functions

      // Reading File from a Server
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          var data = JSON.parse(xmlhttp.responseText);
          //document.getElementById("player").innerHTML = data[0];
          console.log(data.PlayerData);
        }
      };
      xmlhttp.open("GET", "./data/derulo.json", true);
      xmlhttp.send();

function GameObject(name, img, health,x,y) {
    this.name = name;
    this.img = img;
    this.health = health;
    this.x = x;
    this.y = y;
}

function drawTimer(timeLeft) {
    var width = 100;
    var height = 20;
    var max = 100;
    var value = timeLeft;

    //drawing the timer bar background
    context.fillStyle = "#000000";
    context.fillRect(0,0,width,height);

    //draw the time bar value
    context.fillStyle = "#800080";
    var fillValue = Math.min(Math.max(value/max,0),1);
    context.fillRect(0,0,fillValue*width,height);
}

// The GamerInput is an Object that holds the Current
// GamerInput (Left, Right, Up, Down)
function GamerInput(input) {
    this.action = input;
}

// Default GamerInput is set to None
var gamerInput = new GamerInput("None"); //No Input

// Default Player
var sprite = new Image();
sprite.src = "./img/cat.png";

//determines whether or not game can continue
var gameInProgress = true;

// enemy sprite
var spriteE = new Image();
spriteE.src = "./img/mouse.png";

// enemy sprite
var spriteT = new Image();
spriteT.src = "./img/mousetrap.png";

var spriteF = new Image();
spriteF.src = "./img/floor.jpg";

var bgSprite = new Image();
bgSprite.src = "./img/bg.png";
//used when calculating the time left
var counter = 0;

var queryString = window.location.search;
var params = new URLSearchParams(queryString);
var uname = params.get("username");

var player = new GameObject("Player", sprite, 100,0,0);
var enemy = new GameObject("Mouse", spriteE , 100,(Math.random() * 450) + 50,(Math.random() * 450) + 50);
var trap = new GameObject("Trap", spriteT , 100,(Math.random() * 450) + 50,(Math.random() * 450) + 50);
var floor = new GameObject("Floor", spriteF , 100,0,0);
var endScreen = new GameObject("End",bgSprite,100,0,0);
var buttonSound = document.getElementById("buttonSound");

// Gameobjects is a collection of the Actors within the game
var gameobjects = [player,enemy,trap];

// get a handle to the canvas context
var canvas = document.getElementById("game");

// get 2D context for this canvas
var context = canvas.getContext("2d");

//get font for on screen text
context.font = "30px Arial";

//the direction that the player is moving
var direction = 0;

// Setup image
// Total Frames
var frames = 6;

// Current Frame
var currentFrame = 0;

// Initial time set
var initial = new Date().getTime();
var current; // current time

//checks if player wants audio or not
var toggleAudio = false;
  

// Process keyboard input event
function input(event) {
    // Take Input from the Player
    if (event.type === "keydown") {
        switch (event.keyCode) {
            case 37:
                gamerInput = new GamerInput("Left");
                direction = 1;
                break; //Left key
            case 38:
                gamerInput = new GamerInput("Up");
                direction = 2;
                break; //Up key
            case 39:
                gamerInput = new GamerInput("Right");
                direction = 3;
                break; //Right key
            case 40:
                gamerInput = new GamerInput("Down");
                direction = 4;
                break; //Down key
            default:
                gamerInput = new GamerInput("None"); //No Input
                direction = 0;
        }
    } else {
        gamerInput = new GamerInput("None"); //No Input
        direction = 0;
    }
    console.log("Gamer Input :" + gamerInput.action);
}

function update() {
    switch (direction)
    {
        case 0:
            enemy.x = enemy.x;
            enemy.y = enemy.y;
        break;
        case 1:
            enemy.x -=2;
            player.x -= 5;
        break;
        case 2:
            enemy.y -=2;
            player.y -= 5;
        break;
        case 3:
            enemy.x +=2;
            player.x += 5;
        break;
        case 4:
            enemy.y += 2;
            player.y += 5;
        break;
    }
    enemyBoundary();
    boundaryCheck();
    checkIntersect();

    if(counter === 1000)
    {
        console.log("Time is up");
        gameInProgress = false;
    }
    else
    {
        counter++
    }
}

// Draw GameObjects to Console
// Modify to Draw to Screen
function draw() {
    // Clear Canvas
    // Iterate through all GameObjects
    // Draw each GameObject
    // console.log("Draw");
    for (i = 0; i < gameobjects.length; i++) {
        if (gameobjects[i].health > 0) {
             console.log("Image :" + gameobjects[i].img);
        }
    }
    animate();
}



function animate() {
    current = new Date().getTime(); // update current
    if (current - initial >= 500) { // check is greater that 500 ms
        currentFrame = (currentFrame + 1) % frames; // update frame
        initial = current; // reset initial
    } 

    // Draw sprite frame
   context.clearRect(0, 0, canvas.width, canvas.height);
   context.drawImage(floor.img, floor.x, floor.y, 890, 800);
   context.drawImage(trap.img, trap.x, trap.y, 80, 54.25);
   context.drawImage(enemy.img, enemy.x, enemy.y, 80, 76.125);
   context.drawImage(player.img, (player.img.width / 6) * currentFrame, 0, 256, 256, player.x, player.y, 256, 256);


   //timer
   drawTimer(counter/10);
}

//boundary checking
function boundaryCheck() {
    if(player.x < 0)
    {
        player.x = 0;
    }

    else if(player.x > (canvas.width - (player.img.width / 6)))
    {
         player.x = (canvas.width - (player.img.width / 6));
    }

    if(player.y < 0 - 50)
    {
        player.y = 0 - 50;
    }


    else if(player.y > (canvas.height - 200))
    {
        player.y = (canvas.height - 200);
    }

}

//keeps the mouse sprite within screen
function enemyBoundary(){
    if(enemy.x < 0)
    {
        enemy.x = 0;
    }
    
    else if(enemy.x > (canvas.width - 80))
    {
        enemy.x = (canvas.width - 80);
    }
    
    if(enemy.y < 0 )
    {
        enemy.y = 0;
    }
    
    
    else if(enemy.y > (canvas.height - 70))
    {
        enemy.y = (canvas.height - 70);
    }
    
}

//randomises position of mouse and trap when they interlap
function checkIntersect(){

    if(enemy.x >= trap.x && enemy.x <= (trap.x + 40) && enemy.y >= (trap.y - 30)&& enemy.y <= (trap.y + 40) )
    {
        updateScore();
        counter = 0;
        enemy.x = (Math.random() * 450) + 100;
        enemy.y = (Math.random() * 500) + 50;
        trap.x = (Math.random() * 450) + 50;
        trap.y = (Math.random() * 450) + 50;
    }
}
function gameloop() {
    if(gameInProgress) {
        update();
        draw();
        window.requestAnimationFrame(gameloop);
    }
    else{
        gameOver();
    }
}

// Handle Active Browser Tag Animation
window.requestAnimationFrame(gameloop);
displayText();

// Handle Keypressed
window.addEventListener('keyup', input);
window.addEventListener('keydown', input);

document.getElementById("buttonUp").onmouseup = function() {noInput()};
document.getElementById("buttonLeft").onmouseup = function() {noInput()};
document.getElementById("buttonRight").onmouseup = function() {noInput()};
document.getElementById("buttonDown").onmouseup = function() {noInput()};

function buttonOnClickW(){
    gamerInput = new GamerInput("Up");
    direction = 2;
    if(toggleAudio)
    {
        buttonSound.play();
    }
}

function buttonOnClickA(){
    gamerInput = new GamerInput("Left");
    direction = 1;
    if(toggleAudio)
    {
        buttonSound.play();
    }
}

function buttonOnClickD(){
    gamerInput = new GamerInput("Right");
    direction = 3;
    if(toggleAudio)
    {
     buttonSound.play();
    }
}

function buttonOnClickS(){
    gamerInput = new GamerInput("Down");
    direction = 4;
    if(toggleAudio)
    {
      buttonSound.play();
    }
}

function noInput(){
    gamerInput = new GamerInput("None");
    direction = 0;
}
//toggles the audio so player can turn off annoying sounds
function audioSwitch(){

    if(toggleAudio)
    {
        toggleAudio = false;
    }
    else{
        toggleAudio = true;
    }
}

//determines what happens when timer runs out
function gameOver(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(endScreen.img, endScreen.x, endScreen.y, 600, 600);
    localStorage.setItem('score', 1);
}

function displayText(){

    document.getElementById("WelcomeText").innerHTML = "Welcome " + uname;
}

// Update the player score
function updateScore() {
  var current_score = localStorage.getItem('score');

  if (isNaN(current_score)) {
    localStorage.setItem('score', 0);
    document.getElementById("SCORE").innerHTML = " Score:  [ " + current_score + " ] ";
  } else{
    localStorage.setItem('score', parseInt(current_score) + 1);
    document.getElementById("SCORE").innerHTML = " Score:  [" + current_score + " ] ";
  }

}