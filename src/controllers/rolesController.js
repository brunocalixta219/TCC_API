const Role = require('../models/Role');

exports.get = async (req, res) => {
    try {
        const roles = await Role.find().select(['_id', 'name']);
        res.send(roles);
    } catch (error) {
        res.sendStatus(400);
    }
};
