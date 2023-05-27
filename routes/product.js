var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');

// Import the functions from UserController
const {validateProduct,validatePutProduct} = require('./../middleware/product-middleware')
const  { index,show,store,destroy,update,patch,search,uplodeImages} = require('./../controllers/productController');

/* GET home page. */
router.get('/', index);

/* Search. */
router.get('/search', search);

/* GET One Products. */
router.get('/:id', show);
const storage = multer.diskStorage({ 
    destination:  (req, file, cb) => {
        const ALLOWED_IMAGE = {
            'image/png': 'png',
            'image/jpeg': 'jpeg',
            'image/jpg': 'jpg'
        }
        error = null
        if(!ALLOWED_IMAGE[file.mimetype]){
            error = new Error('FileError')
        } 
      cb(error, `${__dirname}/../public/images`)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + path.extname(file.originalname))
    }
  })

const upload = multer({ storage })
/* POST PRODUCT */
router.post('/',[upload.single('thumbnail'),validateProduct],store);
/* add images PRODUCT */
router.put('/:id/images', upload.array('images') ,uplodeImages);
// DELETE PRODUCT
router.delete('/:id', destroy);
// UPDATE PRODUCT
router.put('/:id',[upload.single('thumbnail'),validatePutProduct],update);
// PATCH PRODUCT
router.patch('/:id', patch);


module.exports = router;
