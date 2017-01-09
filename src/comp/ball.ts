/**
 * Game Ball
 */
class Ball {

    public pos = {
        x: 0,
        y: 0
    }

    currentVeloc = {
        x: 0,
        y: 0 
    }

    public angle: number;

    public originalColor: string = "#000000";
    public color: string;

    constructor(public id: number,
        public radius: number,
        public veloc: number) {
        this.color = this.originalColor;
    }

    public moveTo(x: number, y: number): boolean {
        this.pos.x = x;
        this.pos.y = y;
        return true;
    }

    /**
     * Order the ball to keep moving in the current direction and speed
     * not considering limits or collisions
     */
    public keepMoving() {
        // Horizontal component
        this.currentVeloc.x = Math.sin(this.angle) * this.veloc;
        // vertical component
        this.currentVeloc.y = -1 * Math.cos(this.angle) * this.veloc;
        // updates the ball position
        this.pos.y += this.currentVeloc.y;
        this.pos.x += this.currentVeloc.x;
    }

    public bounceVertical(bias: number = 0): void {
        this.angle = Math.PI - this.angle + (Math.random() * bias);
    }

    public bounceHorizontal(bias: number = 0): void {
        this.angle = 2*Math.PI - this.angle + (Math.random() * bias);
    }

    // public bounceRight(bias: number = 0): void {
    //     this.angle = 2*Math.PI - this.angle + (Math.random() * bias);
    // }

    public strike(): void {
        // neutral strike
        this.bounceVertical();
    }

    public strikeLeft(): void {
        // strike bumping to the left
        this.bounceVertical(-1);
    }

    public strikeRight(): void {
        // strike bumping to the right
        this.bounceVertical(+1);
    }

    public colisionWith(player: Player): boolean {
        // se a bola esta se movendo na direcao do jogador...
        if (this.currentVeloc.y > 0) {
            //player.color = "#DDDDDD";
            // e ha colisao...
            if ((this.pos.x - this.radius) <= (player.pos.x + player.width) &&
                ((this.pos.x + this.radius) >= player.pos.x)) {
                if ((this.pos.y + this.radius > player.pos.y) &&
                    (this.pos.y - this.radius < player.pos.y + player.height)) {
                    //console.log("bola colidiu com player " + player.id);
                    player.color = "#EECC33";
                    return true;
                }
            } else {
                return false;
            }
        }
        player.color = player.originalColor;
        return false;
    }


}