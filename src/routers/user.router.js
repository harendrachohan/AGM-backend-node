const express = require('express');
const userController = require('../controllers/user.controller');
const {superAdminAuth, adminAuth, userAuth} = require('../middlewares/jwtMiddleware')
const {imageUpload} = require('../middlewares/fileMiddleware')
const router = express.Router();


//Super admin and admin middlware
router.use(adminAuth);
router.get('/', userController.getAllProfile);
router.get('/pdf/:id', userController.profilePdfGenerate);
router.post('/',userController.add);
router.get('/search-log/',userController.getProfileSearchLogs);

router.get('/get-all', userController.getAll);
router.post('/upload',imageUpload.single('file'), userController.imageUpload);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);


router.use(superAdminAuth);
router.delete('/:id', userController.delete);


module.exports = router
