var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var context = canvas.getContext("2d");


var x = 200;
var dx = 2;
var y = 200;
var dy = 2;

var radius = 30;
function animate() {

  requestAnimationFrame(animate);

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2, false);
  context.strokeStyle = 'blue';
  context.stroke();

  if(x + radius > canvas.width || x - radius < 0) {
    dx = -dx;
  }

  if(y + radius > canvas.height || y - radius < 0) {
    dy = -dy;
  }

  x += dx;
  y += dy;
}

animate();
