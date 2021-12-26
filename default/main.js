var creepManager = require('creep.manager');
var roleSpawn = require('role.spawn');

var newname = 1;
var s = '—';

module.exports.loop = function ()
{
    console.log();
    console.log();
    console.log();
    if (s == '—')
        s = '|';
    else
        s = '—';
        
    for(var name in Game.creeps)
    {
        creepManager.run(Game.creeps[name]);
    }
    for(var name in Game.spawns)
    {
        var spawn = Game.spawns[name];
        newname = newname + 1;
        roleSpawn.run(spawn, newname.toString());
    }
    
    console.log("all good " + s);
}