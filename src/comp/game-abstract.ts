/**
 * GameAbstract
 * Base Class for Games
 */
abstract class GameAbstract {

    protected intervalHandler: any;
    protected paused: boolean = false;
    protected tickms: number = 200;
    protected fps = 25;

    constructor() {
        // call setup after constructor
        setTimeout(
            ()=>{this.setup();},
            0
        );
    }

    /**
     * Sets the game up, creating its elements
     */
    protected setup() {
        // override
    };

    /**
     * Let the game begin...
     * Puts the game loop in an interval, keeping the handler
     */
    public start() {
        // inicio
        this.intervalHandler = setInterval(() => this.gameLoop(), this.fps); // chama a function gameLoop a cada n frames
    }

    /**
     * Quits the game
     * Uses the handler created at :start() to clear the interval running the game loop
     */
    public stop() {
        if (this.intervalHandler) {
            clearInterval(this.intervalHandler);
        }
    }

    /**
     * Puts the game in pause
     */
    public pause() {
        this.paused = true;
        console.log("Game paused.");
    }

    /**
     * Brings the game back from pause
     */
    public continue() {
        this.paused = false;
        console.log("Game continuing...");
    }

    /**
     * Puts the game in pause or brings the game back from pause`
     */
    public togglePause() {
        if (this.paused) {
            this.continue();
        } else {
            this.pause();
        }
    }
    
    async gameLoop() {
        // the game loop
        // override
    }

}
