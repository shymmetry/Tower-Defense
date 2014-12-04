ig.module(
	'game.entities.blockers.blocker-basic'
)
.requires(
	'game.entities.blockers.blocker'
)
.defines(function(){

EntityBlockerBasic = EntityBlocker.extend({
	
	animSheet: new ig.AnimationSheet( 'media/basicBlockerButton.png', 48, 48 ),
	
        init: function(x, y, settings) {
	    this.type = 'blocker-basic';
	    
            this.parent(x, y, settings);
            
	    this.addAnim( 'idle', 1, [0] );
        }
});

});