/// <reference path="game-abstract.ts"/>
/**
 * Game
 * Main Game Class controller
 */

class Game extends GameAbstract {

    private context: any;
    private ball: Ball;
    private player: Player;
    private timeout = 250;

    protected level = [
        {
            id: 1,
            humanPlayerVeloc: 15,
            cpuPlayerVeloc: 20,
            ballVeloc: 12
        }
    ];

    protected controls = {
        beingPressed: {
            'upArrow': false,
            'downArrow': false,
            'leftArrow': false,
            'rightArrow': false,
            'spaceBar': false
        }
    }

    protected score = {
        player: 0,
        ballsLeft: 3
    }

    constructor(protected canvas: any) {
        super();
        console.log('In constructor');
        this.context = canvas.getContext("2d"); // recupera o contexto 2d
    }

    // callback : Tratamento de botão apertada
    protected keyDown = (e: any) => {
        if (e.keyCode == 38) { // up
            this.controls.beingPressed.upArrow = true;
        } else if (e.keyCode == 40) { // down
            this.controls.beingPressed.downArrow = true;
        } else if (e.keyCode == 80) { // p
            //this.paused = !this.paused;
            this.togglePause();
        } else if (e.keyCode == 81) { // q
            this.stop();
        }
    }

    // callback : Tratamento de botão solto
    protected keyUp = (e: any) => {
        if (e.keyCode == 38) { // up
            this.controls.beingPressed.upArrow = false; // jogador soltou tecla cima
        } else if (e.keyCode == 40) { // down
            this.controls.beingPressed.downArrow = false; // jogador soltou tecla baixo
        }
    }


    setup() {
        console.log('In setup');

        // controls
        document.addEventListener('keyup', this.keyUp, false); // adiciona evento para keyup
        document.addEventListener('keydown', this.keyDown, false); // adiciona evento para keydown

        // field

        // players
        this.player = new Player(1, true, this.level[0].humanPlayerVeloc);
        this.player.moveTo((this.canvas.width - this.player.width) / 2, this.canvas.height - (this.player.height * 2));
        this.player.originalColor = "#888888";

        // ball
        this.ball = new Ball(1, 10, this.level[0].ballVeloc);

        this.pause();
        this.kickoff();
        this.renderMessage("Press 'P' to continue...");
    }


    protected renderBall() {
        this.context.strokeStyle = this.ball.color;
        this.context.fillStyle = this.ball.color;
        this.context.beginPath(); // inicia o modo de desenho
        this.context.arc(this.ball.pos.x, this.ball.pos.y, this.ball.radius, 0, Math.PI * 2, true); // desenha o círculo desejado com as coordenadas no centro.
        this.context.closePath(); // finaliza o caminho (opcional)
        this.context.fill();
    }

    protected renderMessage(message: string) {
        this.context.font = "42pt Helvetica"; // tamanho e fonte para desenhar o texto
        this.context.fillStyle = "#000000"; // cor preta (opcional)
        let messageWidth = message.length * 23;
        this.context.fillText(message, (this.canvas.width - messageWidth) / 2, 50); // escreve texto na tela na posição desejada
    }

    protected renderScore() {
        var pontosA, balls: string;
        if (this.score.player < 10) { // se o número de pontos for menor que 10, colocamos o zero á esquerda
            pontosA = "0" + this.score.player;
        }
        if (this.score.player < 100) { // se o número de pontos for menor que 10, colocamos o zero á esquerda
            pontosA = "0" + this.score.player;
        }
        balls = "" + this.score.ballsLeft;

        this.context.font = "42pt Helvetica"; // tamanho e fonte para desenhar o texto
        this.context.fillStyle = "#000000"; // cor preta (opcional)
        //this.context.fillText(pontosA + "     " + balls + " *  " + this.ball.angle.toFixed(4), (this.canvas.width / 2) - 90, 50); // escreve texto na tela na posição desejada
        this.renderMessage(pontosA + "    " + balls + " *  " + this.ball.angle.toFixed(4));
    }

    protected renderPlayer() {
        this.context.fillStyle = this.player.color;
        this.context.fillRect(this.player.pos.x, this.player.pos.y, this.player.width, this.player.height);
    }

