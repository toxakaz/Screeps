var roleMydrone =
{
    run: function(creep)
    {
        /*
        if (creep.store.getFreeCapacity() > 0)
        {
            var spawn = creep.memory.spawn;
            var dif = spawn.store[RESOURCE_ENERGY] - spawn.memory["minres"];
            if(dif > 0 && creep.withdraw(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                creep.moveTo(spawn);
        }
        else
        {
            var controler = creep.memory.room.controller;
            if (creep.upgradeController(controler) == ERR_NOT_IN_RANGE)
                creep.moveTo(controler);
        }
        */
        
        console.log(creep.memory.spawn.spawnCreep());
    }
};

module.exports = roleMydrone;