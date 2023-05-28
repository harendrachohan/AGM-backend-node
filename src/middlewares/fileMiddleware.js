const multer = require('multer');
const path = require('path');

/***
 * Upload File directory
 */
const imageStorage = multer.diskStorage({   
    destination: 'src/public/uploads', 
      filename: (req, file, cb) => {
          cb(null, file.fieldname + '_' + Date.now() 
             + path.extname(file.originalname))
    }
});

/*** 
 * Image file Upload
*/
exports.imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 2000000 // 2000000 Bytes = @ MB
  },
  fileFilter(req, file, cb) {
    // if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {       
    //   req.fileValidationError = 'Only image files are allowed!';
    //   return cb(new Error('Only image files are allowed!'), false);
    //  }
   cb(undefined, true)
  }
  
})

