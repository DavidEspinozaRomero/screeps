
// Variables
const bodyStorage = {
	"tier1": {
		harvester: [MOVE, CARRY, WORK],
		builder: [MOVE, CARRY, MOVE, CARRY, WORK],
		upgrader: [MOVE, CARRY, WORK],
		miner: [WORK, MOVE, WORK, MOVE],
		carrier: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY]
	},
	"tier2": {}
}

// Functions
function setOptions(role) {
	return {
		memory: {
			role,
			isWorking: false,
			isFull: false,
		}
	}
}

function getName(role) {
	return role + Game.time;
}

function getBody(tier, role) {
	return bodyStorage[tier][role];
}

function getSourcesBySpawn(spawnName = 'master') {
	return Game.spawns[spawnName].room.find(FIND_SOURCES)
}

function getEnergyAvailable(spawnName = 'master') {
	try {
		return Game.spawns[spawnName].room.energyAvailable
	} catch (err) {
		errorHandler(err, 'getEnergyAvailable')
	}
}

function getEnergyCapacityAvailable(spawnName = 'master') {
	return Game.spawns[spawnName].room.energyCapacityAvailable
}

function getSources(creep) {
	const sources = creep.room.find(FIND_SOURCES);
	return sources;
}

function getEnergyStructures(creep) {
	const targets = creep.room.find(FIND_STRUCTURES, {
		filter: (structure) => structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN
	})
	return targets;
}


function getEnergyStructuresWithFreeCapacity(creep) {
	const targets = creep.room.find(FIND_STRUCTURES, {
		filter: (structure) => {
			return (structure.structureType == STRUCTURE_EXTENSION ||
				structure.structureType == STRUCTURE_SPAWN) &&
				structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
		}
	});
	return targets;
}




function errorHandler(err, site = 'UK') {
	console.log('Utils', site)
	console.log(err)
}

function handleCommonCreepError(creep, err, target) {
	if (!target) return console.log('no target');
	switch (err) {
		case OK:
			break;

		case ERR_NOT_OWNER:
			break;

		case ERR_BUSY:
			break;
		case ERR_NOT_ENOUGH_RESOURCES:
			break;
		case ERR_INVALID_TARGET:
			break;
		case ERR_NOT_IN_RANGE:
			creep.moveTo(target)
			break;
		case ERR_NO_BODYPART:
			break;
	}
}

module.exports = {
	getName,
	getBody,
	getSources,
	getSourcesBySpawn,
	getEnergyStructuresWithFreeCapacity,
	getEnergyAvailable,
	getEnergyCapacityAvailable,
	handleCommonCreepError
};