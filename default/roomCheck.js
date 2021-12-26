var decode = require('creep.decode');

var roomCheck =
{
    check: function(creep)
    {
        var room = decode.room(creep);
        if (room != creep.room)
        {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.room));
            return false;
        }
        return true;
    }
};

module.exports = roomCheck;