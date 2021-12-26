var creepCheck = require('creep.check');
var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleMydrone = require('role.mydrone');
var roleControllerUpdater = require('role.controllerUpdater');
var roleRepair = require('role.repair');

var manage =
{
    run: function(creep)
    {
        if (!creepCheck.run(creep))
            return;
        switch(creep.memory["role"])
        {
            case "harvester":
                roleHarvester.run(creep);
                break;
            case "builder":
                roleBuilder.run(creep);
                break;
            case "mydrone":
                //roleHarvester.run(creep);
                //roleMydrone.run(creep);
                break;
            case "controllerUpdater":
                roleControllerUpdater.run(creep);
                break;
            case "repair":
                roleRepair.run(creep);
                break;
        }
    }
};

module.exports = manage;
