const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contactsController');

router.get('/getContacts/:id', contactsController.getContacts);
router.get('/getContact/:id', contactsController.getContact);
router.post('/insertContact/:id', contactsController.insertContact);
router.put('/updateDataContact/:id', contactsController.updateDataContact);
router.delete('/deleteContact/:id', contactsController.deleteContact);

module.exports = router;
