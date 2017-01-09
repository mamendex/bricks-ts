/**
 * BRICKS HTML5 TS
 * Main app.TS
 * onload creates a new game into canvas identified by id
 */

window.onload = () => {
    var canvas = document.getElementById('canvas');
    var game : Game = new Game(canvas);
    game.start();
}