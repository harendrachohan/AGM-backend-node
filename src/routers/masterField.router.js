const express = require('express');
const masterFieldController = require('../controllers/masterField.controller');
const {superAdminAuth,} = require('../middlewares/jwtMiddleware')
const router = express.Router();

//Super admin middlware
router.use(superAdminAuth);

router.post('/', masterFieldController.add);
router.get('/', masterFieldController.getAll);
router.get('/:id', masterFieldController.getById);
router.put('/:id', masterFieldController.update);
router.delete('/:id', masterFieldController.delete);

module.exports = router
