ig.module(
	'game.entities.traps.trap-basic'
)
.requires(
	'game.entities.traps.trap'
)
.defines(function(){

EntityTrapBasic = EntityTrap.extend({
	
	animSheet: new ig.AnimationSheet( 'media/basicTrapButton.png', 48, 48 ),
	
        init: function(x, y, settings) {
	    this.type = "trap-basic";
            
            this.parent(x, y, settings);
            
	    this.addAnim( 'idle', 1, [0] );
	    
            this.cooldown = this.cdcount = 5;
            this.damage = 1;
        }
});

});