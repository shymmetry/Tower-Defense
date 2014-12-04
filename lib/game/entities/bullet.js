ig.module(
	'game.entities.bullet'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityBullet = ig.Entity.extend({
	
	size: {x:10, y:10},
	collides: ig.Entity.COLLIDES.NEVER,
	
	animSheet: new ig.AnimationSheet( 'media/bullet.png', 10, 10 ),
	
        target: null,
        vel: 2,
	damage: -1,
        
	init: function( x, y, settings ) {
		this.parent( x - this.size.x/2, y - this.size.y/2, settings );
		
		this.addAnim( 'idle', 1, [0] );
	},
        
        reset: function( x, y, settings ) {
            this.parent( x, y, settings );
        },
        
        update: function() {
            if (this.target != null) {
                // move
                if (ig.game.attackers.indexOf(this.target) >= 0) {
                    var xdist = this.pos.x - (this.target.pos.x + ig.game.tileSize/2);
                    var ydist = this.pos.y - (this.target.pos.y + ig.game.tileSize/2);
                    
                    var ang = Math.atan(ydist/xdist);
                    
                    var xvel = Math.cos(ang) * this.vel;
                    var yvel = Math.sin(ang) * this.vel;
                    
                    if (this.pos.x < (this.target.pos.x + ig.game.tileSize/2)) {
                        this.pos.x += xvel;
			this.pos.y += yvel;
                    }
                    else {
                        this.pos.x -= xvel;
			this.pos.y -= yvel;
                    }   
                }
                else
                {
                    // target has left the map
                    this.kill();
                    return;
                }
                
                // check if reached target
                if (this.distanceTo(this.target) < ig.game.tileSize/2) {
                     this.target.hurt(this.damage);
                     this.kill();
                }
            }
        }
        
});

});





