    protected renderField() {
        //     this.context.beginPath(); // inicia o modo de desenho
        //     this.context.moveTo(this.canvas.width / 2, 0); // posiciona o para desenhar
        //     this.context.lineTo(this.canvas.width / 2, this.canvas.height); // faz o "risco" na tela
        //     this.context.strokeStyle = "#000000"; // cor preta (opcional)
        //     this.context.stroke(); // aplica o risco na tela
        //     this.context.closePath(); // finaliza o caminho (opcional)
    }

    protected clearScene() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // limpa a tela antes de desenhar
    }


    protected renderScene() {
        // clear everything to draw everything again
        this.clearScene();

        // Jogador e Oponente
        this.renderPlayer();

        // Bola
        this.renderBall();

        // Placar
        this.renderScore();

        // Linha divisória
        this.renderField();
    }


    protected handlePlayer() {
        // 1
        if (this.player.human) {
            if (this.controls.beingPressed.upArrow != this.controls.beingPressed.downArrow) { // se o jogador estiver pressionando a tecla baixo ou cima
                if (this.controls.beingPressed.upArrow) { // se for para cima...
                    if (this.player.pos.x > 0) { // se não sair da tela...
                        this.player.moveLeft(); // muda a posição
                    }
                } else { // se for para baixo...
                    if (this.player.pos.x < (this.canvas.width - this.player.width)) { // se não sair da tela...
                        this.player.moveRight(); // muda a posição
                    }
                }
            }
        }

    }

    protected handleBall() {
        this.ball.keepMoving();
    }

    protected handleCollisions() {
        // colisao com player1?
        if (this.ball.colisionWith(this.player)) {
            console.log("Hit!");
            // hitting player lateral: adjust vertical position of ball to consider hit on surface
            if ( this.ball.pos.y > this.player.pos.y ) {
                console.log("adjusting ball vertical position");
                this.ball.pos.y = this.player.pos.y - this.ball.radius;
            }
            if (this.controls.beingPressed.upArrow) {
                // strike moving to the left
                this.ball.strikeLeft();
            } else if (this.controls.beingPressed.downArrow) {
                // strike moving to the right
                this.ball.strikeRight();
            } else {
                // neutral strike
                this.ball.strike();
            }
            // edges of field
        } else if (this.ball.pos.x <= this.ball.radius) {
            // adjust ball pos.x if necessary
            this.ball.pos.x = this.ball.radius+1;
            this.ball.bounceHorizontal(); // left edge
        } else if (this.ball.pos.x >= this.canvas.width) {
            this.ball.pos.x = this.canvas.width-this.ball.radius-1;
            this.ball.bounceHorizontal(); // right edge
        } else if (this.ball.pos.y <= this.ball.radius ) {
            this.ball.pos.y = this.ball.radius+1;
            this.ball.bounceVertical(); // top edge
        } else if (this.ball.pos.y + this.ball.radius >= this.canvas.height) {
            // bottom edge, loose ball
            this.goal();
        }
    }

    async goal() {
        console.log("Loose ball...");
        //await sleep(this.timeout);
        this.pause();
        this.score.ballsLeft--; // ponto do jogador!
        console.log("   balls left:", this.score.ballsLeft);
        if (this.score.ballsLeft < 0) {
            this.gameOver();
        } else {
            this.kickoff();
        }
    }

    gameOver() {
        // game over
        console.log("Game over");
        this.clearScene();
        this.renderMessage("GAME OVER");
        this.stop();
    }

    kickoff() {
        this.ball.pos.x = this.canvas.width / 2; // posiciona a bola no meio da tela
        this.ball.pos.y = this.canvas.height / 2; // posiciona a bola no meio da tela
        this.ball.angle = Math.PI + (Math.random() * 0.2 - 0.1); // faz a bola ir para uma direção aleatória
    }


    async gameLoop() {
        if (!this.paused) {

            // Bola
            this.handleBall();

            // Jogador
            this.handlePlayer();

            // Collisions
            this.handleCollisions();

            // Atualizar a cena
            this.renderScene();

        } else {

            await sleep(200);

        }

    }

}