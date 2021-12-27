var roles = {};

var MakeRoles = function()
{
    roles = {};
    for (var i in Game.creeps)
    {
        var mem = Game.creeps[i].memory;
        if (mem.hasOwnProperty("role") && mem.hasOwnProperty("room"))
        {
            var role = mem.role + ':' + mem.room;
            if (!roles.hasOwnProperty(role))
                roles[role] = 1;
            else
                roles[role] = roles[role] + 1;
        }
    }
}

var RoleCount = function(role)
{
    if (!roles.hasOwnProperty(role))
        return 0;
    return roles[role];
}

var RoleCountLog = function()
{
    var arr = []
    for (var i in roles)
        arr.push(i + ' ' + roles[i]);
    arr.sort();
    for (i = 0; i < arr.length; i++)
        console.log(arr[i]);
}

var Create = function(spawn, role, room, count, skills)
{
    if (RoleCount(role + ':' + room) < count)
    {
        var name = role + spawn.memory["nameindex"];
        spawn.memory["nameindex"] = spawn.memory["nameindex"] + 1;
        if (spawn.spawnCreep(skills, name) == 0)
        {
            var creep = Game.creeps[name];
            creep.memory.role = role;
            creep.memory.spawn = spawn.id;
            creep.memory.room = room;
        }
        return false;
    }
    return true;
}

var roleSpawn =
{
    run: function(spawn)
    {
        MakeRoles();
        if (Create(spawn, "harvester", "W7N8", 2, [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY]))
        if (Create(spawn, "harvester", "W8N8", 12, [WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY]))
        if (Create(spawn, "harvester", "W7N9", 12, [WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY]))
        if (Create(spawn, "builder", "W7N8", 5, [WORK, WORK, MOVE, MOVE, CARRY, CARRY]))
        if (Create(spawn, "repair", "W7N8", 2, [WORK, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY]))
        if (Create(spawn, "controllerUpdater", "W7N8", 1, [WORK, MOVE, CARRY]))
        Create(spawn, "my", "W7N8", 0, [WORK, MOVE, MOVE, CARRY]);

        RoleCountLog();
    }
};

module.exports = roleSpawn;
