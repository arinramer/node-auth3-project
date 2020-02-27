const db = require('../data/dbConfig.js');

module.exports = {
    add,
    findBy,
    getUsers
}

function add(body) {
    return db('users').insert(body);
}

function getUsers() {
    return db('users');
}

function findBy(filter) {
    return db('users').where(filter)
}