const cacheService = require('./cacheService');
const User = require('../models/user');

async function getUserById(id) {
    const cachedUser = cacheService.get(id);
    if (cachedUser) {
        return cachedUser;
    }

    const user = await User.findById(id);
    if (user) {
        cacheService.set(id, user);
    }
    return user;
}

module.exports = { getUserById };