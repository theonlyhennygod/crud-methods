const NodeCache = require('node-cache');
const cache = new NodeCache();

function set(key, value, ttl = 3600) {
    cache.set(key, value, ttl);
}

function get(key) {
    return cache.get(key);
}

function del(key) {
    cache.del(key);
}

module.exports = { set, get, del };