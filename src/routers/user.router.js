const express = require('express');
const userController = require('../controllers/user.controller');
const {superAdminAuth, adminAuth, userAuth} = require('../middlewares/jwtMiddleware')
const router = express.Router();


//Super admin and admin middlware
router.use(adminAuth);
router.get('/profile/', userController.getAllProfile);
router.get('/profile/pdf/:id', userController.profilePdfGenerate);
router.post('/', userController.add);
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);

router.use(superAdminAuth);
router.delete('/:id', userController.delete);


module.exports = router
