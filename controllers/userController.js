const userService = require('../services/userServices');

async function getUser(req, res) {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({user, geoLocation: req.geoLocation});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getUser };