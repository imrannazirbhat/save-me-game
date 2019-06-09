var canvas = document.querySelector('canvas');

canvas.width = 600; //window.innerWidth;
canvas.height = 450; //window.innerHeight;

var context = canvas.getContext("2d");
var saveMe = null;
var isGameOver = false;

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

var points = 0;
var saveMeDx = 2;
var saveMeDy = 2;
saveMe = new Circle(200, 200, 2, 2, 20, 'saveMe');
var obstacleCircles = []; //to store obstacle circles

//add obstacle circle after every 5 seconds
var addObstacleTimer = setInterval(addObstacleCircle, 5000);
var scoreTimer = setInterval(updateScore, 250);

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

  //limit obstacle circles
  if (obstacleCircles.length == 10) {
    obstacleCircles = [];
  }

  var obstacle = new Circle(20, 20, 2, 2, 20, 'obstacle');
  obstacleCircles.push(obstacle);
}

function gameOver() {

  isGameOver = true;
  clearInterval(scoreTimer);
  //alert("Game Over! You scored " + --points + " points.");
  document.getElementById('score').innerHTML = "Game Over! You scored " + --points + " points. <a href='index.html'>Start Again</a>";
  //points = 0;
  //saveMe.x = 200;
  //saveMe.y = 200;
  //obstacleCircles = [];
}

function updateScore() {

  document.getElementById('score').innerHTML = "Score: " + points;
  points++;
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

animate();
