const contactService = require('../services/contactService');
const errorHandlers = require('../utils/errorHandlers');

exports.identifyContact = async (req, res) => {
    try {
        const { email, phoneNumber } = req.body;
        const result = await contactService.processContact(email, phoneNumber);
        res.status(200).json(result);
    } catch (error) {
        errorHandlers.handleError(res, error, 'Internal Server Error');
    }
};