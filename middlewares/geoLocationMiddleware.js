const geoip = require('geoip-lite');

function geoLocationMiddleware(req, res, next) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);

    if (geo) {
        req.geoLocation = geo;
    } else {
        req.geoLocation = { error: 'Geo-location not found' };
    }
    next();
}

module.exports = geoLocationMiddleware;