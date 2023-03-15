const express = require('express');
const userController = require('../controllers/user.controller');
const {superAdminAuth, adminAuth} = require('../middlewares/jwtMiddleware')
const router = express.Router();

//Super admin and admin middlware
router.use(superAdminAuth, adminAuth );

router.post('/', userController.add);
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);

module.exports = router
