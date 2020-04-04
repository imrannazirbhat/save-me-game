var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth * .95;

if(window.innerWidth < window.innerHeight) {
  canvas.height = window.innerHeight * .92;
} else {
  canvas.height = window.innerHeight * .80;
}

var context = canvas.getContext("2d");
var saveMe = null;
var hasGameStarted = false;
var isGameOver = false;
var radius_ = 10;
var points = 0;
var saveMeDx = 4;
var saveMeDy = 4;
var obstacleCircles = []; //to store obstacle circles
//add obstacle circle after every 5 seconds
var addObstacleTimer = null;//setInterval(addObstacleCircle, 5000);
var maxObstaclePeak = 5;
var maxObstaclePeakTouched = false;
var isWin = false;
var score = 0;
//var scoreTimer = null;//setInterval(updateScore, 250);

window.addEventListener("orientationchange", function() {
  location.reload(true);
}, false);

function Circle(x, y, dx, dy, radius, who) {

  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.who = who;

  this.draw = function() {

    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.strokeStyle = (this.who == 'saveMe' ? 'green' : 'red');
    context.stroke();
    context.fillStyle = (this.who == 'saveMe' ? 'green' : 'red');
    context.fill();
  }

  this.update = function() {

    // if 'saveMe' hits left or right border, it should gameover;
    // while as other circles should rebound
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {

      if (this.who == 'saveMe') {
        gameOver();
      } else {
        this.dx = -this.dx;
      }
    }

    // if 'saveMe' hits top or bottom border, it should gameover;
    // while as other circles should rebound
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {

      if (this.who == 'saveMe') {
        gameOver();
      } else {
        this.dy = -this.dy;
      }
    }

    this.x += this.dx;
    this.y += this.dy;
    this.draw();
    this.collusion();
  }

  this.collusion = function() {

    //detect collusion of 'saveMe' circle with all other obstacle circles
    if (this.who != 'saveMe') {
      //get distance between 'saveMe' circle and this
      var distance = getDistance(saveMe, this);

      //if disctance is less than the sum of two radii, then it is a collusion
      if (distance < (saveMe.radius + this.radius)) {
        gameOver();
      }
    }
  }

}

function animate() {

  if (!isGameOver) {
    requestAnimationFrame(animate);
  }
  context.clearRect(0, 0, canvas.width, canvas.height);
  saveMe.update();

  for (looper = 0; looper < obstacleCircles.length; looper++) {
    obstacleCircles[looper].update();
  }

}

function addObstacleCircle() {

  ++score;
  document.getElementById('score').innerHTML = "Survival: " + Math.floor((score / (maxObstaclePeak*2)) * 100) + "% | <a href='#' onclick='startGame()'>Start Again</a>";
  
  if(maxObstaclePeak === obstacleCircles.length && !maxObstaclePeakTouched) {
    maxObstaclePeakTouched = true;
  }

  if(!maxObstaclePeakTouched) {
    // Get random x between radius_ and canvas width
    var x = Math.floor(Math.random() * (canvas.width - radius_)) + radius_;
    var obstacle = new Circle(x, radius_, 2, 2, radius_, 'obstacle');
    obstacleCircles.push(obstacle);
  } else {
    obstacleCircles.pop();
    didWon();
  }
}

function didWon() {

  if(obstacleCircles.length === 0 && maxObstaclePeakTouched) {
    isWin = true;
    gameOver();
  }

}

function gameOver() {

  isGameOver = true;
  //clearInterval(scoreTimer);
  if(addObstacleTimer) {
    clearInterval(addObstacleTimer);
  }

  if(isWin) {
    document.getElementById('score').innerHTML = "Congratulations!! You Survived.";
  } else {
    document.getElementById('score').innerHTML = ((obstacleCircles.length > 0) ? ("You survived " + Math.floor((score / (maxObstaclePeak*2)) * 100) + "%.") : "You could not even survive alone.") + " <a href='#' onclick='startGame()'>Start Again</a>";
  }
}

//funciton to get distance bewtween two obstacleCircles
//FORMULA: d = sqrt( sq(x2 - x1) + sq(y2 - y1))
function getDistance(circle1, circle2) {


  circle1Center = [circle1.x + circle1.radius, circle1.y + circle1.radius];
  circle2Center = [circle2.x + circle2.radius, circle2.y + circle2.radius];

  var distance = Math.sqrt(Math.pow(circle2Center[0] - circle1Center[0], 2) +
    Math.pow(circle2Center[1] - circle1Center[1], 2));

  return distance;
}

// arrow key detection for navigation
document.onkeydown = function(e) {
  switch (e.keyCode) {

    case 37: //left

      saveMe.dy = 0;
      saveMe.dx = -saveMeDx;
      break;

    case 38: //up

      saveMe.dx = 0;
      saveMe.dy = -saveMeDy;
      break;

    case 39: //right

      saveMe.dy = 0;
      saveMe.dx = saveMeDx;
      break;

    case 40: //down

      saveMe.dx = 0;
      saveMe.dy = saveMeDy;
      break;
  }
};

// Funciton to control navigation using arrow panel
function navigate(code) {
  document.dispatchEvent(new KeyboardEvent('keydown',{'keyCode':code}));
}

function startGame() {

  isGameOver = false;
  score = 0;
  obstacleCircles = [];
  saveMe = new Circle(radius_, radius_, saveMeDx, saveMeDy, radius_, 'saveMe');
  //alert(canvas.width);
  if(addObstacleTimer) {
    clearInterval(addObstacleTimer);
  }
  addObstacleTimer = setInterval(addObstacleCircle, 5000);
  document.getElementById('score').innerHTML = "Survival: 0%";
  /*
  if(scoreTimer) {
    clearInterval(scoreTimer);
  }
  scoreTimer = setInterval(updateScore, 250);
  */
  animate();
  //hasGameStarted = true;
}

var swiper = new Swipe(document.getElementById('canvas'));
swiper.onLeft(function() { document.dispatchEvent(new KeyboardEvent('keydown',{'keyCode':37})); });
swiper.onUp(function() { document.dispatchEvent(new KeyboardEvent('keydown',{'keyCode':38})); });
swiper.onRight(function() { document.dispatchEvent(new KeyboardEvent('keydown',{'keyCode':39})); });
swiper.onDown(function() { document.dispatchEvent(new KeyboardEvent('keydown',{'keyCode':40})); });
swiper.run();

startGame();