var roleHarvester = require('role.harvester');
var decode = require('creep.decode');
var roomCheck = require('roomCheck');
var roleControllerUpdater = require('role.controllerUpdater');

var randomProperty = function (obj)
{
    var keys = Object.keys(obj);
    return obj[keys[ keys.length * Math.random() << 0]];
}

var brokenId = function(site)
{
    if (site == undefined)
        return 1;
    if ((site.hits == undefined) || (site.hitsMax == undefined))
        return 1;
    if (site.hits == site.hitsMax)
        return 1;
    return site.hits / site.hitsMax;
}

var findSite = function(creep)
{
    var sites = decode.room(creep).find(FIND_STRUCTURES);
    if (sites == undefined)
        return undefined;

    var min = 1;
    var site = undefined;

    for (var i in sites)
    {
        var s = sites[i];
        if ((s.hits == undefined) || (s.hitsMax == undefined))
            continue;
        if (min > brokenId(s))
        {
            min = brokenId(s);
            site = s;
        }
    }

    if (brokenId(site) == 1)
        return undefined;
    return site;
}

var roleRepair =
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
            site = findSite(creep);
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
                site = findSite(creep);
                if (site == undefined)
                    creep.memory.dist = 0;
                else
                    creep.memory.dist = site.id;
            }
            else if (brokenId(site) == 1)
            {
                site = findSite(creep);
                if (site == undefined)
                    creep.memory.dist = 0;
                else
                    creep.memory.dist = site.id;
            }
        }

        if (site == undefined)
            roleControllerUpdater.run(creep);
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
            if (creep.repair(site) == ERR_NOT_IN_RANGE)
                creep.moveTo(site);
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
                creep.memory.fill = true;
        }
    }
};

module.exports = roleRepair;
