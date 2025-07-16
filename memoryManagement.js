function cleanMemory(alive) {
  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      const role = Memory.creeps[name].role;
      alive[role]--;
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
      console.log(role, alive[role]);
    }
  }
}

function setMemory(key, value) {
  Memory[key] = value;
}
function deleteMemory(key, value) {
  delete Memory[key]
}
function getMemory(key) {
  return Memory[key];
}

// function getMemoryOfCreep() {}

function memoryConfig(energySources) {
  if (!Memory.energySources) {
    Memory.energySources = energySources;
    Memory.energySources.forEach(source => { source.workerID = undefined });
  }
}

module.exports = {
  cleanMemory,
  setMemory,
  getMemory,
  deleteMemory,
  memoryConfig
}