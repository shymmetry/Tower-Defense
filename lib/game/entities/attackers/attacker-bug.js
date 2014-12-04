ig.module(
	'game.entities.attackers.attacker-bug'
)
.requires(
	'game.entities.attackers.attacker'
)
.defines(function(){

EntityAttackerBug = EntityAttacker.extend({
	
	animSheet: new ig.AnimationSheet( 'media/bug1left.png', 48, 48 ),
	
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            
            this.health = 100;
            this.reward = 5;
        }
});

});