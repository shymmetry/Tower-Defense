ig.module(
	'game.game'
)
.requires(
)
.defines(function(){

initGameBar = function() {
    var money = document.getElementById("money");
    money.innerHTML = ig.game.money;
    
    var lives = document.getElementById("lives");
    lives.innerHTML = ig.game.lives;
    
    var lives = document.getElementById("round");
    round.innerHTML = ig.game.curRound + 1;
};

addLives = function(livesToAdd) {
    ig.game.lives += livesToAdd;
    lives = document.getElementById('lives');
    lives.innerHTML = ig.game.lives;
    if (ig.game.lives <= 0) {
        endGame();
    }
};

addMoney = function(moneyToAdd) {
    if (ig.game.money + moneyToAdd >= 0) {
        ig.game.money += moneyToAdd
        money = document.getElementById("money");
        money.innerHTML = ig.game.money;
        return true;
    }
    return false;
};

startRound = function() {
    var game = ig.game;
    if (game.roundOver) {
        game.spawnTimer.unpause();
        game.spawnTimer.set(rounds[game.curRound].spawnTime[game.spawnCounter]);
        game.spawning = true;
        game.roundOver = false;
    }
};

endRound = function() {
    var game = ig.game;
    game.spawnTimer.pause();
    game.roundOver = true;
    game.spawnCounter = 0;
    
    // add bonus
    addMoney(rounds[game.curRound].bonus + ig.game.extraRoundBonus);
    
    game.curRound++;
    document.getElementById('round').innerHTML = game.curRound + 1;
    
    if (game.curRound == rounds.length) {
        endGame();
    }
};

endGame = function() {
    ig.game.gameOver = true;
};

});