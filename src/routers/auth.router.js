const express = require('express');
const authController = require('../controllers/auth.controller');
const {superAdminAuth,} = require('../middlewares/jwtMiddleware')
const router = express.Router();

//login APIS
router.post('/super-admin/login', authController.superAdminLogin);
router.post('/login/', authController.login);

module.exports = router
