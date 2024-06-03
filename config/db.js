const config = require('config');
// const { mongo } = require('mongoose');
const db = config.get('mongoURI');

module.export = {
    mongoURI: db
}