/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creepActions');
 * mod.thing == 'a thing'; // true
 */

// A shorthand to Memory.creeps[creep.name]. You can use it for quick access the creep’s specific memory data object

module.exports = {
    setMemory: (key, value) => {
        creep.memory[key] = value;
    },
    deleteMemory: (key) => {
        delete creep.memory[key]
    },

    /*
    if(creep.store[RESOURCE_ENERGY] < creep.store.getCapacity()) {
        goHarvest(creep);
    }
    */

    attack: () => {
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    },

    attackController: () => {
        if (creep.room.controller && !creep.room.controller.my) {
            if (creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};