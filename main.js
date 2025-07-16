// IMPORTS
const { getBody, getName, getSourcesBySpawn, } = require('utils');
const { cleanMemory,
	setMemory,
	getMemory,
	deleteMemory, memoryConfig } = require('memoryManagement');
const roleHarvester = require('role.harvester')
const roleUpgrader = require('role.upgrader')
const roleBuilder = require('role.builder')

// VARIABLES
let actualTier = "tier" + 1;
const spawnerName = 'Spawn1'
const spawner = Game.spawns[spawnerName]

// Initial Configs
memoryConfig(getSourcesBySpawn(spawnerName))

// Numero Actual the creeps y numero deseado
let POP = {
	isFull: false,
	alive: {},
	expected: {
		miner: 0,
		carrier: 0,
		// builder: 1,
		// upgrader:5,
		// soldier:8,
		// archers:0,
	},
}
const ROLES = Object.keys(POP.expected);
POP.expected.miner = Memory.energySources.length;
Object.entries(POP.expected).forEach(([role, minWorkers]) => {
	POP.alive[role] = _.filter(Game.creeps, (creep) => creep.memory.role == role).length;
});


// FUNCTIONS

module.exports.loop = function () {
	cleanMemory(POP.alive)

	if (!POP.isFull && !spawner.spawning) {
		let isSpawnerWorking = false
		for (const role of ROLES) {
			// console.log(role, POP.alive[role], POP.expected[role], POP.alive[role] >= POP.expected[role]);
			// todo: improve having a flag to know when to check POP.isFull
			if (isSpawnerWorking) return;
			if (POP.alive[role] < POP.expected[role]) {
				// if is miner asing a energysource id
				let workingPlace;
				if (role == "miner") {
					// check energy sourse free
					workingPlace = Memory.energySources.find((source) => !source.workerID)
				}
				spawner.spawnCreep(getBody(actualTier, role), getName(role), { memory: { role, isWorking: false, workingPlaceID: workingPlace.id } })
				POP.alive[role]++;
				isSpawnerWorking = true
			}
		}
	}

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
			case 'miner':
				let { isWorking, workingPlaceID } = creep.memory;

				if (creep.ticksToLive < 2 && workingPlaceID) {
					Memory.energySources.find((source) => source.id === workingPlaceID).workerID = ''
					return
				}
				if (creep.ticksToLive > 100) {
					Memory.energySources.find((source) => source.id === workingPlaceID).workerID = creep.id
				}
				if (!isWorking && creep.ticksToLive > 2) {
					// check reason
					// asign role
					// role = "miner"
					// asign workingPlace
					if (!workingPlaceID) {
						source = Memory.energySources.find(({ isFree }) => isFree)
						console.log(source);

						source.isFree = false
						workingPlaceID = source.id
					}
					isWorking = true
				}

				// Mine energy source
				const workingPlace = Game.getObjectById(workingPlaceID);
				if (creep.harvest(workingPlace) == ERR_NOT_IN_RANGE) {
					creep.moveTo(workingPlace, { visualizePathStyle: { stroke: '#ffaa00' } });
				}
				// if (isWorking) {

				// }

				// else {
				// 	const targets = creep.room.find(FIND_STRUCTURES, {
				// 		filter: (structure) => {
				// 			return (structure.structureType == STRUCTURE_EXTENSION ||
				// 				structure.structureType == STRUCTURE_SPAWN ||
				// 				structure.structureType == STRUCTURE_TOWER) &&
				// 				structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
				// 		}
				// 	});
				// 	if (targets.length > 0) {
				// 		if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				// 			creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
				// 		}
				// 	}
				// }
				break;
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


/* Gestion de aldea
- spawner creeps
	- roles (default, builder, miner, upgrader, carrier)
	- 
- creeps do tasks
- manage population

*/