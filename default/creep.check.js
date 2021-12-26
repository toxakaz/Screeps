var creepCheck =
{
    run: function(creep)
    {
        if (!creep.memory.hasOwnProperty("role"))
        {
            //creep.suicide()
            return false;
        }
        if (!creep.memory.hasOwnProperty("room"))
        {
            //creep.suicide()
            return false;
        }
        return true;
    }
};

module.exports = creepCheck;