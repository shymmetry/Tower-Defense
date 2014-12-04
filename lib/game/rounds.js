ig.module(
	'game.rounds'
)
.requires(
        'game.entities.attackers.attacker-bug'
)
.defines(function(){

eab = EntityAttackerBug

rounds = [
    {bonus: 50, spawnTime:[2,2,2,1,1,1],
    spawnUnit:[eab, eab, eab, eab, eab, eab]},
    {bonus: 100, spawnTime:[1,1,1,1,1,1,1,1,1,1],
    spawnUnit:[eab,eab,eab,eab,eab,eab,eab,eab,eab,eab]},
    {bonus: 150, spawnTime:[.5,.5,.5,.5,.5,.5,5,.5,.5,.5,.5,.5,.5,.5,.5],
    spawnUnit:[eab,eab,eab,eab,eab,eab,eab,eab,eab,eab,eab,eab,eab,eab,eab]}
];

});

