javascript
// Variáveis globais
var canvas;
var canvasContext;
var ballX = 300;
var ballY = 200;
var ballSpeedX = 5;
var ballSpeedY = 5;
var paddle1Y = 150;
var paddle2Y = 150;
var player1Score = 0;
var player2Score = 0;
var showingWinScreen = false;

// Constantes
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;
const WINNING_SCORE = 3;

// Função principal
window.onload = function() {
	canvas = document.getElementById('canvas');
	canvasContext = canvas.getContext('2d');

	// Atualiza a tela a cada 30 milissegundos
	var framesPerSecond = 30;
	setInterval(function() {
		moveEverything();
		drawEverything();
	}, 1000/framesPerSecond);

	// Evento de clique para reiniciar o jogo
	canvas.addEventListener('mousedown', handleMouseClick);

	// Evento de movimento do mouse para controlar a raquete do jogador 1
	canvas.addEventListener('mousemove', function(evt) {
		var mousePos = calculateMousePos(evt);
		paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
	});
}

// Função para mover a bola e as raquetes
function moveEverything() {
	if (showingWinScreen) {
		return;
	}

	// Move a bola
	ballX += ballSpeedX;
	ballY += ballSpeedY;

	// Verifica colisão com as paredes laterais
	if (ballX < 0) {
		if (ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;

			// Calcula a direção da bola ao bater na raquete
			var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player2Score++; // Jogador 2 marca ponto
			ballReset();
		}
	}
	if (ballX > canvas.width) {
		if (ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;

			// Calcula a direção da bola ao bater na raquete
			var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player1Score++; // Jogador 1 marca ponto
			ballReset();
		}
	}

	// Verifica colisão com as paredes superior e inferior
	if (ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
	if (ballY > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}

	// Move a raquete do jogador 2 automaticamente
	computerMovement();
}

// Função para desenhar a bola e as raquetes
function drawEverything() {
	// Desenha o fundo
	colorRect(0, 0, canvas.width, canvas.height, 'black');

	if (showingWinScreen) {
		canvasContext.fillStyle = 'white';

		if (player1Score >= WINNING_SCORE) {
			canvasContext.fillText('Jogador 1 venceu!', 300, 200);
		} else if (player2Score >= WINNING_SCORE) {
			canvasContext.fillText('Jogador 2 venceu!', 300, 200);
		}

		canvasContext.fillText('Clique para continuar', 300, 500);
		return;
	}

	// Desenha a bola
	colorCircle(ballX, ballY, 10, 'white');

	// Desenha a raquete do jogador 1
	colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

	// Desenha a raquete do jogador 2
	colorRect(canvas.width-PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

	// Desenha a pontuação
	canvasContext.fillText(player1Score, 100, 100);
	canvasContext.fillText(player2Score, canvas.width-100, 100);
}

// Função para resetar a bola após um ponto ser marcado
function ballReset() {
	if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
		showingWinScreen = true;
	}

	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

// Função para mover a raquete do jogador 2 automaticamente
function computerMovement() {
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);

	if (paddle2YCenter < ballY-35) {
		paddle2Y += 6;
	} else if (paddle2YCenter > ballY+35) {
		paddle2Y -= 6;
	}
}

// Função para lidar com o evento de clique do mouse
function handleMouseClick(evt) {
	if (showingWinScreen) {
		player1Score = 0;
		player2Score = 0;
		showingWinScreen = false;
	}
}

// Função para calcular a posição do mouse no canvas
function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x: mouseX,
		y: mouseY
	};
}

// Função para desenhar um retângulo colorido
function colorRect(leftX, topY, width, height, color) {
	canvasContext.fillStyle = color;
	canvasContext.fillRect(leftX, topY, width, height);
}

// Função para desenhar um círculo colorido
function colorCircle(centerX, centerY, radius, color) {
	canvasContext.fillStyle = color;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}