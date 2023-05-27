var express = require('express');
var router = express.Router();
// Import the functions from UserController
const  { index,register,login,destroy,patchUser} = require('./../controllers/userController')
const {validatelogin,validateRegister} = require('./../middleware/user-middleware')
/* GET users listing. */
router.get('/', index);

/* POST Register a users . */
router.post('/register',validateRegister,register);

/* POST Login a users . */
router.post('/login',validatelogin,login);
// Check token validity
// router.post('/auth',validateToken)
// DELETE User
router.delete('/:id', destroy);

// PATCH User
 router.patch('/:id', patchUser);



module.exports = router;
