//In the name of Allah
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var height = canvas.height = innerHeight;
var width = canvas.width = innerWidth;

var frameH = height / 8;
var frameW = width / 8 - frameH / 14; 

var newGame = true;
var pause = false;

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

function drawFrame(x, y, w, h) {
		ctx.beginPath();
		ctx.lineWidth = 5;
		ctx.strokeRect(x, y, w, h);
}

function Ball(x, y, velX, velY, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.size = size;
}

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = 'black';
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

Ball.prototype.update = function() {
  if((this.x + this.size) >= width - frameH / 4) {
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= frameH / 4) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
	pause = true;
	showDialog();
	setupGame();
	requestAnimationFrame(loop);
	//score = 0;
  }
  
  if((this.y - this.size) <= frameW / 6) {
    this.velY = -(this.velY);
  }

  this.x -= this.velX;
  this.y -= this.velY;
};
var score = 0;
Ball.prototype.collisionDetect = function() {
  var w = bat.width / 2;
  var h = bat.height / 2;
  
  var batDistanceX = Math.abs(this.x - bat.x - w);
  var batDistanceY = Math.abs(this.y - bat.y - h);
  
  if(batDistanceX <= w && batDistanceY <= h) {
	this.velY = -(this.velY);
  }
  
  for(var i = 0; i < 64; i++) {
	var w = bricks[i].width / 2;
	var h = bricks[i].height / 2;
  
	var brickDistanceX = Math.abs(this.x - bricks[i].x - w);
	var brickDistanceY = Math.abs(this.y - bricks[i].y - h);
  
	if(brickDistanceX <= w && brickDistanceY <= h && bricks[i].exists === true) {
		score += 1;
		bricks[i].exists = false;
		this.velY = -(this.velY);
		if(score == 64) {
			pause = true;
			showDialog();
			setupGame();
			requestAnimationFrame(loop);
			score = 0;
		}
		break;
	}
  }
};

function Brick(x, y, width, height, color, exists) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.color = color;
	this.exists = exists;
};

Brick.prototype.draw = function() {
	ctx.beginPath();
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x, this.y, this.width, this.height);
};
var _this = this;
Brick.prototype.setControls = function(e) {
	window.onkeydown = function(e) {
		if(e.keyCode) {
			if(!pause) {
				start();
			}
		}if(e.keyCode === 65 || e.keyCode === 37) {
			if(!pause) {
				bat.x -= 40;
			}
		}else if(e.keyCode === 68 || e.keyCode === 39) {
			if(!pause) {
				bat.x += 40;
			}
		}
		
	}; 
};

Brick.prototype.checkBounds = function() {
  if((this.x + this.width) >= width - frameH / 4) {
    this.x -= 20;
  }

  if(this.x <= frameH / 4) {
    this.x += 20;
  }
};

var bricks;
var bat;
var ball;

function setupGame() {
	bricks = [];
	newGame = true;
	
	bat = new Brick(3.155 * frameW, 8 * frameH - frameW / 12, 
	(frameW - frameW / 32) * 2, frameW / 12, 'black', true);
	bat.setControls();

	for(var i = 0; i < 8; i++) {
		for(var j = 0; j < 8; j++) {
			var brick = new Brick(frameH / 3 + frameW * i,
			frameW / 4 + frameW / 8 * j, frameW - frameW / 32,
			frameW / 12, 'rgb(' + random(0, 255)  + ',' 
			+ random(0, 255) + ',' + random(0, 255) + ')', true);
			bricks.push(brick);
		}
	}
	
	ball = new Ball(3.155 * frameW + (frameW - frameW / 32), 
	8 * frameH - frameW / 12 - 10, 6, 6, 10);
}

 

function loop() {
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, width, height);
	
	for(var i = 0; i < 8; i++) {
		drawFrame(0, frameH * i, frameH / 4, frameH );
		drawFrame(width - frameH / 4, frameH * i, frameH / 4, frameH);
		drawFrame(frameH / 3 + frameW * i, 0, frameW - frameW / 28, frameW / 6);
	}
	
	for(var i = 0; i < 64; i++) {
		if(bricks[i].exists) {
			bricks[i].draw();
		}
	}
			
	bat.draw();
	bat.checkBounds();
	
	ball.draw();
	ball.collisionDetect();
	ball.update();
	
	if(!newGame) {
		requestAnimationFrame(loop);
	}
}

function showDialog() {
	var html = document.querySelector('html');
	var panel = document.createElement('div');
	
	panel.setAttribute('class', 'diagBox');
	html.appendChild(panel);
	
	var msg = document.createElement('p');	
	msg.textContent = 'Your Score: ' + score * 5;
	score = 0;
	
	panel.style.backgroundColor = 'aqua';	
	panel.appendChild(msg);
	
	var okBtn = document.createElement('button');
	okBtn.textContent = 'OK';
	panel.appendChild(okBtn);
	
	okBtn.onclick = function() {
		panel.parentNode.removeChild(panel);
		pause = false;
	};
}
 
function start() {
	if(newGame) {
		requestAnimationFrame(loop);
		newGame = false;
	}
}
setupGame();
loop();