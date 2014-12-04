ig.module(
	'game.entities.builder'
)
.requires(
	'impact.entity',
	'game.buildingVars',
	'game.game',
	'game.entities.land'
)
.defines(function(){

EntityBuilder = ig.Entity.extend({
	
	size: {x:48, y:48},
	collides: ig.Entity.COLLIDES.NEVER,
	
	animSheet: new ig.AnimationSheet( 'media/cancelButton.png', 48, 48 ),
	
	options: null,
	buildX: null,
	buildY: null,
	building: null,
	buildable: null,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		ig.game.isBuilding = true;
		
		this.buildable = [true, true, true, true];
		
		this.buildX = x/ig.game.tileSize;
		this.buildY = y/ig.game.tileSize;
		
		this.building = ig.game.entityGrid[this.buildX][this.buildY];
		
		if (this.building == null) {
			options = builderLevels['empty'];
		}
		else {
			options = builderLevels[this.building.type];
		}
		
		// remove blocking towers from selection
		if (getBestRoute(ig.game.start, {x:this.buildX, y:this.buildY}) == null) {
			for (var i = 0; i < options.length; i++) {
				if (noblockBuildings.indexOf(options[i]) == -1) {
					this.buildable[i] = false;
				}
			}
		}
	
		this.addAnim( 'idle', 1, [0] );
	},
	
	draw: function() {
		
		// draw background shadow
		var ctx = document.getElementById('canvas').getContext("2d");
		var radius = 90;
		ctx.beginPath();
		ctx.arc(this.buildX*ig.game.tileSize + ig.game.tileSize/2, this.buildY*ig.game.tileSize + ig.game.tileSize/2, radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'rgba(0,0,0,.5)';
		ctx.fill();
		
		// draw cancel button (this)
		if( this.currentAnim ) {
			this.currentAnim.draw(
				this.pos.x - this.offset.x - ig.game._rscreen.x,
				this.pos.y - this.offset.y - ig.game._rscreen.y
			);
		}
		
		// draw buttons
		if (options[0] != null) {
			var img0 = new Image();
			img0.src = buildingImgs[options[0]];
			ctx.drawImage(img0, this.buildX*ig.game.tileSize, (this.buildY-1)*ig.game.tileSize);
		}
		if (options[1] != null) {
			var img1 = new Image();
			img1.src = buildingImgs[options[1]];
			ctx.drawImage(img1, (this.buildX+1)*ig.game.tileSize, this.buildY*ig.game.tileSize);
		}
		if (options[2] != null) {
			var img2 = new Image();
			img2.src = buildingImgs[options[2]];
			ctx.drawImage(img2, this.buildX*ig.game.tileSize, (this.buildY+1)*ig.game.tileSize);
		}
		if (options[3] != null) {
			var img3 = new Image();
			img3.src = buildingImgs[options[3]];
			ctx.drawImage(img3, (this.buildX-1)*ig.game.tileSize, this.buildY*ig.game.tileSize);
		}
		
		// draw sell and info if on building
		if (this.building != null) {
			var imgSell = new Image();
			imgSell.src = 'media/sellBuilderButton.png';
			ctx.drawImage(imgSell, (this.buildX-1)*ig.game.tileSize, (this.buildY+1)*ig.game.tileSize);
			
			var imgInfo = new Image();
			imgInfo.src = 'media/infoBuilderButton.png';
			ctx.drawImage(imgInfo, (this.buildX+1)*ig.game.tileSize, (this.buildY+1)*ig.game.tileSize);
		}
		
		// draw shading over unusable options
		if (buildingCosts[options[0]] > ig.game.money || !this.buildable[0]) {
			this.drawCircle(this.buildX,this.buildY-1);
		}
		if (buildingCosts[options[1]] > ig.game.money || !this.buildable[1]) {
			this.drawCircle(this.buildX+1,this.buildY);
		}
		if (buildingCosts[options[2]] > ig.game.money || !this.buildable[2]) {
			this.drawCircle(this.buildX,this.buildY+1);
		}
		if (buildingCosts[options[3]] > ig.game.money || !this.buildable[3]) {
			this.drawCircle(this.buildX-1,this.buildY);
		}
	},
	
	drawCircle: function(x,y) {
		var ctx = document.getElementById('canvas').getContext("2d");
		var radius = 20;
	
		ctx.beginPath();
		ctx.arc(x*ig.game.tileSize + ig.game.tileSize/2, y*ig.game.tileSize + ig.game.tileSize/2, radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'rgba(0,0,0,.5)';
		ctx.fill();
	},
	
	clicked: function (x, y) {
		// cancel button hit
		if (x == this.buildX && y == this.buildY) {
			this.endBuild();
		}
		// Option Up
		else if (x == this.buildX && y == this.buildY - 1) {
			this.build(options[0]);
		}
		// Option Right
		else if (x == this.buildX + 1 && y == this.buildY) {
			this.build(options[1]);
		}
		// Option Down
		else if (x == this.buildX && y == this.buildY + 1) {
			this.build(options[2]);
		}
		// Option Left
		else if (x == this.buildX - 1 && y == this.buildY) {
			this.build(options[3]);
		}
		// Option Sell
		else if (x == this.buildX - 1 && y == this.buildY + 1) {
			addMoney(this.building.cost/2);
			
			this.building.kill();
			
			ig.game.entityGrid[this.buildX][this.buildY] = undefined;
		
			ig.game.attackers.forEach( function(attacker) {
				attacker.needToUpdate = true;	
			});
			
			this.endBuild();
		}
		// Option Info
		else if (x == this.buildX + 1 && y == this.buildY + 1) {
			//code
		}
	},
	
	build: function(buildingType) {
		// check if placing on attacker
		for (var i = 0; i < ig.game.attackers.length; i++) {
			if ((ig.game.attackers[i].curSpace.x == this.buildX && ig.game.attackers[i].curSpace.y == this.buildY) ||
			     (ig.game.attackers[i].nextSpace.x == this.buildX && ig.game.attackers[i].nextSpace.y == this.buildY)) {
				console.log("placing on attacker");
				return;
			}
		}
		
		// spend money
		if (!addMoney(-1*buildingCosts[buildingType])) {
			console.log("not enough money");
			return;
		}
		
		var building = ig.game.spawnEntity( buildingClass[buildingType] , this.buildX*ig.game.tileSize, this.buildY*ig.game.tileSize, null);
		
		// add to entity grid
		ig.game.entityGrid[this.buildX][this.buildY] = building;
		
		ig.game.attackers.forEach( function(attacker) {
			attacker.needToUpdate = true;	
		});
		
		this.endBuild();
	},
	
	endBuild: function() {
		ig.game.builderShader = [];
		ig.game.isBuilding = false;
		this.kill();
	}
});

});