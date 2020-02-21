// CAPITAL VARIABLES ARE CONSTANT VARIABLES
var DELAY = 20;
var WIDTH = 400;
var HEIGHT = 600;
// min and max velocity of enemies
var ENEMY_V_MIN = -2;
var ENEMY_V_MAX = 2;
var VOLUME = 0.3;
var canvas;
var ctx;
var difficulty;
var point = 0; // to determine where to generate the enemies
var arraySize;// max array size
var enemies;

// functions and variables about the main character
var Reimu = function()
{
	this.CHANGE = 4;
	// setting up the image
	this.img = new Image();
	this.img.src = "images/reimu_yukkuri_ps.png";
	this.IMG_WIDTH = 50;
	this.IMG_HEIGHT = 50;
	
	// vars about the circle
	this.RADIUS = 2;
	
	// vars about position
	this.DEFAULT_X = 200;
	this.DEFAULT_Y = 500;
	this.xPos = this.DEFAULT_X;
	this.yPos = this.DEFAULT_Y;
	
	// vars about moving
	this.up = false;
	this.down = false;
	this.left = false;
	this.right = false;
	this.slow = false;
	
	// functions
	// move the character, if the user is pressing something
	this.move = function()
	{
		var change;
		if(this.slow)
			change = this.CHANGE / 2;
		else
			change = this.CHANGE;
		/*
		if(this.up && this.right || this.right && this.down || this.down && this.left || this.left && this.up)
			change /= 1.6 ;*/
		if(this.up && !(this.yPos - this.RADIUS - change < 0))
			this.yPos -= change;
		if(this.down && !(this.yPos + this.RADIUS + change > canvas.height))
			this.yPos += change;
		if(this.left && !(this.xPos - this.RADIUS - change < 0))
			this.xPos -= change;
		if(this.right && !(this.xPos + this.RADIUS + change > canvas.width))
			this.xPos += change;
	}
	
	// draw the character using this.xPos and this.yPos
	this.draw = function()
	{
		ctx.save();
		ctx.drawImage(this.img, this.xPos - this.IMG_WIDTH / 2, this.yPos - this.IMG_HEIGHT / 2);
		ctx.fillStyle = "white";
		ctx.strokeStyle = "red";
		ctx.beginPath();
		ctx.arc(this.xPos, this.yPos, this.RADIUS, 0, 7);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		ctx.restore();
	}
	
	this.crashWith = function(n){
		for(var i = 0; i < n; i++)
		{
			if(this.collision(i))
				return true;
		}
		return false;
	}
	
	this.collision = function(index){
		if(enemies[index] == undefined)
			return false;
		var myleft = this.xPos - this.RADIUS;
        var myright = this.xPos + this.RADIUS;	
		var mytop = this.yPos - this.RADIUS;	
		var mybuttom = this.yPos + this.RADIUS;
        var otherleft = enemies[index].xPos - (enemies[index].RADIUS);
	    var otherright = enemies[index].xPos + (enemies[index].RADIUS);
	    var othertop = enemies[index].yPos - (enemies[index].RADIUS);
		var otherbuttom = enemies[index].yPos + (enemies[index].RADIUS);
		var crash = true;
		if ((mybuttom < othertop) || 
			(mytop > otherbuttom) ||
			(myright < otherleft) || 
			(myleft > otherright))
			crash = false;
		return crash;
	}
}

// functions and variables about the enemies
// need to construct an enemy through another function, can't use new Enemy()
var Enemy = function()
{
	
	this.RADIUS = 5;
	
	//variables about position
	this.xPos;
	this.yPos;
	this.vx;
	this.vy;
	
	// move the enemy using this.vx and this.vy
	this.move = function()
	{
		this.xPos += this.vx;
		this.yPos += this.vy;
	}
	
	// draw the enemy using this.xPos and this.yPos
	this.draw = function()
	{
		ctx.save();
		ctx.fillStyle = "white";
		ctx.strokeStyle = "blue";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(this.xPos, this.yPos, this.RADIUS, 0, 7);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		ctx.restore();
	}
}

