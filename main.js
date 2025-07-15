// IMPORTS
const { cleanMemory, getBody, getName } = require('utils');
const roleHarvester = require('role.harvester')
const roleUpgrader = require('role.upgrader')
const roleBuilder = require('role.builder')

// VARIABLES
const spawnerName = 'Spawn1'
const spawner = Game.spawns[spawnerName]

const numberForRole = {
    harvester: 2,
    builder: 1,
    // upgrader:5,
    miner: 0,
    carrier: 0,
    // soldier:8,
    // archers:0,
}


// FUNCTIONS

// creep parts ([string] body, string name, object opts

// spawner.spawnCreep([WORK, CARRY, MOVE], Game.time+'Worker1', {
//     memory: {role: 'harvester'}
// });
module.exports.loop = function () {
    cleanMemory()

    Object.entries(numberForRole).forEach(([role, minWorkers]) => {
        let numberAlive = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        if (numberAlive.length >= minWorkers) return;
        spawner.spawnCreep(getBody(1, role), getName(role), { memory: { role } })
    });

    if (spawner.spawning) {
        const spawningCreep = Game.creeps[spawner.spawning.name];
        spawner.room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            spawner.pos.x + 1,
            spawner.pos.y,
            { align: 'left', opacity: 0.8 });
    }

    for (let name in Game.creeps) {
        const creep = Game.creeps[name];

        switch (creep.memory.role) {

            case 'harvester':
                roleHarvester.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'soldier':
                roleSoldier.run(creep);
                break;
        }

    }
}


// var harvesters = _.filter(Game.creeps, {
//     memory: {role: 'harvester'}
// });

/* Gestion de aldea
- spawner creeps
    - roles (default, builder, miner, upgrader, carrier)
    - 
- creeps do tasks
- manage population

*/