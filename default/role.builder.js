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
            var spawn = decode.spawn(creep);
            var dif = spawn.store[RESOURCE_ENERGY] - spawn.memory["minres"];
            if (dif > 0)
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
            if (creep.build(site) == ERR_NOT_IN_RANGE)
                creep.moveTo(site);
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
                creep.memory.fill = true;
        }
    }
};

module.exports = roleBuilder;
