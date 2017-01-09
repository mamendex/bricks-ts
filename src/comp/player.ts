/**
 * Game Player
 */
class Player {

    public pos = {
        x: 0,
        y: 0
    }
    public direction = {
        left: false,
        right: false
    }
    //public veloc : number = 0;
    public width = 100;
    public height = 30;
    public originalColor : string = "#111111";
    public color : string;

    constructor (public id : number,
                public human : boolean = true,
                public veloc : number)
    {
        this.color = this.originalColor;
    }

    public moveTo(x: number, y: number) : boolean {
        this.pos.x = x;
        this.pos.y = y;
        return true;
    }

    public moveLeft() {
        this.pos.x -= this.veloc;
        this.direction.left = true;
        this.direction.right = false;
    }

    public moveRight() {
        this.pos.x += this.veloc;
        this.direction.left = false;
        this.direction.right = true;
    }

    public keepMoving() {
        if (this.direction.left) {
            this.moveLeft();
        } else if (this.direction.right) {
            this.moveRight();
        }
        return this.pos;
    }
}