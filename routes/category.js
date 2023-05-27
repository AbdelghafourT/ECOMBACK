var express = require('express');
var router = express.Router();

const  {show,store,destroy,update,patch,index} = require('./../controllers/categoryController')

/* GET home page. */
router.get('/', index);
/* GET One category. */
router.get('/:id', show);
/* POST category */
router.post('/', store);
// DELETE category
router.delete('/:id', destroy);
// UPDATE category
router.put('/:id', update);
// PATCH category
router.patch('/:id', patch);

module.exports = router;