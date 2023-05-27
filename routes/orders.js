var express = require('express');
var router = express.Router();

const  {store,index,userOrder, patchOrder,destroy,cancelOrder} = require('../controllers/orderController')

/* GET home page. */
router.get('/', index);

// GET USERS WITH HIS ORDER
router.get('/users/:id/orders',userOrder)

router.post('/', store);

// PATCH ORDERS
router.put('/:id', patchOrder);
//PATCH CANCEL ORDERS
router.put('/cancel-order/:id', cancelOrder);
//selete order 
router.delete('/:id',destroy)
module.exports = router;