var creepDecode =
{
    spawn: function(creep)
    {
        var spawnid = creep.memory.spawn;
        if (spawnid == undefined)
            return undefined;
        else
            return Game.getObjectById(spawnid);
    },
    room: function(creep)
    {
        var roomid = creep.memory.room;
        return Game.rooms[roomid];
    }
};

module.exports = creepDecode;