const express = require('express');
const authController = require('../controllers/auth.controller');
const {superAdminAuth,} = require('../middlewares/jwtMiddleware')
const router = express.Router();


//Import admin and super admin
// router.post('/import-admin/', userController.createSuperAdmin);
// router.post('/import-super-admin/', userController.createSuperAdmin);

//login APIS
// router.post('/login/', authController.login);
// router.post('/admin/login/' , authController.adminLogin);
router.post('/super-admin/login/', authController.superAdminLogin);

router.use(superAdminAuth)
router.get('/super-admin/get', authController.superAdminGet);


module.exports = router
