var decode = require('creep.decode');
var roomCheck = require('roomCheck');

var randomProperty = function (obj) {
    var keys = Object.keys(obj);
    return obj[keys[ keys.length * Math.random() << 0]];
}

var fillSpawn = function(creep)
{
    var spawn = decode.spawn(creep);
    if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
    {
        if(creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            creep.moveTo(spawn);
        return false;
    }
    return true;
}

var extFillId = function(ext)
{
    if (ext == undefined)
        return 1;
    if (ext.store == undefined)
        return 1;
    return ext.store.getUsedCapacity(RESOURCE_ENERGY) / ext.store.getCapacity(RESOURCE_ENERGY);
}

var findExt = function(creep)
{
    var ext = decode.spawn(creep).room.find(FIND_MY_STRUCTURES, { filter: {structureType: STRUCTURE_EXTENSION} });
    var min = 1;
    var str = undefined;
    for (var i in ext)
    {
        var k = extFillId(ext[i]);
        if (k < min)
        {
            min = k;
            str = ext[i];
        }
    }

    return str;
}

var fillExt = function(creep)
{
    if (findExt(creep) == undefined)
        return true;
    if (creep.memory.dir == 0)
        creep.memory.dir = findExt(creep).id;
    var ext = Game.getObjectById(creep.memory.dir);
    if (extFillId(ext) == 1)
    {
        ext = findExt(creep);
        if (extFillId(ext) == 1)
        {
            creep.memory.dir = 0;
            return true;
        }
        creep.memory.dir = ext.id;
    }

    if(creep.transfer(ext, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
        creep.moveTo(ext);
    return false;
}

var findCont = function(creep)
{
    var ext = decode.spawn(creep).room.find(FIND_STRUCTURES, { filter: {structureType: STRUCTURE_CONTAINER} });
    var min = 1;
    var str = undefined;
    for (var i in ext)
    {
        var k = extFillId(ext[i]);
        if (k < min)
        {
            min = k;
            str = ext[i];
        }
    }

    return str;
}

var fillCont = function(creep)
{
    if (findCont(creep) == undefined)
        return true;
    if (creep.memory.dir == 0)
        creep.memory.dir = findCont(creep).id;
    if ((findExt(creep) != undefined) || (decode.spawn(creep).store.getFreeCapacity(RESOURCE_ENERGY) > 0))
    {
        creep.memory.dir = 0;
        return false;
    }
    var ext = Game.getObjectById(creep.memory.dir);
    if (extFillId(ext) == 1)
    {
        ext = findCont(creep);
        if (extFillId(ext) == 1)
        {
            creep.memory.dir = 0;
            return true;
        }
        creep.memory.dir = ext.id;
    }

    if(creep.transfer(ext, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
        creep.moveTo(ext);
    return false;
}

var roleHarvester =
{
    run: function(creep)
    {
        if (!creep.memory.hasOwnProperty("mine"))
            creep.memory.mine = true;
        if (!creep.memory.hasOwnProperty("dir"))
            creep.memory.dir = 0;

        if(creep.memory.mine)
        {
            if (!roomCheck.check(creep))
                return;
            var room = decode.room(creep);
            if (room != creep.room)
                creep.moveTo(new RoomPosition(25, 25, creep.memory.room));
            else
            {
                var sources;
                if (creep.memory.dir == 0)
                {
                    sources = decode.room(creep).find(FIND_SOURCES);
                    creep.memory.dir = randomProperty(sources).id;
                }

                source = Game.getObjectById(creep.memory.dir);

                if(creep.harvest(source) == ERR_NOT_IN_RANGE)
                    creep.moveTo(source);
            }

            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0)
            {
                creep.memory.mine = false;
                creep.memory.dir = 0;
                return;
            }
        }
        else
        {
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0)
            {
                creep.memory.mine = true;
                creep.memory.dir = 0;
                return;
            }

            if (fillExt(creep))
            if (fillSpawn(creep))
            if (fillCont(creep))
            creep.moveTo(Game.flags.AFK);
        }
    }
};

module.exports = roleHarvester;