// functions about generating enemies
// generate an enemy
function generateEnemy(x, y, vx, vy)
{
	var enemy = new Enemy();
	enemy.xPos = x;
	enemy.yPos = y;
	enemy.vx = vx;
	enemy.vy = vy;
	return enemy;
}

// draw all the enemies in the array.
// n : the current size of the array.
Array.prototype.draw = function(n)
{
	for(var i = 0; i < n; i++)
		if(!(this[i] == undefined))
			this[i].draw();
}

// move all the enemies in the array
// n : the current size of the array
Array.prototype.move = function(n)
{
	for(var i = 0; i < n; i++)
		if(!(this[i] == undefined))
			this[i].move();
}

Array.prototype.getEmptyIndex = function(n)
{
	for(var i = 0; i < n; i++)
		if(this[i] == undefined)
			return i;
	return -1;
}

// generate a new enemy in the array, return the new size of the array.
// n : the current size of the array
Array.prototype.generateNewEnemy = function(n)
{
	var x;
	var y;
	var vx;
	var vy;
	var i;
	if(difficulty == 0) // easy
	{
		x = WIDTH / 2;
		y = 0;
		vx = random(ENEMY_V_MIN, ENEMY_V_MAX);
		vy = random(0, ENEMY_V_MAX);
	}
	else if(difficulty == 1) // normal
	{
		if(point == 0)
		{
			x = 0;
			y = 0;
			vx = random(0, ENEMY_V_MAX);
			vy = random(0, ENEMY_V_MAX);
		}
		else if(point == 1)
		{
			x = WIDTH;
			y = 0;
			vx = random(ENEMY_V_MIN, 0);
			vy = random(0, ENEMY_V_MAX);
		}
		point = (point + 1) % 2;
	}
	else if(difficulty == 2)
	{
		if(point == 0)
		{
			x = 0;
			y = 0;
			vx = random(0, ENEMY_V_MAX);
			vy = random(0, ENEMY_V_MAX);
		}
		else if(point == 1)
		{
			x = WIDTH / 2;
			y = 0;
			vx = random(ENEMY_V_MIN, ENEMY_V_MAX);
			vy = random(0, ENEMY_V_MAX);
		}
		else if(point == 2)
		{
			x = WIDTH;
			y = 0;
			vx = random(ENEMY_V_MIN, 0);
			vy = random(0, ENEMY_V_MAX);
		}
		point = (point + 1) % 3;
	}
	else if(difficulty == 3) // nightmare
	{
		if(point == 0)
		{
			x = 0;
			y = 0;
			vx = random(0, ENEMY_V_MAX);
			vy = random(0, ENEMY_V_MAX);
		}
		else if(point == 1)
		{
			x = WIDTH / 2;
			y = 0;
			vx = random(ENEMY_V_MIN, ENEMY_V_MAX);
			vy = random(0, ENEMY_V_MAX);
		}
		else if(point == 2)
		{
			x = WIDTH;
			y = 0;
			vx = random(ENEMY_V_MIN, 0);
			vy = random(0, ENEMY_V_MAX);
		}
		else if(point == 3)
		{
			x = 0;
			y = HEIGHT;
			vx = random(0, ENEMY_V_MAX);
			vy = random(ENEMY_V_MIN, 0);
		}
		else if(point == 4)
		{
			x = WIDTH;
			y = HEIGHT;
			vx = random(ENEMY_V_MIN, 0);
			vy = random(ENEMY_V_MIN, 0);
		}
		point = (point + 1) % 5;
	}
	i = this.getEmptyIndex(n);
	if(i == -1 && n + 1 <= arraySize)
	{
		i = n;
		n++;
	}
	this[i] = generateEnemy(x, y, vx, vy);
	return n;
}

// delete enemies that are outside of the screen
// n : the size of the array
Array.prototype.clean = function(n)
{
	for(var i = 0; i < n; i++)
	{
		if((!(this[i] == undefined)) && (this[i].xPos + this[i].RADIUS < 0 || this[i].xPos - this[i].RADIUS > WIDTH || 
			this[i].yPos - this[i].RADIUS > HEIGHT))
		{
			delete this[i];
		}
	}
}

