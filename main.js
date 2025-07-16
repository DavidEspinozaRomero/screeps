// IMPORTS
const { cleanMemory, getBody, getName, getSourcesBySpawn } = require('utils');
const roleHarvester = require('role.harvester')
const roleUpgrader = require('role.upgrader')
const roleBuilder = require('role.builder')

// VARIABLES
let actualTier = "tier" + 1;
const spawnerName = 'Spawn1'
const spawner = Game.spawns[spawnerName]
const [energy1, energy2, energy3] = getSourcesBySpawn(spawnerName)
// console.log(energy1);

// Numero Actual the creeps y numero deseado
let POP = {
	isFull: false,
	alive: {},
	expected: {
		// harvester: 2,
		// builder: 1,
		// upgrader:5,
		miner: 0,
		carrier: 0,
		// soldier:8,
		// archers:0,
	},
}
const ROLES = Object.keys(POP.expected);
Object.entries(POP.expected).forEach(([role, minWorkers]) => {
	POP.alive[role] = _.filter(Game.creeps, (creep) => creep.memory.role == role).length;
});


// FUNCTIONS

module.exports.loop = function () {
	cleanMemory()

	if (!POP.isFull && !spawner.spawning) {
		for (const role of ROLES) {
			console.log(role, POP.alive[role], POP.expected[role], POP.alive[role] >= POP.expected[role]);
			// todo: improve having a flag to know when to check POP.isFull
			if (POP.alive[role] < POP.expected[role]) {
				spawner.spawnCreep(getBody(actualTier, role), getName(role), { memory: { role } })
				POP.alive[role]++;
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