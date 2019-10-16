var jenua = document.getElementById('jenua');
var danik = document.getElementById('danik');
var edikk = document.getElementById('edikk');
var pasha = document.getElementById('pasha');

var endBoard = document.getElementById('endBoard');
var outScore = document.getElementById('outScore');

var playAgainButton = document.getElementById('playAgain');
playAgainButton.addEventListener('click',() => {
	location.reload();
})

jenua.addEventListener('click',() => {

	var jenua = new Object();
	jenua = {
		name: 'jenua',
		speed: 25,
		sizeX: 50,
		sizeY: 50,
		life: 1,
		img: 'img/jenua.png'
	};

	gameStart(jenua);
	
})

danik.addEventListener('click',() => {

	var danik = new Object();
	danik = {
		name: 'danik',
		speed: 30,
		sizeX: 50,
		sizeY: 75,
		life: 1,
		img: 'img/danik.jpg'
	};

	gameStart(danik);
})

edikk.addEventListener('click',() => {
	var edikk = new Object();
	edikk = {
		name: 'edikk',
		speed: 10,
		sizeX: 100,
		sizeY: 100,
		life: 1,
		img: 'img/edikk.jpg'
	};

	gameStart(edikk);
})

pasha.addEventListener('click',() => {
	var pasha = new Object();
	pasha = {
		name: 'pasha',
		speed: 25,
		sizeX: 50,
		sizeY: 50,
		life: 2,
		img: 'img/pasha.jpg'
	};

	gameStart(pasha);
})

function gameStart(obj){

	var characterStats = obj;

	// Прячем меню выбора, динамически отображаем canvas

	var canvas = document.createElement('canvas');
	var all = document.getElementById('all');
	all.classList.toggle('hidden');

	canvas.id = "canvas";
	canvas.className = "canvas";	
	canvas.width = 1300;
	canvas.height = 550;
	var body = document.getElementsByTagName("body")[0];
	body.appendChild(canvas);


	var ctx = canvas.getContext("2d");

	var char = new Image();
	var	enemy = new Image();
	var bg = new Image();


	var music = new Audio();
	var deathSound = new Audio();

	music.src = "audio/shootingStars.mp3";
	deathSound.src = "audio/damage.mp3"
	music.play();

	var enemyObj = new Object();

	enemyObj = {
		podalov: 'img/podalov.png',
		sokolov: 'img/sokolov.jpg',
		grishenko: 'img/grishenko.png'
	}

	char.src = characterStats.img;
	enemy.src = getRandomEnemyImg(enemyObj);
	bg.src = "img/bg.png";

	// Радномные значения в диапазоне [min, max]

	function getRandomInt(min, max){
		  return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function getRandomEnemyImg(enemyObj){
		if (getRandomInt(1,3) == 1) {
			return enemyObj.podalov;
		}
		if (getRandomInt(1,3) == 2) {
			return enemyObj.sokolov;
		}
		if (getRandomInt(1,3) == 3) {
			return enemyObj.grishenko;
		}
	}

	var arrayOfEnemies = [];
	arrayOfEnemies[0] = {
		x: getRandomInt(50, 1250),
		y: -50
	}

	// Позиция игрока

	var xPosChar = 625;
	var yPosChar = canvas.height - characterStats.sizeY;

	// Движения

	document.onkeydown = function(event) {
		switch (event.keyCode) {
			case 39:
				if(xPosChar + characterStats.sizeX > 1250){
					xPosChar += 1300 - (xPosChar + characterStats.sizeX);
					break;
				}
				xPosChar += characterStats.speed;
				break;
			case 37:
				if(xPosChar - characterStats.sizeX < 0){
					xPosChar -= xPosChar;
					break; 
				}
				xPosChar -= characterStats.speed;
				break;
			default:
				// statements_def
				break;
		}
	}

	//  Игровые настройки

	var gravity = 2.5;
	var score = 0;
	var spawnPoint = 50;
	var lifes = characterStats.life;

	function draw(){

		ctx.drawImage(bg, 0, 0, 1300, 550 );
		ctx.drawImage(char, xPosChar, yPosChar, characterStats.sizeX, characterStats.sizeY);

		for(var i = 0; i < arrayOfEnemies.length; i++){

			ctx.drawImage(enemy, arrayOfEnemies[i].x, arrayOfEnemies[i].y, 50, 50);

			arrayOfEnemies[i].y+= gravity;

			// Добавление новых элементов в массив arrayOfEnemies когда 
			// координата y становится равной 300

			if(arrayOfEnemies[i].y == spawnPoint){
				arrayOfEnemies.push({
					x: getRandomInt(0, 1250),
					y: -100
				});
			}

			// Проверка на столкновение
				
			for (var x = 0; x < characterStats.sizeX; x++){
				for(var y = 0; y < characterStats.sizeY; y++){
					if (xPosChar + x == arrayOfEnemies[i].x + y && yPosChar - 50 == arrayOfEnemies[i].y) {
						music.pause();
						deathSound.play();
						body.removeChild(canvas);
						endBoard.classList.toggle('show');
						outScore.value = score;
						



						/*alert('Вас поймали и отчислили! Вы доучились до курса: '  +score);
						location.reload();*/
						
					}
				}
			}
			
			

			if(arrayOfEnemies[i].y == 510){
				score++;
			}

			if(arrayOfEnemies[i].y == 700){
				arrayOfEnemies.splice(i, 1);
			}

			

			// Scoreboard

			ctx.fillStyle = "#fff";
			ctx.font = "20px Cinnamon";
			ctx.fillText("Счет: " + score, 10, 30);
		
		}

		if(score == 10){
			gravity = 5;
		}

		if(score == 20){
			spawnPoint = 0;
		}

		if(score == 32){
			bg.src = "img/bg-2.png";
		}

		if(score == 40){
			spawnPoint = -20;
		}


		

		if(score == 100){
			spawnPoint = -50;
		}

		if(score == 100){
			gravity = 10;
		}

		requestAnimationFrame(draw);
	}

	enemy.onload = draw;

}

