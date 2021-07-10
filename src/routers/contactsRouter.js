const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contactsController');

router.get('/getContacts/:id', contactsController.getContacts);
router.get('/getContact/:id', contactsController.getContact);
router.post('/insertContact/:id', contactsController.insertContact);
router.put('/updateContact/:id', contactsController.updateContact);
router.delete('/deleteContact/:id', contactsController.deleteContact);

module.exports = router;
