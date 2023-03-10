const express = require('express');
const router = express.Router();
const controllers = require('../controllers/collections.controllers');

router.get('/:id', controllers.getCollectionById);
router.post('/:id', controllers.createCollection);
router.patch('/:id', controllers.updateCollectionField);
router.delete('/:id', controllers.deleteCollectionField);

module.exports = router;
