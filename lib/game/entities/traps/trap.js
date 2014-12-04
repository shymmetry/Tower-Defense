ig.module(
	'game.entities.traps.trap'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityTrap = ig.Entity.extend({
	
	size: {x:48, y:48},
	collides: ig.Entity.COLLIDES.NEVER,
	
	animSheet: new ig.AnimationSheet( 'media/paddle-red.png', 48, 48 ),
	
        cooldown: -1,
        cdcount: -1,
        damage: -1,
	cost: -1,
	type: 'trap',
        
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 1, [0] );
                
                this.cooldown = this.cdcount = 200;
                this.damage = 10;
		
		this.cost = buildingCosts[this.type];
		
		//ig.game.entityGrid[x/ig.game.tileSize][y/ig.game.tileSize] = undefined;
	},
        
        update: function() {
            if (this.cdcount >= this.cooldown) {
                
                // find closest attacker and shoot it
                var a = ig.game.attackers;
                if (a.length > 0) {
                    for (var i = 0; i < a.length; i++) {
                        //var dist = this.distance(a[i].pos.x,a[i].pos.y,this.pos.x+ig.game.tileSize/2,this.pos.y+ig.game.tileSize/2);
                        var dist = this.distanceTo(a[i]);
                        if (dist < ig.game.tileSize/2) {
                            a[i].hurt(this.damage);
                        }
                    }
                }
                
            }
            
            this.cdcount++;
        }
});

});