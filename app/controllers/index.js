const models = require('../database/models');

const getUsers = async (ctx) => {
    const users = await models.User.findAll();
    ctx.body = users;
}

module.exports = {
    getUsers
}