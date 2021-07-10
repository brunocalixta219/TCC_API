const cepPromise = require('cep-promise');
const Address = require('../models/Address');

exports.getCEP = async (req, res) => {
    try {
        const { cep } = req.query;
        const address = await Address.findOne({ cep });

        if (address) return res.status(200).send(address);

        const { street, state, city, neighborhood } = await cepPromise(cep);

        const newAddress = new Address({
            cep,
            street,
            neighborhood,
            city,
            state,
        });
        await newAddress.save();

        res.status(201).send(newAddress);
    } catch (error) {
        res.status(400).send(error.message);
    }
};
