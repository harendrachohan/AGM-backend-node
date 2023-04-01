const express = require('express');
const authController = require('../controllers/auth.controller');
const {superAdminAuth,} = require('../middlewares/jwtMiddleware')
const router = express.Router();

//login APIS
router.post('/admin/login', authController.adminLogin);
router.post('/login', authController.login);
// router.post('/logout', authController.login);

module.exports = router
