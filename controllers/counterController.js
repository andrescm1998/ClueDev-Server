const Counter = require('../models/Counter');

const addCounter = async (data) => {
    const counter = await Counter.create(data)
    const conflicts = await counter.checkConflicts();
    return conflicts
}

const getCounters = async (room) => {
    const repoId = parseInt(room)
    const counters = await Counter.getAllByRepo(repoId);
    console.log(counters)
    return counters
}

const deleteCounter = async (data) => {
    const counter = await Counter.getOneByUser(data)
    await counter.destroy()
}

module.exports = { addCounter, deleteCounter, getCounters }
