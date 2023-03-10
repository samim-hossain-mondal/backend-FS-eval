const express = require('express');
const router = express.Router();

const controllers = require('../controllers/contents.controllers.');

router.get('/', controllers.getAllContents);
router.post('/', controllers.createContent);
router.post('/:name', controllers.addContentField);
router.put('/:name', controllers.updateContentField);
router.delete('/:name/:fieldname', controllers.deleteContentField);
router.get('/:name', controllers.getAllFieldsByName);
router.patch('/:name/:fieldname', controllers.editContentField);

module.exports = router;