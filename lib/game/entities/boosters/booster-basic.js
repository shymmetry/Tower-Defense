ig.module(
	'game.entities.boosters.booster-basic'
)
.requires(
	'game.entities.boosters.booster'
)
.defines(function(){

EntityBoosterBasic = EntityBooster.extend({
	
	animSheet: new ig.AnimationSheet( 'media/basicBoosterButton.png', 48, 48 ),
	
	bonus: 10,
	
        init: function(x, y, settings) {
	    this.type = 'booster-basic';
	    
            this.parent(x, y, settings);
            
	    this.addAnim( 'idle', 1, [0] );
	    
	    ig.game.extraRoundBonus += this.bonus;
        },
	
	kill: function() {
		ig.game.extraRoundBonus -= this.bonus;
		
		this.parent();
	}
});

});