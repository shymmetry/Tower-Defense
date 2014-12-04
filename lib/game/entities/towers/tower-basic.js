ig.module(
	'game.entities.towers.tower-basic'
)
.requires(
	'game.entities.towers.tower'
)
.defines(function(){

EntityTowerBasic = EntityTower.extend({
	
	animSheet: new ig.AnimationSheet( 'media/basicTowerButton.png', 48, 48 ),
	
        init: function(x, y, settings) {
	    this.type = "tower-basic";
	    
            this.parent(x, y, settings);
            
	    this.addAnim( 'idle', 1, [0] );
	    
            this.cooldown = this.cdcount = 5;
            this.radius = 100;
            this.damage = 1;
        }
});

});