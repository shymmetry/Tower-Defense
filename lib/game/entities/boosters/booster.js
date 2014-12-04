ig.module(
	'game.entities.boosters.booster'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityBooster = ig.Entity.extend({
	
	size: {x:48, y:48},
	collides: ig.Entity.COLLIDES.FIXED,
	
	animSheet: new ig.AnimationSheet( 'media/paddle-red.png', 48, 48 ),
	
        type: 'booster',
        cost: -1,
        
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 1, [0] );
                
                this.cost = buildingCosts[this.type];
	}
});

});