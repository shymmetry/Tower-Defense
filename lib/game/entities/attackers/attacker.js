ig.module(
	'game.entities.attackers.attacker'
)
.requires(
	'impact.entity',
	'game.game',
	'game.buildingVars'
)
.defines(function(){

EntityAttacker = ig.Entity.extend({
	
	size: {x:48, y:48},
	collides: ig.Entity.COLLIDES.LITE,
	
	animSheet: new ig.AnimationSheet( 'media/paddle-blue.png', 48, 48 ),
	
	route: null,
	curSpace: null,
	nextSpace: null,
	needToUpdate: false,
	
	health: -1,
	reward: -1,
	
	speed: 1,
	
	init: function( x, y, settings ) {
		this.parent( x + ig.game.tileSize, y, settings );
		
		this.addAnim( 'idle', 1, [0] );
		
		this.curSpace = {x:this.pos.x/ig.game.tileSize,y:this.pos.y/ig.game.tileSize};
		this.nextSpace = {x:this.pos.x/ig.game.tileSize - 1,y:this.pos.y/ig.game.tileSize};
		
		this.route = getBestRoute(this.nextSpace, null);
		
		this.health = 100;
		this.reward = 0;
	},
	
	update: function () {
		
		// check if need to update the route
		if (this.needToUpdate) {
			this.updateRoute();
			
			this.needToUpdate = false;
		}
		
		// move
		if (this.curSpace.x != this.nextSpace.x) {
			(this.curSpace.x > this.nextSpace.x) ? (this.pos.x -= this.speed) : (this.pos.x += this.speed)
		}
		if (this.curSpace.y != this.nextSpace.y) {
			(this.curSpace.y > this.nextSpace.y) ? (this.pos.y -= this.speed) : (this.pos.y += this.speed)
		}
		// check if reached next space
		if (this.pos.x == this.nextSpace.x*ig.game.tileSize && this.pos.y == this.nextSpace.y*ig.game.tileSize) {
			this.curSpace = this.nextSpace;
			
			// if reached end
			if (this.curSpace.x == ig.game.finish.x && this.curSpace.y == ig.game.finish.y) {
				addLives(-1);
				this.killSelf();
			}
			
			this.nextSpace = this.route.pop();
		}
	},
	
	updateRoute: function() {
		this.route = getBestRoute(this.nextSpace, null);
	},
	
	killSelf: function() {
		ig.game.attackers.splice(ig.game.attackers.indexOf(this),1);
		this.kill();
		
		// check if round over
		if (!ig.game.spawning && ig.game.attackers.length == 0) {
			endRound();
		}
	},
	
	hurt: function(dmg) {
		this.health -= dmg;
		if (this.health <= 0) {
			addMoney(this.reward);
			this.killSelf();
		}
	},
	
});

getBestRoute = function(space, addedEntity) {
	var pos = {x:space.x,y:space.y};
	var finish = ig.game.finish;
	
	// clone entity grid and add temp entity if provided
	var tempEG = [];
	for (var i = 0; i<ig.game.entityGrid.length; i++) {
		tempEG[i] = ig.game.entityGrid[i].slice(0);
	}
	if (addedEntity != null) {
		tempEG[addedEntity.x][addedEntity.y] = "temp";
	}
	
	// SEARCH
	var dist = new Object();
	var visited = new Object();
	var previous = new Object();
	var queue = [];
	
	dist[[pos.x,pos.y]] = 0;
	queue.push(pos);
	
	while (queue.length > 0) {
		
		var best = queue.pop();
		visited[[best.x,best.y]] = true;
		
		// found end
		if (best.x == finish.x && best.y == finish.y) {
			var route = [{x:finish.x,y:finish.y}];
	
			// get path
			var destx = finish.x;
			var desty = finish.y;
			while (destx != space.x || desty != space.y) {
				var prev = previous[[destx, desty]];
				destx = prev.x;
				desty = prev.y;
				
				route.push({x:destx,y:desty});
			}
			// remove current space
			route.pop();
			
			return route;
		}
		
		// loop through all neighbors and add if needed
		var neighbors = getOpenNeighbors(best, tempEG);
		for (var i = 0; i < neighbors.length; i++) {
			alt = dist[[best.x,best.y]] + neighbors[i].dist;
			if (dist[[neighbors[i].pos.x,neighbors[i].pos.y]] == undefined || alt < dist[[neighbors[i].pos.x,neighbors[i].pos.y]]) {
				dist[[neighbors[i].pos.x,neighbors[i].pos.y]] = alt;
				previous[[neighbors[i].pos.x,neighbors[i].pos.y]] = best;
				if (!visited[[neighbors[i].pos.x,neighbors[i].pos.y]]) {
					queue = insertIntoQueue(queue, neighbors[i].pos, dist);
				}
			}
		}
	}
	
	return null;
};

insertIntoQueue = function(queue, pos, dist) {
	for (var i = 0; i < queue.length; i++) {
		if (dist[[pos.x, pos.y]] > dist[[queue[i].x,queue[i].y]]) {
			
			// get front of queue
			var front = queue.slice(0, i);
			// add to spot
			front.push(pos);
			// add back end
			front = front.concat(queue.slice(i, queue.length));
			
			return front;
		}
	}
	// if it is less than everything in the list
	queue.push(pos);
	return queue;
};

getOpenNeighbors = function(pos, tempEG) {
	var neighbors = [];
	var openNeighbors = [];
	neighbors.push({pos:{x:pos.x+1,y:pos.y+1},dist:Math.sqrt(2)});
	neighbors.push({pos:{x:pos.x+1,y:pos.y},dist:1});
	neighbors.push({pos:{x:pos.x+1,y:pos.y-1},dist:Math.sqrt(2)});
	neighbors.push({pos:{x:pos.x-1,y:pos.y+1},dist:Math.sqrt(2)});
	neighbors.push({pos:{x:pos.x-1,y:pos.y},dist:1});
	neighbors.push({pos:{x:pos.x-1,y:pos.y-1},dist:Math.sqrt(2)});
	neighbors.push({pos:{x:pos.x,y:pos.y+1},dist:1});
	neighbors.push({pos:{x:pos.x,y:pos.y-1},dist:1});
	neighbors.forEach(function(neighbor) {
		if (neighbor.pos.x >= 0 && neighbor.pos.x < ig.game.mapWidth &&
		    neighbor.pos.y >= 0 && neighbor.pos.y < ig.game.mapHeight)
		{
			// if it is a building then it must be a no block building
			if (tempEG[neighbor.pos.x][neighbor.pos.y] != undefined &&
			    noblockBuildings.indexOf(tempEG[neighbor.pos.x][neighbor.pos.y].type) == -1) {
				return;
			}
			
			// check for diagonal movement with entity in the way
			if (neighbor.dist > 1) {
				// if either adjacents have entity return
				if (tempEG[neighbor.pos.x][pos.y] != undefined ||
				    tempEG[pos.x][neighbor.pos.y] != undefined) {
					return;
				}
			}
			openNeighbors.push(neighbor);
		}
	});
	return openNeighbors;

};

});