// generate a random number from min to max.
function random(min, max)
{
	return Math.random() * (max - min ) + min;
}

// executed when the window is loaded
window.onload = function()
{
	// disable the button until everything is loaded
	document.getElementById("start").disabled = true;
	// since the music is too loud... set the volume to VOLUME
	document.getElementById("music").volume = VOLUME;
	
	// variables
	var n; // size of the array
	var reimu = new Reimu();
	var score;
	// handle keys
	handleKeys();
	var timer;
	
	// set up canvas
	canvas = document.getElementById("canvasArea");
	ctx = canvas.getContext("2d");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	
	
	// main program, for per frame
	var main = function()
	{
		// disable button
		document.getElementById("start").disabled = true;
		// clean the array
		enemies.clean(n);
		// generate new enemies
		n = enemies.generateNewEnemy(n);
		// move everything
		reimu.move();
		enemies.move(n);
		// clear everything
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
		// draw everything
		reimu.draw();
		enemies.draw(n);
		// judge if the player dies or not
		document.getElementById("time-survived").innerHTML = score;
		if(judge(n))
		{
			clearInterval(timer);
			alert("Game Over!\nYou Score: " + score);
			document.getElementById("start").disabled = false;
		}
		score += 1 + difficulty;
	}
	
	// enable button when the image is loaded
	reimu.img.addEventListener("load", function(){
		document.getElementById("start").disabled = false;
	});
	
	// action when the "Game Start" button is clicked
	// set up the interval
	document.getElementById("start").onclick = function()
	{
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
		enemies = [];
		n = 0; // size of the array
		reimu = new Reimu();
		score = 0;
		for(var i = 0; i < document.forms["form"]["difficulty"].length; i++)
		{
			if(document.forms["form"]["difficulty"][i].checked)
			{
				difficulty = i;
				i = document.forms["form"]["difficulty"].length;
			}
		}
		arraySize = difficulty * 400 + 200;
		timer = setInterval(function(){main()}, DELAY);
	}
	
	// handle the help button
	document.getElementById("help").onclick = function()
	{
		alert("Instructions: \n" + 
		"-Press the \"Up\", \"Down\", \"Left\", \"Right\" key on the keyboard to control Reimu.\n" +
		"-Hold \"Shift\" key to slow down the speed of Reimu.\n" +
		"-Dodge the danmaku(barrage) and stay alive for as long as you can!");
	}
	
	// handle the mute button
	document.getElementById("mute").onclick = function()
	{
		if(document.getElementById("mute").value == "Mute")
		{
			document.getElementById("music").volume = 0;
			document.getElementById("mute").value = "Unmute";
		}
		else
		{
			document.getElementById("music").volume = VOLUME;
			document.getElementById("mute").value = "Mute";
		}
	};
	
	// set up event listener to handle key events
	function handleKeys()
	{
		document.addEventListener("keydown", function(e)
		{
			if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40)
				e.preventDefault(); // prevent the screen from scrolling when up, down, left or right keys are pressed.
			if(e.keyCode == 38)
				reimu.up = true;
			if(e.keyCode == 37)
				reimu.left = true;
			if(e.keyCode == 39)
				reimu.right = true;
			if(e.keyCode == 40)
				reimu.down = true;
			if(e.keyCode == 16)
				reimu.slow = true;
		});
		
		document.addEventListener("keyup", function(e)
		{
			if(e.keyCode == 38)
				reimu.up = false;
			if(e.keyCode == 37)
				reimu.left = false;
			if(e.keyCode == 39)
				reimu.right = false;
			if(e.keyCode == 40)
				reimu.down = false;
			if(e.keyCode == 16)
				reimu.slow = false;
		});
	}
	
	// judge if the player dies or not, return true if the player dies, otherwise return false.
	// n : the size of the array
	function judge(n)
	{
		return reimu.crashWith(n);
	}
}	