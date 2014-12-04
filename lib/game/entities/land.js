ig.module(
	'game.entities.land'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityLand = ig.Entity.extend({
	
	size: {x:48, y:48},
	collides: ig.Entity.COLLIDES.FIXED,
	
	animSheet: new ig.AnimationSheet( 'media/tileSet.png', 48, 48 ),
	
	type: 'land',
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.type = 'land';
		
		this.addAnim( 'idle', 1, [2] );
	}
});

});