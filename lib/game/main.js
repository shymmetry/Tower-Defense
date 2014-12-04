ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	
	'game.entities.towers.tower',
	'game.entities.towers.tower-basic',
	'game.entities.traps.trap',
	'game.entities.traps.trap-basic',
	'game.entities.attackers.attacker',
	'game.entities.attackers.attacker-bug',
	'game.entities.boosters.booster',
	'game.entities.boosters.booster-basic',
	'game.entities.blockers.blocker',
	'game.entities.blockers.blocker-basic',
	'game.entities.bullet',
	'game.entities.land',
	'game.entities.builder',
	'game.levels.TestLevel',
	'game.rounds',
	'game.game',
	'game.buildingVars'
)
.defines(function(){

MyGame = ig.Game.extend({
	tileSize: -1,
	mapWidth: -1,
	mapHeight: -1,
	curRound: -1,
	spawnCounter: -1,
	lives: -1,
	money: -1,
	spawnTimer: null,
	finish: null,
	currentMap: null,
	entityGrid: null,
	attackers: null,
	builder: null,
	
	gameOver: false,
	roundOver: true,
	spawning: false,
	isBuilding: false,
	
	builderShader: null,
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	
	
	init: function() {
		// init variables
		this.tileSize = 48;
		this.mapWidth = 15;
		this.mapHeight = 9;
		this.lives = 5;
		this.money = 300;
		this.extraRoundBonus = 0;
		this.finish = {x:0,y:4};
		this.start = {x:14,y:4};
		this.currentMap = LevelTestLevel;
		this.curRound = 0;
		this.spawnCounter = 0;
		this.attackers = [];
		this.entityGrid = [];
		this.builderShader = [];
		for (var i = 0; i < this.mapWidth; i++)
			this.entityGrid[i] = [];
		
		// load level 
		this.loadLevel( this.currentMap );
		
		// populate entitygrid
		var entities = this.currentMap["entities"];
		for (var i = 0; i < entities.length; i++) {
			this.entityGrid[entities[i].x / this.tileSize][entities[i].y / this.tileSize] = entities[i];
		}
		this.entityGrid[this.start.x][this.start.y] = "start";
			
		// load events
		ig.input.bind( ig.KEY.MOUSE1 , 'click');
		ig.input.bind( ig.KEY.SPACE , 'spawn');
		
		// init timer
		this.spawnTimer = new ig.Timer();
		this.spawnTimer.pause();
		
		// initialize the top game bar
		initGameBar();
	},
	
	update: function() {
		if (this.gameOver) {
			var ctx = document.getElementById('canvas').getContext("2d");
			return;
		}
		
		// Update all entities and backgroundMaps
		this.parent();
		
		// check for next spawn
		if (this.spawning && this.spawnTimer.delta() > 0) {
			this.sendAttacker();
		}
		
		// spawn monster
		if (ig.input.pressed('spawn')) {
			startRound();
		}
		
		// LAST BECAUSE RETURNS IF BUILDING
		// check for mouse clicks
		if (ig.input.pressed('click')) {
			var mousex = Math.floor(ig.input.mouse.x/this.tileSize);
			var mousey = Math.floor(ig.input.mouse.y/this.tileSize);
			
			// check if in building mode
			if (this.isBuilding) {
				this.builder.clicked(mousex, mousey);
				return;
			}
			
			// check if building on land and start
			this.building = ig.game.entityGrid[mousex][mousey];
			
			if (this.building != null &&
			    (this.building.type == 'land' || this.building.type == 'EntityLand' || this.building.type == undefined)) {
				console.log("yes");
				return;
			}
			
			this.builder = ig.game.spawnEntity( EntityBuilder , mousex*ig.game.tileSize, mousey*ig.game.tileSize, null);
		}
	},
	
	sendAttacker: function() {
		var attacker = ig.game.spawnEntity( rounds[this.curRound].spawnUnit[this.spawnCounter] , this.start.x*this.tileSize, this.start.y*this.tileSize, null);
		this.attackers.push(attacker);
		
		this.spawnCounter++;
		
		// if end of spawn list stop
		if (this.spawnCounter != rounds[this.curRound].spawnUnit.length) {
			this.spawnTimer.set(rounds[this.curRound].spawnTime[this.spawnCounter]);
		}
		else
			this.spawning = false;
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		if (this.gameOver) {
			var canvas = document.getElementById('canvas');
			var ctx = canvas.getContext("2d");
			ctx.fillStyle = "black";
			ctx.font = "bold 32px Arial";
			ctx.textAlign = "center";
			ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
		}
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 15*48, 9*48, 1 );

});
