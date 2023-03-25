const express = require('express');
const adminController = require('../controllers/admin.controller');
const {superAdminAuth} = require('../middlewares/jwtMiddleware');
const router = express.Router();

//Super admin and admin middlware
router.use(superAdminAuth);

router.post('/', adminController.add);
router.get('/', adminController.getAll);
router.get('/:id', adminController.getById);
router.put('/:id', adminController.update);
router.delete('/:id', adminController.delete);

module.exports = router
