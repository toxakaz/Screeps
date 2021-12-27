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
            var spawn = decode.spawn(creep).room.find(FIND_STRUCTURES, { filter: {structureType: STRUCTURE_CONTAINER} });

            for (var i in spawn)
            {
                spawn = spawn[i];
                break;
            }

            if (spawn == undefined)
                spawn = decode.spawn(creep);

            var dif;
            if ((spawn.memory == undefined) || !spawn.memory.hasOwnProperty("minres"))
            {
                if (spawn.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
                    dif = 0;
                else
                    dif = 1;
            }
            else
                dif = spawn.store[RESOURCE_ENERGY] - spawn.memory["minres"];
            if(dif > 0)
            {
                if (creep.withdraw(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(spawn, {reusePath: 0});
            }
            else
                creep.moveTo(Game.flags.AFK, {reusePath: 0});

            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
                creep.memory.fill = false;
        }
        else
        {
            var controler = decode.room(creep).controller;
            if (creep.upgradeController(controler) == ERR_NOT_IN_RANGE)
                creep.moveTo(controler, {reusePath: 0});
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
                creep.memory.fill = true;
        }
    }
};

module.exports = roleControllerUpdater;
