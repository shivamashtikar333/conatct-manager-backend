const express = require('express');
const router = express.Router();
const {getContacts,createContact,getContact,updateContact,deleteContact} = require('../controllers/contactController');
const validateToken = require('../middleware/validateTokenHandle');


router.use(validateToken);
router.route('/').get(getContacts);

// Get single contact

router.route('/:id').get(getContact)


router.route('/').post(createContact);

router.route('/:id').put(updateContact);



router.route('/:id').delete(deleteContact);

module.exports = router;