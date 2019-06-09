var canvas = document.querySelector('canvas');
canvas.width = 600;//window.innerWidth;
canvas.height = 450;//window.innerHeight;

var context = canvas.getContext("2d");



function Circle(x, y, dx, dy, radius, who) {

  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius= radius;
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

    if(this.who != 'saveMe') {

      if(this.x + this.radius > canvas.width || this.x - this.radius < 0) {
        this.dx = -this.dx;
      }

      if(this.y + this.radius > canvas.height || this.y - this.radius < 0) {
        this.dy = -this.dy;
      }

    }

    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  }
}

var saveMeDx = 2;
var saveMeDy = 2;
var saveMe = new Circle(200,200,2,2,20,'saveMe');
var obstacleCircles = [];

setInterval(addObstacleCircle, 5000);

function animate() {

  requestAnimationFrame(animate);
  context.clearRect(0, 0, canvas.width, canvas.height);
  saveMe.update();

  for(looper = 0;looper < obstacleCircles.length; looper++) {
    obstacleCircles[looper].update();
  }

}

function addObstacleCircle() {

  var obstacle = new Circle(20,20,2,2,20,'obstacle');
  obstacleCircles.push(obstacle);
}

// arrow key detection
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
