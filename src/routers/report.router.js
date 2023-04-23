const express = require('express');
const userController = require('../controllers/user.controller');
const {superAdminAuth, adminAuth, userAuth} = require('../middlewares/jwtMiddleware')
const router = express.Router();

//Super admin and admin middlware
router.use(adminAuth);
router.get('/', userController.report);
router.get('/login-history', userController.getLoginHistory);



module.exports = router
