ig.module(
	'game.buildingVars'
)
.requires(
	'game.entities.towers.tower-basic',
	'game.entities.traps.trap-basic',
	'game.entities.boosters.booster-basic',
	'game.entities.blockers.blocker-basic'
)
.defines(function(){
   
    builderLevels = {    
        'empty': ['tower-basic', 'trap-basic', 'blocker-basic', 'booster-basic'],
	'tower-basic': [null,null,null,null],
	'trap-basic': [null,null,null,null],
	'blocker-basic': [null,null,null,null],
	'booster-basic': [null,null,null,null]
    };
    
    buildingCosts = {
        'tower-basic': 50,
        'trap-basic': 50,
        'booster-basic': 50,
	'blocker-basic': 10
    };
    
    buildingImgs = {
	'tower-basic': 'media/basicTowerButton.png',
	'trap-basic': 'media/basicTrapButton.png',
	'booster-basic': 'media/basicBoosterButton.png',
	'blocker-basic': 'media/basicBlockerButton.png'
    };
    
    buildingClass = {
	'tower-basic': EntityTowerBasic,
	'trap-basic': EntityTrapBasic,
	'booster-basic': EntityBoosterBasic,
	'blocker-basic': EntityBlockerBasic
    };
    
    noblockBuildings = ['trap-basic'];
});