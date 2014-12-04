ig.module(
	'game.entities.towers.tower'
)
.requires(
	'impact.entity',
        'game.game',
        'game.entities.bullet'
)
.defines(function(){

EntityTower = ig.Entity.extend({
	
	size: {x:48, y:48},
	collides: ig.Entity.COLLIDES.FIXED,
	
	animSheet: new ig.AnimationSheet( 'media/paddle-red.png', 48, 48 ),
	
        cooldown: -1,
        cdcount: -1,
        radius: -1,
        damage: -1,
        type: 'tower',
        cost: -1,
        
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 1, [0] );
                
                this.cooldown = this.cdcount = 200;
                this.radius = 300;
                this.damage = 10;
                
                this.cost = buildingCosts[this.type];
	},
        
        update: function() {
            if (this.cdcount >= this.cooldown) {
                
                // find closest attacker and shoot it
                var a = ig.game.attackers;
                if (a.length > 0) {
                    var bestDist = 99999;
                    var bestA = null;
                    for (var i = 0; i < a.length; i++) {
                        //var dist = this.distance(a[i].pos.x,a[i].pos.y,this.pos.x+ig.game.tileSize/2,this.pos.y+ig.game.tileSize/2);
                        var dist = this.distanceTo(a[i]);
                        if (dist < bestDist) {
                            bestDist = dist;
                            bestA = a[i];
                        }
                    }
                    
                    // if closest attacker in range, shoot
                    if (bestDist < this.radius) {
                        var bullet = ig.game.spawnEntity( EntityBullet , this.pos.x + ig.game.tileSize/2, this.pos.y + ig.game.tileSize/2, null);
                        bullet.target = bestA;
                        bullet.damage = this.damage;
                        
                        this.cdcount = 0;
                    }
                }
                
            }
            
            this.cdcount++;
        },
        
        distance: function(x1,y1,x2,y2) {
            return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
        }
});

});