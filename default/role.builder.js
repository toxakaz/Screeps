var roleHarvester = require('role.harvester');
var decode = require('creep.decode');
var roomCheck = require('roomCheck');
var roleControllerUpdater = require('role.controllerUpdater');
var roleRepair = require('role.repair');

var randomProperty = function (obj) {
    var keys = Object.keys(obj);
    return obj[keys[ keys.length * Math.random() << 0]];
}

var roleBuilder =
{
    run: function(creep)
    {
        if (!roomCheck.check(creep))
            return;


        if (!creep.memory.hasOwnProperty("fill"))
            creep.memory.fill = true;
        if (!creep.memory.hasOwnProperty("dist"))
            creep.memory.dist = 0;


        var site;
        if (creep.memory.dist == 0)
        {
            site = randomProperty(decode.room(creep).find(FIND_CONSTRUCTION_SITES));
            if (site == undefined)
                creep.memory.dist = 0;
            else
                creep.memory.dist = site.id;
        }
        else
        {
            site = Game.getObjectById(creep.memory.dist)
            if (site == undefined)
            {
                site = randomProperty(decode.room(creep).find(FIND_CONSTRUCTION_SITES));
                if (site == undefined)
                    creep.memory.dist = 0;
                else
                    creep.memory.dist = site.id;
            }
            else if (site.progressTotal == site.progress)
            {
                site = randomProperty(decode.room(creep).find(FIND_CONSTRUCTION_SITES));
                if (site == undefined)
                    creep.memory.dist = 0;
                else
                    creep.memory.dist = site.id;
            }
        }

        if (site == undefined)
            roleRepair.run(creep);
        else if (creep.memory.fill)
        {
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

            if (dif > 0)
            {
                var key = creep.withdraw(spawn, RESOURCE_ENERGY);
                if (key == ERR_NOT_IN_RANGE)
                    creep.moveTo(spawn, {reusePath: 0});
            }
            else
                creep.moveTo(Game.flags.AFK, {reusePath: 0});

            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
                creep.memory.fill = false;
        }
        else
        {
            if (creep.build(site) == ERR_NOT_IN_RANGE)
                creep.moveTo(site, {reusePath: 0});
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
                creep.memory.fill = true;
        }
    }
};

module.exports = roleBuilder;
