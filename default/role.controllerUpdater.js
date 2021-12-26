var decode = require('creep.decode');
var roomCheck = require('roomCheck');
var roleHarvester = require('role.harvester');

var roleControllerUpdater =
{
    run: function(creep)
    {
        if (!creep.memory.hasOwnProperty("fill"))
            creep.memory.fill = true;
        if (creep.memory.fill)
        {
            if (!roomCheck.check(creep))
                return;
            var spawn = decode.spawn(creep);
            var dif = spawn.store[RESOURCE_ENERGY] - spawn.memory["minres"];
            if(dif > 0)
            {
                if (creep.withdraw(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(spawn);
            }
            else
                creep.moveTo(Game.flags.AFK);
            
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
                creep.memory.fill = false;
        }
        else
        {
            var controler = decode.room(creep).controller;
            if (creep.upgradeController(controler) == ERR_NOT_IN_RANGE)
                creep.moveTo(controler);
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
                creep.memory.fill = true;
        }
    }
};

module.exports = roleControllerUpdater;